"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { BookOpen, Download, Bookmark, BookmarkCheck } from "lucide-react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import BookPreview from "./BookPreview";
import RelatedBooks from "./RelatedBooks";
import Nav from "../Nav/Nav";
import "./bookDetails.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FullScreenPDFReader = dynamic(() => import("../PDFReader/PDFReader"), { ssr: false });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function Spinner() {
  return (
    <div style={{ width: 14, height: 14, border: "2px solid #e5e7eb", borderTopColor: "rgb(18,18,18)", borderRadius: "50%", animation: "bd-spin 0.9s linear infinite" }} />
  );
}

function BibliographicDetails({ book, accessionNo }) {
  const pubDateFull = book.date_of_publication
    ? new Date(book.date_of_publication).toLocaleDateString("en-US", { year: "numeric", month: "short" })
    : null;

  return (
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
          value={new Date(book.accession.date_accessioned).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        />
      )}
      {book.access_level && (
        <InfoRow label="Access Level" value={book.access_level === "staff_only" ? "Staff Only" : "Public"} />
      )}
    </div>
  );
}

// ─── Main BookDetails ─────────────────────────────────────────────────────────

const BookDetails = ({ bookId }) => {
  const [book,        setBook]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showReader,  setShowReader]  = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [bookmarked,  setBookmarked]  = useState(false);

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    setError(null);

    const fetchBook = async () => {
      try {
        const token = getToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/api/book-details/${bookId}`, { headers });
        if (!res.ok) {
          const msgs = { 403: "Access denied.", 404: "Book not found." };
          throw new Error(msgs[res.status] || "Failed to fetch book details.");
        }
        setBook(await res.json());
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

  const handleDownload = async () => {
    if (!book?.upload?.id || downloading) return;
    setDownloading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/uploads/${book.upload.id}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blobUrl = URL.createObjectURL(await res.blob());
      Object.assign(document.createElement("a"), {
        href: blobUrl,
        download: book.upload.original_name || `${book.title}.pdf`,
      }).click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
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
          <Spinner />
          <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af" }}>Loading</span>
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Nav />
      <div className="flex justify-center items-center h-96 flex-col gap-4">
        <p style={{ fontSize: 14, color: "rgb(18,18,18)" }}>{error}</p>
        <button onClick={() => window.history.back()} style={{ fontSize: 12, color: "#6b7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, fontFamily: "inherit" }}>
          Go back
        </button>
      </div>
    </>
  );

  if (!book) return null;

  const uploadId    = book.upload?.id || null;
  const pubYear     = book.date_of_publication ? new Date(book.date_of_publication).getFullYear() : null;
  const accessionNo = book.accession?.accession_no || "—";

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

          <div className="bd-main-grid">

            {/* Left: PDF Preview */}
            <div style={{ minWidth: 0, width: "100%" }}>
              {uploadId ? (
                <div className="bp-preview-wrapper" style={{ overflow: "hidden" }}>
                  <BookPreview uploadId={uploadId} title={book.title} onReadClick={() => setShowReader(true)} />
                </div>
              ) : (
                <div style={{ width: "100%", aspectRatio: "1.35/1", overflow: "hidden", border: "1px solid #e5e7eb", background: "#f4f4f4" }} />
              )}
            </div>

            {/* Right: Panel */}
            <div className="bd-panel">
              <span className="bd-genre-pill">{book.category || "Books"}</span>

              <h1 className="bd-title">{book.title}</h1>

              <div className="bd-byline" style={{ marginBottom: "8px" }}>
                <span className="bd-byline-author">{book.author || "Unknown Author"}</span>
                {pubYear && <><span className="bd-byline-dot">·</span><span className="bd-byline-year">{pubYear}</span></>}
              </div>

              <div className="bd-stats-row" />

              <div className="bd-actions bd-actions-tight">
                <button onClick={() => setShowReader(true)} disabled={!uploadId} className="bd-btn-primary">
                  <BookOpen size={15} /> Read
                </button>
                <button onClick={handleDownload} disabled={!uploadId || downloading} className="bd-btn-secondary">
                  {downloading ? <><Spinner /> Saving…</> : <><Download size={15} /> Download</>}
                </button>
                <button onClick={() => setBookmarked((b) => !b)} className={`bd-btn-icon ${bookmarked ? "on" : ""}`} title={bookmarked ? "Remove bookmark" : "Bookmark"}>
                  {bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                </button>
              </div>

              <div className="bd-divider" />

              <BibliographicDetails book={book} accessionNo={accessionNo} />

              {book.notes && (
                <div className="bd-notes-card">
                  <div className="bd-notes-card-label">Notes</div>
                  <p className="bd-notes-text">{book.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* FIX: was currentBook={book}, now passes the id the route expects */}
          <RelatedBooks currentBookId={book.id} />
        </div>
      </div>

      {showReader && (
        <FullScreenPDFReader uploadId={uploadId} title={book.title} author={book.author} onClose={() => setShowReader(false)} />
      )}
    </>
  );
};

export default BookDetails;