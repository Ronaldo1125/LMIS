// routes/mostSearched.js
const express = require("express");
const router  = express.Router();
const pool    = require("../config/connection");

/**
 * GET /api/most-searched
 * Returns top-N books ordered by search_count DESC.
 * Query params:
 *   limit – how many books to return (default 10, max 50)
 */
router.get("/", async (req, res) => {
  try {
    const { limit = "10" } = req.query;
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    const sql = `
  SELECT
    b.id,
    b.title,
    b.author,
    b.search_count,
    YEAR(b.date_of_publication) AS year,

    (
      SELECT u.id FROM uploads u
      WHERE  u.book_id = b.id
        AND  u.status  = 'active'
      ORDER BY u.is_primary DESC, u.upload_date ASC
      LIMIT 1
    ) AS upload_id,

    (
      SELECT u.file_type FROM uploads u
      WHERE  u.book_id = b.id
        AND  u.status  = 'active'
      ORDER BY u.is_primary DESC, u.upload_date ASC
      LIMIT 1
    ) AS file_type,

    (
      SELECT u.original_name FROM uploads u
      WHERE  u.book_id = b.id
        AND  u.status  = 'active'
      ORDER BY u.is_primary DESC, u.upload_date ASC
      LIMIT 1
    ) AS upload_name

  FROM books b
  WHERE b.is_archived    = 0
    AND b.is_accessioned = 1
    AND b.access_level   = 'public'
    AND b.search_count   > 0
    AND EXISTS (
      SELECT 1 FROM accessions a WHERE a.book_id = b.id AND a.is_archived = 0
    )
    AND EXISTS (
      SELECT 1 FROM uploads u WHERE u.book_id = b.id AND u.status = 'active'
    )
  ORDER BY b.search_count DESC, b.title ASC
  LIMIT ?
`;

    const [books] = await pool.query(sql, [limitNum]);

    return res.json({ results: books, total: books.length });

  } catch (err) {
    console.error("[/api/most-searched] error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;