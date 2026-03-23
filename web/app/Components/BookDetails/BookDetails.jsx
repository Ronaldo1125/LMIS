"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import RelatedBooks from "./RelatedBooks";
import Nav from "../Nav/Nav";
import dynamic from "next/dynamic";
import { BookOpen, Download, ZoomIn, ZoomOut, Sun, Moon, Columns, AlignJustify, Bookmark, BookmarkCheck } from "lucide-react";

const BookPreview = dynamic(
  () => import("./BookPreview"),
  { ssr: false }
); 
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

  .bpv-root {
    display: flex; flex-direction: column;
    width: 100%; height: 100%; overflow: hidden;
    background: #fff;
    border: 1.5px solid #f4f4f4;
  }

  .bpv-toolbar {
    display: flex; align-items: center; gap: 4px;
    height: 48px; padding: 0 14px; flex-shrink: 0;
    background: #f4f4f4;
    border-bottom: 1px solid #f4f4f4;
  }

  .bpv-tb-title {
    flex: 1; font-size: 12px; font-weight: 500; color: rgb(18,18,18);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 8px;
  }

  .bpv-tb-sep { width: 1px; height: 16px; background: #e5e7eb; margin: 0 6px; flex-shrink: 0; }

  .bpv-pill-group {
    display: flex; align-items: center;
    background: #f3f4f6; padding: 2px; gap: 1px;
  }

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

  .bpv-zoom-pct {
    font-size: 11px; font-weight: 500; color: #6b7280;
    min-width: 34px; text-align: center; flex-shrink: 0;
  }

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

  .bpv-bottom {
    display: flex; align-items: center; gap: 8px;
    height: 44px; padding: 0 14px; flex-shrink: 0;
    background: #fff; border-top: 1px solid #f4f4f4;
  }
  .bpv-pg-label { font-size: 12px; color: #6b7280; }
  .bpv-pg-label b { font-weight: 600; color: rgb(18,18,18); }
  .bpv-bottom-sep { flex: 1; }

  .bp-preview-wrapper { width: 100%; min-height: 280px; height: 360px; }
  @media (min-width: 480px)  { .bp-preview-wrapper { height: 420px; } }
  @media (min-width: 640px)  { .bp-preview-wrapper { height: 500px; } }
  @media (min-width: 1024px) { .bp-preview-wrapper { height: 720px; } }
  @media (min-width: 1280px) { .bp-preview-wrapper { height: 800px; } }

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

  .bd-page-wrap { max-width: 1700px; margin: 0 auto; padding: 20px 16px 48px; }
  @media (min-width: 640px)  { .bd-page-wrap { padding: 24px 24px 56px; } }
  @media (min-width: 1024px) { .bd-page-wrap { padding: 28px 32px 64px; } }

  .bd-back-wrap { margin-bottom: 20px; }
  @media (min-width: 640px) { .bd-back-wrap { margin-bottom: 28px; } }

  .bd-title {
    font-size: clamp(18px, 3vw, 26px);
    font-weight: 700; line-height: 1.15;
    color: #000; margin-bottom: 8px;
    letter-spacing: -0.02em;
  }

  .bd-stats-row { display: flex; align-items: center; gap: 8px; margin-bottom: 22px; flex-wrap: wrap; }

  .bd-actions { display: flex; gap: 8px; margin-bottom: 28px; }
  @media (max-width: 360px) {
    .bd-actions { flex-wrap: wrap; }
    .bd-btn-primary, .bd-btn-secondary { min-width: calc(50% - 4px); }
  }

  .bd-info-row {
    display: flex; align-items: baseline;
    justify-content: space-between; gap: 12px;
    padding: 9px 0; border-bottom: 1px solid #f4f4f4;
  }
  @media (max-width: 480px) {
    .bd-info-row { flex-direction: column; gap: 2px; }
    .bd-info-value { text-align: left; }
  }

  .bpv-toolbar { flex-wrap: nowrap; overflow: hidden; }
  .bpv-tb-title { min-width: 0; }
  @media (max-width: 480px) {
    .bpv-zoom-pct { display: none; }
  }

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

  .bd-genre-pill {
    display: inline-flex; align-items: center;
    font-size: 11px; font-weight: 500; letter-spacing: 0.03em;
    color: #1e40af; background: #dbeafe;
    padding: 3px 12px;
    width: fit-content; align-self: flex-start; margin-bottom: 14px;
  }

  .bd-byline {
    font-size: 14px; color: #6b7280; margin-bottom: 18px;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .bd-byline-author { color: rgb(18,18,18); font-weight: 500; }
  .bd-byline-dot { color: #d1d5db; }
  .bd-byline-year { color: #9ca3af; }

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

  .bd-btn-primary {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px 0; background: #1e40af; color: #fff;
    border: none;
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: transform 0.1s; font-family: inherit;
  }
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
    background: #fff; color: #000;
    border: 1.5px solid #f4f4f4;
    cursor: pointer; transition: all 0.15s;
  }
  .bd-btn-icon.on    { background: #fffbeb; color: #d97706; border-color: #fcd34d; }
  .bd-btn-icon:disabled { opacity: 0.4; cursor: not-allowed; }

  .bd-divider { height: 1px; background: #f3f4f6; margin: 0 0 22px; }

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

  // ── Bookmark state ──────────────────────────────────────────────────────────
  const [bookmarked,        setBookmarked]        = useState(false);
  const [bookmarkLoading,   setBookmarkLoading]   = useState(false); // checking on mount
  const [bookmarkToggling,  setBookmarkToggling]  = useState(false); // during add/remove
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => { injectCss(); }, []);

  // ── Fetch book details ──────────────────────────────────────────────────────
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

  // ── Check bookmark status on mount (only if logged in) ─────────────────────
  useEffect(() => {
    if (!bookId) return;
    const token = getToken();
    if (!token) return; // not logged in — leave bookmark button visible but inactive

    const checkBookmark = async () => {
      setBookmarkLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookmarks/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return; // fail silently — don't break the page
        const data = await res.json();
        setBookmarked(data.bookmarked);
      } catch {
        // fail silently
      } finally {
        setBookmarkLoading(false);
      }
    };

    checkBookmark();
  }, [bookId]);
  // ───────────────────────────────────────────────────────────────────────────

  // ── Toggle bookmark ─────────────────────────────────────────────────────────
  const handleBookmark = async () => {
    const token = getToken();
    if (!token || bookmarkToggling) return;

    setBookmarkToggling(true);
    try {
      if (bookmarked) {
        // DELETE /api/bookmarks/:book_id
        const res = await fetch(`${API_BASE_URL}/api/bookmarks/${bookId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        setBookmarked(false);
      } else {
        // POST /api/bookmarks/:book_id
        const res = await fetch(`${API_BASE_URL}/api/bookmarks/${bookId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 409) {
          // Already bookmarked on server — sync state
          setBookmarked(true);
          return;
        }
        if (!res.ok) throw new Error();
        setBookmarked(true);
      }
    } catch {
      // fail silently — button reverts to previous state automatically
    } finally {
      setBookmarkToggling(false);
    }
  };
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = showReader ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showReader]);

  const handleDownloadBook = async () => {
    if (!book?.upload?.id || downloading) return;
    setDownloading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/uploads/${book.upload.id}/download`, {
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

  const isLoggedIn         = !!getToken();
  const bookmarkDisabled   = !isLoggedIn || bookmarkLoading || bookmarkToggling;

  return (
    <>
      <Nav />
      <div className="bg-white">
        <div className="bd-page-wrap">

          {/* Back */}
          <div className="bd-back-wrap">
            <button className="bd-back" onClick={() => window.history.back()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Books
            </button>
          </div>

          {/* Main grid */}
          <div className="bd-main-grid">

            {/* Left: PDF Preview */}
            <div style={{ minWidth: 0, width: "100%" }}>
              {uploadId ? (
                <div className="bp-preview-wrapper" style={{ overflow: "hidden" }}>
                  <BookPreview uploadId={uploadId} title={book.title} onReadClick={() => setShowReader(true)} />
                </div>
              ) : (
                <div style={{ width: "100%", aspectRatio: "1.35/1", overflow: "hidden", border: "1px solid #e5e7eb", background: "#f9fafb" }}>
                  <img src={coverImage} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>

            {/* Right: panel */}
            <div className="bd-panel">

              <span className="bd-genre-pill">{book.category || "Books"}</span>

              <h1 className="bd-title">{book.title}</h1>

              <div className="bd-byline">
                <span className="bd-byline-author">{book.author || "Unknown Author"}</span>
                {pubYear && (
                  <>
                    <span className="bd-byline-dot">·</span>
                    <span className="bd-byline-year">{pubYear}</span>
                  </>
                )}
              </div>

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
                <button onClick={() => setShowReader(true)} disabled={!uploadId} className="bd-btn-primary">
                  <BookOpen size={15} /> Read
                </button>
                <button onClick={handleDownloadBook} disabled={!uploadId || downloading} className="bd-btn-secondary">
                  {downloading ? (
                    <>
                      <div style={{ width: 14, height: 14, border: "2px solid #e5e7eb", borderTopColor: "rgb(18,18,18)", borderRadius: "50%", animation: "bd-spin 0.9s linear infinite" }} />
                      Saving…
                    </>
                  ) : (
                    <><Download size={15} /> Download</>
                  )}
                </button>

                {/* ── Bookmark button — now wired to API ── */}
                <button
                  onClick={handleBookmark}
                  disabled={bookmarkDisabled}
                  className={`bd-btn-icon ${bookmarked ? "on" : ""}`}
                  title={
                    !isLoggedIn        ? "Log in to bookmark" :
                    bookmarkLoading    ? "Checking…" :
                    bookmarkToggling   ? (bookmarked ? "Removing…" : "Saving…") :
                    bookmarked         ? "Remove bookmark" : "Bookmark"
                  }
                >
                  {bookmarkToggling ? (
                    <div style={{ width: 14, height: 14, border: "2px solid #e5e7eb", borderTopColor: bookmarked ? "#d97706" : "rgb(18,18,18)", borderRadius: "50%", animation: "bd-spin 0.9s linear infinite" }} />
                  ) : bookmarked ? (
                    <BookmarkCheck size={17} />
                  ) : (
                    <Bookmark size={17} />
                  )}
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