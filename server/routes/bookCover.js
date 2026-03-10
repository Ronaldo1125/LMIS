// routes/bookCover.js
const express    = require("express");
const router     = express.Router();
const pool       = require("../config/connection");
const path       = require("path");
const fs         = require("fs");
const sharp      = require("sharp");

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");

/**
 * GET /api/book-cover/:uploadId
 * Renders the first page / cover of any supported file as a JPEG thumbnail.
 * Supported: PDF, EPUB, DOCX, PNG, JPG, WEBP
 */
router.get("/:uploadId", async (req, res) => {
  try {
    const { uploadId } = req.params;
    const width = Math.min(600, Math.max(100, parseInt(req.query.w || "300")));

    // ── 1. Look up the upload record ──────────────────────────────────────
    // MySQL pool.query() returns [rows, fields] — NOT [[row]] like PostgreSQL
    const [rows] = await pool.query(
      `SELECT id, book_id, file_path, file_type, original_name
         FROM uploads
        WHERE id = ? AND status = 'active'
        LIMIT 1`,
      [uploadId]
    );

    const upload = rows[0];
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    // file_path may be stored as absolute or relative — handle both
    const filePath = path.isAbsolute(upload.file_path)
      ? upload.file_path
      : path.join(UPLOADS_DIR, upload.file_path);

    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "File not found on disk" });

    const ext = path.extname(upload.original_name || upload.file_path).toLowerCase();

    // ── 2. Extract cover image ────────────────────────────────────────────
    let imageBuffer;

    if (ext === ".pdf") {
      imageBuffer = await extractPdfCover(filePath);
    } else if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"].includes(ext)) {
      imageBuffer = fs.readFileSync(filePath);
    } else if (ext === ".epub") {
      imageBuffer = await extractEpubCover(filePath);
    } else if ([".docx", ".doc"].includes(ext)) {
      imageBuffer = await extractDocxCover(filePath);
    } else {
      return res.status(415).json({ message: `Unsupported file type: ${ext}` });
    }

    if (!imageBuffer)
      return res.status(422).json({ message: "Could not extract cover" });

    // ── 3. Resize & send as JPEG ──────────────────────────────────────────
    const jpeg = await sharp(imageBuffer)
      .resize(width, null, { withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();

    res.set({
      "Content-Type":  "image/jpeg",
      "Cache-Control": "public, max-age=86400",
      "ETag":          `cover-${uploadId}-${width}`,
    });
    return res.send(jpeg);

  } catch (err) {
    console.error("[/api/book-cover] error:", err);
    return res.status(500).json({ message: "Cover generation failed", error: err.message });
  }
});

// ── PDF: render page 1 via pdf-poppler ───────────────────────────────────
async function extractPdfCover(filePath) {
  const pdfPoppler = require("pdf-poppler");
  const os  = require("os");
  const tmp = path.join(os.tmpdir(), `cover_${Date.now()}`);

  await pdfPoppler.convert(filePath, {
    format:      "jpeg",
    out_dir:     os.tmpdir(),
    out_prefix:  path.basename(tmp),
    page:        1,
    single_file: true,
  });

  const outFile = `${tmp}-1.jpg`;
  if (!fs.existsSync(outFile)) throw new Error("pdf-poppler produced no output");

  const buf = fs.readFileSync(outFile);
  fs.unlinkSync(outFile);
  return buf;
}

// ── EPUB: pull cover image from zip ──────────────────────────────────────
async function extractEpubCover(filePath) {
  const JSZip = require("jszip");
  const zip   = await JSZip.loadAsync(fs.readFileSync(filePath));

  const candidates = [
    "OEBPS/Images/cover.jpg",
    "OEBPS/images/cover.jpg",
    "OEBPS/cover.jpg",
    "cover.jpg",
    "cover.jpeg",
    "cover.png",
  ];

  for (const c of candidates) {
    const entry = zip.file(c);
    if (entry) return entry.async("nodebuffer");
  }

  const coverEntry = Object.keys(zip.files).find(
    (k) => /cover/i.test(k) && /\.(jpe?g|png|webp)$/i.test(k)
  );
  if (coverEntry) return zip.file(coverEntry).async("nodebuffer");

  return null;
}

// ── DOCX: extract first embedded image ───────────────────────────────────
async function extractDocxCover(filePath) {
  const JSZip = require("jszip");
  const zip   = await JSZip.loadAsync(fs.readFileSync(filePath));

  const imgEntry = Object.keys(zip.files).find(
    (k) => k.startsWith("word/media/") && /\.(jpe?g|png|webp)$/i.test(k)
  );
  if (imgEntry) return zip.file(imgEntry).async("nodebuffer");
  return null;
}

module.exports = router;