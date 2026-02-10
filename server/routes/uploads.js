// routes/uploads.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Ensure upload directory exists - using absolute path from project root
// This will create: C:\Users\Laptop\Desktop\LMIS\server\uploads
const uploadDir = path.join(process.cwd(), 'uploads');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Allowed file types and their MIME types
const ALLOWED_FILE_TYPES = {
  'application/pdf': 'pdf',
  'application/epub+zip': 'epub',
  'application/x-mobipocket-ebook': 'mobi',
  'application/vnd.amazon.ebook': 'azw3',
  'image/vnd.djvu': 'djvu',
  'image/x-djvu': 'djvu'
};

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // Create book-specific subfolder
      const bookId = req.params.bookId || req.body.bookId;
      const bookDir = path.join(uploadDir, `book_${bookId}`);
      await fs.mkdir(bookDir, { recursive: true });
      cb(null, bookDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_random_originalname
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${timestamp}_${randomString}_${sanitizedName}${ext}`);
  }
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: PDF, EPUB, MOBI, AZW3, DJVU`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Maximum 5 files per upload
  }
});

// Helper function to calculate file checksum
const calculateChecksum = async (filePath) => {
  const fileBuffer = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};

// Helper function to log upload actions
const logUploadAction = async (uploadId, action, userId, ipAddress, userAgent, details = null) => {
  try {
    await pool.query(
      `INSERT INTO upload_logs (upload_id, action, performed_by, ip_address, user_agent, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uploadId, action, userId, ipAddress, userAgent, details]
    );
  } catch (error) {
    console.error('Error logging upload action:', error);
  }
};

// Upload file(s) for a book (Admin only)
router.post('/:bookId', authMiddleware, roleMiddleware('admin'), upload.array('files', 5), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { bookId } = req.params;
    const { setPrimary } = req.body; // Optional: set first file as primary
    
    // Verify book exists
    const [books] = await connection.query('SELECT id, title FROM books WHERE id = ?', [bookId]);
    if (books.length === 0) {
      await connection.rollback();
      // Delete uploaded files
      if (req.files) {
        for (const file of req.files) {
          await fs.unlink(file.path).catch(() => {});
        }
      }
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!req.files || req.files.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = [];
    const userId = req.user.email || req.user.username;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // If setPrimary is true, unset any existing primary files
    if (setPrimary === 'true') {
      await connection.query(
        'UPDATE uploads SET is_primary = FALSE WHERE book_id = ?',
        [bookId]
      );
    }

    // Process each uploaded file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      try {
        // Calculate checksum for file integrity
        const checksum = await calculateChecksum(file.path);
        
        // Check for duplicate file (same checksum)
        const [existingFile] = await connection.query(
          'SELECT id FROM uploads WHERE book_id = ? AND checksum = ?',
          [bookId, checksum]
        );
        
        if (existingFile.length > 0) {
          // Delete duplicate file
          await fs.unlink(file.path).catch(() => {});
          continue; // Skip this file
        }

        // Determine file type
        const fileType = ALLOWED_FILE_TYPES[file.mimetype] || 'other';
        
        // Set as primary if it's the first file and setPrimary is true
        const isPrimary = (setPrimary === 'true' && i === 0);

        // Insert upload record
        const [result] = await connection.query(
          `INSERT INTO uploads (
            book_id, file_name, original_name, file_path, file_type, 
            mime_type, file_size, uploaded_by, is_primary, checksum, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
          [
            bookId,
            file.filename,
            file.originalname,
            file.path,
            fileType,
            file.mimetype,
            file.size,
            userId,
            isPrimary,
            checksum
          ]
        );

        // Log the upload
        await logUploadAction(result.insertId, 'created', userId, ipAddress, userAgent, 
          `Uploaded ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

        uploadedFiles.push({
          id: result.insertId,
          fileName: file.filename,
          originalName: file.originalname,
          fileType: fileType,
          fileSize: file.size,
          isPrimary: isPrimary
        });
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        // Delete the file if database insert fails
        await fs.unlink(file.path).catch(() => {});
      }
    }

    if (uploadedFiles.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'No files were successfully uploaded (possible duplicates)' });
    }

    await connection.commit();

    res.status(201).json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      uploads: uploadedFiles
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error uploading files:', error);
    
    // Cleanup uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
    
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  } finally {
    connection.release();
  }
});

// Get all uploads for a book
router.get('/book/:bookId', authMiddleware, async (req, res) => {
  try {
    const [uploads] = await pool.query(
      `SELECT 
        id, file_name, original_name, file_type, file_size, 
        upload_date, uploaded_by, is_primary, download_count, status
       FROM uploads 
       WHERE book_id = ? AND status = 'active'
       ORDER BY is_primary DESC, upload_date DESC`,
      [req.params.bookId]
    );

    res.json(uploads);
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ message: 'Error fetching uploads' });
  }
});

// Get single upload details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [uploads] = await pool.query(
      `SELECT u.*, b.title as book_title 
       FROM uploads u
       JOIN books b ON u.book_id = b.id
       WHERE u.id = ?`,
      [req.params.id]
    );

    if (uploads.length === 0) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    res.json(uploads[0]);
  } catch (error) {
    console.error('Error fetching upload:', error);
    res.status(500).json({ message: 'Error fetching upload' });
  }
});

// Download file
router.get('/:id/download', authMiddleware, async (req, res) => {
  try {
    const [uploads] = await pool.query(
      'SELECT * FROM uploads WHERE id = ? AND status = "active"',
      [req.params.id]
    );

    if (uploads.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const upload = uploads[0];

    // Check if file exists on disk
    try {
      await fs.access(upload.file_path);
    } catch {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Increment download count
    await pool.query(
      'UPDATE uploads SET download_count = download_count + 1 WHERE id = ?',
      [req.params.id]
    );

    // Log download
    const userId = req.user.email || req.user.username;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    await logUploadAction(req.params.id, 'downloaded', userId, ipAddress, userAgent);

    // Send file
    res.download(upload.file_path, upload.original_name);

  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
});

// Set primary file (Admin only)
router.patch('/:id/set-primary', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Get upload and verify it exists
    const [uploads] = await connection.query(
      'SELECT book_id FROM uploads WHERE id = ? AND status = "active"',
      [req.params.id]
    );

    if (uploads.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Upload not found' });
    }

    const bookId = uploads[0].book_id;

    // Unset all primary flags for this book
    await connection.query(
      'UPDATE uploads SET is_primary = FALSE WHERE book_id = ?',
      [bookId]
    );

    // Set this upload as primary
    await connection.query(
      'UPDATE uploads SET is_primary = TRUE WHERE id = ?',
      [req.params.id]
    );

    await connection.commit();

    res.json({ message: 'Primary file updated successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('Error setting primary file:', error);
    res.status(500).json({ message: 'Error setting primary file' });
  } finally {
    connection.release();
  }
});
// Delete ALL uploads for a book (Admin only) — called when deleting a book
router.delete('/book/:bookId', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { bookId } = req.params;

    // Fetch all active uploads for this book so we can delete the physical files
    const [uploads] = await connection.query(
      'SELECT id, file_path FROM uploads WHERE book_id = ? AND status = "active"',
      [bookId]
    );

    if (uploads.length > 0) {
      const ids = uploads.map(u => u.id);

      // Soft-delete all records
      await connection.query(
        `UPDATE uploads SET status = "deleted" WHERE book_id = ?`,
        [bookId]
      );

      // Log each deletion
      const userId = req.user.email || req.user.username;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent');
      for (const id of ids) {
        await logUploadAction(id, 'deleted', userId, ipAddress, userAgent, 'Deleted with book');
      }

      await connection.commit();

      // Delete physical files + the book's folder
      for (const upload of uploads) {
        await fs.unlink(upload.file_path).catch(err =>
          console.error(`Could not delete file ${upload.file_path}:`, err)
        );
      }

      // Remove the now-empty book directory
      const bookDir = path.join(uploadDir, `book_${bookId}`);
      await fs.rmdir(bookDir).catch(() => {}); // silently ignore if non-empty or missing
    } else {
      await connection.commit();
    }

    res.json({ message: `All uploads for book ${bookId} deleted` });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting uploads for book:', error);
    res.status(500).json({ message: 'Error deleting uploads for book' });
  } finally {
    connection.release();
  }
});

// Delete upload (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Get upload details
    const [uploads] = await connection.query(
      'SELECT * FROM uploads WHERE id = ?',
      [req.params.id]
    );

    if (uploads.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Upload not found' });
    }

    const upload = uploads[0];

    // Mark as deleted in database (soft delete)
    await connection.query(
      'UPDATE uploads SET status = "deleted" WHERE id = ?',
      [req.params.id]
    );

    // Log deletion
    const userId = req.user.email || req.user.username;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    await logUploadAction(req.params.id, 'deleted', userId, ipAddress, userAgent);

    await connection.commit();

    // Delete physical file
    await fs.unlink(upload.file_path).catch(err => {
      console.error('Error deleting physical file:', err);
    });

    res.json({ message: 'Upload deleted successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting upload:', error);
    res.status(500).json({ message: 'Error deleting upload' });
  } finally {
    connection.release();
  }
});

// Verify file integrity (Admin only)
router.post('/:id/verify', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const [uploads] = await pool.query(
      'SELECT * FROM uploads WHERE id = ?',
      [req.params.id]
    );

    if (uploads.length === 0) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    const upload = uploads[0];

    // Check if file exists
    try {
      await fs.access(upload.file_path);
    } catch {
      return res.status(404).json({ 
        message: 'File not found on server',
        integrity: 'failed'
      });
    }

    // Calculate current checksum
    const currentChecksum = await calculateChecksum(upload.file_path);

    // Compare with stored checksum
    const isValid = currentChecksum === upload.checksum;

    // Log verification
    const userId = req.user.email || req.user.username;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    await logUploadAction(
      req.params.id, 
      'verified', 
      userId, 
      ipAddress, 
      userAgent,
      isValid ? 'Integrity check passed' : 'Integrity check FAILED'
    );

    res.json({
      integrity: isValid ? 'valid' : 'corrupted',
      message: isValid 
        ? 'File integrity verified successfully' 
        : 'File has been modified or corrupted',
      storedChecksum: upload.checksum,
      currentChecksum: currentChecksum
    });

  } catch (error) {
    console.error('Error verifying file:', error);
    res.status(500).json({ message: 'Error verifying file integrity' });
  }
});

// Get upload statistics (Admin only)
router.get('/meta/statistics', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_uploads,
        COUNT(DISTINCT book_id) as books_with_files,
        SUM(file_size) as total_storage_bytes,
        SUM(download_count) as total_downloads,
        AVG(file_size) as avg_file_size,
        file_type,
        COUNT(*) as count_by_type
      FROM uploads 
      WHERE status = 'active'
      GROUP BY file_type
    `);

    const [recentUploads] = await pool.query(`
      SELECT u.*, b.title as book_title
      FROM uploads u
      JOIN books b ON u.book_id = b.id
      WHERE u.status = 'active'
      ORDER BY u.upload_date DESC
      LIMIT 10
    `);

    const [topDownloads] = await pool.query(`
      SELECT u.*, b.title as book_title
      FROM uploads u
      JOIN books b ON u.book_id = b.id
      WHERE u.status = 'active'
      ORDER BY u.download_count DESC
      LIMIT 10
    `);

    // Calculate total storage in MB/GB
    const totalBytes = stats.reduce((sum, stat) => sum + (parseInt(stat.total_storage_bytes) || 0), 0);
    const totalStorageGB = (totalBytes / 1024 / 1024 / 1024).toFixed(2);

    res.json({
      summary: {
        totalUploads: stats.reduce((sum, stat) => sum + stat.count_by_type, 0),
        booksWithFiles: stats[0]?.books_with_files || 0,
        totalStorageGB: totalStorageGB,
        totalDownloads: stats.reduce((sum, stat) => sum + (stat.total_downloads || 0), 0)
      },
      byFileType: stats,
      recentUploads: recentUploads,
      topDownloads: topDownloads
    });

  } catch (error) {
    console.error('Error fetching upload statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router;