// routes/books.js
const express = require('express');
const router = express.Router();
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get all books with pagination and search
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM books WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM books WHERE 1=1';
    const params = [];
    const countParams = [];

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

    res.json({
      books,
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

    res.json(books[0]);
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
        COALESCE(parent_id, id),  -- Group by parent
        display_order,             -- Then by display order
        name                       -- Then alphabetically
    `);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Create new book (Admin only)
// CHANGED: roleMiddleware(['admin']) → roleMiddleware('admin')
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
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

    // Validation
    if (!category || !title || !author || !publisher || !isbn) {
      return res.status(400).json({ 
        message: 'Required fields: category, title, author, publisher, isbn' 
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
// CHANGED: roleMiddleware(['admin']) → roleMiddleware('admin')
router.put('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
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
// CHANGED: roleMiddleware(['admin']) → roleMiddleware('admin')
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
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