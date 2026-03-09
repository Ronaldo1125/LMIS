const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { getLinkPreview } = require('link-preview-js');

// ── Multer: announcement attachments ────────────────────────────────────────
const announcementStorage = multer.diskStorage({
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
const uploadAnnouncement = multer({
  storage: announcementStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ── Multer: news thumbnail (images only, 5 MB) ───────────────────────────────
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/news-thumbnails';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for thumbnails'));
    }
  },
});

// ── NEWS LINKS ──────────────────────────────────────────────────────────────

// GET all news links (public)
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

// GET preview metadata for a URL (admin only — still useful for title/description autofill)
router.get('/news/preview', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'URL is required' });

  try {
    const preview = await getLinkPreview(url, {
      timeout: 5000,
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)' },
    });

    res.json({
      title: preview.title || null,
      description: preview.description || null,
      favicon: preview.favicons?.[0] || null,
    });
  } catch (err) {
    res.status(422).json({ message: 'Could not fetch preview', error: err.message });
  }
});

// POST add news link with optional thumbnail upload (admin only)
router.post(
  '/news',
  authMiddleware,
  roleMiddleware('admin'),
  uploadThumbnail.single('thumbnail'), // field name: "thumbnail"
  async (req, res) => {
    const { title, url, category, description } = req.body;
    if (!title || !url)
      return res.status(400).json({ message: 'Title and URL are required' });

    // Build thumbnail path — served as a static URL from your express static middleware
    const thumbnailPath = req.file
      ? `/${req.file.path.replace(/\\/g, '/')}` // e.g. /uploads/news-thumbnails/xyz.jpg
      : null;

    try {
      const [result] = await pool.query(
        'INSERT INTO news_links (title, url, category, thumbnail, description) VALUES (?, ?, ?, ?, ?)',
        [title, url, category || 'General', thumbnailPath, description || null]
      );

      const [rows] = await pool.query('SELECT * FROM news_links WHERE id = ?', [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (err) {
      // Clean up uploaded file if DB insert fails
      if (req.file) fs.unlink(req.file.path, () => {});
      res.status(500).json({ message: 'Failed to add news', error: err.message });
    }
  }
);

// DELETE news link — also removes thumbnail file (admin only)
router.delete('/news/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT thumbnail FROM news_links WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'News not found' });

    const [result] = await pool.query('DELETE FROM news_links WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'News not found' });

    // Remove thumbnail file from disk if it was a local upload
    const thumb = existing[0].thumbnail;
    if (thumb && thumb.startsWith('/uploads/')) {
      const filePath = thumb.replace(/^\//, ''); // strip leading slash
      fs.unlink(filePath, () => {}); // fire-and-forget
    }

    res.json({ message: 'News removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete news', error: err.message });
  }
});

// ── ANNOUNCEMENTS ───────────────────────────────────────────────────────────

// GET announcements filtered by requesting user's type
router.get('/announcements', authMiddleware, async (req, res) => {
  try {
    const userType = req.user.user_type;

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
  uploadAnnouncement.array('attachments', 5),
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