// routes/bookCover.js
const express = require("express");
const router  = express.Router();
const pool    = require("../config/connection");
const path    = require("path");
const fs      = require("fs");
const sharp   = require("sharp");
const { createCanvas } = require("canvas");

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");

// ── Canvas rounded rect helper ────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Placeholder: renders a JPEG cover card via node-canvas ────────────────
async function generatePlaceholderJpeg(title = "Untitled", width = 300) {
  const W = width;
  const H = Math.round(W * 1.45);
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext("2d");
  const gold   = "#c9a84c";
  const spineW = Math.round(W * 0.09);
  const ruleX1 = spineW + Math.round(W * 0.07);
  const ruleX2 = W - Math.round(W * 0.07);

  // Background & spine
  ctx.fillStyle = "#1e2a3a";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#111c28";
  ctx.fillRect(0, 0, spineW, H);
  ctx.strokeStyle = "#0a1018";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(spineW, 0);
  ctx.lineTo(spineW, H);
  ctx.stroke();

  // Top decorative rules
  ctx.strokeStyle = gold;
  ctx.lineWidth   = 0.8;
  ctx.globalAlpha = 0.55;
  ctx.beginPath(); ctx.moveTo(ruleX1, H * 0.19); ctx.lineTo(ruleX2, H * 0.19); ctx.stroke();
  ctx.globalAlpha = 0.25;
  ctx.beginPath(); ctx.moveTo(ruleX1, H * 0.21); ctx.lineTo(ruleX2, H * 0.21); ctx.stroke();
  ctx.globalAlpha = 1;

  // Open book icon
  const cx = W / 2;
  const cy = H * 0.41;
  const bW = W * 0.28;
  const bH = H * 0.16;
  ctx.strokeStyle = gold;
  ctx.lineWidth   = Math.max(1, W * 0.005);
  ctx.globalAlpha = 0.85;

  ctx.beginPath();
  ctx.moveTo(cx - bW, cy - bH);
  ctx.bezierCurveTo(cx - bW + 4, cy - bH - 4, cx - 4, cy - bH - 4, cx, cy - bH + 4);
  ctx.lineTo(cx, cy + bH);
  ctx.bezierCurveTo(cx - 4, cy + bH - 4, cx - bW + 4, cy + bH - 4, cx - bW, cy + bH - 6);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + bW, cy - bH);
  ctx.bezierCurveTo(cx + bW - 4, cy - bH - 4, cx + 4, cy - bH - 4, cx, cy - bH + 4);
  ctx.lineTo(cx, cy + bH);
  ctx.bezierCurveTo(cx + 4, cy + bH - 4, cx + bW - 4, cy + bH - 4, cx + bW, cy + bH - 6);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath(); ctx.moveTo(cx, cy - bH + 4); ctx.lineTo(cx, cy + bH); ctx.stroke();

  // Page lines
  ctx.lineWidth   = Math.max(0.5, W * 0.003);
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 3; i++) {
    const ly = cy - bH * 0.5 + i * (bH * 0.5);
    ctx.beginPath(); ctx.moveTo(cx - bW * 0.85, ly); ctx.lineTo(cx - bW * 0.15, ly + 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + bW * 0.15, ly + 2); ctx.lineTo(cx + bW * 0.85, ly); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Bottom decorative rules
  ctx.strokeStyle = gold;
  ctx.lineWidth   = 0.8;
  ctx.globalAlpha = 0.25;
  ctx.beginPath(); ctx.moveTo(ruleX1, H * 0.60); ctx.lineTo(ruleX2, H * 0.60); ctx.stroke();
  ctx.globalAlpha = 0.55;
  ctx.beginPath(); ctx.moveTo(ruleX1, H * 0.62); ctx.lineTo(ruleX2, H * 0.62); ctx.stroke();
  ctx.globalAlpha = 1;

  // Title text — word-wrap to fit
  const maxLineW = W - spineW - W * 0.16;
  const fontSize = Math.round(W * 0.055);
  ctx.font      = `600 ${fontSize}px Georgia, serif`;
  ctx.fillStyle = "#e8dcc8";
  ctx.textAlign = "center";

  const words = title.split(" ");
  const lines = [];
  let   line  = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxLineW) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word.slice(0, 20);
    }
  }
  if (line) lines.push(line);

  const titleLines  = lines.slice(0, 4);
  const lineHeight  = fontSize * 1.45;
  const blockH      = titleLines.length * lineHeight;
  const titleStartY = H * 0.76 - blockH / 2 + fontSize;
  titleLines.forEach((l, i) => ctx.fillText(l, W / 2, titleStartY + i * lineHeight));

  // Rule above badge
  ctx.strokeStyle = gold;
  ctx.lineWidth   = 0.8;
  ctx.globalAlpha = 0.55;
  ctx.beginPath(); ctx.moveTo(ruleX1, H * 0.875); ctx.lineTo(ruleX2, H * 0.875); ctx.stroke();
  ctx.globalAlpha = 1;

  // PDF badge
  const badgeW = W * 0.28;
  const badgeH = H * 0.062;
  const badgeX = W / 2 - badgeW / 2;
  const badgeY = H * 0.898;
  ctx.fillStyle   = gold;
  ctx.globalAlpha = 0.9;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const badgeFontSize = Math.round(W * 0.038);
  ctx.font      = `700 ${badgeFontSize}px Arial, sans-serif`;
  ctx.fillStyle = "#16202e";
  ctx.textAlign = "center";
  ctx.fillText("PDF", W / 2, badgeY + badgeH * 0.72);

  return canvas.toBuffer("image/jpeg", { quality: 0.88 });
}

// ── Send a generated JPEG placeholder ────────────────────────────────────
async function sendPlaceholder(res, upload, width = 300) {
  try {
    const rawName = upload
      ? (upload.original_name || upload.file_path || "")
      : "";
    const ext   = path.extname(rawName).toLowerCase();
    const base  = path.basename(rawName, ext);
    const title = base
      .replace(/[_\-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim() || "Untitled";

    const jpeg = await generatePlaceholderJpeg(title, width);
    res.set({
      "Content-Type":  "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    });
    return res.send(jpeg);
  } catch (fallbackErr) {
    console.error("[/api/book-cover] placeholder failed:", fallbackErr);
    return res.status(500).json({ message: "Cover generation failed" });
  }
}

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

/**
 * GET /api/book-cover/:uploadId
 * Returns the first page of a PDF as a JPEG thumbnail.
 * Falls back to a generated JPEG placeholder if extraction fails.
 */
router.get("/:uploadId", async (req, res) => {
  let uploadRecord = null;

  try {
    const { uploadId } = req.params;
    const width = Math.min(600, Math.max(100, parseInt(req.query.w || "300")));

    // ── 1. Look up the upload record ──────────────────────────────────────
    const [rows] = await pool.query(
      `SELECT id, book_id, file_path, file_type, original_name
         FROM uploads
        WHERE id = ? AND status = 'active'
        LIMIT 1`,
      [uploadId]
    );

    const upload = rows[0];
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    uploadRecord = upload;

    const filePath = path.isAbsolute(upload.file_path)
      ? upload.file_path
      : path.join(UPLOADS_DIR, upload.file_path);

    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "File not found on disk" });

    // ── 2. Extract PDF cover ──────────────────────────────────────────────
    const imageBuffer = await extractPdfCover(filePath);

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
    return sendPlaceholder(res, uploadRecord, 300);
  }
});

module.exports = router;