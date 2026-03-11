// routes/search.js
const express = require("express");
const router  = express.Router();
const pool    = require("../config/connection");
const { optionalAuthMiddleware } = require("../middleware/auth");

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse the structured advanced-search query string the frontend emits.
 *
 * Supported tokens:
 *   title:"..."        author:"..."      subject:"..."
 *   publisher:"..."    isbn:<val>         issn:<val>
 *   year_from:<n>      year_to:<n>
 *
 * Everything else is treated as a plain keyword.
 */
function parseAdvancedQuery(raw = "") {
  const result = {
    keyword:   "",
    title:     "",
    author:    "",
    subject:   "",
    publisher: "",
    isbn:      "",
    issn:      "",
    yearFrom:  null,
    yearTo:    null,
  };

  let remainder = raw;

  // Quoted tokens  e.g.  title:"The Great Gatsby"
  const quotedPattern = /(\w+):"([^"]+)"/g;
  let m;
  while ((m = quotedPattern.exec(raw)) !== null) {
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if      (key === "title")     result.title     = val;
    else if (key === "author")    result.author    = val;
    else if (key === "subject")   result.subject   = val;
    else if (key === "publisher") result.publisher = val;
    else if (key === "isbn")      result.isbn      = val;
    else if (key === "issn")      result.issn      = val;
    remainder = remainder.replace(m[0], "");
  }

  // Unquoted tokens  e.g.  year_from:2020
  remainder = remainder.replace(/(\w+):(\S+)/g, (full, key, val) => {
    key = key.toLowerCase();
    if      (key === "year_from") result.yearFrom = parseInt(val, 10) || null;
    else if (key === "year_to")   result.yearTo   = parseInt(val, 10) || null;
    else if (key === "isbn")      result.isbn     = val;
    else if (key === "issn")      result.issn     = val;
    return "";
  });

  result.keyword = remainder.trim();
  return result;
}

// ─── GET /api/search ──────────────────────────────────────────────────────────
/**
 * Query params:
 *   query       – keyword or advanced query string
 *   field       – "all" | "title" | "author" | "subject" | "isbn"  (default "all")
 *   category    – exact match  on books.category
 *   publication – partial match on books.publication
 *   yearFrom    – YEAR(date_of_publication) >=
 *   yearTo      – YEAR(date_of_publication) <=
 *   sort        – "title" | "title_desc" | "year_asc" | "year_desc" | "author" | "relevance"
 *   page        – default 1
 *   limit       – default 24, max 100
 */
router.get("/", optionalAuthMiddleware, async (req, res) => {
  try {
    const {
      query       = "",
      field       = "all",
      category    = "",
      publication = "",
      yearFrom    = "",
      yearTo      = "",
      sort        = "title",
      page        = "1",
      limit       = "24",
    } = req.query;

    // ── pagination ────────────────────────────────────────────────────────
    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));
    const offset   = (pageNum - 1) * limitNum;

    // ── parse advanced query syntax ───────────────────────────────────────
    const adv = parseAdvancedQuery(query);

    // ── WHERE clauses ─────────────────────────────────────────────────────
    const conditions = [];
    const params     = [];

    // Standard book guards
    conditions.push("b.is_archived = 0");
    conditions.push("b.is_accessioned = 1");
    conditions.push(`
      EXISTS (
        SELECT 1 FROM accessions a
        WHERE a.book_id = b.id AND a.is_archived = 0
      )
    `);

    // ── plain keyword / field-specific search ─────────────────────────────
    if (adv.keyword) {
      const like = `%${adv.keyword}%`;
      const f    = (field || "all").toLowerCase();

      if (f === "title") {
        conditions.push("b.title LIKE ?");
        params.push(like);
      } else if (f === "author") {
        conditions.push("b.author LIKE ?");
        params.push(like);
      } else if (f === "subject") {
        conditions.push("b.subjects LIKE ?");
        params.push(like);
      } else if (f === "isbn") {
        conditions.push("(b.isbn LIKE ? OR b.issn LIKE ?)");
        params.push(like, like);
      } else {
        // "all" — search across every meaningful text column
        conditions.push(`(
          b.title         LIKE ? OR
          b.author        LIKE ? OR
          b.editor        LIKE ? OR
          b.subjects      LIKE ? OR
          b.publisher     LIKE ? OR
          b.publication   LIKE ? OR
          b.isbn          LIKE ? OR
          b.issn          LIKE ? OR
          b.call_number   LIKE ? OR
          b.notes_area    LIKE ?
        )`);
        params.push(like, like, like, like, like, like, like, like, like, like);
      }
    }

    // ── advanced structured tokens ────────────────────────────────────────
    if (adv.title) {
      conditions.push("b.title LIKE ?");
      params.push(`%${adv.title}%`);
    }
    if (adv.author) {
      conditions.push("b.author LIKE ?");
      params.push(`%${adv.author}%`);
    }
    if (adv.subject) {
      conditions.push("b.subjects LIKE ?");
      params.push(`%${adv.subject}%`);
    }
    if (adv.publisher) {
      conditions.push("b.publisher LIKE ?");
      params.push(`%${adv.publisher}%`);
    }
    if (adv.isbn) {
      const clean = adv.isbn.replace(/-/g, "");
      conditions.push("(REPLACE(b.isbn,'-','') LIKE ? OR REPLACE(b.issn,'-','') LIKE ?)");
      params.push(`%${clean}%`, `%${clean}%`);
    }
    if (adv.issn) {
      const clean = adv.issn.replace(/-/g, "");
      conditions.push("REPLACE(b.issn,'-','') LIKE ?");
      params.push(`%${clean}%`);
    }
    if (adv.yearFrom) {
      conditions.push("YEAR(b.date_of_publication) >= ?");
      params.push(adv.yearFrom);
    }
    if (adv.yearTo) {
      conditions.push("YEAR(b.date_of_publication) <= ?");
      params.push(adv.yearTo);
    }

    // ── filter params ─────────────────────────────────────────────────────
    if (category.trim()) {
      conditions.push("b.category = ?");
      params.push(category.trim());
    }
    if (publication.trim()) {
      conditions.push("b.publication LIKE ?");
      params.push(`%${publication.trim()}%`);
    }
    if (yearFrom && !adv.yearFrom) {
      const yf = parseInt(yearFrom, 10);
      if (!isNaN(yf)) { conditions.push("YEAR(b.date_of_publication) >= ?"); params.push(yf); }
    }
    if (yearTo && !adv.yearTo) {
      const yt = parseInt(yearTo, 10);
      if (!isNaN(yt)) { conditions.push("YEAR(b.date_of_publication) <= ?"); params.push(yt); }
    }

    const whereSQL = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

    // ── relevance score ───────────────────────────────────────────────────
    const kw = adv.keyword;
    let relevanceSQL  = "0";
    const scoreParams = [];

    if (kw) {
      const like = `%${kw}%`;
      relevanceSQL = `(
        CASE WHEN b.title     = ?    THEN 100 ELSE 0 END +
        CASE WHEN b.title     LIKE ? THEN  50 ELSE 0 END +
        CASE WHEN b.author    LIKE ? THEN  30 ELSE 0 END +
        CASE WHEN b.subjects  LIKE ? THEN  20 ELSE 0 END +
        CASE WHEN b.publisher LIKE ? THEN  10 ELSE 0 END
      )`;
      scoreParams.push(kw, like, like, like, like);
    }

    // ── ORDER BY ──────────────────────────────────────────────────────────
    const ORDER_MAP = {
      title:      "b.title ASC",
      title_desc: "b.title DESC",
      year_asc:   "YEAR(b.date_of_publication) ASC,  b.title ASC",
      year_desc:  "YEAR(b.date_of_publication) DESC, b.title ASC",
      author:     "b.author ASC, b.title ASC",
      relevance:  `(${relevanceSQL}) DESC, b.title ASC`,
    };
    const orderSQL = ORDER_MAP[sort] || ORDER_MAP.title;

    // ── SELECT ────────────────────────────────────────────────────────────
    const selectSQL = `
      SELECT
        b.id,
        b.category,
        b.call_number,
        b.title,
        b.author,
        b.editor,
        b.edition,
        b.publication,
        b.publisher,
        b.date_of_publication,
        YEAR(b.date_of_publication) AS year,
        b.extent,
        b.dimensions,
        b.other_physical_details,
        b.accompanying_material,
        b.isbn,
        b.issn,
        b.notes_area,
        b.subjects,
        b.copies,

        -- Primary active PDF upload
        (SELECT u.id            FROM uploads u WHERE u.book_id = b.id AND u.file_type = 'pdf' AND u.status = 'active' ORDER BY u.is_primary DESC, u.upload_date ASC LIMIT 1) AS upload_id,
        (SELECT u.original_name FROM uploads u WHERE u.book_id = b.id AND u.file_type = 'pdf' AND u.status = 'active' ORDER BY u.is_primary DESC, u.upload_date ASC LIMIT 1) AS upload_name,
        (SELECT u.file_size     FROM uploads u WHERE u.book_id = b.id AND u.file_type = 'pdf' AND u.status = 'active' ORDER BY u.is_primary DESC, u.upload_date ASC LIMIT 1) AS upload_size,
        (SELECT u.download_count FROM uploads u WHERE u.book_id = b.id AND u.file_type = 'pdf' AND u.status = 'active' ORDER BY u.is_primary DESC, u.upload_date ASC LIMIT 1) AS download_count
    `;

    // ── count + results ───────────────────────────────────────────────────
    const countSQL = `SELECT COUNT(*) AS total FROM books b ${whereSQL}`;

    const resultsSQL = sort === "relevance"
      ? `
          SELECT (${relevanceSQL}) AS _score, sub.*
          FROM ( ${selectSQL} FROM books b ${whereSQL} ) sub
          ORDER BY _score DESC, title ASC
          LIMIT ? OFFSET ?
        `
      : `
          ${selectSQL}
          FROM books b
          ${whereSQL}
          ORDER BY ${orderSQL}
          LIMIT ? OFFSET ?
        `;

    const resultsParams = sort === "relevance"
      ? [...scoreParams, ...params, limitNum, offset]
      : [...params, limitNum, offset];

    const [[countResult], [books]] = await Promise.all([
      pool.query(countSQL, params),
      pool.query(resultsSQL, resultsParams),
    ]);

    const total      = Number(countResult?.[0]?.total ?? 0);
    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.json({ results: books, total, page: pageNum, limit: limitNum, totalPages });

  } catch (err) {
    console.error("[/api/search] error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ─── GET /api/search/filters ──────────────────────────────────────────────────
/**
 * Returns distinct filter values actually present in the DB.
 * Response: { categories, publications, yearMin, yearMax }
 */
router.get("/filters", optionalAuthMiddleware, async (req, res) => {
  try {
    const baseGuard = `
      b.is_archived = 0
      AND b.is_accessioned = 1
      AND EXISTS (SELECT 1 FROM accessions a WHERE a.book_id = b.id AND a.is_archived = 0)
    `;

    const [categories, publications, yearRange] = await Promise.all([
      pool.query(
        `SELECT DISTINCT b.category    FROM books b
         WHERE ${baseGuard} AND b.category    IS NOT NULL AND b.category    != ''
         ORDER BY b.category    ASC`
      ),
      pool.query(
        `SELECT DISTINCT b.publication FROM books b
         WHERE ${baseGuard} AND b.publication IS NOT NULL AND b.publication != ''
         ORDER BY b.publication ASC`
      ),
      pool.query(
        `SELECT MIN(YEAR(b.date_of_publication)) AS yearMin,
                MAX(YEAR(b.date_of_publication)) AS yearMax
         FROM books b
         WHERE ${baseGuard} AND b.date_of_publication IS NOT NULL`
      ),
    ]);

    return res.json({
      categories:   categories[0].map((r) => r.category).filter(Boolean),
      publications: publications[0].map((r) => r.publication).filter(Boolean),
      yearMin:      yearRange[0][0]?.yearMin ?? null,
      yearMax:      yearRange[0][0]?.yearMax ?? null,
    });
  } catch (err) {
    console.error("[/api/search/filters] error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ─── GET /api/search/suggestions ─────────────────────────────────────────────
/**
 * Autocomplete — up to 9 title / author suggestions.
 * Query params: q (min 2 chars)
 */
router.get("/suggestions", optionalAuthMiddleware, async (req, res) => {
  try {
    const { q = "" } = req.query;
    if (q.trim().length < 2) return res.json({ suggestions: [] });

    const like = `%${q.trim()}%`;

    const [rows] = await pool.query(
      `(
        SELECT 'title'  AS type, b.title  AS value, b.id
        FROM books b
        WHERE b.is_archived = 0 AND b.is_accessioned = 1
          AND EXISTS (SELECT 1 FROM accessions a WHERE a.book_id = b.id AND a.is_archived = 0)
          AND b.title LIKE ?
        ORDER BY b.title ASC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT DISTINCT 'author' AS type, b.author AS value, NULL AS id
        FROM books b
        WHERE b.is_archived = 0 AND b.is_accessioned = 1
          AND EXISTS (SELECT 1 FROM accessions a WHERE a.book_id = b.id AND a.is_archived = 0)
          AND b.author LIKE ?
        ORDER BY b.author ASC
        LIMIT 4
      )
      ORDER BY type ASC, value ASC
      LIMIT 9`,
      [like, like]
    );

    return res.json({ suggestions: rows });
  } catch (err) {
    console.error("[/api/search/suggestions] error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;