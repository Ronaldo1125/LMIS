const express = require('express');
const router = express.Router();
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.use(roleMiddleware(['Staff', 'admin', 'librarian']));

// ─── GET /api/usertype ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        username,
        NULL          AS email,
        full_name,
        role          AS role,
        is_active,
        CASE
          WHEN role = 'librarian' AND is_active = 1 THEN 1
          ELSE 0
        END           AS is_active_librarian,
        created_at,
        last_login,
        'adminpanel'  AS source
      FROM adminpanel_users

      UNION ALL

      SELECT
        id,
        username,
        email,
        full_name,
        user_type     AS role,
        is_active,
        0             AS is_active_librarian,
        created_at,
        NULL          AS last_login,
        'users'       AS source
      FROM users

      ORDER BY created_at DESC
    `);

    const users = rows.map(row => ({
      id:               row.id,
      username:         row.username,
      email:            row.email || row.username,
      name:             row.full_name || row.username || 'Unknown',
      role:             capitalizeRole(row.role),
      status:           row.is_active ? 'Active' : 'Inactive',
      dateAdded:        row.created_at,
      lastLogin:        row.last_login || null,
      source:           row.source,
      isActiveLibrarian: row.is_active_librarian === 1 || row.is_active_librarian === true,
    }));

    res.json({ users });
  } catch (err) {
    console.error('GET /usertype error:', err);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// ─── GET /api/usertype/stats ──────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [adminStats] = await pool.query(`
      SELECT role, COUNT(*) AS count
      FROM adminpanel_users
      GROUP BY role
    `);

    const [userStats] = await pool.query(`
      SELECT user_type AS role, COUNT(*) AS count
      FROM users
      GROUP BY user_type
    `);

    const stats = { Admin: 0, Librarian: 0, Staff: 0, Patron: 0 };

    for (const row of adminStats) {
      const key = capitalizeRole(row.role);
      if (key in stats) stats[key] = Number(row.count);
    }
    for (const row of userStats) {
      const key = capitalizeRole(row.role);
      if (key in stats) stats[key] = Number(row.count);
    }

    res.json(stats);
  } catch (err) {
    console.error('GET /usertype/stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
});

// ─── GET /api/usertype/patrons/count ─────────────────────────────────────────
router.get('/patrons/count', async (req, res) => {
  try {
    const [[{ count }]] = await pool.query(
      `SELECT COUNT(*) AS count FROM users WHERE user_type = 'Patron'`
    );
    res.json({ count: Number(count) });
  } catch (err) {
    console.error('GET /usertype/patrons/count error:', err);
    res.status(500).json({ message: 'Failed to fetch patron count.' });
  }
});

// ─── PATCH /api/usertype/:id/user-type ───────────────────────────────────────
router.patch('/:id/user-type', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_type } = req.body;

    if (!user_type || !['Patron', 'Staff'].includes(user_type)) {
      return res.status(400).json({
        message: "Invalid user_type. Must be 'Patron' or 'Staff'."
      });
    }

    const [existing] = await pool.query(
      'SELECT id, user_type FROM users WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'User not found in users table.' });
    }

    if (existing[0].user_type === user_type) {
      return res.status(400).json({ message: `User is already a ${user_type}.` });
    }

    await pool.query(
      'UPDATE users SET user_type = ? WHERE id = ?',
      [user_type, id]
    );

    res.json({
      message: `User successfully changed to ${user_type}.`,
      user_id: Number(id),
      user_type
    });
  } catch (err) {
    console.error('PATCH /usertype/:id/user-type error:', err);
    res.status(500).json({ message: 'Failed to update user type.' });
  }
});

// ─── Helper ───────────────────────────────────────────────────────────────────
function capitalizeRole(role) {
  if (!role) return 'Unknown';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

module.exports = router;