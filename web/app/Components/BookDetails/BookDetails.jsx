"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import RelatedBooks from "./RelatedBooks";
import Nav from "../Nav/Nav";
import dynamic from "next/dynamic";
import { BookOpen, Download, ZoomIn, ZoomOut, Sun, Moon, Columns, AlignJustify, Bookmark, BookmarkCheck } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FullScreenPDFReader = dynamic(
  () => import("../PDFReader/PDFReader"),
  { ssr: false }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const ALL_CSS = `
  @keyframes bd-spin { to { transform: rotate(360deg) } }
  @keyframes bd-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ════════════════════════════════════
     MODERN VIEWER — matches right panel
  ════════════════════════════════════ */

  .bpv-root {
    display: flex; flex-direction: column;
    width: 100%; height: 100%; overflow: hidden;
    background: #fff;
    border: 1.5px solid #f4f4f4;
  }

  /* Toolbar — clean white bar with pill buttons */
  .bpv-toolbar {
    display: flex; align-items: center; gap: 4px;
    height: 48px; padding: 0 14px; flex-shrink: 0;
    background: #f4f4f4;
    border-bottom: 1px solid #f4f4f4;
  }

  /* Title in toolbar */
  .bpv-tb-title {
    flex: 1; font-size: 12px; font-weight: 500; color: rgb(18,18,18);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 8px;
  }

  .bpv-tb-sep { width: 1px; height: 16px; background: #e5e7eb; margin: 0 6px; flex-shrink: 0; }

  /* Pill group wrapper for toggle buttons */
  .bpv-pill-group {
    display: flex; align-items: center;
    background: #f3f4f6; padding: 2px; gap: 1px;
  }

  /* Individual toolbar icon button */
  .bpv-tb-btn {
    width: 28px; height: 28px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border: none; background: transparent; color: #9ca3af;
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
  }
  .bpv-tb-btn:hover:not(:disabled) { background: #f3f4f6; color: rgb(18,18,18); }
  .bpv-tb-btn:disabled { opacity: 0.3; cursor: default; }
  .bpv-tb-btn.active { background: #fff; color: rgb(18,18,18); box-shadow: 0 1px 3px rgba(0,0,0,.1); }

  /* Zoom % badge */
  .bpv-zoom-pct {
    font-size: 11px; font-weight: 500; color: #6b7280;
    min-width: 34px; text-align: center; flex-shrink: 0;
  }

  /* Canvas scroll area */
  .bpv-scroll {
    flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden;
    display: flex; flex-direction: column; align-items: center;
    padding: 24px 16px 36px; gap: 0;
    background: #f9fafb;
  }
  .bpv-scroll::-webkit-scrollbar { width: 3px; }
  .bpv-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.12); border-radius: 3px; }
  .bpv-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.35); border-radius: 3px; }
  .bpv-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.55); }

  .bpv-scroll-inner {
    width: 100%; overflow-x: auto;
    display: flex; flex-direction: column; align-items: center;
  }
  .bpv-scroll-inner::-webkit-scrollbar { height: 3px; }
  .bpv-scroll-inner::-webkit-scrollbar-track { background: rgba(0,0,0,0.12); border-radius: 3px; }
  .bpv-scroll-inner::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.35); border-radius: 3px; }

  /* Pages */
  .bpv-spread { display: flex; align-items: flex-start; gap: 0; margin-bottom: 20px; }
  .bpv-spread-page {
    flex-shrink: 0; line-height: 0; background: #fff; position: relative;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.08);
  }
  .bpv-spread-page .react-pdf__Page { display: block !important; }
  .bpv-spread-page .react-pdf__Page canvas { display: block; }

  .bpv-spine {
    width: 2px; flex-shrink: 0; align-self: stretch;
    background: #e5e7eb;
  }
  .bpv-blank { flex-shrink: 0; background: #f3f4f6; }

  .bpv-single {
    margin-bottom: 20px; line-height: 0; background: #fff;
    position: relative; flex-shrink: 0;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.08);
  }
  .bpv-single .react-pdf__Page { display: block !important; }
  .bpv-single .react-pdf__Page canvas { display: block; }

  /* CTA fade — softer white gradient */
  .bpv-last-fade {
    position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(to top, rgba(249,250,251,0.98) 50%, transparent);
    display: flex; flex-direction: column; align-items: center;
    justify-content: flex-end; padding-bottom: 20px; gap: 10px; z-index: 5;
  }
  .bpv-cta-hint {
    font-size: 11px; color: #9ca3af; font-weight: 400;
  }
  .bpv-cta-btn {
    padding: 9px 22px; background: rgb(18,18,18); color: #fff;
    border: none;
    font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: inherit; transition: background 0.15s;
  }
  .bpv-cta-btn:hover { background: #333; }

  /* Loading / error states */
  .bpv-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px; padding: 80px 0; width: 100%;
  }
  .bpv-state-text {
    font-size: 12px; color: #9ca3af; letter-spacing: 0.02em;
  }
  .bpv-spinner {
    width: 22px; height: 22px; border-radius: 50%;
    border: 2px solid #e5e7eb; border-top-color: rgb(18,18,18);
    animation: bd-spin 0.8s linear infinite;
  }

  /* Bottom bar */
  .bpv-bottom {
    display: flex; align-items: center; gap: 8px;
    height: 44px; padding: 0 14px; flex-shrink: 0;
    background: #fff; border-top: 1px solid #f4f4f4;
  }
  .bpv-pg-label { font-size: 12px; color: #6b7280; }
  .bpv-pg-label b { font-weight: 600; color: rgb(18,18,18); }
  .bpv-bottom-sep { flex: 1; }

  /* ── Preview wrapper sizing ── */
  .bp-preview-wrapper { width: 100%; min-height: 280px; height: 360px; }
  @media (min-width: 480px)  { .bp-preview-wrapper { height: 420px; } }
  @media (min-width: 640px)  { .bp-preview-wrapper { height: 500px; } }
  @media (min-width: 1024px) { .bp-preview-wrapper { height: 720px; } }
  @media (min-width: 1280px) { .bp-preview-wrapper { height: 800px; } }

  /* ── Responsive layout ── */
  .bd-main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: start;
  }
  @media (min-width: 1024px) {
    .bd-main-grid {
      grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
      gap: 2.5rem;
    }
  }

  /* Mobile page padding */
  .bd-page-wrap { max-width: 1700px; margin: 0 auto; padding: 20px 16px 48px; }
  @media (min-width: 640px)  { .bd-page-wrap { padding: 24px 24px 56px; } }
  @media (min-width: 1024px) { .bd-page-wrap { padding: 28px 32px 64px; } }

  /* Mobile back button spacing */
  .bd-back-wrap { margin-bottom: 20px; }
  @media (min-width: 640px) { .bd-back-wrap { margin-bottom: 28px; } }

  /* Title scales down on mobile */
  .bd-title {
    font-size: clamp(18px, 3vw, 26px);
    font-weight: 700; line-height: 1.15;
    color: #000; margin-bottom: 8px;
    letter-spacing: -0.02em;
  }

  /* Stats row wraps nicely on small screens */
  .bd-stats-row { display: flex; align-items: center; gap: 8px; margin-bottom: 22px; flex-wrap: wrap; }

  /* Actions stack on very small screens */
  .bd-actions { display: flex; gap: 8px; margin-bottom: 28px; }
  @media (max-width: 360px) {
    .bd-actions { flex-wrap: wrap; }
    .bd-btn-primary, .bd-btn-secondary { min-width: calc(50% - 4px); }
  }

  /* Info rows readable on mobile */
  .bd-info-row {
    display: flex; align-items: baseline;
    justify-content: space-between; gap: 12px;
    padding: 9px 0; border-bottom: 1px solid #f4f4f4;
  }
  @media (max-width: 480px) {
    .bd-info-row { flex-direction: column; gap: 2px; }
    .bd-info-value { text-align: left; }
  }

  /* Toolbar wraps on very narrow viewer */
  .bpv-toolbar { flex-wrap: nowrap; overflow: hidden; }
  .bpv-tb-title { min-width: 0; }
  @media (max-width: 480px) {
    .bpv-zoom-pct { display: none; }
  }

  /* ════════════════════════════════════
     MODERN RIGHT PANEL
  ════════════════════════════════════ */
  .bd-panel {
    display: flex; flex-direction: column; min-width: 0;
    animation: bd-fade-up 0.3s ease both;
  }

  .bd-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; color: #6b7280;
    background: none; border: none; cursor: pointer;
    padding: 0; transition: color 0.15s; font-family: inherit;
  }
  .bd-back:hover { color: rgb(18,18,18); }

  /* Genre pill */
  .bd-genre-pill {
    display: inline-flex; align-items: center;
    font-size: 11px; font-weight: 500; letter-spacing: 0.03em;
    color: #1e40af; background: #dbeafe;
    padding: 3px 12px;
    width: fit-content; align-self: flex-start; margin-bottom: 14px;
  }

  /* Title — handled in responsive block below */

  /* Byline */
  .bd-byline {
    font-size: 14px; color: #6b7280; margin-bottom: 18px;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .bd-byline-author { color: rgb(18,18,18); font-weight: 500; }
  .bd-byline-dot { color: #d1d5db; }
  .bd-byline-year { color: #9ca3af; }

  /* Stats, actions, info rows — see responsive block */
  .bd-stat-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; color: #6b7280;
    padding: 4px 10px;
  }
  .bd-avail {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 500; padding: 4px 12px;
  }
  .bd-avail.ok  { color: #dc2626; }
  .bd-avail.no  { color: #dc2626; }
  .bd-avail-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .bd-avail.ok .bd-avail-dot  { background: #dc2626; }
  .bd-avail.no .bd-avail-dot  { background: #dc2626; }

  /* Buttons */
  .bd-btn-primary {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px 0; background: #1e40af; color: #fff;
    border: none;
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: background 0.15s, transform 0.1s; font-family: inherit;
  }
  .bd-btn-primary:hover:not(:disabled) { background: #333; }
  .bd-btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .bd-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }

  .bd-btn-secondary {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px 0; background: #f4f4f4; color: #000;
    border: 1.5px solid #f4f4f4;
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; font-family: inherit;
  }
  .bd-btn-secondary:hover:not(:disabled) { border-color: #9ca3af; background: #f9fafb; }
  .bd-btn-secondary:active:not(:disabled) { transform: scale(0.98); }
  .bd-btn-secondary:disabled { opacity: 0.35; cursor: not-allowed; }

  .bd-btn-icon {
    width: 44px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #fff; color: #9ca3af;
    border: 1.5px solid #f4f4f4;
    cursor: pointer; transition: all 0.15s;
  }
  .bd-btn-icon:hover { border-color: #9ca3af; color: rgb(18,18,18); }
  .bd-btn-icon.on    { background: #fffbeb; color: #d97706; border-color: #fcd34d; }

  /* Divider */
  .bd-divider { height: 1px; background: #f3f4f6; margin: 0 0 22px; }

  /* Info section */
  .bd-info-section { margin-bottom: 24px; }
  .bd-info-heading {
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase; color: #9ca3af; margin-bottom: 4px;
  }
  .bd-info-row:last-child { border-bottom: none; }
  .bd-info-label { font-size: 13px; color: #9ca3af; flex-shrink: 0; min-width: 90px; }
  .bd-info-value { font-size: 13px; color: #000; font-weight: 500; text-align: right; word-break: break-word; }
  .bd-info-value.mono { font-family: 'Courier New', monospace; font-size: 12px; }
  .bd-info-value.muted { color: #d1d5db; font-weight: 400; font-style: italic; }

  /* Notes */
  .bd-notes-card {
    background: #fffbeb; border: 1px solid #f4f4f4;
    padding: 14px 16px;
  }
  .bd-notes-card-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: #d97706; margin-bottom: 6px;
  }
  .bd-notes-text { font-size: 13px; color: #78350f; line-height: 1.6; }
`;

function injectCss() {
  if (typeof document === "undefined" || document.getElementById("bd-css")) return;
  const s = document.createElement("style");
  s.id = "bd-css";
  s.textContent = ALL_CSS;
  document.head.appendChild(s);
}

// ─── Theme tokens (viewer only) ───────────────────────────────────────────────
const THEMES = {
  dark: {
    bg: "rgba(30,64,115,1)", toolbar: "rgba(22,50,92,1)", border: "1px solid rgba(15,38,72,1)", sep: "rgba(15,38,72,1)",
    titleColor: "#fff", btnColor: "rgba(255,255,255,0.85)",
    btnHoverBg: "rgba(255,255,255,0.2)", btnHoverColor: "#fff",
    activeBg: "rgba(255,255,255,0.25)", activeColor: "#fff",
    scrollBg: "rgba(30,64,115,1)", bottomBg: "rgba(22,50,92,1)", bottomBorder: "1px solid rgba(15,38,72,1)",
    pgLabelColor: "rgba(255,255,255,0.8)", pgLabelBold: "#fff",
    spinBorder: "rgba(15,38,72,1)", spinTop: "#fff",
    stateColor: "#fff", scrollThumb: "rgba(255,255,255,0.55)", pctColor: "#fff",
  },
  light: {
    bg: "#f0f4f8", toolbar: "#fff", border: "0.5px solid #d0e4f5", sep: "#d0e4f5",
    titleColor: "rgb(18,18,18)", btnColor: "#7aaad0",
    btnHoverBg: "#e8f2fc", btnHoverColor: "#1e6db5",
    activeBg: "#ddeefa", activeColor: "#1e6db5",
    scrollBg: "#edf3fa", bottomBg: "#fff", bottomBorder: "0.5px solid #e0eaf5",
    pgLabelColor: "rgb(18,18,18)", pgLabelBold: "rgb(18,18,18)",
    spinBorder: "#d0e4f5", spinTop: "#1e6db5",
    stateColor: "rgb(18,18,18)", scrollThumb: "#b8d4ef", pctColor: "rgb(18,18,18)",
  },
};

const PREVIEW_PAGES = 5;

// ─── BookPreview ──────────────────────────────────────────────────────────────
const BookPreview = ({ uploadId, title, onReadClick }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(0.65);
  const [pdfError, setPdfError] = useState(false);
  const [twoUp, setTwoUp] = useState(false);

  const scrollRef = useRef(null);
  const [areaW, setAreaW] = useState(0);

  useEffect(() => {
    if (!scrollRef.current) return;
    const ro = new ResizeObserver(([e]) => setAreaW(e.contentRect.width));
    ro.observe(scrollRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!uploadId) {
      setFetchStatus("error");
      return;
    }

    let cancelled = false;
    setFetchStatus("loading");

    (async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/api/uploads/${uploadId}/preview`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const blob = await res.blob();
        if (cancelled) return;

        setBlobUrl(URL.createObjectURL(blob));
        setFetchStatus("done");
      } catch {
        if (!cancelled) setFetchStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      setBlobUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [uploadId]);

  const clamp = s => Math.min(Math.max(s, 0.4), 2);

  const baseW = areaW > 0 ? areaW - 40 : 700;
  const pageW = twoUp ? Math.floor((baseW - 4) / 2) : baseW;
  const scaledW = Math.round(pageW * clamp(scale));

  const totalPrev = numPages ? Math.min(5, numPages) : 0;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "#e8e8e8",
    }}>

      {/* ───────── Toolbar ───────── */}
      <div style={{
        height: 42,
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #f4f4f4"
      }}>
        <span style={{
          flex: 1,
          fontSize: 12,
          color: "#111",
          opacity: 0.6,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis"
        }}>
          {title}
        </span>

        <button onClick={() => setTwoUp(false)}>
          <AlignJustify size={12} strokeWidth={1.5} />
        </button>

        <button onClick={() => setTwoUp(true)}>
          <Columns size={12} strokeWidth={1.5} />
        </button>

        <button onClick={() => setScale(s => clamp(s - 0.1))}>
          <ZoomOut size={12} strokeWidth={1.5} />
        </button>

        <span style={{ fontSize: 11, color: "#9ca3af" }}>
          {Math.round(scale * 100)}%
        </span>

        <button onClick={() => setScale(s => clamp(s + 0.1))}>
          <ZoomIn size={12} strokeWidth={1.5} />
        </button>
      </div>

      {/* ───────── Scroll Area ───────── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          padding: "50px 0 80px",
        }}
      >
        <div style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>

          {(fetchStatus === "loading") && (
            <div style={{ marginTop: 100, color: "#999" }}>
              Loading preview...
            </div>
          )}

          {(fetchStatus === "error" || pdfError) && (
            <div style={{ marginTop: 100, color: "#999" }}>
              Preview unavailable
            </div>
          )}

          {blobUrl && (
            <Document
              file={blobUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => setPdfError(true)}
            >
              {Array.from({ length: totalPrev }, (_, i) => i + 1).map(n => (
                <div
                  key={n}
                  style={{
                    marginBottom: 32,
                    background: "#fff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    transition: "0.2s"
                  }}
                >
                  <Page
                    pageNumber={n}
                    width={scaledW}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />

                  {n === totalPrev && numPages > 5 && (
                    <div style={{
                      position: "relative",
                      height: 120,
                      marginTop: -120,
                      background: "linear-gradient(to top, white, transparent)",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      paddingBottom: 20
                    }}>
                      <button
                        onClick={onReadClick}
                        style={{
                          padding: "8px 18px",
                          borderRadius: 999,
                          background: "#111",
                          color: "#fff",
                          border: "none",
                          fontSize: 12,
                          cursor: "pointer"
                        }}
                      >
                        Read Full Book
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </Document>
          )}
        </div>
      </div>

      {/* ───────── Bottom ───────── */}
      <div style={{
        height: 40,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        background: "rgba(255,255,255,0.7)",
        borderTop: "1px solid #f4f4f4"
      }}>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>
          {totalPrev} pages preview
        </span>
      </div>

    </div>
  );
};

// ─── InfoRow helper ───────────────────────────────────────────────────────────
function InfoRow({ label, value, mono }) {
  return (
    <div className="bd-info-row">
      <span className="bd-info-label">{label}</span>
      <span className={`bd-info-value${!value ? " muted" : mono ? " mono" : ""}`}>
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Main BookDetails ─────────────────────────────────────────────────────────
const BookDetails = ({ bookId }) => {
  const [book,          setBook]          = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [showReader,    setShowReader]    = useState(false);
  const [downloadCount, setDownloadCount] = useState(null);
  const [downloading,   setDownloading]   = useState(false);
  const [bookmarked,    setBookmarked]    = useState(false);

  useEffect(() => { injectCss(); }, []);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      setLoading(true); setError(null);
      try {
        const token = getToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/api/book-details/${bookId}`, { headers });
        if (!res.ok) {
          if (res.status === 403) throw new Error("Access denied.");
          else if (res.status === 404) throw new Error("Book not found.");
          else throw new Error("Failed to fetch book details.");
        }
        const data = await res.json();
        setBook(data);
        if (data.upload?.download_count != null) setDownloadCount(data.upload.download_count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  useEffect(() => {
    document.body.style.overflow = showReader ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showReader]);

  const handleDownloadBook = async () => {
    if (!book?.upload?.id || downloading) return;
    setDownloading(true);
    try {
      const token = getToken();
      const res   = await fetch(`${API_BASE_URL}/api/uploads/${book.upload.id}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob    = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link    = document.createElement("a");
      link.href     = blobUrl;
      link.download = book.upload.original_name || `${book.title}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
      setDownloadCount(prev => (prev ?? 0) + 1);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <>
      <Nav />
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af" }}>
            Loading
          </span>
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Nav />
      <div className="flex justify-center items-center h-96 flex-col gap-4">
        <p style={{ fontSize: 14, color: "rgb(18,18,18)" }}>{error}</p>
        <button onClick={() => window.history.back()}
          style={{ fontSize: 12, color: "#6b7280", background: "none", border: "none",
            cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, fontFamily: "inherit" }}>
          Go back
        </button>
      </div>
    </>
  );

  if (!book) return null;

  const uploadId    = book.upload?.id || null;
  const coverImage  = "/assets/BooksImages/2.avif";
  const accessionNo = book.accession?.accession_no || "—";
  const isAvailable = book.copies > 0;
  const pubYear     = book.date_of_publication ? new Date(book.date_of_publication).getFullYear() : null;
  const pubDateFull = book.date_of_publication
    ? new Date(book.date_of_publication).toLocaleDateString("en-US", { year: "numeric", month: "short" })
    : null;

  return (
    <>
      <Nav />
      <div className="bg-white">
        <div className="bd-page-wrap">

          {/* Back */}
          <div className="bd-back-wrap">
            <button className="bd-back" onClick={() => window.history.back()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Books
            </button>
          </div>

          {/* Main grid — 1 col mobile, 3fr/2fr on lg+ */}
          <div className="bd-main-grid">

            {/* Left: PDF Preview */}
            <div style={{ minWidth: 0, width: "100%" }}>
              {uploadId ? (
                <div className="bp-preview-wrapper" style={{ overflow: "hidden" }}>
                  <BookPreview
                    uploadId={uploadId}
                    title={book.title}
                    onReadClick={() => setShowReader(true)}
                  />
                </div>
              ) : (
                <div style={{ width: "100%", aspectRatio: "1.35/1", overflow: "hidden",
                  border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                  <img src={coverImage} alt={book.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>

            {/* Right: Modern panel */}
            <div className="bd-panel">

              {/* Genre pill */}
              <span className="bd-genre-pill">{book.category || "Books"}</span>

              {/* Title */}
              <h1 className="bd-title">{book.title}</h1>

              {/* Author + year */}
              <div className="bd-byline">
                <span className="bd-byline-author">{book.author || "Unknown Author"}</span>
                {pubYear && (
                  <>
                    <span className="bd-byline-dot">·</span>
                    <span className="bd-byline-year">{pubYear}</span>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="bd-stats-row">
                <span className={`bd-avail ${isAvailable ? "ok" : "no"}`}>
                  <span className="bd-avail-dot" />
                  {isAvailable ? "Available" : "Unavailable"}
                </span>

                {book.copies != null && (
                  <span className="bd-stat-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                    {book.copies} {book.copies === 1 ? "copy" : "copies"}
                  </span>
                )}

                {downloadCount != null && downloadCount > 0 && (
                  <span className="bd-stat-chip">
                    <Download size={12} />
                    {downloadCount.toLocaleString()}
                  </span>
                )}

                {book.upload?.file_type && (
                  <span className="bd-stat-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {book.upload.file_type.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="bd-actions">
                <button onClick={() => setShowReader(true)} disabled={!uploadId}
                  className="bd-btn-primary">
                  <BookOpen size={15} /> Read
                </button>
                <button onClick={handleDownloadBook} disabled={!uploadId || downloading}
                  className="bd-btn-secondary">
                  {downloading ? (
                    <>
                      <div style={{ width: 14, height: 14, border: "2px solid #e5e7eb",
                        borderTopColor: "rgb(18,18,18)", borderRadius: "50%",
                        animation: "bd-spin 0.9s linear infinite" }} />
                      Saving…
                    </>
                  ) : (
                    <><Download size={15} /> Download</>
                  )}
                </button>
                <button onClick={() => setBookmarked(b => !b)}
                  className={`bd-btn-icon ${bookmarked ? "on" : ""}`}
                  title={bookmarked ? "Remove bookmark" : "Bookmark"}>
                  {bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                </button>
              </div>

              <div className="bd-divider" />

              {/* Bibliographic */}
              <div className="bd-info-section">
                <div className="bd-info-heading">Bibliographic Details</div>
                <InfoRow label="Author"    value={book.author} />
                <InfoRow label="Editor"    value={book.editor} />
                <InfoRow label="Edition"   value={book.edition} />
                <InfoRow label="Publisher" value={book.publisher} />
                <InfoRow label="Published" value={pubDateFull} />
                <InfoRow label="ISBN"      value={book.isbn} />
                <InfoRow label="ISSN"      value={book.issn} />
                <InfoRow label="Call No."  value={book.call_number} mono />
                <InfoRow label="Subjects"  value={book.subjects} />
                <InfoRow label="Extent"    value={book.extent} />
                <InfoRow label="Accession No." value={accessionNo} />
                {book.accession?.date_accessioned && (
                  <InfoRow
                    label="Date Accessioned"
                    value={new Date(book.accession.date_accessioned).toLocaleDateString("en-US",
                      { year: "numeric", month: "short", day: "numeric" })}
                  />
                )}
                {book.access_level && (
                  <InfoRow
                    label="Access Level"
                    value={book.access_level === "staff_only" ? "Staff Only" : "Public"}
                  />
                )}
              </div>

              {/* Notes */}
              {book.notes && (
                <div className="bd-notes-card">
                  <div className="bd-notes-card-label">Notes</div>
                  <p className="bd-notes-text">{book.notes}</p>
                </div>
              )}

            </div>
          </div>

          <RelatedBooks currentBook={book} />
        </div>
      </div>

      {showReader && (
        <FullScreenPDFReader
          uploadId={uploadId}
          title={book.title}
          author={book.author}
          onClose={() => setShowReader(false)}
        />
      )}
    </>
  );
};

export default BookDetails;