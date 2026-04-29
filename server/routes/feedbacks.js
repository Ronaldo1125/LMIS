const express = require('express');
const router = express.Router();

const pool = require('../config/connection');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger');


// ✅ SUBMIT FEEDBACK (optional auth - both logged-in users and guests can submit)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Basic validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const user_id = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO feedbacks (user_id, rating, comment)
       VALUES (?, ?, ?)`,
      [user_id, rating, comment || null]
    );

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedbackId: result.insertId
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ GET ALL FEEDBACKS (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        f.id,
        f.rating,
        f.comment,
        f.created_at,
        f.user_id,
        u.username,
        u.full_name,
        u.user_type,
        u.avatar
      FROM feedbacks f
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY f.created_at DESC
    `);

    res.json(rows);

  } catch (error) {
    console.error('Fetch feedbacks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ DELETE FEEDBACK (owner or staff only - requires auth)
router.delete('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    // Require authentication for delete
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to delete feedback' });
    }

    const feedbackId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    // Check ownership
    const [rows] = await pool.query(
      `SELECT * FROM feedbacks WHERE id = ?`,
      [feedbackId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const feedback = rows[0];

    // Allow if owner OR staff
    if (feedback.user_id !== userId && role !== 'Staff') {
      return res.status(403).json({ message: 'Not allowed to delete this feedback' });
    }

    // Store feedback data for activity log before deletion
    const feedbackData = {
      id: feedback.id,
      rating: feedback.rating,
      comment: feedback.comment,
      userId: feedback.user_id
    };

    await pool.query(`DELETE FROM feedbacks WHERE id = ?`, [feedbackId]);

    // Log the activity
    await logActivity(req, {
      action: 'DELETE_FEEDBACK',
      entityType: 'feedback',
      entityId: feedbackId,
      entityLabel: `Feedback #${feedbackId}`,
      description: `Deleted feedback with rating ${feedbackData.rating}`,
      metadata: {
        deletedFeedback: feedbackData,
        deletedBy: {
          userId: userId,
          role: role
        }
      },
      status: 'success'
    });

    res.json({ message: 'Feedback deleted successfully' });

  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;