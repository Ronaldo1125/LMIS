// routes/books.js
const express = require('express');
const router = express.Router();
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

// Helper function to format dates
const formatDateForResponse = (book) => {
  if (book.date_of_publication) {
    const date = new Date(book.date_of_publication);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    book.date_of_publication = `${year}-${month}-${day}`;
  }
  return book;
};

const canViewStaffOnly = (user) => {
  if (!user) return false;
  const role = user.role;
  return role === 'admin' || role === 'librarian' || role === 'Staff';
};

// ─── Get all books with pagination and search ──────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      showArchived = 'false',
      showAccessioned = 'all',
    } = req.query;

    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM books WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM books WHERE 1=1';
    const params = [];
    const countParams = [];

    if (!canViewStaffOnly(req.user)) {
      query += " AND access_level = 'public'";
      countQuery += " AND access_level = 'public'";
    }

    if (showArchived === 'true') {
      query += ' AND is_archived = TRUE';
      countQuery += ' AND is_archived = TRUE';
    } else if (showArchived === 'all') {
      // no filter
    } else {
      query += ' AND is_archived = FALSE';
      countQuery += ' AND is_archived = FALSE';
    }

    if (showAccessioned === 'true') {
      query += ' AND is_accessioned = TRUE';
      countQuery += ' AND is_accessioned = TRUE';
    } else if (showAccessioned === 'all') {
      // no filter
    } else {
      query += ' AND is_accessioned = FALSE';
      countQuery += ' AND is_accessioned = FALSE';
    }

    if (search) {
      const searchClause = ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
      query += searchClause;
      countQuery += searchClause;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
      countParams.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [books] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    const formattedBooks = books.map(formatDateForResponse);

    res.json({
      books: formattedBooks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// ─── Get all categories (hierarchical) ────────────────────────────────────────
router.get('/meta/categories', authMiddleware, async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT id, name, parent_id, display_order
      FROM categories
      ORDER BY COALESCE(parent_id, id), display_order, name
    `);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// ─── Get catalog statistics ────────────────────────────────────────────────────
router.get('/meta/stats', authMiddleware, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const accessFilter = canViewStaffOnly(req.user) ? '' : "AND access_level = 'public'";

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM books WHERE is_archived = FALSE ${accessFilter}`
    );

    const [[{ accessioned }]] = await pool.query(
      `SELECT COUNT(*) as accessioned FROM books WHERE is_accessioned = TRUE ${accessFilter}`
    );

    const [[{ missing }]] = await pool.query(
      `SELECT COUNT(*) as missing FROM books
       WHERE is_archived = FALSE AND is_accessioned = FALSE
       AND (isbn IS NULL OR isbn = '')
       AND (issn IS NULL OR issn = '')
       ${accessFilter}`
    );

    const [publisherRows] = await pool.query(
      `SELECT publisher, COUNT(*) as count
       FROM books
       WHERE is_archived = FALSE AND is_accessioned = FALSE
       AND publisher IS NOT NULL AND publisher != ''
       ${accessFilter}
       GROUP BY publisher
       ORDER BY count DESC
       LIMIT 1`
    );

    const [[{ recent }]] = await pool.query(
      `SELECT COUNT(*) as recent FROM books
       WHERE is_archived = FALSE AND is_accessioned = FALSE
       AND created_at >= ? ${accessFilter}`,
      [thirtyDaysAgoStr]
    );

    res.json({
      totalBooks: total,
      totalAccessioned: accessioned,
      missingIdentifiers: missing,
      mostCommonPublisher: publisherRows[0]?.publisher || 'N/A',
      mostCommonPublisherCount: publisherRows[0]?.count || 0,
      recentlyCataloged: recent,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// ─── Get archive statistics ────────────────────────────────────────────────────
router.get('/meta/archive-stats', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT archive_reason, COUNT(*) as count_by_reason
      FROM books
      WHERE is_archived = TRUE
      GROUP BY archive_reason
    `);

    const [totalCount] = await pool.query(`
      SELECT
        SUM(CASE WHEN is_archived = TRUE THEN 1 ELSE 0 END) as archived,
        SUM(CASE WHEN is_accessioned = TRUE THEN 1 ELSE 0 END) as accessioned,
        SUM(CASE WHEN is_archived = FALSE AND is_accessioned = FALSE THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN access_level = 'staff_only' THEN 1 ELSE 0 END) as staff_only,
        SUM(CASE WHEN access_level = 'public' THEN 1 ELSE 0 END) as public,
        COUNT(*) as total
      FROM books
    `);

    res.json({
      overview: totalCount[0],
      byReason: stats,
    });
  } catch (error) {
    console.error('Error fetching archive stats:', error);
    res.status(500).json({ message: 'Error fetching archive statistics' });
  }
});

// ─── POST /:id/click — increment search_count ──────────────────────────────────
router.post('/:id/click', optionalAuthMiddleware, async (req, res) => {
  try {
    const bookId = parseInt(req.params.id, 10);
    if (!bookId || isNaN(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const [result] = await pool.query(
      `UPDATE books
          SET search_count = search_count + 1,
              updated_at   = NOW()
        WHERE id          = ?
          AND is_archived = 0`,
      [bookId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found or archived' });
    }

    const [[row]] = await pool.query(
      'SELECT search_count FROM books WHERE id = ?',
      [bookId]
    );

    return res.json({ success: true, search_count: row?.search_count ?? null });
  } catch (err) {
    console.error('[POST /api/books/:id/click] error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// ─── Archive a book ────────────────────────────────────────────────────────────
router.patch('/:id/archive', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const { reason } = req.body;

    const [existingBook] = await pool.query(
      'SELECT id, is_archived, is_accessioned FROM books WHERE id = ?',
      [req.params.id]
    );

    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (existingBook[0].is_archived) {
      return res.status(400).json({ message: 'Book is already archived' });
    }

    if (existingBook[0].is_accessioned) {
      return res.status(400).json({
        message: 'Cannot archive an accessioned book. De-accession it first.',
      });
    }

    await pool.query(
      `UPDATE books
       SET is_archived = TRUE,
           archived_at = NOW(),
           archived_by = ?,
           archive_reason = ?
       WHERE id = ?`,
      [req.user.email || req.user.username, reason || null, req.params.id]
    );

    res.json({ message: 'Book archived successfully' });
  } catch (error) {
    console.error('Error archiving book:', error);
    res.status(500).json({ message: 'Error archiving book' });
  }
});

// ─── Unarchive a book ─────────────────────────────────────────────────────────
router.patch('/:id/unarchive', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const [existingBook] = await pool.query(
      'SELECT id, is_archived FROM books WHERE id = ?',
      [req.params.id]
    );

    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!existingBook[0].is_archived) {
      return res.status(400).json({ message: 'Book is not archived' });
    }

    await pool.query(
      `UPDATE books
       SET is_archived = FALSE,
           archived_at = NULL,
           archived_by = NULL,
           archive_reason = NULL
       WHERE id = ?`,
      [req.params.id]
    );

    res.json({ message: 'Book unarchived successfully' });
  } catch (error) {
    console.error('Error unarchiving book:', error);
    res.status(500).json({ message: 'Error unarchiving book' });
  }
});

// ─── Update access level ───────────────────────────────────────────────────────
router.patch('/:id/access-level', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const { access_level } = req.body;

    const validLevels = ['public', 'staff_only'];
    if (!access_level || !validLevels.includes(access_level)) {
      return res.status(400).json({
        message: `Invalid access_level. Must be one of: ${validLevels.join(', ')}`,
      });
    }

    const [existingBook] = await pool.query(
      'SELECT id FROM books WHERE id = ?',
      [req.params.id]
    );

    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await pool.query(
      'UPDATE books SET access_level = ? WHERE id = ?',
      [access_level, req.params.id]
    );

    res.json({ message: `Book access level updated to '${access_level}'` });
  } catch (error) {
    console.error('Error updating access level:', error);
    res.status(500).json({ message: 'Error updating access level' });
  }
});

// ─── Get related books ─────────────────────────────────────────────────────────
router.get("/:id/related", optionalAuthMiddleware, async (req, res) => {
  try {
    const bookId   = parseInt(req.params.id, 10);
    const limitNum = Math.min(24, Math.max(1, parseInt(req.query.limit || "6", 10)));

    if (isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    // ── fetch the source book ─────────────────────────────────────────────
    // FIX: was [[sourceRows]] which destructured the first *row* not the rows array
    const [sourceRows] = await pool.query(
      `SELECT id, category, author, subjects
       FROM books
       WHERE id = ? AND is_archived = 0`,
      [bookId]
    );

    if (!sourceRows || sourceRows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const source = sourceRows[0];

    // ── extract individual subject keywords ───────────────────────────────
    const subjectKeywords = source.subjects
      ? source.subjects
          .split(/[,;|]+/)
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s.length > 2)
      : [];

    const cappedKeywords = subjectKeywords.slice(0, 8);

    // ── build score expression ────────────────────────────────────────────
    // FIX: avoid alias in HAVING — inline the full score expression instead
    const subjectLikes   = cappedKeywords.map(() => `b.subjects LIKE ?`).join(" OR ");
    const subjectScore   = cappedKeywords.length > 0
      ? `CASE WHEN (${subjectLikes}) THEN 2 ELSE 0 END`
      : "0";
    const subjectParams  = cappedKeywords.map((k) => `%${k}%`);

    // Full inline score (repeated for HAVING)
    const inlineScore = `(
      CASE WHEN b.category = ? THEN 3 ELSE 0 END
      + ${subjectScore}
      + CASE WHEN b.author = ? THEN 1 ELSE 0 END
    )`;

    // params: [category, ...subjectParams, author]
    const scoreParamsOnce = [source.category, ...subjectParams, source.author];

    const sql = `
      SELECT
        b.id,
        b.title,
        b.author,
        b.editor,
        b.edition,
        b.category,
        b.call_number,
        b.publication,
        b.publisher,
        b.subjects,
        b.isbn,
        b.issn,
        YEAR(b.date_of_publication) AS year,
        b.copies,
        ${inlineScore} AS _score,

        (SELECT u.id
           FROM uploads u
          WHERE u.book_id = b.id AND u.file_type = 'pdf' AND u.status = 'active'
          ORDER BY u.is_primary DESC, u.upload_date ASC
          LIMIT 1) AS upload_id,

        (SELECT u.file_size
           FROM uploads u
          WHERE u.book_id = b.id AND u.file_type = 'pdf' AND u.status = 'active'
          ORDER BY u.is_primary DESC, u.upload_date ASC
          LIMIT 1) AS upload_size

      FROM books b
      WHERE b.id            != ?
        AND b.is_archived    = 0
        AND EXISTS (
          SELECT 1 FROM accessions a
          WHERE a.book_id = b.id AND a.is_archived = 0
        )
        AND EXISTS (
          SELECT 1 FROM uploads u
          WHERE u.book_id = b.id AND u.file_type = 'pdf' AND u.status = 'active'
        )
      HAVING ${inlineScore} > 0
      ORDER BY _score DESC, b.title ASC
      LIMIT ?
    `;

    // params order: score SELECT, bookId, score HAVING, limitNum
    const queryParams = [
      ...scoreParamsOnce,   // for SELECT score
      bookId,               // for WHERE b.id != ?
      ...scoreParamsOnce,   // for HAVING score (repeated because inline)
      limitNum,
    ];

    const [related] = await pool.query(sql, queryParams);

    return res.json({ results: related, total: related.length });

  } catch (err) {
    console.error("[/api/books/:id/related] error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ─── Get single book by ID ─────────────────────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);

    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = books[0];

    if (book.access_level === 'staff_only' && !canViewStaffOnly(req.user)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const formattedBook = formatDateForResponse(book);

    if (formattedBook.is_accessioned) {
      const [accessions] = await pool.query(
        'SELECT id, accession_no, date_accessioned FROM accessions WHERE book_id = ?',
        [req.params.id]
      );
      formattedBook.accession = accessions[0] || null;
    }

    res.json(formattedBook);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
});

// ─── Create new book ───────────────────────────────────────────────────────────
router.post('/', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const {
      category, call_number, title, author, editor, edition,
      publication, publisher, date_of_publication, extent, dimensions,
      other_physical_details, accompanying_material, isbn, issn,
      notes_area, subjects, copies,
      access_level = 'public',
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const validLevels = ['public', 'staff_only'];
    if (!validLevels.includes(access_level)) {
      return res.status(400).json({
        message: `Invalid access_level. Must be one of: ${validLevels.join(', ')}`,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO books (
        category, call_number, title, author, editor, edition,
        publication, publisher, date_of_publication, extent, dimensions,
        other_physical_details, accompanying_material, isbn, issn,
        notes_area, subjects, copies, access_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category.trim(), call_number || null, title.trim(),
        author || null, editor || null, edition || null,
        publication || null, publisher || null, date_of_publication || null,
        extent || null, dimensions || null, other_physical_details || null,
        accompanying_material || null, isbn || null, issn || null,
        notes_area || null, subjects || null, copies || 1, access_level,
      ]
    );

    res.status(201).json({ message: 'Book created successfully', bookId: result.insertId });
  } catch (error) {
    console.error('Error creating book:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Book with this ISBN already exists' });
    }
    res.status(500).json({ message: 'Error creating book' });
  }
});

// ─── Update book ───────────────────────────────────────────────────────────────
router.put('/:id', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const {
      category, call_number, title, author, editor, edition,
      publication, publisher, date_of_publication, extent, dimensions,
      other_physical_details, accompanying_material, isbn, issn,
      notes_area, subjects, copies, access_level,
    } = req.body;

    const [existingBook] = await pool.query(
      'SELECT id, is_accessioned, access_level FROM books WHERE id = ?',
      [req.params.id]
    );

    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (existingBook[0].is_accessioned) {
      return res.status(400).json({
        message: 'Cannot edit an accessioned book. De-accession it first.',
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const validLevels = ['public', 'staff_only'];
    const resolvedAccessLevel = access_level ?? existingBook[0].access_level;
    if (!validLevels.includes(resolvedAccessLevel)) {
      return res.status(400).json({
        message: `Invalid access_level. Must be one of: ${validLevels.join(', ')}`,
      });
    }

    await pool.query(
      `UPDATE books SET
        category = ?, call_number = ?, title = ?, author = ?, editor = ?,
        edition = ?, publication = ?, publisher = ?, date_of_publication = ?,
        extent = ?, dimensions = ?, other_physical_details = ?,
        accompanying_material = ?, isbn = ?, issn = ?,
        notes_area = ?, subjects = ?, copies = ?, access_level = ?
       WHERE id = ?`,
      [
        category.trim(), call_number || null, title.trim(),
        author, editor || null, edition || null,
        publication || null, publisher,
        date_of_publication || null, extent || null, dimensions || null,
        other_physical_details || null, accompanying_material || null,
        isbn, issn || null, notes_area || null, subjects || null,
        copies || 1, resolvedAccessLevel, req.params.id,
      ]
    );

    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

// ─── Delete book ───────────────────────────────────────────────────────────────
router.delete('/:id', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const [existingBook] = await pool.query(
      'SELECT id, is_accessioned FROM books WHERE id = ?',
      [req.params.id]
    );

    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (existingBook[0].is_accessioned) {
      return res.status(400).json({
        message: 'Cannot delete an accessioned book. De-accession it first.',
      });
    }

    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
});

module.exports = router;