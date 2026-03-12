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
          created_at,
          CASE 
            WHEN role = 'librarian' AND is_active = 1 THEN 1
            ELSE 0
          END as is_active_librarian
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

      // New librarians are created as inactive by default
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

      const [result] = await pool.query(
        'UPDATE adminpanel_users SET password_hash = ? WHERE id = ? AND role != "admin"',
        [passwordHash, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'User not found or cannot reset admin password'
        });
      }

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

      const [result] = await pool.query(
        'UPDATE adminpanel_users SET is_active = FALSE WHERE id = ? AND role = "patron"',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Patron not found'
        });
      }

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
        // First, verify the user is a librarian
        const [user] = await connection.query(
          'SELECT id, role FROM adminpanel_users WHERE id = ?',
          [id]
        );

        if (user.length === 0 || user[0].role !== 'librarian') {
          await connection.rollback();
          connection.release();
          return res.status(400).json({
            message: 'User is not a librarian'
          });
        }

        // Deactivate all librarians
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

router.put(
  '/:id/avatar',
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { avatar } = req.body;

      if (!avatar) {
        return res.status(400).json({ message: 'Avatar URL is required' });
      }

      // Validate it's a DiceBear URL (basic guard)
      if (!avatar.startsWith('https://api.dicebear.com/')) {
        return res.status(400).json({ message: 'Invalid avatar URL' });
      }

      // Users can only update their own avatar unless they're admin
      const isSelf = String(req.user.id) === String(id);
      const isAdmin = req.user.role === 'admin';

      if (!isSelf && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // Admins cannot have their avatar changed by others
      if (!isSelf && isAdmin) {
        return res.status(403).json({ message: 'Cannot modify admin avatar' });
      }

      const [result] = await pool.query(
        'UPDATE adminpanel_users SET avatar = ? WHERE id = ?',
        [avatar, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'Avatar updated successfully', avatar });
    } catch (error) {
      console.error('Update avatar error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Update profile fields (full_name) — self only
 * PUT /adminpanel-users/:id/profile
 */
router.put(
  '/:id/profile',
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { full_name } = req.body;

      // Only the account owner can update their own profile
      if (String(req.user.id) !== String(id)) {
        return res.status(403).json({ message: 'You can only update your own profile.' });
      }

      if (!full_name || !full_name.trim()) {
        return res.status(400).json({ message: 'Display name cannot be empty.' });
      }

      const trimmed = full_name.trim();

      if (trimmed.length > 60) {
        return res.status(400).json({ message: 'Display name must be 60 characters or fewer.' });
      }

      const [result] = await pool.query(
        'UPDATE adminpanel_users SET full_name = ? WHERE id = ?',
        [trimmed, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.json({ message: 'Display name updated successfully.', full_name: trimmed });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Change username (self only, requires current password)
 * PUT /adminpanel-users/:id/username
 */
router.put(
  '/:id/username',
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { newUsername, currentPassword } = req.body;

      // Users can only change their own username
      if (String(req.user.id) !== String(id)) {
        return res.status(403).json({ message: 'You can only change your own username.' });
      }

      if (!newUsername || !currentPassword) {
        return res.status(400).json({ message: 'New username and current password are required.' });
      }

      // Validate username format
      if (newUsername.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters.' });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores.' });
      }

      // Fetch current user to verify password
      const [rows] = await pool.query(
        'SELECT id, password_hash, username FROM adminpanel_users WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const user = rows[0];

      if (newUsername === user.username) {
        return res.status(400).json({ message: 'New username must be different from current username.' });
      }

      // Verify current password
      const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }

      // Update username
      const [result] = await pool.query(
        'UPDATE adminpanel_users SET username = ? WHERE id = ?',
        [newUsername, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.json({ message: 'Username updated successfully.', username: newUsername });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'That username is already taken.' });
      }
      console.error('Change username error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Delete own account (librarians only, self-service)
 * DELETE /adminpanel-users/:id
 */
router.delete(
  '/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Only the account owner can delete their own account
      if (String(req.user.id) !== String(id)) {
        return res.status(403).json({ message: 'You can only delete your own account.' });
      }

      // Only librarians may self-delete
      if (req.user.role !== 'librarian') {
        return res.status(403).json({ message: 'Only librarian accounts can be self-deleted.' });
      }

      const [result] = await pool.query(
        'DELETE FROM adminpanel_users WHERE id = ? AND role = "librarian"',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Account not found.' });
      }

      res.json({ message: 'Account deleted successfully.' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;