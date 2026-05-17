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


function AnimatedCheckCircle({ visible }) {
  return (
    <div style={{
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: "transparent",
      border: "2px solid rgba(255,255,255,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transform: visible ? "scale(1)" : "scale(0.6)",
      transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
        <polyline
          points="1.5,6.5 5.5,10.5 14.5,1.5"
          stroke="#fbbf24"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: 22,
            strokeDashoffset: visible ? 0 : 22,
            transition: visible
              ? "stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1) 0.15s"
              : "none",
          }}
        />
      </svg>
    </div>
  );
}


function BookmarkToast({ visible, onView }) {
  const [checkVisible, setCheckVisible] = useState(false);

  // Trigger the check animation shortly after the toast slides in
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setCheckVisible(true), 80);
      return () => clearTimeout(t);
    } else {
      setCheckVisible(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
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
        padding: "10px 16px 10px 12px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        animation: "slideDown 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        minWidth: "300px",
      }}
    >
      <AnimatedCheckCircle visible={checkVisible} />

      <span style={{ fontSize: "14px", fontWeight: 600, flex: 1 }}>
        Added to Bookmark!
      </span>

      <button
        style={{
          background: "none",
          color: "#fff",
          fontSize: "12px",
          fontWeight: 500,
          cursor: "pointer",
          padding: "5px 12px",
          whiteSpace: "nowrap",
        }}
        onClick={onView}
      >
        View
      </button>
    </div>
  );
}

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
          } catch {}
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

  const handleRead = () => {
    const token = getToken();
    if (!token) {
      window.dispatchEvent(new CustomEvent('showLoginWithMessage', {
        detail: 'Log in or create an account to read books.'
      }));
      return;
    }
    setShowReader(true);
  };

  const handleDownload = async () => {
    if (!book?.upload?.id || downloading) return;
    const token = getToken();
    if (!token) {
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

  const dismissToast = () => {
    const notif = document.querySelector('[data-bookmark-notif]');
    if (notif) {
      notif.style.animation = 'slideUp 0.3s ease forwards';
      setTimeout(() => setShowBookmarkNotif(false), 300);
    } else {
      setShowBookmarkNotif(false);
    }
  };

  const handleBookmark = async () => {
    if (bookmarkLoading) return;
    const token = getToken();
    if (!token) {
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
        if (!bookmarked) {
          setShowBookmarkNotif(true);
          setTimeout(dismissToast, 3200);
        }
      } else if (res.status === 409) {
        setBookmarked(true);
        setShowBookmarkNotif(true);
        setTimeout(dismissToast, 3200);
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

      <BookmarkToast
        visible={showBookmarkNotif}
        onView={() => {
          dismissToast();
          window.dispatchEvent(new CustomEvent('openProfileBookmarked'));
        }}
      />

      <div className="bg-white">
        <div className="bd-page-wrap">

          <div className="bd-back-wrap">
            <button className="bd-back" onClick={() => window.history.back()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Books
            </button>
          </div>

          <div className="bd-main-grid">

            <div style={{ minWidth: 0, width: "100%" }}>
              {uploadId ? (
                <div className="bp-preview-wrapper" style={{ overflow: "hidden" }}>
                  <BookPreview uploadId={uploadId} title={book.title} onReadClick={handleRead} />
                </div>
              ) : (
                <div style={{ width: "100%", aspectRatio: "1.35/1", overflow: "hidden", border: "1px solid #e5e7eb", background: "#f4f4f4" }} />
              )}
            </div>

            <div className="bd-panel">
              <span className="bd-genre-pill">{book.category || "Books"}</span>

              <h1 className="bd-title">{book.title}</h1>

              <div className="bd-byline" style={{ marginBottom: "8px" }}>
                <span className="bd-byline-author">{book.author || "Unknown Author"}</span>
                {pubYear && <><span className="bd-byline-dot">·</span><span className="bd-byline-year">{pubYear}</span></>}
              </div>

              <div className="bd-stats-row" />

              <div className="bd-actions bd-actions-tight">
                <button onClick={handleRead} disabled={!uploadId} className="bd-btn-primary">
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
                    {bookmarkLoading ? <Spinner /> : bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
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
          from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to   { opacity: 0; transform: translateX(-50%) translateY(-16px); }
        }
      `}</style>
    </>
  );
};

export default BookDetails;