const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/connection');
const { authMiddleware } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger');

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
// ─────────────────────────────────────────────────────────────────────────────
// Create Librarian
// POST /api/adminpanel-users/librarians
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/librarians',
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    const { username, password, full_name } = req.body;
 
    if (!username || !password || !full_name) {
      await logActivity(req, {
        action:      'CREATE_LIBRARIAN',
        entityType:  'adminpanel_user',
        description: `Failed to create librarian — missing required fields`,
        metadata:    { provided_fields: Object.keys(req.body) },
        status:      'failure',
      });
      return res.status(400).json({
        message: 'Username, password, and full name are required',
      });
    }
 
    try {
      const passwordHash = await bcrypt.hash(password, 10);
 
      const [result] = await pool.query(
        `INSERT INTO adminpanel_users (username, password_hash, full_name, role, is_active)
         VALUES (?, ?, ?, 'librarian', FALSE)`,
        [username, passwordHash, full_name]
      );
 
      await logActivity(req, {
        action:      'CREATE_LIBRARIAN',
        entityType:  'adminpanel_user',
        entityId:    result.insertId,
        entityLabel: full_name,
        description: `Created librarian account "${full_name}" (username: ${username}). Account starts inactive.`,
        metadata:    {
          new_user: {
            id:        result.insertId,
            username,
            full_name,
            role:      'librarian',
            is_active: false,
          },
        },
      });
 
      res.status(201).json({
        message: 'Librarian created successfully',
        librarian: {
          id: result.insertId,
          username,
          full_name,
          role:      'librarian',
          is_active: false,
        },
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        await logActivity(req, {
          action:      'CREATE_LIBRARIAN',
          entityType:  'adminpanel_user',
          description: `Failed to create librarian — username "${username}" already exists`,
          metadata:    { username, full_name, conflict: 'duplicate_username' },
          status:      'failure',
        });
        return res.status(409).json({ message: 'Username already exists' });
      }
 
      await logActivity(req, {
        action:      'CREATE_LIBRARIAN',
        entityType:  'adminpanel_user',
        description: `Server error while creating librarian "${username}"`,
        metadata:    { username, full_name, error: error.message },
        status:      'failure',
      });
      console.error('Create librarian error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
 
// ─────────────────────────────────────────────────────────────────────────────
// Reset user password
// PUT /api/adminpanel-users/:id/reset-password
// ─────────────────────────────────────────────────────────────────────────────
router.put(
  '/:id/reset-password',
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
 
    if (!password) {
      await logActivity(req, {
        action:      'RESET_PASSWORD',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Failed password reset for user ID ${id} — no password provided`,
        status:      'failure',
      });
      return res.status(400).json({ message: 'Password is required' });
    }
 
    try {
      // Fetch target user for logging context
      const [[targetUser]] = await pool.query(
        'SELECT id, username, full_name, role FROM adminpanel_users WHERE id = ?',
        [id]
      );
 
      const passwordHash = await bcrypt.hash(password, 10);
 
      const [result] = await pool.query(
        'UPDATE adminpanel_users SET password_hash = ? WHERE id = ? AND role != "admin"',
        [passwordHash, id]
      );
 
      if (result.affectedRows === 0) {
        await logActivity(req, {
          action:      'RESET_PASSWORD',
          entityType:  'adminpanel_user',
          entityId:    id,
          description: `Password reset failed — user ID ${id} not found or is an admin account`,
          metadata:    { target_id: id },
          status:      'failure',
        });
        return res.status(404).json({
          message: 'User not found or cannot reset admin password',
        });
      }
 
      await logActivity(req, {
        action:      'RESET_PASSWORD',
        entityType:  'adminpanel_user',
        entityId:    id,
        entityLabel: targetUser?.full_name ?? `User #${id}`,
        description: `Admin reset password for "${targetUser?.full_name ?? `User #${id}`}" (username: ${targetUser?.username ?? 'unknown'}, role: ${targetUser?.role ?? 'unknown'})`,
        metadata:    {
          target: {
            id,
            username:  targetUser?.username,
            full_name: targetUser?.full_name,
            role:      targetUser?.role,
          },
          reset_by: { id: req.user.id, full_name: req.user.full_name },
        },
      });
 
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      await logActivity(req, {
        action:      'RESET_PASSWORD',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Server error during password reset for user ID ${id}`,
        metadata:    { error: error.message },
        status:      'failure',
      });
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
 
// ─────────────────────────────────────────────────────────────────────────────
// Deactivate user account
// PUT /api/adminpanel-users/:id/deactivate
// ─────────────────────────────────────────────────────────────────────────────
router.put(
  '/:id/deactivate',
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
 
    try {
      const [[targetUser]] = await pool.query(
        'SELECT id, username, full_name, role, is_active FROM adminpanel_users WHERE id = ?',
        [id]
      );
 
      if (!targetUser) {
        await logActivity(req, {
          action:      'DEACTIVATE_USER',
          entityType:  'adminpanel_user',
          entityId:    id,
          description: `Deactivation failed — user ID ${id} not found`,
          status:      'failure',
        });
        return res.status(404).json({ message: 'User not found' });
      }
 
      if (targetUser.role !== 'librarian') {
        await logActivity(req, {
          action:      'DEACTIVATE_USER',
          entityType:  'adminpanel_user',
          entityId:    id,
          entityLabel: targetUser.full_name,
          description: `Deactivation rejected — "${targetUser.full_name}" is not a librarian (role: ${targetUser.role})`,
          metadata:    { target: targetUser },
          status:      'failure',
        });
        return res.status(400).json({ message: 'Only librarian accounts can be deactivated' });
      }
 
      if (!targetUser.is_active) {
        return res.status(400).json({ message: 'Account is already inactive' });
      }
 
      await pool.query(
        'UPDATE adminpanel_users SET is_active = FALSE WHERE id = ? AND role = "librarian"',
        [id]
      );
 
      await logActivity(req, {
        action:      'DEACTIVATE_USER',
        entityType:  'adminpanel_user',
        entityId:    id,
        entityLabel: targetUser.full_name,
        description: `Deactivated librarian account "${targetUser.full_name}" (username: ${targetUser.username})`,
        metadata:    {
          target:    { id, username: targetUser.username, full_name: targetUser.full_name, role: targetUser.role },
          before:    { is_active: true },
          after:     { is_active: false },
          action_by: { id: req.user.id, full_name: req.user.full_name },
        },
      });
 
      res.json({ message: 'Account deactivated successfully' });
    } catch (error) {
      await logActivity(req, {
        action:      'DEACTIVATE_USER',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Server error while deactivating user ID ${id}`,
        metadata:    { error: error.message },
        status:      'failure',
      });
      console.error('Deactivate account error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
 
// ─────────────────────────────────────────────────────────────────────────────
// Set active librarian (deactivates all others)
// PUT /api/adminpanel-users/:id/set-active-librarian
// ─────────────────────────────────────────────────────────────────────────────
router.put(
  '/:id/set-active-librarian',
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
 
    const connection = await pool.getConnection();
    await connection.beginTransaction();
 
    try {
      const [[targetUser]] = await connection.query(
        'SELECT id, username, full_name, role, is_active FROM adminpanel_users WHERE id = ?',
        [id]
      );
 
      if (!targetUser || targetUser.role !== 'librarian') {
        await connection.rollback();
        connection.release();
 
        await logActivity(req, {
          action:      'SET_ACTIVE_LIBRARIAN',
          entityType:  'adminpanel_user',
          entityId:    id,
          description: `Failed to set active librarian — user ID ${id} not found or is not a librarian`,
          metadata:    { target_id: id, found: !!targetUser, role: targetUser?.role },
          status:      'failure',
        });
        return res.status(400).json({ message: 'User is not a librarian' });
      }
 
      // Snapshot who was previously active for the audit log
      const [previouslyActive] = await connection.query(
        'SELECT id, username, full_name FROM adminpanel_users WHERE role = "librarian" AND is_active = TRUE'
      );
 
      await connection.query(
        'UPDATE adminpanel_users SET is_active = FALSE WHERE role = "librarian"'
      );
 
      await connection.query(
        'UPDATE adminpanel_users SET is_active = TRUE WHERE id = ? AND role = "librarian"',
        [id]
      );
 
      await connection.commit();
      connection.release();
 
      await logActivity(req, {
        action:      'SET_ACTIVE_LIBRARIAN',
        entityType:  'adminpanel_user',
        entityId:    id,
        entityLabel: targetUser.full_name,
        description: `Set "${targetUser.full_name}" (username: ${targetUser.username}) as the active librarian. ${previouslyActive.length} previously active librarian(s) deactivated.`,
        metadata:    {
          new_active:          { id, username: targetUser.username, full_name: targetUser.full_name },
          previously_active:   previouslyActive.map(u => ({ id: u.id, username: u.username, full_name: u.full_name })),
          deactivated_count:   previouslyActive.length,
          action_by:           { id: req.user.id, full_name: req.user.full_name },
        },
      });
 
      res.json({ message: 'Active librarian set successfully' });
    } catch (error) {
      await connection.rollback();
      connection.release();
 
      await logActivity(req, {
        action:      'SET_ACTIVE_LIBRARIAN',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Server error while setting active librarian for user ID ${id}`,
        metadata:    { error: error.message },
        status:      'failure',
      });
      console.error('Set active librarian error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
 
// ─────────────────────────────────────────────────────────────────────────────
// Update avatar (self or admin)
// PUT /api/adminpanel-users/:id/avatar
// ─────────────────────────────────────────────────────────────────────────────
router.put(
  '/:id/avatar',
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { avatar } = req.body;
 
    const isSelf  = String(req.user.id) === String(id);
    const isAdmin = req.user.role === 'admin';
 
    if (!avatar) {
      return res.status(400).json({ message: 'Avatar URL is required' });
    }
 
    if (!avatar.startsWith('https://api.dicebear.com/')) {
      await logActivity(req, {
        action:      'UPDATE_AVATAR',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Avatar update rejected — invalid URL provided`,
        metadata:    { provided_url: avatar },
        status:      'failure',
      });
      return res.status(400).json({ message: 'Invalid avatar URL' });
    }
 
    if (!isSelf && !isAdmin) {
      await logActivity(req, {
        action:      'UPDATE_AVATAR',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Unauthorized avatar update attempt on user ID ${id}`,
        metadata:    { attempted_by: { id: req.user.id, full_name: req.user.full_name } },
        status:      'failure',
      });
      return res.status(403).json({ message: 'Forbidden' });
    }
 
    if (!isSelf && isAdmin) {
      return res.status(403).json({ message: 'Cannot modify admin avatar' });
    }
 
    try {
      const [[currentUser]] = await pool.query(
        'SELECT id, full_name, avatar FROM adminpanel_users WHERE id = ?',
        [id]
      );
 
      const [result] = await pool.query(
        'UPDATE adminpanel_users SET avatar = ? WHERE id = ?',
        [avatar, id]
      );
 
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
 
      await logActivity(req, {
        action:      'UPDATE_AVATAR',
        entityType:  'adminpanel_user',
        entityId:    id,
        entityLabel: currentUser?.full_name ?? `User #${id}`,
        description: `Updated avatar for "${currentUser?.full_name ?? `User #${id}`}"`,
        metadata:    {
          before: { avatar: currentUser?.avatar ?? null },
          after:  { avatar },
        },
      });
 
      res.json({ message: 'Avatar updated successfully', avatar });
    } catch (error) {
      await logActivity(req, {
        action:      'UPDATE_AVATAR',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Server error while updating avatar for user ID ${id}`,
        metadata:    { error: error.message },
        status:      'failure',
      });
      console.error('Update avatar error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
 
// ─────────────────────────────────────────────────────────────────────────────
// Update display name (self only)
// PUT /api/adminpanel-users/:id/profile
// ─────────────────────────────────────────────────────────────────────────────
router.put(
  '/:id/profile',
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { full_name } = req.body;
 
    if (String(req.user.id) !== String(id)) {
      await logActivity(req, {
        action:      'UPDATE_PROFILE',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Unauthorized profile update attempt on user ID ${id}`,
        metadata:    { attempted_by: { id: req.user.id, full_name: req.user.full_name } },
        status:      'failure',
      });
      return res.status(403).json({ message: 'You can only update your own profile.' });
    }
 
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ message: 'Display name cannot be empty.' });
    }
 
    const trimmed = full_name.trim();
 
    if (trimmed.length > 60) {
      return res.status(400).json({ message: 'Display name must be 60 characters or fewer.' });
    }
 
    try {
      const [[currentUser]] = await pool.query(
        'SELECT id, full_name FROM adminpanel_users WHERE id = ?',
        [id]
      );
 
      const [result] = await pool.query(
        'UPDATE adminpanel_users SET full_name = ? WHERE id = ?',
        [trimmed, id]
      );
 
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
 
      await logActivity(req, {
        action:      'UPDATE_PROFILE',
        entityType:  'adminpanel_user',
        entityId:    id,
        entityLabel: trimmed,
        description: `Updated display name from "${currentUser?.full_name}" to "${trimmed}"`,
        metadata:    {
          before: { full_name: currentUser?.full_name },
          after:  { full_name: trimmed },
        },
      });
 
      res.json({ message: 'Display name updated successfully.', full_name: trimmed });
    } catch (error) {
      await logActivity(req, {
        action:      'UPDATE_PROFILE',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Server error while updating profile for user ID ${id}`,
        metadata:    { error: error.message },
        status:      'failure',
      });
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
 
// ─────────────────────────────────────────────────────────────────────────────
// Change username (self only, requires current password)
// PUT /api/adminpanel-users/:id/username
// ─────────────────────────────────────────────────────────────────────────────
router.put(
  '/:id/username',
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { newUsername, currentPassword } = req.body;
 
    if (String(req.user.id) !== String(id)) {
      await logActivity(req, {
        action:      'CHANGE_USERNAME',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Unauthorized username change attempt on user ID ${id}`,
        metadata:    { attempted_by: { id: req.user.id, full_name: req.user.full_name } },
        status:      'failure',
      });
      return res.status(403).json({ message: 'You can only change your own username.' });
    }
 
    if (!newUsername || !currentPassword) {
      return res.status(400).json({ message: 'New username and current password are required.' });
    }
 
    if (newUsername.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters.' });
    }
 
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores.' });
    }
 
    try {
      const [[user]] = await pool.query(
        'SELECT id, username, full_name, password_hash FROM adminpanel_users WHERE id = ?',
        [id]
      );
 
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
 
      if (newUsername === user.username) {
        return res.status(400).json({ message: 'New username must be different from current username.' });
      }
 
      const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!passwordMatch) {
        await logActivity(req, {
          action:      'CHANGE_USERNAME',
          entityType:  'adminpanel_user',
          entityId:    id,
          entityLabel: user.full_name,
          description: `Username change failed for "${user.full_name}" — incorrect current password`,
          metadata:    { current_username: user.username, attempted_new_username: newUsername },
          status:      'failure',
        });
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
 
      const [result] = await pool.query(
        'UPDATE adminpanel_users SET username = ? WHERE id = ?',
        [newUsername, id]
      );
 
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
 
      await logActivity(req, {
        action:      'CHANGE_USERNAME',
        entityType:  'adminpanel_user',
        entityId:    id,
        entityLabel: user.full_name,
        description: `Changed username from "${user.username}" to "${newUsername}" for "${user.full_name}"`,
        metadata:    {
          before: { username: user.username },
          after:  { username: newUsername },
        },
      });
 
      res.json({ message: 'Username updated successfully.', username: newUsername });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        await logActivity(req, {
          action:      'CHANGE_USERNAME',
          entityType:  'adminpanel_user',
          entityId:    id,
          description: `Username change failed — "${newUsername}" is already taken`,
          metadata:    { attempted_username: newUsername },
          status:      'failure',
        });
        return res.status(409).json({ message: 'That username is already taken.' });
      }
 
      await logActivity(req, {
        action:      'CHANGE_USERNAME',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Server error while changing username for user ID ${id}`,
        metadata:    { error: error.message },
        status:      'failure',
      });
      console.error('Change username error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
 
// ─────────────────────────────────────────────────────────────────────────────
// Delete own account (librarians only, self-service)
// DELETE /api/adminpanel-users/:id
// ─────────────────────────────────────────────────────────────────────────────
router.delete(
  '/:id',
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
 
    if (String(req.user.id) !== String(id)) {
      await logActivity(req, {
        action:      'DELETE_ACCOUNT',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Unauthorized account deletion attempt on user ID ${id}`,
        metadata:    { attempted_by: { id: req.user.id, full_name: req.user.full_name } },
        status:      'failure',
      });
      return res.status(403).json({ message: 'You can only delete your own account.' });
    }
 
    if (req.user.role !== 'librarian') {
      await logActivity(req, {
        action:      'DELETE_ACCOUNT',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Account deletion rejected — only librarians may self-delete (role: ${req.user.role})`,
        metadata:    { role: req.user.role },
        status:      'failure',
      });
      return res.status(403).json({ message: 'Only librarian accounts can be self-deleted.' });
    }
 
    try {
      // Fetch full snapshot before deletion for the log
      const [[targetUser]] = await pool.query(
        'SELECT id, username, full_name, role, is_active, created_at FROM adminpanel_users WHERE id = ?',
        [id]
      );
 
      const [result] = await pool.query(
        'DELETE FROM adminpanel_users WHERE id = ? AND role = "librarian"',
        [id]
      );
 
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Account not found.' });
      }
 
      // Log after deletion — user_id will remain in log via ON DELETE SET NULL
      await logActivity(req, {
        action:      'DELETE_ACCOUNT',
        entityType:  'adminpanel_user',
        entityId:    id,
        entityLabel: targetUser?.full_name ?? `User #${id}`,
        description: `Librarian "${targetUser?.full_name ?? `User #${id}`}" (username: ${targetUser?.username}) self-deleted their account`,
        metadata:    {
          deleted_user: {
            id:         targetUser?.id,
            username:   targetUser?.username,
            full_name:  targetUser?.full_name,
            role:       targetUser?.role,
            is_active:  targetUser?.is_active,
            created_at: targetUser?.created_at,
          },
        },
      });
 
      res.json({ message: 'Account deleted successfully.' });
    } catch (error) {
      await logActivity(req, {
        action:      'DELETE_ACCOUNT',
        entityType:  'adminpanel_user',
        entityId:    id,
        description: `Server error while deleting account for user ID ${id}`,
        metadata:    { error: error.message },
        status:      'failure',
      });
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
 
module.exports = router;