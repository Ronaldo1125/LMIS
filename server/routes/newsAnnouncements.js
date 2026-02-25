const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Multer setup for announcement attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/announcements';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// ── NEWS LINKS ──────────────────────────────────────────────

// GET all news links (public - for client website)
router.get('/news', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news_links ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news', error: err.message });
  }
});

// POST add news link (admin only)
router.post('/news', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const { title, url, category } = req.body;
  if (!title || !url) return res.status(400).json({ message: 'Title and URL are required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO news_links (title, url, category) VALUES (?, ?, ?)',
      [title, url, category || 'General']
    );
    const [rows] = await pool.query('SELECT * FROM news_links WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add news', error: err.message });
  }
});

// DELETE news link (admin only)
router.delete('/news/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM news_links WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete news', error: err.message });
  }
});

// ── ANNOUNCEMENTS ───────────────────────────────────────────
// GET announcements — filtered by the requesting user's type
router.get('/announcements', authMiddleware, async (req, res) => {
  try {
    // req.user comes from your authMiddleware (JWT decode)
    const userType = req.user.user_type; // 'Patron' or 'Staff'

    const [announcements] = await pool.query(
      `SELECT * FROM announcements 
       WHERE audience = 'all' OR audience = ?
       ORDER BY sent_at DESC`,
      [userType]
    );

    for (const ann of announcements) {
      const [files] = await pool.query(
        'SELECT * FROM announcement_attachments WHERE announcement_id = ?',
        [ann.id]
      );
      ann.attachments = files;
    }

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcements', error: err.message });
  }
});

// POST send announcement with optional file attachments (admin only)
router.post(
  '/announcements',
  authMiddleware,
  roleMiddleware('admin'),
  upload.array('attachments', 5),
  async (req, res) => {
    const { subject, description, audience, priority } = req.body;
    if (!subject || !description)
      return res.status(400).json({ message: 'Subject and description are required' });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        'INSERT INTO announcements (subject, description, audience, priority) VALUES (?, ?, ?, ?)',
        [subject, description, audience || 'all', priority || 'normal']
      );
      const announcementId = result.insertId;

      // Insert attachments if any
      if (req.files && req.files.length > 0) {
        const fileValues = req.files.map(f => [
          announcementId, f.originalname, f.path, f.size, f.mimetype,
        ]);
        await conn.query(
          'INSERT INTO announcement_attachments (announcement_id, file_name, file_path, file_size, file_type) VALUES ?',
          [fileValues]
        );
      }

      await conn.commit();

      const [rows] = await pool.query('SELECT * FROM announcements WHERE id = ?', [announcementId]);
      const [files] = await pool.query(
        'SELECT * FROM announcement_attachments WHERE announcement_id = ?',
        [announcementId]
      );
      rows[0].attachments = files;

      res.status(201).json(rows[0]);
    } catch (err) {
      await conn.rollback();
      res.status(500).json({ message: 'Failed to send announcement', error: err.message });
    } finally {
      conn.release();
    }
  }
);

module.exports = router;