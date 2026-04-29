const express = require('express');
const router = express.Router();
const pool = require('../config/connection');

// ─── GET all sections (public) ───────────────────────────────────────────────
// GET /api/privacy-terms
// Optional query param: ?section=privacy_policy  or  ?section=terms_and_conditions
router.get('/', async (req, res) => {
  try {
    const { section } = req.query;

    let query = 'SELECT * FROM privacy_terms';
    const params = [];

    if (section) {
      query += ' WHERE section = ?';
      params.push(section);
    }

    query += ' ORDER BY created_at ASC';

    const [rows] = await pool.query(query, params);

    // Parse items JSON for each row
    const data = rows.map((row) => ({
      ...row,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    }));

    return res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/privacy-terms error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch records.' });
  }
});

// ─── GET single record by ID (public) ────────────────────────────────────────
// GET /api/privacy-terms/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM privacy_terms WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    const row = rows[0];
    return res.json({
      success: true,
      data: {
        ...row,
        items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
      },
    });
  } catch (error) {
    console.error('GET /api/privacy-terms/:id error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch record.' });
  }
});

// ─── CREATE a new section (admin only) ───────────────────────────────────────
// POST /api/privacy-terms
// Body: { section: "privacy_policy", items: [ { header, content }, ... ] }
router.post('/', async (req, res) => {
  try {
    const { section, items } = req.body;

    if (!section || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: '`section` (string) and `items` (non-empty array) are required.',
      });
    }

    // Validate each item has at least a header and content
    for (const item of items) {
      if (!item.header || !item.content) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a `header` and `content` field.',
        });
      }
    }

    const itemsJson = JSON.stringify(items);

    const [result] = await pool.query(
      'INSERT INTO privacy_terms (section, items) VALUES (?, ?)',
      [section, itemsJson]
    );

    return res.status(201).json({
      success: true,
      message: 'Record created successfully.',
      data: { id: result.insertId, section, items },
    });
  } catch (error) {
    console.error('POST /api/privacy-terms error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create record.' });
  }
});

// ─── UPDATE a section (admin only) ───────────────────────────────────────────
// PUT /api/privacy-terms/:id
// Body: { section?: "...", items?: [ { header, content }, ... ] }
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { section, items } = req.body;

    if (!section && !items) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one field to update: `section` or `items`.',
      });
    }

    // Fetch existing record
    const [rows] = await pool.query('SELECT * FROM privacy_terms WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    const existing = rows[0];
    const updatedSection = section ?? existing.section;
    const updatedItems = items ?? (typeof existing.items === 'string'
      ? JSON.parse(existing.items)
      : existing.items);

    if (!Array.isArray(updatedItems) || updatedItems.length === 0) {
      return res.status(400).json({ success: false, message: '`items` must be a non-empty array.' });
    }

    for (const item of updatedItems) {
      if (!item.header || !item.content) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a `header` and `content` field.',
        });
      }
    }

    await pool.query(
      'UPDATE privacy_terms SET section = ?, items = ?, updated_at = NOW() WHERE id = ?',
      [updatedSection, JSON.stringify(updatedItems), id]
    );

    return res.json({
      success: true,
      message: 'Record updated successfully.',
      data: { id: Number(id), section: updatedSection, items: updatedItems },
    });
  } catch (error) {
    console.error('PUT /api/privacy-terms/:id error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update record.' });
  }
});

// ─── DELETE a section (admin only) ───────────────────────────────────────────
// DELETE /api/privacy-terms/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT id FROM privacy_terms WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    await pool.query('DELETE FROM privacy_terms WHERE id = ?', [id]);

    return res.json({ success: true, message: 'Record deleted successfully.' });
  } catch (error) {
    console.error('DELETE /api/privacy-terms/:id error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete record.' });
  }
});

module.exports = router;
