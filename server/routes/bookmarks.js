// routes/bookmarks.js
const express = require('express');
const router = express.Router();
const pool = require('../config/connection');
const { authMiddleware } = require('../middleware/auth');

// ─── Get all bookmarks for the logged-in user ──────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    const [bookmarks] = await pool.query(
      `SELECT
         b.id,
         b.title,
         b.author,
         b.category,
         b.call_number,
         b.publisher,
         b.date_of_publication,
         b.copies,
         b.has_digital_copy,
         b.access_level,
         bm.created_at AS bookmarked_at
       FROM bookmarks bm
       JOIN books b ON b.id = bm.book_id
       WHERE bm.user_id = ?
         AND b.is_archived = 0
         AND b.access_level = 'public'
       ORDER BY bm.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total
       FROM bookmarks bm
       JOIN books b ON b.id = bm.book_id
       WHERE bm.user_id = ?
         AND b.is_archived = 0
         AND b.access_level = 'public'`,
      [req.user.id]
    );

    res.json({
      bookmarks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
});

// ─── Check if a specific book is bookmarked ────────────────────────────────────
router.get('/:book_id', authMiddleware, async (req, res) => {
  try {
    const bookId = parseInt(req.params.book_id, 10);
    if (!bookId || isNaN(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const [rows] = await pool.query(
      'SELECT id, created_at FROM bookmarks WHERE user_id = ? AND book_id = ?',
      [req.user.id, bookId]
    );

    res.json({ bookmarked: rows.length > 0, bookmarked_at: rows[0]?.created_at || null });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    res.status(500).json({ message: 'Error checking bookmark' });
  }
});

// ─── Add a bookmark ────────────────────────────────────────────────────────────
router.post('/:book_id', authMiddleware, async (req, res) => {
  try {
    const bookId = parseInt(req.params.book_id, 10);
    if (!bookId || isNaN(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const [book] = await pool.query(
      `SELECT id, access_level FROM books WHERE id = ? AND is_archived = 0`,
      [bookId]
    );

    if (book.length === 0) {
      return res.status(404).json({ message: 'Book not found or archived' });
    }

    if (book[0].access_level === 'staff_only') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM bookmarks WHERE user_id = ? AND book_id = ?',
      [req.user.id, bookId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Book is already bookmarked' });
    }

    await pool.query(
      'INSERT INTO bookmarks (user_id, book_id) VALUES (?, ?)',
      [req.user.id, bookId]
    );

    res.status(201).json({ message: 'Book bookmarked successfully' });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ message: 'Error adding bookmark' });
  }
});

// ─── Remove a bookmark ─────────────────────────────────────────────────────────
router.delete('/:book_id', authMiddleware, async (req, res) => {
  try {
    const bookId = parseInt(req.params.book_id, 10);
    if (!bookId || isNaN(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM bookmarks WHERE user_id = ? AND book_id = ?',
      [req.user.id, bookId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await pool.query(
      'DELETE FROM bookmarks WHERE user_id = ? AND book_id = ?',
      [req.user.id, bookId]
    );

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ message: 'Error removing bookmark' });
  }
});

module.exports = router;