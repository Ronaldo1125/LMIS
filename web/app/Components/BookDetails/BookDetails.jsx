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

function Spinner() {
  return <div className="bpv-spinner" />;
}

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
  const [book,            setBook]            = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [showReader,      setShowReader]      = useState(false);
  const [downloading,     setDownloading]     = useState(false);
  const [bookmarked,      setBookmarked]      = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [showBookmarkNotif, setShowBookmarkNotif] = useState(false);

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
        const bookData = await res.json();
        setBook(bookData);

        if (token) {
          try {
            const bmRes = await fetch(`${API_BASE_URL}/api/bookmarks/${bookId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (bmRes.ok) {
              const bmData = await bmRes.json();
              setBookmarked(bmData.bookmarked);
            }
          } catch {
            // Silently ignore bookmark check failure — not critical
          }
        }
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
    const token = getToken();
    if (!token) {
      // Dispatch custom event to show login modal with download message
      window.dispatchEvent(new CustomEvent('showLoginWithMessage', {
        detail: 'Log in or create an account to download books.'
      }));
      return;
    }
    setDownloading(true);
    try {
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

  const handleBookmark = async () => {
    if (bookmarkLoading) return;
    const token = getToken();
    if (!token) {
      // Dispatch custom event to show login modal with bookmark message
      window.dispatchEvent(new CustomEvent('showLoginWithMessage', {
        detail: 'Log in or create an account to have access to bookmarks.'
      }));
      return;
    }

    setBookmarkLoading(true);
    try {
      const method = bookmarked ? "DELETE" : "POST";
      const res = await fetch(`${API_BASE_URL}/api/bookmarks/${book.id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookmarked((prev) => !prev);
        // Show notification only when adding bookmark (not removing)
        if (!bookmarked) {
          setShowBookmarkNotif(true);
          setTimeout(() => {
            const notif = document.querySelector('[data-bookmark-notif]');
            if (notif) {
              notif.style.animation = 'slideUp 0.3s ease forwards';
              setTimeout(() => setShowBookmarkNotif(false), 300);
            } else {
              setShowBookmarkNotif(false);
            }
          }, 3000);
        }
      } else if (res.status === 409) {
        // Handle case where bookmark already exists
        setBookmarked(true);
        // Show notification for existing bookmark
        setShowBookmarkNotif(true);
        setTimeout(() => {
          const notif = document.querySelector('[data-bookmark-notif]');
          if (notif) {
            notif.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => setShowBookmarkNotif(false), 300);
          } else {
            setShowBookmarkNotif(false);
          }
        }, 3000);
      } else {
        console.error("Bookmark request failed:", res.status);
      }
    } catch (err) {
      console.error("Bookmark failed:", err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) return (
    <>
      <Nav />
      <div className="flex justify-center items-center h-96">
        <Spinner />
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
  const isLoggedIn  = !!getToken();

  return (
    <>
      <Nav />
      
      {/* Bookmark Notification */}
      {showBookmarkNotif && (
        <div 
          data-bookmark-notif
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "#1e3a8a",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            animation: "slideDown 0.3s ease",
            minWidth: "300px",
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#1e3a8a",
            border: "2px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Added to Bookmark!</span>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "12px",
              cursor: "pointer",
              textDecoration: "underline",
              padding: "4px 8px",
              marginLeft: "auto",
            }}
            onClick={() => {
  // Dispatch custom event to open profile modal and navigate to bookmarked tab
  window.dispatchEvent(new CustomEvent('openProfileBookmarked'));
}}
          >
            View
          </button>
        </div>
      )}
      
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
                {isLoggedIn && (
                  <button
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                    className={`bd-btn-icon ${bookmarked ? "on" : ""}`}
                    title={bookmarked ? "Remove bookmark" : "Bookmark"}
                  >
                    {bookmarkLoading
                      ? <Spinner />
                      : <Bookmark size={17} />
                    }
                  </button>
                )}
                {!isLoggedIn && (
                  <button
                    onClick={handleBookmark}
                    className="bd-btn-icon"
                    title="Log in to bookmark"
                  >
                    <Bookmark size={17} />
                  </button>
                )}
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

          <RelatedBooks currentBookId={book.id} />
        </div>
      </div>

      {showReader && (
        <FullScreenPDFReader uploadId={uploadId} title={book.title} author={book.author} onClose={() => setShowReader(false)} />
      )}
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
        }
      `}</style>
    </>
  );
};

export default BookDetails;