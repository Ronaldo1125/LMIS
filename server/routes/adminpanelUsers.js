const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/connection');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * Admin-only middleware
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

/**
 * Create Librarian
 * POST /adminpanel-users/librarians
 */
router.post(
  '/librarians',
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    try {
      const { username, password, full_name } = req.body;

      if (!username || !password || !full_name) {
        return res.status(400).json({
          message: 'Username, password, and full name are required'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        `
        INSERT INTO adminpanel_users
        (username, password_hash, full_name, role, is_active)
        VALUES (?, ?, ?, 'librarian', TRUE)
        `,
        [username, passwordHash, full_name]
      );

      res.status(201).json({
        message: 'Librarian created successfully',
        librarian: {
          id: result.insertId,
          username,
          full_name,
          role: 'librarian'
        }
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          message: 'Username already exists'
        });
      }

      console.error('Create librarian error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
