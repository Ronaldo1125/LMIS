const express = require('express');
const router = express.Router();
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// GET /api/acquisitions - Get recent acquisitions (last 14 days)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Query directly from the view you created
    const [acquisitions] = await pool.query(`
      SELECT * FROM acquisitions
      ORDER BY date_accessioned DESC
    `);

    res.json({
      success: true,
      count: acquisitions.length,
      data: acquisitions
    });
  } catch (error) {
    console.error('Error fetching acquisitions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch acquisitions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/acquisitions/stats - Get acquisition statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT
        COUNT(*) as total_acquisitions,
        COUNT(DISTINCT author) as unique_authors,
        DATE(MIN(date_accessioned)) as earliest_date,
        DATE(MAX(date_accessioned)) as latest_date
      FROM acquisitions
    `);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Error fetching acquisition stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch acquisition statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;