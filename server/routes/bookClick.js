// routes/bookClick.js
const express = require("express");
const router = express.Router();
const pool = require("../config/connection");
const { optionalAuthMiddleware } = require("../middleware/auth");

/**
 * POST /api/books/:id/click
 * Increments search_count when a book card is clicked from search results.
 */
router.post("/:id/click", optionalAuthMiddleware, async (req, res) => {
  try {
    const bookId = parseInt(req.params.id, 10);
    if (!bookId || isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const [result] = await pool.query(
      `UPDATE books
          SET search_count = search_count + 1,
              updated_at   = NOW()
        WHERE id          = ?
          AND is_archived = 0`,
      [bookId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found or archived" });
    }

    const [[row]] = await pool.query(
      "SELECT search_count FROM books WHERE id = ?",
      [bookId]
    );

    return res.json({ success: true, search_count: row?.search_count ?? null });
  } catch (err) {
    console.error("[POST /api/books/:id/click] error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

/**
 * POST /api/books/:id/download-click
 * Increments download_count on the primary active upload for a book.
 * The download_count column already exists on the uploads table.
 */
router.post("/:id/download-click", optionalAuthMiddleware, async (req, res) => {
  try {
    const bookId = parseInt(req.params.id, 10);
    if (!bookId || isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const [result] = await pool.query(
      `UPDATE uploads
          SET download_count = download_count + 1
        WHERE book_id   = ?
          AND file_type = 'pdf'
          AND status    = 'active'
        ORDER BY is_primary DESC, upload_date ASC
        LIMIT 1`,
      [bookId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No active upload found for this book" });
    }

    const [[row]] = await pool.query(
      `SELECT download_count FROM uploads
        WHERE book_id   = ?
          AND file_type = 'pdf'
          AND status    = 'active'
        ORDER BY is_primary DESC, upload_date ASC
        LIMIT 1`,
      [bookId]
    );

    return res.json({ success: true, download_count: row?.download_count ?? null });
  } catch (err) {
    console.error("[POST /api/books/:id/download-click] error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;