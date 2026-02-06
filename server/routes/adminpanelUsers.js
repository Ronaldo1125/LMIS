const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/connection');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * Admin or Librarian middleware - for viewing
 */
const requireAdminOrLibrarian = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
    return res.status(403).json({ message: 'Admin or Librarian access only' });
  }
  next();
};

/**
 * Admin-only middleware - for modifications
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

/**
 * Get all users (staff, librarians, patrons)
 * GET /adminpanel-users
 */
router.get(
  '/',
  authMiddleware,
  requireAdminOrLibrarian,
  async (req, res) => {
    try {
      const { role, is_active, search } = req.query;

      let query = `
        SELECT 
          id, 
          username, 
          full_name, 
          role, 
          is_active, 
          created_at
        FROM adminpanel_users
        WHERE role != 'admin'
      `;
      
      const params = [];

      // Filter by role
      if (role && role !== 'All') {
        query += ' AND role = ?';
        params.push(role.toLowerCase());
      }

      // Filter by status
      if (is_active && is_active !== 'All') {
        query += ' AND is_active = ?';
        params.push(is_active === 'Active' ? 1 : 0);
      }

      // Search by name or username
      if (search) {
        query += ' AND (full_name LIKE ? OR username LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY created_at DESC';

      const [users] = await pool.query(query, params);

      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Get user stats
 * GET /adminpanel-users/stats
 */
router.get(
  '/stats',
  authMiddleware,
  requireAdminOrLibrarian,
  async (req, res) => {
    try {
      const [stats] = await pool.query(`
        SELECT 
          COUNT(CASE WHEN role = 'staff' THEN 1 END) as staff,
          COUNT(CASE WHEN role = 'librarian' THEN 1 END) as librarians,
          COUNT(CASE WHEN role = 'patron' THEN 1 END) as patrons
        FROM adminpanel_users
        WHERE role != 'admin'
      `);

      res.json(stats[0]);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Create Staff
 * POST /adminpanel-users/staff
 */
router.post(
  '/staff',
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
        VALUES (?, ?, ?, 'staff', TRUE)
        `,
        [username, passwordHash, full_name]
      );

      res.status(201).json({
        message: 'Staff created successfully',
        staff: {
          id: result.insertId,
          username,
          full_name,
          role: 'staff'
        }
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          message: 'Username already exists'
        });
      }

      console.error('Create staff error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

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
        VALUES (?, ?, ?, 'librarian', FALSE)
        `,
        [username, passwordHash, full_name]
      );

      res.status(201).json({
        message: 'Librarian created successfully',
        librarian: {
          id: result.insertId,
          username,
          full_name,
          role: 'librarian',
          is_active: false
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

/**
 * Reset user password
 * PUT /adminpanel-users/:id/reset-password
 */
router.put(
  '/:id/reset-password',
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          message: 'Password is required'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await pool.query(
        'UPDATE adminpanel_users SET password_hash = ? WHERE id = ? AND role != "admin"',
        [passwordHash, id]
      );

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Deactivate user account
 * PUT /adminpanel-users/:id/deactivate
 */
router.put(
  '/:id/deactivate',
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(
        'UPDATE adminpanel_users SET is_active = FALSE WHERE id = ? AND role = "patron"',
        [id]
      );

      res.json({ message: 'Account deactivated successfully' });
    } catch (error) {
      console.error('Deactivate account error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Set active librarian
 * PUT /adminpanel-users/:id/set-active-librarian
 */
router.put(
  '/:id/set-active-librarian',
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Deactivate all other librarians
        await connection.query(
          'UPDATE adminpanel_users SET is_active = FALSE WHERE role = "librarian"'
        );

        // Activate the selected librarian
        await connection.query(
          'UPDATE adminpanel_users SET is_active = TRUE WHERE id = ? AND role = "librarian"',
          [id]
        );

        await connection.commit();
        connection.release();

        res.json({ message: 'Active librarian set successfully' });
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Set active librarian error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;