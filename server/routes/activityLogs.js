const express = require('express');
const router = express.Router();
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/activity-logs
// Query params:
//   page, limit, user_id, action, entity_type, entity_id,
//   status, date_from (YYYY-MM-DD), date_to (YYYY-MM-DD), search
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  async (req, res) => {
    try {
      const {
        page        = 1,
        limit       = 50,
        user_id,
        action,
        entity_type,
        entity_id,
        status,
        date_from,
        date_to,
        search,
      } = req.query;

      const take   = Math.min(200, Math.max(1, Number(limit)));
      const offset = (Math.max(1, Number(page)) - 1) * take;

      const conditions = [];
      const params     = [];

      if (user_id)     { conditions.push('al.user_id = ?');                params.push(user_id); }
      if (action)      { conditions.push('al.action = ?');                 params.push(action); }
      if (entity_type) { conditions.push('al.entity_type = ?');            params.push(entity_type); }
      if (entity_id)   { conditions.push('al.entity_id = ?');              params.push(entity_id); }
      if (status)      { conditions.push('al.status = ?');                 params.push(status); }
      if (date_from)   { conditions.push('al.created_at >= ?');            params.push(date_from + ' 00:00:00'); }
      if (date_to)     { conditions.push('al.created_at <= ?');            params.push(date_to   + ' 23:59:59'); }
      if (search) {
        conditions.push(
          '(al.user_name LIKE ? OR al.description LIKE ? OR al.entity_label LIKE ? OR al.action LIKE ?)'
        );
        const like = `%${search}%`;
        params.push(like, like, like, like);
      }

      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      // Total count
      const [[{ total }]] = await pool.execute(
        `SELECT COUNT(*) AS total FROM activity_logs al ${where}`,
        params
      );

      // Paginated rows — also JOIN adminpanel_users to get live avatar/is_active
      const [rows] = await pool.execute(
        `SELECT
           al.*,
           u.avatar       AS user_avatar,
           u.is_active    AS user_is_active
         FROM activity_logs al
         LEFT JOIN adminpanel_users u ON u.id = al.user_id
         ${where}
         ORDER BY al.created_at DESC
         LIMIT ${take} OFFSET ${offset}`,
        params
      );

      const logs = rows.map(row => ({
        ...row,
        metadata: row.metadata
          ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata)
          : null,
      }));

      res.json({
        data: logs,
        pagination: {
          total:  Number(total),
          page:   Number(page),
          limit:  take,
          pages:  Math.ceil(Number(total) / take),
        },
      });
    } catch (err) {
      console.error('GET /activity-logs error:', err);
      res.status(500).json({ message: 'Failed to retrieve activity logs' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/activity-logs/summary
// Quick stats for a dashboard widget
// Query params: days (default 7)
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/summary',
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  async (req, res) => {
    try {
      const days = Math.min(365, Math.max(1, Number(req.query.days ?? 7)));

      const [[counts]] = await pool.execute(
        `SELECT
           COUNT(*)                        AS total,
           SUM(status = 'success')         AS success_count,
           SUM(status = 'failure')         AS failure_count,
           COUNT(DISTINCT user_id)         AS unique_users
         FROM activity_logs
         WHERE created_at >= NOW() - INTERVAL ? DAY`,
        [days]
      );

      const [byAction] = await pool.execute(
        `SELECT action, COUNT(*) AS count
         FROM activity_logs
         WHERE created_at >= NOW() - INTERVAL ? DAY
         GROUP BY action
         ORDER BY count DESC
         LIMIT 10`,
        [days]
      );

      const [byEntity] = await pool.execute(
        `SELECT entity_type, COUNT(*) AS count
         FROM activity_logs
         WHERE created_at >= NOW() - INTERVAL ? DAY
         GROUP BY entity_type
         ORDER BY count DESC`,
        [days]
      );

      const [topUsers] = await pool.execute(
        `SELECT
           al.user_id,
           al.user_name,
           al.user_role,
           u.avatar,
           COUNT(*) AS count
         FROM activity_logs al
         LEFT JOIN adminpanel_users u ON u.id = al.user_id
         WHERE al.created_at >= NOW() - INTERVAL ? DAY
           AND al.user_id IS NOT NULL
         GROUP BY al.user_id, al.user_name, al.user_role, u.avatar
         ORDER BY count DESC
         LIMIT 5`,
        [days]
      );

      const [dailyActivity] = await pool.execute(
        `SELECT
           DATE(created_at) AS date,
           COUNT(*)         AS total,
           SUM(status = 'success') AS success,
           SUM(status = 'failure') AS failure
         FROM activity_logs
         WHERE created_at >= NOW() - INTERVAL ? DAY
         GROUP BY DATE(created_at)
         ORDER BY date ASC`,
        [days]
      );

      res.json({
        period_days:   days,
        counts,
        byAction,
        byEntity,
        topUsers,
        dailyActivity,
      });
    } catch (err) {
      console.error('GET /activity-logs/summary error:', err);
      res.status(500).json({ message: 'Failed to retrieve summary' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/activity-logs/actions
// Returns distinct action values — useful for filter dropdowns in the UI
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/actions',
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  async (req, res) => {
    try {
      const [rows] = await pool.execute(
        `SELECT DISTINCT action FROM activity_logs ORDER BY action ASC`
      );
      res.json(rows.map(r => r.action));
    } catch (err) {
      res.status(500).json({ message: 'Failed to retrieve actions' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/activity-logs/entity-types
// Returns distinct entity_type values — useful for filter dropdowns
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/entity-types',
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  async (req, res) => {
    try {
      const [rows] = await pool.execute(
        `SELECT DISTINCT entity_type FROM activity_logs ORDER BY entity_type ASC`
      );
      res.json(rows.map(r => r.entity_type));
    } catch (err) {
      res.status(500).json({ message: 'Failed to retrieve entity types' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/activity-logs/user/:userId
// All logs for a specific adminpanel user
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/user/:userId',
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const take   = Math.min(200, Math.max(1, Number(limit)));
      const offset = (Math.max(1, Number(page)) - 1) * take;

      // Verify user exists in adminpanel_users
      const [[user]] = await pool.execute(
        `SELECT id, full_name, role, avatar, is_active FROM adminpanel_users WHERE id = ?`,
        [userId]
      );
      if (!user) return res.status(404).json({ message: 'User not found' });

      const [[{ total }]] = await pool.execute(
        `SELECT COUNT(*) AS total FROM activity_logs WHERE user_id = ?`,
        [userId]
      );

      const [rows] = await pool.execute(
        `SELECT * FROM activity_logs
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ${take} OFFSET ${offset}`,
        [userId]
      );

      const logs = rows.map(row => ({
        ...row,
        metadata: row.metadata
          ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata)
          : null,
      }));

      res.json({
        user,
        data: logs,
        pagination: {
          total:  Number(total),
          page:   Number(page),
          limit:  take,
          pages:  Math.ceil(Number(total) / take),
        },
      });
    } catch (err) {
      console.error('GET /activity-logs/user/:userId error:', err);
      res.status(500).json({ message: 'Failed to retrieve user logs' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/activity-logs/:id
// Single log entry by ID
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  async (req, res) => {
    try {
      const [[log]] = await pool.execute(
        `SELECT
           al.*,
           u.full_name   AS user_full_name,
           u.avatar      AS user_avatar,
           u.is_active   AS user_is_active
         FROM activity_logs al
         LEFT JOIN adminpanel_users u ON u.id = al.user_id
         WHERE al.id = ?`,
        [req.params.id]
      );

      if (!log) return res.status(404).json({ message: 'Log entry not found' });

      log.metadata = log.metadata
        ? (typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata)
        : null;

      res.json(log);
    } catch (err) {
      console.error('GET /activity-logs/:id error:', err);
      res.status(500).json({ message: 'Failed to retrieve log entry' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/activity-logs
// Purge logs older than N days (admin only)
// Query params: older_than_days (default 90)
// ─────────────────────────────────────────────────────────────────────────────
router.delete(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  async (req, res) => {
    try {
      const days = Math.max(1, Number(req.query.older_than_days ?? 90));

      const [result] = await pool.execute(
        `DELETE FROM activity_logs WHERE created_at < NOW() - INTERVAL ? DAY`,
        [days]
      );

      // Log the purge action itself
      const { logActivity } = require('../utils/activityLogger');
      await logActivity(req, {
        action:      'PURGE_ACTIVITY_LOGS',
        entityType:  'activity_log',
        description: `Purged ${result.affectedRows} log entries older than ${days} days`,
        metadata:    { deleted_count: result.affectedRows, older_than_days: days },
      });

      res.json({
        message:          `Deleted ${result.affectedRows} log entries`,
        deleted:          result.affectedRows,
        older_than_days:  days,
      });
    } catch (err) {
      console.error('DELETE /activity-logs error:', err);
      res.status(500).json({ message: 'Failed to purge logs' });
    }
  }
);

module.exports = router;
