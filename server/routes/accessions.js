const express = require('express');
const router = express.Router();
const pool = require('../config/connection');

// ─── Search books for the autofill modal ───────────────────────────────────────
// GET /api/accessions/search-books?q=keyword
router.get('/search-books', async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 1) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const keyword = `%${q.trim()}%`;
    const [rows] = await pool.query(
      `SELECT
        id, category, call_number, title, author, editor, edition,
        publication, publisher, date_of_publication, extent,
        other_physical_details, dimensions, accompanying_material,
        isbn, issn, notes_area, subjects
       FROM books
       WHERE is_archived = 0
         AND (title LIKE ? OR author LIKE ? OR call_number LIKE ? OR isbn LIKE ?)
       ORDER BY title ASC
       LIMIT 20`,
      [keyword, keyword, keyword, keyword]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error searching books:', err);
    res.status(500).json({ message: 'Failed to search books' });
  }
});

// ─── Get single book by ID (for autofill) ─────────────────────────────────────
// GET /api/accessions/book/:id
router.get('/book/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        id, category, call_number, title, author, editor, edition,
        publication, publisher, date_of_publication, extent,
        other_physical_details, dimensions, accompanying_material,
        isbn, issn, notes_area, subjects
       FROM books
       WHERE id = ? AND is_archived = 0`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).json({ message: 'Failed to fetch book' });
  }
});

// ─── Get next accession number (auto-suggest) ─────────────────────────────────
// GET /api/accessions/next-number
router.get('/next-number', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT accession_no FROM accessions ORDER BY id DESC LIMIT 1`
    );

    let nextNumber = 1;

    if (rows.length > 0) {
      // Expects format like "2024-0001" or just "0001"
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

// ─── Get all accessions ────────────────────────────────────────────────────────
// GET /api/accessions
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM accessions WHERE is_archived = 0 ORDER BY date_accessioned DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching accessions:', err);
    res.status(500).json({ message: 'Failed to fetch accessions' });
  }
});

// ─── Get archived accessions ───────────────────────────────────────────────────
// GET /api/accessions/archived
router.get('/archived', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM accessions WHERE is_archived = 1 ORDER BY archived_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching archived accessions:', err);
    res.status(500).json({ message: 'Failed to fetch archived accessions' });
  }
});

// ─── Get single accession ──────────────────────────────────────────────────────
// GET /api/accessions/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM accessions WHERE id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Accession not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching accession:', err);
    res.status(500).json({ message: 'Failed to fetch accession' });
  }
});

// ─── Create accession ──────────────────────────────────────────────────────────
// POST /api/accessions
router.post('/', async (req, res) => {
  const {
    accession_no,
    date_accessioned,
    book_id,
    title,
    author,
    editor,
    edition,
    publication,
    publisher,
    date_of_publication,
    extent,
    other_physical_details,
    dimensions,
    accompanying_material,
    isbn,
    issn,
    notes_area,
    subjects,
  } = req.body;

  // Basic validation
  if (!accession_no || !date_accessioned) {
    return res.status(400).json({
      message: 'accession_no and date_accessioned are required',
    });
  }

  try {
    // Check for duplicate accession_no
    const [existing] = await pool.query(
      `SELECT id FROM accessions WHERE accession_no = ?`,
      [accession_no]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: `Accession number "${accession_no}" already exists`,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO accessions (
        accession_no, date_accessioned, book_id,
        title, author, editor, edition,
        publication, publisher, date_of_publication,
        extent, other_physical_details, dimensions,
        accompanying_material, isbn, issn, notes_area, subjects
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        accession_no, date_accessioned, book_id || null,
        title, author, editor, edition,
        publication, publisher, date_of_publication || null,
        extent, other_physical_details, dimensions,
        accompanying_material, isbn, issn, notes_area, subjects,
      ]
    );

    res.status(201).json({
      message: 'Accession created successfully',
      id: result.insertId,
      accession_no,
    });
  } catch (err) {
    console.error('Error creating accession:', err);
    res.status(500).json({ message: 'Failed to create accession' });
  }
});

// ─── Update accession ──────────────────────────────────────────────────────────
// PUT /api/accessions/:id
router.put('/:id', async (req, res) => {
  const {
    accession_no, date_accessioned, book_id,
    title, author, editor, edition,
    publication, publisher, date_of_publication,
    extent, other_physical_details, dimensions,
    accompanying_material, isbn, issn, notes_area, subjects,
  } = req.body;

  try {
    // Check duplicate accession_no but exclude current record
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

    const [result] = await pool.query(
      `UPDATE accessions SET
        accession_no = ?, date_accessioned = ?, book_id = ?,
        title = ?, author = ?, editor = ?, edition = ?,
        publication = ?, publisher = ?, date_of_publication = ?,
        extent = ?, other_physical_details = ?, dimensions = ?,
        accompanying_material = ?, isbn = ?, issn = ?,
        notes_area = ?, subjects = ?
       WHERE id = ?`,
      [
        accession_no, date_accessioned, book_id || null,
        title, author, editor, edition,
        publication, publisher, date_of_publication || null,
        extent, other_physical_details, dimensions,
        accompanying_material, isbn, issn,
        notes_area, subjects,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Accession not found' });
    }

    res.json({ message: 'Accession updated successfully' });
  } catch (err) {
    console.error('Error updating accession:', err);
    res.status(500).json({ message: 'Failed to update accession' });
  }
});


// ─── Archive accession (soft delete) ───────────────────────────────────────────
// PATCH /api/accessions/:id/archive
router.patch('/:id/archive', async (req, res) => {
  const { archived_by, archive_reason } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE accessions SET
        is_archived = 1,
        archived_at = NOW(),
        archived_by = ?,
        archive_reason = ?
       WHERE id = ? AND is_archived = 0`,
      [archived_by || null, archive_reason || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Accession not found or already archived',
      });
    }

    res.json({ message: 'Accession archived successfully' });
  } catch (err) {
    console.error('Error archiving accession:', err);
    res.status(500).json({ message: 'Failed to archive accession' });
  }
});

// ─── Restore archived accession ────────────────────────────────────────────────
// PATCH /api/accessions/:id/restore
router.patch('/:id/restore', async (req, res) => {
  try {
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
      return res.status(404).json({
        message: 'Accession not found or not archived',
      });
    }

    res.json({ message: 'Accession restored successfully' });
  } catch (err) {
    console.error('Error restoring accession:', err);
    res.status(500).json({ message: 'Failed to restore accession' });
  }
});

// ─── Delete accession permanently ──────────────────────────────────────────────
// DELETE /api/accessions/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM accessions WHERE id = ?`,
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Accession not found',
      });
    }

    res.json({ message: 'Accession deleted permanently' });
  } catch (err) {
    console.error('Error deleting accession:', err);
    res.status(500).json({ message: 'Failed to delete accession' });
  }
});

module.exports = router;