const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { getLinkPreview } = require('link-preview-js');

// ── Role constants ───────────────────────────────────────────────────────────
// Admin-panel roles (JWT payload has `role`)
const ADMIN_PANEL_ROLES = ['admin', 'librarian'];

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the requester is an admin-panel user.
 * Admin-panel tokens carry `role`; web-client tokens carry `user_type`.
 */
const isAdminPanelUser = (user) => !!user.role && ADMIN_PANEL_ROLES.includes(user.role);

/**
 * Attach attachments array to each announcement row.
 */
const withAttachments = async (announcements) => {
  for (const ann of announcements) {
    const [files] = await pool.query(
      'SELECT * FROM announcement_attachments WHERE announcement_id = ?',
      [ann.id]
    );
    ann.attachments = files;
  }
  return announcements;
};

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
  limits: { fileSize: 5 * 1024 * 1024 },
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
    const [rows] = await pool.query('SELECT * FROM news_links ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news', error: err.message });
  }
});

// GET preview metadata for a URL (admin panel only)
router.get('/news/preview', authMiddleware, roleMiddleware(...ADMIN_PANEL_ROLES), async (req, res) => {
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

// POST add news link (admin only)
router.post(
  '/news',
  authMiddleware,
  roleMiddleware('admin'),
  uploadThumbnail.single('thumbnail'),
  async (req, res) => {
    const { title, url, category, description } = req.body;
    if (!title || !url)
      return res.status(400).json({ message: 'Title and URL are required' });

    const thumbnailPath = req.file
      ? `/${req.file.path.replace(/\\/g, '/')}`
      : null;

    try {
      const [result] = await pool.query(
        'INSERT INTO news_links (title, url, category, thumbnail, description) VALUES (?, ?, ?, ?, ?)',
        [title, url, category || 'General', thumbnailPath, description || null]
      );
      const [rows] = await pool.query('SELECT * FROM news_links WHERE id = ?', [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (err) {
      if (req.file) fs.unlink(req.file.path, () => {});
      res.status(500).json({ message: 'Failed to add news', error: err.message });
    }
  }
);

// DELETE news link (admin only)
router.delete('/news/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT thumbnail FROM news_links WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'News not found' });

    const [result] = await pool.query('DELETE FROM news_links WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'News not found' });

    const thumb = existing[0].thumbnail;
    if (thumb && thumb.startsWith('/uploads/')) {
      fs.unlink(thumb.replace(/^\//, ''), () => {});
    }

    res.json({ message: 'News removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete news', error: err.message });
  }
});

// ── ANNOUNCEMENTS ───────────────────────────────────────────────────────────

/**
 * GET /announcements
 *
 * Admin panel  → sees ALL announcements (sent-history / management view)
 * Web client   → sees only announcements where audience = 'all' OR audience = their user_type
 */
router.get('/announcements', authMiddleware, async (req, res) => {
  try {
    let announcements;

    if (isAdminPanelUser(req.user)) {
      // Admin / Librarian: full history
      [announcements] = await pool.query(
        'SELECT * FROM announcements ORDER BY sent_at DESC'
      );
    } else {
      // Web client: Patron or Staff — filter by their user_type
      const userType = req.user.user_type; // 'Patron' | 'Staff'
      if (!userType) return res.status(403).json({ message: 'Access denied' });

      [announcements] = await pool.query(
        `SELECT * FROM announcements
         WHERE audience = 'all' OR audience = ?
         ORDER BY sent_at DESC`,
        [userType]
      );
    }

    await withAttachments(announcements);
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcements', error: err.message });
  }
});

/**
 * POST /announcements
 * Admin + Librarian can create.
 * created_by and creator_role are pulled from the JWT — never from req.body.
 */
router.post(
  '/announcements',
  authMiddleware,
  roleMiddleware(...ADMIN_PANEL_ROLES),
  uploadAnnouncement.array('attachments', 5),
  async (req, res) => {
    const { subject, description, audience } = req.body;
    if (!subject || !description)
      return res.status(400).json({ message: 'Subject and description are required' });

    const validAudiences = ['all', 'Patron', 'Staff'];
    const safeAudience = validAudiences.includes(audience) ? audience : 'all';

    // Pull identity from the verified JWT — never trust req.body for this
    const createdBy   = req.user.id;
    const creatorRole = req.user.role;
    if (!createdBy) return res.status(400).json({ message: 'Creator ID missing from token' });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO announcements (subject, description, audience, created_by, creator_role)
         VALUES (?, ?, ?, ?, ?)`,
        [subject, description, safeAudience, createdBy, creatorRole]
      );
      const announcementId = result.insertId;

      if (req.files && req.files.length > 0) {
        const fileValues = req.files.map(f => [
          announcementId, f.originalname, f.path, f.size, f.mimetype,
        ]);
        await conn.query(
          `INSERT INTO announcement_attachments
             (announcement_id, file_name, file_path, file_size, file_type)
           VALUES ?`,
          [fileValues]
        );
      }

      await conn.commit();

      const [rows] = await pool.query('SELECT * FROM announcements WHERE id = ?', [announcementId]);
      await withAttachments(rows);
      res.status(201).json(rows[0]);
    } catch (err) {
      await conn.rollback();
      if (req.files) req.files.forEach(f => fs.unlink(f.path, () => {}));
      res.status(500).json({ message: 'Failed to send announcement', error: err.message });
    } finally {
      conn.release();
    }
  }
);

/**
 * PATCH /announcements/:id
 * Admin  → can edit any announcement
 * Librarian → can only edit announcements they created (created_by = their id)
 */
router.patch(
  '/announcements/:id',
  authMiddleware,
  roleMiddleware(...ADMIN_PANEL_ROLES),
  async (req, res) => {
    const { id } = req.params;
    const { subject, description, audience } = req.body;

    try {
      const [existing] = await pool.query('SELECT * FROM announcements WHERE id = ?', [id]);
      if (!existing.length) return res.status(404).json({ message: 'Announcement not found' });

      const ann = existing[0];

      // Ownership check: librarians can only edit their own
      if (req.user.role === 'librarian' && ann.created_by !== req.user.id) {
        return res.status(403).json({ message: 'You can only edit your own announcements' });
      }

      const validAudiences = ['all', 'Patron', 'Staff'];
      const updatedSubject     = subject     ?? ann.subject;
      const updatedDescription = description ?? ann.description;
      const updatedAudience    = validAudiences.includes(audience) ? audience : ann.audience;

      await pool.query(
        'UPDATE announcements SET subject = ?, description = ?, audience = ? WHERE id = ?',
        [updatedSubject, updatedDescription, updatedAudience, id]
      );

      const [rows] = await pool.query('SELECT * FROM announcements WHERE id = ?', [id]);
      await withAttachments(rows);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update announcement', error: err.message });
    }
  }
);

/**
 * DELETE /announcements/:id
 * Admin  → can delete any announcement
 * Librarian → can only delete announcements they created
 */
router.delete(
  '/announcements/:id',
  authMiddleware,
  roleMiddleware(...ADMIN_PANEL_ROLES),
  async (req, res) => {
    const { id } = req.params;
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [existing] = await conn.query('SELECT * FROM announcements WHERE id = ?', [id]);
      if (!existing.length) {
        await conn.rollback();
        return res.status(404).json({ message: 'Announcement not found' });
      }

      // Ownership check: librarians can only delete their own
      if (req.user.role === 'librarian' && existing[0].created_by !== req.user.id) {
        await conn.rollback();
        return res.status(403).json({ message: 'You can only delete your own announcements' });
      }

      const [attachments] = await conn.query(
        'SELECT file_path FROM announcement_attachments WHERE announcement_id = ?',
        [id]
      );

      await conn.query('DELETE FROM announcement_attachments WHERE announcement_id = ?', [id]);
      await conn.query('DELETE FROM announcements WHERE id = ?', [id]);

      await conn.commit();

      // Delete attachment files from disk after successful commit
      attachments.forEach(({ file_path }) => {
        if (file_path) fs.unlink(file_path, () => {});
      });

      res.json({ message: 'Announcement deleted' });
    } catch (err) {
      await conn.rollback();
      res.status(500).json({ message: 'Failed to delete announcement', error: err.message });
    } finally {
      conn.release();
    }
  }
);

module.exports = router;