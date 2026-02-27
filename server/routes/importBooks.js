const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const pool = require('../config/connection');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Multer - memory storage (no disk write needed)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx and .xls files are accepted'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB cap
});

// ─── Column name normalizer ───────────────────────────────────────────────────
function normalizeKey(raw) {
  return String(raw ?? '')
    .toLowerCase()
    .replace(/[\r\n]+/g, ' ')   // collapse newlines (multi-line headers)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// ─── Map a normalised header to a DB column ───────────────────────────────────
const HEADER_MAP = {
  // call number
  'call no':             'call_number',
  'call number':         'call_number',
  'call no.':            'call_number',
  // title
  'title':               'title',
  // author / publisher (Excel often merges these)
  'author publisher':    'author',
  'author':              'author',
  'publisher':           'publisher',
  // date
  'date of publication': 'date_of_publication',
  'date':                'date_of_publication',
  // isbn / issn (Excel often merges these)
  'isbn issn':           'isbn',
  'isbn':                'isbn',
  'issn':                'issn',
  // copies
  'no of copies':        'copies',
  'copies':              'copies',
  'no copies':           'copies',
  // accession / call number aliases
  'accession no':        'call_number',
  'accession no.':       'call_number',
  // link to online copy → digital flag
  'link to online copy': 'has_digital_copy',
  'link':                'has_digital_copy',
  // category / subject
  'category':            'category',
  'subject':             'category',
  'subject area':        'category',
  'classification':      'category',
};

function mapHeaders(rawHeaders) {
  return rawHeaders.map(h => HEADER_MAP[normalizeKey(h)] ?? null);
}

// ─── Parse a date value from various formats ─────────────────────────────────
function parseDate(val) {
  if (!val) return null;

  // Excel serial number
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val);
    if (d) return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
  }

  const s = String(val).trim();
  if (!s) return null;

  // "Month D, YYYY"  e.g. "January 4, 1999"
  const longDate = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (longDate) {
    const months = { january:1,february:2,march:3,april:4,may:5,june:6,
                     july:7,august:8,september:9,october:10,november:11,december:12 };
    const m = months[longDate[1].toLowerCase()];
    if (m) return `${longDate[3]}-${String(m).padStart(2,'0')}-${String(longDate[2]).padStart(2,'0')}`;
  }

  // "YYYY-MM-DD" or "MM/DD/YYYY"
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return s;

  const us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) return `${us[3]}-${us[1].padStart(2,'0')}-${us[2].padStart(2,'0')}`;

  // Just a year  "1999"
  if (/^\d{4}$/.test(s)) return `${s}-01-01`;

  return null;
}

// ─── Clean a single row into a DB-ready object ────────────────────────────────
function buildRecord(mappedHeaders, rowValues) {
  const raw = {};
  mappedHeaders.forEach((col, i) => {
    if (col) raw[col] = rowValues[i] ?? null;
  });

  // Nothing useful
  if (!raw.title && !raw.call_number) return null;

  // Normalise copies
  let copies = parseInt(raw.copies, 10);
  if (isNaN(copies) || copies < 1) copies = 1;

  // isbn / issn split when stored together
  let isbn = String(raw.isbn ?? '').trim() || null;
  let issn = String(raw.issn ?? '').trim() || null;
  if (isbn && isbn.includes('/')) {
    [isbn, issn] = isbn.split('/').map(s => s.trim() || null);
  }

  // Detect digital copy from asterisk ("*") or a URL in the link column
  let has_digital = 0;
  if (raw.has_digital_copy) {
    const v = String(raw.has_digital_copy).trim();
    has_digital = (v && v !== '' && v.toLowerCase() !== 'no') ? 1 : 0;
  }

  // Separate author vs publisher when merged
  let author = String(raw.author ?? '').trim() || null;
  let publisher = String(raw.publisher ?? '').trim() || null;
  if (!publisher && author && author.includes('/')) {
    const parts = author.split('/').map(s => s.trim());
    author    = parts[0] || null;
    publisher = parts[1] || null;
  }

  // Category — falls back to "Uncategorized" so FK constraint is always satisfied
  const category = String(raw.category ?? '').trim() || 'Uncategorized';

  return {
    call_number:          String(raw.call_number ?? '').trim() || null,
    title:                String(raw.title ?? '').trim() || null,
    author,
    publisher,
    date_of_publication:  parseDate(raw.date_of_publication),
    isbn:                 isbn ? isbn.substring(0, 20) : null,
    issn:                 issn ? issn.substring(0, 20) : null,
    copies,
    has_digital_copy:     has_digital,
    category,
  };
}

// ─── Detect the header row (first row that contains "title" or "call") ────────
function findHeaderRow(sheet) {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');

  for (let r = range.s.r; r <= Math.min(range.e.r, 20); r++) {
    const rowCells = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      rowCells.push(cell ? String(cell.v ?? '') : '');
    }
    const norm = rowCells.map(normalizeKey).join(' ');
    if (norm.includes('title') || norm.includes('call no')) {
      return { headerRowIndex: r, columnCount: range.e.c - range.s.c + 1 };
    }
  }
  return null;
}

// ─── POST /api/books/import ───────────────────────────────────────────────────
router.post(
  '/import',
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  upload.single('file'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    try {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: false });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Locate header row
      const headerInfo = findHeaderRow(sheet);
      if (!headerInfo) {
        return res.status(422).json({ message: 'Could not find a header row with recognised column names (Title, Call No, etc.).' });
      }

      const { headerRowIndex, columnCount } = headerInfo;
      const range = XLSX.utils.decode_range(sheet['!ref']);

      // Read headers
      const rawHeaders = [];
      for (let c = range.s.c; c < range.s.c + columnCount; c++) {
        const cell = sheet[XLSX.utils.encode_cell({ r: headerRowIndex, c })];
        rawHeaders.push(cell ? String(cell.v ?? '') : '');
      }
      const mappedHeaders = mapHeaders(rawHeaders);

      // Parse data rows
      const records = [];
      const skipped = [];

      for (let r = headerRowIndex + 1; r <= range.e.r; r++) {
        const rowValues = [];
        for (let c = range.s.c; c < range.s.c + columnCount; c++) {
          const cell = sheet[XLSX.utils.encode_cell({ r, c })];
          rowValues.push(cell ? cell.v : null);
        }

        // Skip completely empty rows and section-label rows
        const nonEmpty = rowValues.filter(v => v !== null && v !== '');
        if (nonEmpty.length === 0) continue;

        const record = buildRecord(mappedHeaders, rowValues);
        if (!record || !record.title) {
          skipped.push({ row: r + 1, reason: 'Missing title or empty row' });
          continue;
        }

        records.push(record);
      }

      if (records.length === 0) {
        return res.status(422).json({ message: 'No valid book records found in the file.', skipped });
      }

      // ── Ensure all categories exist (auto-insert unknown ones, including "Uncategorized") ──
      const uniqueCategories = [...new Set(records.map(r => r.category).filter(Boolean))];
      if (uniqueCategories.length > 0) {
        await pool.query(
          'INSERT IGNORE INTO categories (name) VALUES ?',
          [uniqueCategories.map(c => [c])]
        );
      }

      // ── Bulk insert ──────────────────────────────────────────────────────────
      const SQL = `
        INSERT INTO books
          (call_number, title, author, publisher, date_of_publication,
           isbn, issn, copies, has_digital_copy, category, created_at, updated_at)
        VALUES ?
        ON DUPLICATE KEY UPDATE
          title               = VALUES(title),
          author              = VALUES(author),
          publisher           = VALUES(publisher),
          date_of_publication = VALUES(date_of_publication),
          isbn                = VALUES(isbn),
          issn                = VALUES(issn),
          copies              = VALUES(copies),
          has_digital_copy    = VALUES(has_digital_copy),
          category            = VALUES(category),
          updated_at          = NOW()
      `;

      const now = new Date();
      const values = records.map(r => [
        r.call_number,
        r.title,
        r.author,
        r.publisher,
        r.date_of_publication,
        r.isbn,
        r.issn,
        r.copies,
        r.has_digital_copy,
        r.category,
        now,
        now,
      ]);

      const [result] = await pool.query(SQL, [values]);

      return res.status(200).json({
        message:  'Import complete.',
        imported: records.length,
        inserted: result.affectedRows,
        skipped:  skipped.length,
        skippedDetails: skipped,
      });

    } catch (err) {
      console.error('Import error:', err);
      return res.status(500).json({ message: 'Import failed.', error: err.message });
    }
  }
);

module.exports = router;