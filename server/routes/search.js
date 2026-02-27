// routes/search.js
const express = require("express");
const router = express.Router();
const pool = require('../config/connection');

/**
 * GET /api/search
 *
 * Query params:
 *   query      – full-text keyword (searches title, author, subjects, publisher)
 *   category   – filter by books.category
 *   author     – filter by books.author (partial match)
 *   format     – filter by books.publication column
 *   language   – filter by books.language (if column exists)
 *   page       – page number (default 1)
 *   limit      – results per page (default 24, max 100)
 */
router.get("/", async (req, res) => {
  try {
    const {
      query    = "",
      category = "",
      author   = "",
      format   = "",
      language = "",
      page     = "1",
      limit    = "24",
    } = req.query;

    // ── pagination ──────────────────────────────────────────────────────────
    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));
    const offset   = (pageNum - 1) * limitNum;

    // ── access-level gate ───────────────────────────────────────────────────
    const isStaff =
      req.user &&
      (req.user.role === "staff" ||
        req.user.role === "admin" ||
        req.user.role === "librarian");

    // ── build WHERE clauses ─────────────────────────────────────────────────
    const conditions = [];
    const params     = [];

    // 1. Only show non-archived, accessioned books
    conditions.push("b.is_archived = 0");
    conditions.push("b.is_accessioned = 1");

    // 2. Only show books with at least one non-archived accession record
    conditions.push(`
      EXISTS (
        SELECT 1 FROM accessions a
        WHERE a.book_id = b.id
          AND a.is_archived = 0
      )
    `);

    // 3. Access level — unauthenticated users see public only
    if (!isStaff) {
      conditions.push("b.access_level = 'public'");
    }

    // 4. Full-text keyword search
    if (query.trim()) {
      conditions.push(`(
        b.title     LIKE ? OR
        b.author    LIKE ? OR
        b.subjects  LIKE ? OR
        b.publisher LIKE ? OR
        b.isbn      LIKE ? OR
        b.issn      LIKE ?
      )`);
      const like = `%${query.trim()}%`;
      params.push(like, like, like, like, like, like);
    }

    // 5. Category filter
    if (category.trim()) {
      conditions.push("b.category = ?");
      params.push(category.trim());
    }

    // 6. Author filter (partial match)
    if (author.trim()) {
      conditions.push("b.author LIKE ?");
      params.push(`%${author.trim()}%`);
    }

    // 7. Format filter — mapped to `publication` column
    if (format.trim()) {
      conditions.push("b.publication LIKE ?");
      params.push(`%${format.trim()}%`);
    }

    // 8. Language filter — uncomment when column exists in your DB
    // if (language.trim()) {
    //   conditions.push("b.language = ?");
    //   params.push(language.trim());
    // }

    const whereSQL = conditions.length
      ? "WHERE " + conditions.join(" AND ")
      : "";

    // ── SELECT columns ──────────────────────────────────────────────────────
    const selectSQL = `
      SELECT
        b.id,
        b.title,
        b.author,
        b.editor,
        b.category,
        b.call_number,
        b.publisher,
        b.publication,
        b.isbn,
        b.issn,
        b.copies,
        b.has_digital_copy,
        b.access_level,
        YEAR(b.date_of_publication) AS year,
        b.date_of_publication,
        NULL AS image
    `;

    // ── count query ──────────────────────────────────────────────────────────
    const countSQL = `
      SELECT COUNT(*) AS total
      FROM books b
      ${whereSQL}
    `;

    // ── results query ────────────────────────────────────────────────────────
    const resultsSQL = `
      ${selectSQL}
      FROM books b
      ${whereSQL}
      ORDER BY b.title ASC
      LIMIT ? OFFSET ?
    `;

    // ── execute using pool (fix: was incorrectly using `db`) ─────────────────
    const [[countResult], [books]] = await Promise.all([
      pool.query(countSQL, params),
      pool.query(resultsSQL, [...params, limitNum, offset]),
    ]);

    const total      = Number(countResult?.[0]?.total ?? 0);
    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.json({
      results: books,
      total,
      page:       pageNum,
      limit:      limitNum,
      totalPages,
    });

  } catch (err) {
    console.error("[/api/search] error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;