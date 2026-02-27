const express = require('express');
const router = express.Router();
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Helper: check if the requesting user can see staff_only records
const canViewStaffOnly = (user) => {
  return user && (user.role === 'admin' || user.role === 'librarian' || user.role === 'staff');
};

// GET /api/acquisitions/stats - Get acquisition statistics
// NOTE: must be defined BEFORE the '/' route to avoid routing conflicts
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const accessFilter = canViewStaffOnly(req.user) ? '' : "AND a.access_level = 'public'";

    const [stats] = await pool.query(`
      SELECT
        COUNT(*)                        AS total_acquisitions,
        COUNT(DISTINCT b.author)        AS unique_authors,
        DATE(MIN(a.date_accessioned))   AS earliest_date,
        DATE(MAX(a.date_accessioned))   AS latest_date
      FROM accessions a
      JOIN books b ON a.book_id = b.id
      WHERE a.is_archived = 0
      ${accessFilter}
    `);

    res.json({ success: true, data: stats[0] });
  } catch (error) {
    console.error('Error fetching acquisition stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch acquisition statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// GET /api/acquisitions?page=1&limit=15&search=keyword
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const accessFilter = canViewStaffOnly(req.user) ? '' : "AND a.access_level = 'public'";

    let baseWhere = `
      WHERE a.is_archived = 0
        ${accessFilter}
    `;
    const params = [];

    if (search.trim()) {
      const like = `%${search.trim()}%`;
      baseWhere += ` AND (b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ? OR a.accession_no LIKE ?)`;
      params.push(like, like, like, like);
    }

    const dataQuery = `
      SELECT
        a.id,
        a.accession_no,
        a.date_accessioned,
        a.book_id,
        a.access_level,
        COALESCE(b.category, 'Uncategorized') AS category,
        b.call_number,
        b.title,
        b.author,
        b.editor,
        b.edition,
        b.publication,
        b.publisher,
        b.date_of_publication,
        b.extent,
        b.other_physical_details,
        b.dimensions,
        b.accompanying_material,
        b.isbn,
        b.issn,
        b.notes_area,
        b.subjects,
        (
          SELECT COUNT(*)
          FROM uploads u
          WHERE u.book_id = a.book_id AND u.status = 'active'
        ) AS upload_count
      FROM accessions a
      JOIN books b ON a.book_id = b.id
      ${baseWhere}
      ORDER BY a.date_accessioned DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM accessions a
      JOIN books b ON a.book_id = b.id
      ${baseWhere}
    `;

    const [acquisitions] = await pool.query(dataQuery, [...params, parseInt(limit), offset]);
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    res.json({
      success: true,
      count: acquisitions.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      data: acquisitions,
    });
  } catch (error) {
    console.error('Error fetching acquisitions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch acquisitions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;