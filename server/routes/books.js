// routes/books.js
const express = require('express');
const router = express.Router();
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Helper function to format dates
const formatDateForResponse = (book) => {
  if (book.date_of_publication) {
    // Convert to yyyy-MM-dd format
    const date = new Date(book.date_of_publication);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    book.date_of_publication = `${year}-${month}-${day}`;
  }
  return book;
};

// Get all books with pagination and search (excludes archived by default)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', showArchived = 'false' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM books WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM books WHERE 1=1';
    const params = [];
    const countParams = [];

    // Archive filter
    if (showArchived === 'true') {
      query += ' AND is_archived = TRUE';
      countQuery += ' AND is_archived = TRUE';
    } else if (showArchived === 'all') {
      // Show both archived and non-archived
    } else {
      // Default: show only non-archived
      query += ' AND is_archived = FALSE';
      countQuery += ' AND is_archived = FALSE';
    }

    // Search filter
    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
      countQuery += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    // Category filter
    if (category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
      countParams.push(category);
    }

    // Add ordering and pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [books] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    // Format dates in all books
    const formattedBooks = books.map(formatDateForResponse);

    res.json({
      books: formattedBooks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// Get single book by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Format the date before sending
    const formattedBook = formatDateForResponse(books[0]);
    res.json(formattedBook);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
});

// Get all categories (hierarchical)
router.get('/meta/categories', authMiddleware, async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT 
        id, 
        name, 
        parent_id, 
        display_order
      FROM categories
      ORDER BY 
        COALESCE(parent_id, id),
        display_order,
        name
    `);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Archive a book (Admin only)
router.patch('/:id/archive', authMiddleware, roleMiddleware('admin','librarian'), async (req, res) => {
  try {
    const { reason } = req.body;
    
    // Check if book exists and is not already archived
    const [existingBook] = await pool.query(
      'SELECT id, is_archived FROM books WHERE id = ?', 
      [req.params.id]
    );
    
    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (existingBook[0].is_archived) {
      return res.status(400).json({ message: 'Book is already archived' });
    }

    // Archive the book
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

// Unarchive a book (Admin only)
router.patch('/:id/unarchive', authMiddleware, roleMiddleware('admin','librarian'), async (req, res) => {
  try {
    // Check if book exists and is archived
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

    // Unarchive the book
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

// Get archive statistics (Admin only)
router.get('/meta/archive-stats', authMiddleware, roleMiddleware('admin','librarian'), async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_archived,
        COUNT(DISTINCT archived_by) as unique_archivers,
        archive_reason,
        COUNT(*) as count_by_reason
      FROM books 
      WHERE is_archived = TRUE
      GROUP BY archive_reason
    `);

    const [totalCount] = await pool.query(`
      SELECT 
        SUM(CASE WHEN is_archived = TRUE THEN 1 ELSE 0 END) as archived,
        SUM(CASE WHEN is_archived = FALSE THEN 1 ELSE 0 END) as active,
        COUNT(*) as total
      FROM books
    `);

    res.json({
      overview: totalCount[0],
      byReason: stats
    });
  } catch (error) {
    console.error('Error fetching archive stats:', error);
    res.status(500).json({ message: 'Error fetching archive statistics' });
  }
});
// Get catalog statistics
router.get('/meta/stats', authMiddleware, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM books WHERE is_archived = FALSE'
    );

    const [[{ missing }]] = await pool.query(
      `SELECT COUNT(*) as missing FROM books 
       WHERE is_archived = FALSE 
       AND (isbn IS NULL OR isbn = '') 
       AND (issn IS NULL OR issn = '')`
    );

    const [publisherRows] = await pool.query(
      `SELECT publisher, COUNT(*) as count
       FROM books
       WHERE is_archived = FALSE
       AND publisher IS NOT NULL
       AND publisher != ''
       GROUP BY publisher
       ORDER BY count DESC
       LIMIT 1`
    );

    const [[{ recent }]] = await pool.query(
      `SELECT COUNT(*) as recent FROM books 
       WHERE is_archived = FALSE 
       AND created_at >= ?`,
      [thirtyDaysAgoStr]
    );

    res.json({
      totalBooks: total,
      missingIdentifiers: missing,
      mostCommonPublisher: publisherRows[0]?.publisher || 'N/A',
      mostCommonPublisherCount: publisherRows[0]?.count || 0,
      recentlyCataloged: recent
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Create new book (Admin only)
router.post('/', authMiddleware, roleMiddleware('admin','librarian'), async (req, res) => {
  try {
    const {
      category,
      call_number,
      title,
      author,
      editor,
      edition,
      publication,
      publisher,
      date_of_publication,
      extent,
      dimensions,
      other_physical_details,
      accompanying_material,
      isbn,
      issn,
      notes_area,
      subjects,
      copies
    } = req.body;

    // Validation - ONLY category and title are required
    if (!category || !title) {
      return res.status(400).json({ 
        message: 'Required fields: category, title' 
      });
    }

    const query = `
      INSERT INTO books (
        category, call_number, title, author, editor, edition, 
        publication, publisher, date_of_publication, extent, dimensions,
        other_physical_details, accompanying_material, isbn, issn,
        notes_area, subjects, copies
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      category,
      call_number || null,
      title,
      author || null,        // ✅ Changed to allow null
      editor || null,
      edition || null,
      publication || null,
      publisher || null,     // ✅ Changed to allow null
      date_of_publication || null,
      extent || null,
      dimensions || null,
      other_physical_details || null,
      accompanying_material || null,
      isbn || null,          // ✅ Changed to allow null
      issn || null,
      notes_area || null,
      subjects || null,
      copies || 1
    ]);

    res.status(201).json({
      message: 'Book created successfully',
      bookId: result.insertId
    });
  } catch (error) {
    console.error('Error creating book:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Book with this ISBN already exists' });
    }
    res.status(500).json({ message: 'Error creating book' });
  }
});

// Update book (Admin only)
router.put('/:id', authMiddleware, roleMiddleware('admin','librarian'), async (req, res) => {
  try {
    const {
      category,
      call_number,
      title,
      author,
      editor,
      edition,
      publication,
      publisher,
      date_of_publication,
      extent,
      dimensions,
      other_physical_details,
      accompanying_material,
      isbn,
      issn,
      notes_area,
      subjects,
      copies
    } = req.body;

    // Check if book exists
    const [existingBook] = await pool.query('SELECT id FROM books WHERE id = ?', [req.params.id]);
    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const query = `
      UPDATE books SET
        category = ?,
        call_number = ?,
        title = ?,
        author = ?,
        editor = ?,
        edition = ?,
        publication = ?,
        publisher = ?,
        date_of_publication = ?,
        extent = ?,
        dimensions = ?,
        other_physical_details = ?,
        accompanying_material = ?,
        isbn = ?,
        issn = ?,
        notes_area = ?,
        subjects = ?,
        copies = ?
      WHERE id = ?
    `;

    await pool.query(query, [
      category,
      call_number || null,
      title,
      author,
      editor || null,
      edition || null,
      publication || null,
      publisher,
      date_of_publication || null,
      extent || null,
      dimensions || null,
      other_physical_details || null,
      accompanying_material || null,
      isbn,
      issn || null,
      notes_area || null,
      subjects || null,
      copies || 1,
      req.params.id
    ]);

    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

// Delete book (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware('admin','librarian'), async (req, res) => {
  try {
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