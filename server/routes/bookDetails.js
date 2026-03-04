// routes/bookDetails.js
// Client-facing route — returns only what the BookDetails page needs.
// Single query: book + accession + primary upload (if any).

const express = require('express');
const router  = express.Router();
const pool    = require('../config/connection');
const { optionalAuthMiddleware } = require('../middleware/auth');

// GET /api/book-details/:bookId
router.get('/:bookId', optionalAuthMiddleware, async (req, res) => {
  try {
    const { bookId } = req.params;

    // ── Fetch book + accession + primary upload in one query ──────────────
    const [rows] = await pool.query(
      `SELECT
        -- Book fields
        b.id                  AS id,
        b.title               AS title,
        b.author              AS author,
        b.editor              AS editor,
        b.edition             AS edition,
        b.category            AS category,
        b.call_number         AS call_number,
        b.publisher           AS publisher,
        b.publication         AS publication,
        b.date_of_publication AS date_of_publication,
        b.isbn                AS isbn,
        b.issn                AS issn,
        b.subjects            AS subjects,
        b.extent              AS extent,
        b.copies              AS copies,
        b.has_digital_copy    AS has_digital_copy,
        b.access_level        AS access_level,
        b.notes_area          AS notes,

        -- Accession fields
        a.id                  AS accession_id,
        a.accession_no        AS accession_no,
        a.date_accessioned    AS date_accessioned,

        -- Primary upload fields (NULL if no digital copy)
        u.id                  AS upload_id,
        u.file_type           AS file_type,
        u.file_size           AS file_size,
        u.original_name       AS upload_original_name

      FROM books b
      LEFT JOIN accessions a
        ON a.book_id = b.id
        AND a.is_archived = 0
      LEFT JOIN uploads u
        ON u.book_id = b.id
        AND u.is_primary = 1
        AND u.status = 'active'
      WHERE b.id = ?
        AND b.is_archived = 0
      LIMIT 1`,
      [bookId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const row = rows[0];

    // ── Access control ────────────────────────────────────────────────────
    // staff_only books are visible only to admin / librarian / staff
    if (row.access_level === 'staff_only') {
      const role    = req.user?.role?.toLowerCase();
      const isStaff = ['admin', 'librarian', 'staff'].includes(role);
      if (!isStaff) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // ── Shape the response ─────────────────────────────────────────────────
    const response = {
      id:                  row.id,
      title:               row.title,
      author:              row.author,
      editor:              row.editor         || null,
      edition:             row.edition        || null,
      category:            row.category       || null,
      call_number:         row.call_number    || null,
      publisher:           row.publisher      || null,
      publication:         row.publication    || null,
      date_of_publication: row.date_of_publication || null,
      isbn:                row.isbn           || null,
      issn:                row.issn           || null,
      subjects:            row.subjects       || null,
      extent:              row.extent         || null,
      copies:              row.copies         ?? 0,
      notes:               row.notes          || null,
      has_digital_copy:    !!row.has_digital_copy,
      access_level:        row.access_level,

      // Accession (null if not yet accessioned)
      accession: row.accession_id
        ? {
            id:             row.accession_id,
            accession_no:   row.accession_no,
            date_accessioned: row.date_accessioned,
          }
        : null,

      // Upload (null if no digital copy uploaded)
      upload: row.upload_id
        ? {
            id:            row.upload_id,
            file_type:     row.file_type,
            file_size:     row.file_size,
            original_name: row.upload_original_name,
          }
        : null,
    };

    res.json(response);

  } catch (error) {
    console.error('[book-details] Error:', error);
    res.status(500).json({ message: 'Error fetching book details' });
  }
});

module.exports = router;