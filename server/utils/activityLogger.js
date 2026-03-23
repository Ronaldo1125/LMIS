const pool = require('../config/connection');

/**
 * Log an activity to the database.
 * @param {import('express').Request} req
 * @param {Object} opts
 * @param {string}        opts.action       - e.g. 'CREATE_BOOK', 'DELETE_USER'
 * @param {string}        opts.entityType   - e.g. 'book', 'user', 'accession'
 * @param {string|number} [opts.entityId]
 * @param {string}        [opts.entityLabel] - human-readable name/title
 * @param {string}        [opts.description] - full sentence description
 * @param {object}        [opts.metadata]    - { before, after, extra }
 * @param {'success'|'failure'} [opts.status]
 */
async function logActivity(req, opts) {
  try {
    // req.user is set by authMiddleware from adminpanel_users JWT payload
    const user = req.user || null;

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      null;

    await pool.execute(
      `INSERT INTO activity_logs
        (user_id, user_name, user_role, action, entity_type, entity_id,
         entity_label, description, metadata, ip_address, user_agent, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user?.id          ?? null,
        user?.full_name   ?? null,   // adminpanel_users.full_name
        user?.role        ?? null,   // adminpanel_users.role (admin|librarian)
        opts.action,
        opts.entityType,
        opts.entityId     != null ? String(opts.entityId) : null,
        opts.entityLabel  ?? null,
        opts.description  ?? null,
        opts.metadata     ? JSON.stringify(opts.metadata) : null,
        ip,
        req.headers['user-agent']?.slice(0, 500) ?? null,
        opts.status       ?? 'success',
      ]
    );
  } catch (err) {
    // Never let logging crash the main request
    console.error('[ActivityLogger] Failed to write log:', err.message);
  }
}

module.exports = { logActivity };
