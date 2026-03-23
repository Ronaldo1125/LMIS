const express = require('express');
const router = express.Router();
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger');

// Helper: check if the requesting user can see staff_only records
const canViewStaffOnly = (user) => {
  return user && (user.role === 'admin' || user.role === 'librarian' || user.role === 'staff');
};

// ─── Search books available for accession (not yet accessioned, not archived) ──
// GET /api/accessions/search-books?q=keyword
router.get('/search-books', authMiddleware, async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 1) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const keyword = `%${q.trim()}%`;

    // Build access level filter — non-staff cannot search staff_only books for accession
    const accessFilter = canViewStaffOnly(req.user) ? '' : "AND b.access_level = 'public'";

    const [rows] = await pool.query(
      `SELECT
        b.id, b.category, b.call_number, b.title, b.author, b.editor, b.edition,
        b.publication, b.publisher, b.date_of_publication, b.extent,
        b.other_physical_details, b.dimensions, b.accompanying_material,
        b.isbn, b.issn, b.notes_area, b.subjects, b.access_level,
        (SELECT COUNT(*) FROM uploads u WHERE u.book_id = b.id AND u.status = 'active') AS upload_count
       FROM books b
       WHERE b.is_archived = 0
         AND b.is_accessioned = 0
         ${accessFilter}
         AND (b.title LIKE ? OR b.author LIKE ? OR b.call_number LIKE ? OR b.isbn LIKE ?)
       ORDER BY b.title ASC
       LIMIT 20`,
      [keyword, keyword, keyword, keyword]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error searching books:', err);
    res.status(500).json({ message: 'Failed to search books' });
  }
});

// ─── Get next accession number (auto-suggest) ─────────────────────────────────
// GET /api/accessions/next-number
router.get('/next-number', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT accession_no FROM accessions ORDER BY id DESC LIMIT 1`
    );

    let nextNumber = 1;

    if (rows.length > 0) {
      const last = rows[0].accession_no;
      const match = last.match(/(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const year = new Date().getFullYear();
    const padded = String(nextNumber).padStart(4, '0');
    const suggested = `${year}-${padded}`;

    res.json({ next_accession_no: suggested });
  } catch (err) {
    console.error('Error generating accession number:', err);
    res.status(500).json({ message: 'Failed to generate accession number' });
  }
});

// ─── Get all accessions (joins with books for full data) ───────────────────────
// GET /api/accessions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    // Access level filter applied at the accession level
    const accessFilter = canViewStaffOnly(req.user) ? '' : "AND a.access_level = 'public'";

    let query = `
      SELECT
        a.id, a.accession_no, a.date_accessioned, a.book_id, a.access_level,
        a.is_archived, a.archived_at, a.archived_by, a.archive_reason,
        b.category, b.call_number, b.title, b.author, b.editor, b.edition,
        b.publication, b.publisher, b.date_of_publication, b.extent,
        b.other_physical_details, b.dimensions, b.accompanying_material,
        b.isbn, b.issn, b.notes_area, b.subjects,
        (SELECT COUNT(*) FROM uploads u WHERE u.book_id = a.book_id AND u.status = 'active') AS upload_count
      FROM accessions a
      JOIN books b ON a.book_id = b.id
      WHERE a.is_archived = 0
      ${accessFilter}
    `;

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM accessions a
      JOIN books b ON a.book_id = b.id
      WHERE a.is_archived = 0
      ${accessFilter}
    `;

    const params = [];
    const countParams = [];

    if (search) {
      const like = `%${search}%`;
      const searchClause = ' AND (b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ? OR a.accession_no LIKE ?)';
      query += searchClause;
      countQuery += searchClause;
      params.push(like, like, like, like);
      countParams.push(like, like, like, like);
    }

    query += ' ORDER BY a.date_accessioned DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      accessions: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching accessions:', err);
    res.status(500).json({ message: 'Failed to fetch accessions' });
  }
});

// ─── Get archived accessions ───────────────────────────────────────────────────
// GET /api/accessions/archived
router.get('/archived', authMiddleware, async (req, res) => {
  try {
    // Archived list is staff-only by nature; still filter access_level for non-privileged users
    const accessFilter = canViewStaffOnly(req.user) ? '' : "AND a.access_level = 'public'";

    const [rows] = await pool.query(
      `SELECT
        a.id, a.accession_no, a.date_accessioned, a.book_id, a.access_level,
        a.is_archived, a.archived_at, a.archived_by, a.archive_reason,
        b.category, b.call_number, b.title, b.author, b.editor, b.edition,
        b.publication, b.publisher, b.date_of_publication,
        b.isbn, b.issn, b.subjects
       FROM accessions a
       JOIN books b ON a.book_id = b.id
       WHERE a.is_archived = 1
       ${accessFilter}
       ORDER BY a.archived_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching archived accessions:', err);
    res.status(500).json({ message: 'Failed to fetch archived accessions' });
  }
});

// ─── Get single accession ──────────────────────────────────────────────────────
// GET /api/accessions/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        a.id, a.accession_no, a.date_accessioned, a.book_id, a.access_level,
        a.is_archived, a.archived_at, a.archived_by, a.archive_reason,
        b.category, b.call_number, b.title, b.author, b.editor, b.edition,
        b.publication, b.publisher, b.date_of_publication, b.extent,
        b.other_physical_details, b.dimensions, b.accompanying_material,
        b.isbn, b.issn, b.notes_area, b.subjects, b.copies
       FROM accessions a
       JOIN books b ON a.book_id = b.id
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Accession not found' });
    }

    const accession = rows[0];

    // ── Access level guard ───────────────────────────────────────────────────
    if (accession.access_level === 'staff_only' && !canViewStaffOnly(req.user)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(accession);
  } catch (err) {
    console.error('Error fetching accession:', err);
    res.status(500).json({ message: 'Failed to fetch accession' });
  }
});

// ─── Create accession (promotes a catalog book) ────────────────────────────────
// POST /api/accessions
router.post('/', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  const { accession_no, date_accessioned, book_id } = req.body;

  if (!accession_no || !date_accessioned || !book_id) {
    return res.status(400).json({
      message: 'accession_no, date_accessioned, and book_id are required',
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [books] = await connection.query(
      `SELECT id, title, is_archived, is_accessioned, access_level FROM books WHERE id = ?`,
      [book_id]
    );

    if (books.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Book not found' });
    }

    if (books[0].is_archived) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cannot accession an archived book' });
    }

    if (books[0].is_accessioned) {
      await connection.rollback();
      return res.status(400).json({ message: 'This book has already been accessioned' });
    }

    const [existing] = await connection.query(
      `SELECT id FROM accessions WHERE accession_no = ?`,
      [accession_no]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        message: `Accession number "${accession_no}" already exists`,
      });
    }

    const inheritedAccessLevel = books[0].access_level || 'public';

    const [result] = await connection.query(
      `INSERT INTO accessions (accession_no, date_accessioned, book_id, access_level)
       VALUES (?, ?, ?, ?)`,
      [accession_no, date_accessioned, book_id, inheritedAccessLevel]
    );

    const performedBy = req.user.email || req.user.username;
    await connection.query(
      `UPDATE books
       SET is_accessioned = TRUE,
           accessioned_at = NOW(),
           accessioned_by = ?
       WHERE id = ?`,
      [performedBy, book_id]
    );

    await connection.commit();

    await logActivity(req, {
      action: 'CREATE_ACCESSION',
      entityType: 'accession',
      entityId: result.insertId,
      entityLabel: accession_no,
      description: `"${books[0].title}" was accessioned as "${accession_no}" by ${req.user.full_name ?? req.user.username}.`,
      metadata: {
        accession_no,
        book_id,
        book_title: books[0].title,
        date_accessioned,
        access_level: inheritedAccessLevel,
      },
      status: 'success',
    });

    res.status(201).json({
      message: 'Book accessioned successfully',
      id: result.insertId,
      accession_no,
      book_id,
      access_level: inheritedAccessLevel,
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating accession:', err);
    res.status(500).json({ message: 'Failed to create accession' });
  } finally {
    connection.release();
  }
});

// ─── Update accession number / date only ──────────────────────────────────────
// PUT /api/accessions/:id
router.put('/:id', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  const { accession_no, date_accessioned } = req.body;

  try {
    if (accession_no) {
      const [existing] = await pool.query(
        `SELECT id FROM accessions WHERE accession_no = ? AND id != ?`,
        [accession_no, req.params.id]
      );
      if (existing.length > 0) {
        return res.status(409).json({
          message: `Accession number "${accession_no}" already exists`,
        });
      }
    }

    // Fetch before state for the diff
    const [[before]] = await pool.query(
      `SELECT a.accession_no, a.date_accessioned, b.title
       FROM accessions a
       LEFT JOIN books b ON b.id = a.book_id
       WHERE a.id = ?`,
      [req.params.id]
    );

    const [result] = await pool.query(
      `UPDATE accessions SET
        accession_no = COALESCE(?, accession_no),
        date_accessioned = COALESCE(?, date_accessioned)
       WHERE id = ?`,
      [accession_no || null, date_accessioned || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Accession not found' });
    }

    await logActivity(req, {
      action: 'UPDATE_ACCESSION',
      entityType: 'accession',
      entityId: req.params.id,
      entityLabel: accession_no ?? before?.accession_no,
      description: `Accession "${before?.accession_no}" for "${before?.title}" was updated by ${req.user.full_name ?? req.user.username}${accession_no && accession_no !== before?.accession_no ? ` (re-numbered to "${accession_no}")` : ''}.`,
      metadata: {
        before: {
          accession_no: before?.accession_no,
          date_accessioned: before?.date_accessioned,
        },
        after: {
          accession_no: accession_no ?? before?.accession_no,
          date_accessioned: date_accessioned ?? before?.date_accessioned,
        },
      },
      status: 'success',
    });

    res.json({ message: 'Accession updated successfully' });
  } catch (err) {
    console.error('Error updating accession:', err);
    res.status(500).json({ message: 'Failed to update accession' });
  }
});

// ─── Update access level of an accession ──────────────────────────────────────
// PATCH /api/accessions/:id/access-level
router.patch('/:id/access-level', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  const { access_level } = req.body;

  const validLevels = ['public', 'staff_only'];
  if (!access_level || !validLevels.includes(access_level)) {
    return res.status(400).json({
      message: `Invalid access_level. Must be one of: ${validLevels.join(', ')}`,
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT a.id, a.accession_no, a.access_level, a.book_id, b.title
       FROM accessions a
       LEFT JOIN books b ON b.id = a.book_id
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Accession not found' });
    }

    const { book_id, accession_no, access_level: prevLevel, title } = rows[0];

    await connection.query(
      `UPDATE accessions SET access_level = ? WHERE id = ?`,
      [access_level, req.params.id]
    );

    await connection.query(
      `UPDATE books SET access_level = ? WHERE id = ?`,
      [access_level, book_id]
    );

    await connection.commit();

    await logActivity(req, {
      action: 'UPDATE_ACCESSION_ACCESS_LEVEL',
      entityType: 'accession',
      entityId: req.params.id,
      entityLabel: accession_no,
      description: `Access level for accession "${accession_no}" ("${title}") changed from "${prevLevel}" to "${access_level}" by ${req.user.full_name ?? req.user.username}.`,
      metadata: { before: prevLevel, after: access_level, book_id, book_title: title },
      status: 'success',
    });

    res.json({
      message: `Access level updated to '${access_level}' for accession and its linked book`,
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error updating access level:', err);
    res.status(500).json({ message: 'Failed to update access level' });
  } finally {
    connection.release();
  }
});

// ─── De-accession: revert book back to catalog ────────────────────────────────
// DELETE /api/accessions/:id/deaccession
router.delete('/:id/deaccession', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT a.id, a.accession_no, a.book_id, b.title
       FROM accessions a
       LEFT JOIN books b ON b.id = a.book_id
       WHERE a.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Accession not found' });
    }

    const { book_id, accession_no, title } = rows[0];

    await connection.query(`DELETE FROM accessions WHERE id = ?`, [req.params.id]);

    await connection.query(
      `UPDATE books
       SET is_accessioned = FALSE,
           accessioned_at = NULL,
           accessioned_by = NULL
       WHERE id = ?`,
      [book_id]
    );

    await connection.commit();

    await logActivity(req, {
      action: 'DEACCESSION',
      entityType: 'accession',
      entityId: req.params.id,
      entityLabel: accession_no,
      description: `Accession "${accession_no}" ("${title}") was de-accessioned by ${req.user.full_name ?? req.user.username} and restored to catalog.`,
      metadata: { accession_no, book_id, book_title: title },
      status: 'success',
    });

    res.json({
      message: 'Book de-accessioned successfully and restored to catalog',
      book_id,
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error de-accessioning:', err);
    res.status(500).json({ message: 'Failed to de-accession' });
  } finally {
    connection.release();
  }
});

// ─── Archive accession (soft delete) ───────────────────────────────────────────
// PATCH /api/accessions/:id/archive
router.patch('/:id/archive', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  const { archive_reason } = req.body;
  const archivedBy = req.user.email || req.user.username;

  try {
    // Fetch label info before update for the log
    const [[accession]] = await pool.query(
      `SELECT a.accession_no, b.title
       FROM accessions a
       LEFT JOIN books b ON b.id = a.book_id
       WHERE a.id = ? AND a.is_archived = 0`,
      [req.params.id]
    );

    const [result] = await pool.query(
      `UPDATE accessions SET
        is_archived = 1,
        archived_at = NOW(),
        archived_by = ?,
        archive_reason = ?
       WHERE id = ? AND is_archived = 0`,
      [archivedBy, archive_reason || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Accession not found or already archived' });
    }

    await logActivity(req, {
      action: 'ARCHIVE_ACCESSION',
      entityType: 'accession',
      entityId: req.params.id,
      entityLabel: accession?.accession_no,
      description: `Accession "${accession?.accession_no}" ("${accession?.title}") was archived by ${req.user.full_name ?? req.user.username}${archive_reason ? ` — reason: ${archive_reason}` : ''}.`,
      metadata: { archive_reason: archive_reason || null, book_title: accession?.title },
      status: 'success',
    });

    res.json({ message: 'Accession archived successfully' });
  } catch (err) {
    console.error('Error archiving accession:', err);
    res.status(500).json({ message: 'Failed to archive accession' });
  }
});

// ─── Restore archived accession ────────────────────────────────────────────────
// PATCH /api/accessions/:id/restore
router.patch('/:id/restore', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const [[accession]] = await pool.query(
      `SELECT a.accession_no, b.title
       FROM accessions a
       LEFT JOIN books b ON b.id = a.book_id
       WHERE a.id = ? AND a.is_archived = 1`,
      [req.params.id]
    );

    const [result] = await pool.query(
      `UPDATE accessions SET
        is_archived = 0,
        archived_at = NULL,
        archived_by = NULL,
        archive_reason = NULL
       WHERE id = ? AND is_archived = 1`,
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Accession not found or not archived' });
    }

    await logActivity(req, {
      action: 'RESTORE_ACCESSION',
      entityType: 'accession',
      entityId: req.params.id,
      entityLabel: accession?.accession_no,
      description: `Accession "${accession?.accession_no}" ("${accession?.title}") was restored by ${req.user.full_name ?? req.user.username}.`,
      metadata: { book_title: accession?.title },
      status: 'success',
    });

    res.json({ message: 'Accession restored successfully' });
  } catch (err) {
    console.error('Error restoring accession:', err);
    res.status(500).json({ message: 'Failed to restore accession' });
  }
});

module.exports = router;