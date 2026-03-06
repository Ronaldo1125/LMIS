import React, { useState, useEffect } from "react";
import RelatedBooks from "./RelatedBooks";
import Nav from "../Nav/Nav";
import dynamic from "next/dynamic";
const PDFReader = dynamic(() => import("../PDFReader/PDFReader"), { ssr: false });
import { BookOpen, Download } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

// ── PDF Thumbnail Preview ──────────────────────────────────────────────────────
const BookThumbnailPreview = ({ uploadId, fallbackImage, title, className = "" }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!uploadId) { setStatus("error"); return; }

    let cancelled = false;
    setStatus("loading");

    const fetchPdf = async () => {
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_BASE_URL}/api/uploads/${uploadId}/preview`, { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        if (cancelled) return;

        setBlobUrl(URL.createObjectURL(blob));
        setStatus("done");
      } catch (err) {
        if (!cancelled) {
          console.warn("[BookThumbnailPreview] fetch failed:", err);
          setStatus("error");
        }
      }
    };

    fetchPdf();
    return () => {
      cancelled = true;
      setBlobUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    };
  }, [uploadId]);

  if (status === "idle" || status === "loading") {
    return (
      <div className={`relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
          <BookOpen size={32} />
          <span className="text-xs">Loading preview…</span>
        </div>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    );
  }

  if (status === "error" || !blobUrl) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
        {fallbackImage ? (
          <img src={fallbackImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <BookOpen size={40} />
            <span className="text-xs text-gray-400">No preview available</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg overflow-hidden flex flex-col ${className}`}>
      <div className="flex-1 overflow-hidden">
        <iframe
          src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH`}
          className="w-full h-full border-0 pointer-events-none"
          title={title}
          onError={() => setStatus("error")}
        />
      </div>
      <div className="flex items-center justify-center gap-2 py-2 bg-gray-900 border-t border-gray-700">
        <BookOpen size={12} className="text-gray-500" />
        <span className="text-xs text-gray-500 tracking-wide">Preview · Click Read for full access</span>
      </div>
    </div>
  );
};

// ── Main BookDetails ───────────────────────────────────────────────────────────
const BookDetails = ({ bookId }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloadCount, setDownloadCount] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      setLoading(true);
      setError(null);

      try {
        const token = getToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/api/book-details/${bookId}`, { headers });

        if (!res.ok) {
          if (res.status === 403) throw new Error("Access denied. You don't have permission to view this book.");
          else if (res.status === 404) throw new Error("Book not found.");
          else throw new Error("Failed to fetch book details.");
        }

        const data = await res.json();
        setBook(data);

        if (data.upload?.download_count != null) {
          setDownloadCount(data.upload.download_count);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // ── Download: authenticated fetch → blob → save
  // The /api/uploads/:id/download route already increments download_count,
  // so we do NOT call /api/books/:id/download-click to avoid double-counting.
  const handleDownloadBook = async () => {
    if (!book?.upload?.id || downloading) return;
    setDownloading(true);

    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE_URL}/api/uploads/${book.upload.id}/download`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const filename = book.upload.original_name || `${book.title}.pdf`;

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.click();

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);

      // Optimistically update the local count since the backend already incremented it
      setDownloadCount((prev) => (prev ?? 0) + 1);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleBookmark = () => console.log("Bookmark to be implemented");

  if (loading) {
    return (
      <>
        <Nav />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading book details...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <div className="flex justify-center items-center h-96 flex-col gap-4">
          <div className="text-red-500 text-lg font-medium">{error}</div>
          <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-800 text-sm underline">
            Go back
          </button>
        </div>
      </>
    );
  }

  if (!book) return null;

  const uploadId = book.upload?.id || null;
  const coverImage = "/assets/BooksImages/2.avif";
  const accessionNo = book.accession?.accession_no || "—";
  const isAvailable = book.copies > 0;

  return (
    <>
      <Nav />
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 py-8 font-sans">

          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-800 text-sm transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Books
            </button>
          </div>

          <div className="bg-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">

              {/* Left: PDF thumbnail */}
              <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-[600px]">
                  <BookThumbnailPreview
                    uploadId={uploadId}
                    fallbackImage={coverImage}
                    title={book.title}
                    className="h-[700px]"
                  />
                </div>
              </div>

              {/* Right: Info */}
              <div className="flex flex-col">
                <h1 className="text-4xl font-semibold text-gray-900 leading-tight">{book.title}</h1>

                <div className="mt-2 text-gray-500 text-sm">
                  <span className="font-medium text-gray-700">{book.author}</span>
                  {book.date_of_publication && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{new Date(book.date_of_publication).getFullYear()}</span>
                    </>
                  )}
                </div>

                {/* Download count badge */}
                {downloadCount != null && downloadCount > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-gray-400 text-xs">
                    <Download size={13} />
                    <span>
                      {downloadCount.toLocaleString()} download{downloadCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-5">
                  <div className="flex gap-3 w-full max-w-2xl">
                    <button
                      onClick={() => setShowModal(true)}
                      disabled={!uploadId}
                      className="flex-1 px-12 py-3 text-sm font-semibold rounded bg-orange-600 text-white hover:bg-orange-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Read
                    </button>
                    <button
                      onClick={handleDownloadBook}
                      disabled={!uploadId || downloading}
                      className="flex-1 px-12 py-3 text-sm font-semibold rounded bg-gray-900 text-white hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {downloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Downloading…
                        </>
                      ) : (
                        "Download"
                      )}
                    </button>
                    <button
                      onClick={handleBookmark}
                      className="px-6 py-3 text-sm font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                      isAvailable ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${isAvailable ? "bg-green-500" : "bg-red-500"}`} />
                      {isAvailable ? "Available" : "Currently Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Book metadata */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm">
                    <InfoRow label="Author"           value={book.author || "—"} />
                    <InfoRow label="Editor"           value={book.editor || "—"} />
                    <InfoRow label="Edition"          value={book.edition || "—"} />
                    <InfoRow label="Publisher"        value={book.publisher || "—"} />
                    <InfoRow label="Publication Date" value={book.date_of_publication
                      ? new Date(book.date_of_publication).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                      : "—"} />
                    <InfoRow label="ISBN"             value={book.isbn || "—"} />
                    <InfoRow label="ISSN"             value={book.issn || "—"} />
                    <InfoRow label="Category"         value={book.category || "—"} />
                    <InfoRow label="Call Number"      value={book.call_number || "—"} />
                    <InfoRow label="Subjects"         value={book.subjects || "—"} />
                    <InfoRow label="Extent"           value={book.extent || "—"} />
                    <InfoRow label="Copies"           value={book.copies ?? "—"} />
                    <InfoRow label="Accession No."    value={accessionNo} />
                    {book.accession?.date_accessioned && (
                      <InfoRow
                        label="Date Accessioned"
                        value={new Date(book.accession.date_accessioned).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      />
                    )}
                    {book.access_level && (
                      <InfoRow label="Access Level" value={book.access_level === "staff_only" ? "Staff Only" : "Public"} />
                    )}
                    {book.upload && (
                      <>
                        <InfoRow label="File Type" value={book.upload.file_type?.toUpperCase() || "—"} />
                        {downloadCount != null && (
                          <InfoRow label="Downloads" value={downloadCount.toLocaleString()} />
                        )}
                      </>
                    )}
                  </div>

                  {book.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{book.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <RelatedBooks currentBook={book} />
        </div>
      </div>

      {/* Read Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{book.title || "Book Preview"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
            </div>
            <div className="h-[75vh]">
              <PDFReader
                uploadId={uploadId}
                fallbackImage={coverImage}
                title={book.title}
                className="h-[700px]"
                maxPages={5}
              />
            </div>
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                Reading preview only. Use Download button for full access.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-gray-100 pb-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}

export default BookDetails;