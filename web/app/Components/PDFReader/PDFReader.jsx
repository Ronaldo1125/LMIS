"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Required: point pdfjs to its worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PDFReader
//
// Props:
//   uploadId     – required, the upload's ID
//   title        – display name
//   fallbackImage – shown on error
//   className    – outer wrapper class
//   maxPages     – if set, only renders up to this many pages (thumbnail mode)
//   showControls – show page nav + zoom bar (default true, auto-false in thumbnail mode)
// ─────────────────────────────────────────────────────────────────────────────
const PDFReader = ({
  uploadId,
  title = "Book Preview",
  fallbackImage,
  className = "",
  maxPages,            // e.g. 5 for thumbnail previews
  showControls,        // undefined = auto
}) => {
  const [blobUrl, setBlobUrl]       = useState(null);
  const [fetchStatus, setFetchStatus] = useState("idle"); // idle | loading | done | error

  const [numPages, setNumPages]     = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale]           = useState(1.0);
  const [pdfError, setPdfError]     = useState(false);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const isThumbnail  = maxPages !== undefined;
  const displayControls = showControls !== undefined ? showControls : !isThumbnail;
  const visiblePages = maxPages ? Math.min(maxPages, numPages ?? maxPages) : numPages;

  // ── Measure container width for responsive Page sizing ─────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Fetch PDF with auth, create blob URL ───────────────────────────────
  useEffect(() => {
    if (!uploadId) return;

    let cancelled = false;
    setFetchStatus("loading");
    setBlobUrl(null);
    setPdfError(false);
    setPageNumber(1);

    const fetchPdf = async () => {
      try {
        const token   = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res     = await fetch(`${API_BASE}/api/uploads/${uploadId}/preview`, { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        if (cancelled) return;

        setBlobUrl(URL.createObjectURL(blob));
        setFetchStatus("done");
      } catch (err) {
        if (!cancelled) {
          console.warn("[PDFReader] fetch failed:", err);
          setFetchStatus("error");
        }
      }
    };

    fetchPdf();

    return () => {
      cancelled = true;
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [uploadId]);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    console.warn("[PDFReader] react-pdf error:", err);
    setPdfError(true);
  }, []);

  const clampedScale = Math.min(Math.max(scale, 0.5), 2.5);

  // ── Loading shimmer ────────────────────────────────────────────────────
  if (fetchStatus === "idle" || fetchStatus === "loading") {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-md bg-gray-100 border border-gray-200 ${className}`}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
            backgroundSize: "200% 100%",
            animation: "pdf-shimmer 1.4s infinite",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
          <BookOpen size={32} />
          <span className="text-xs">Loading PDF…</span>
        </div>
        <style>{`@keyframes pdf-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
      </div>
    );
  }

  // ── Error / fallback ───────────────────────────────────────────────────
  if (fetchStatus === "error" || pdfError || !blobUrl) {
    return (
      <div
        ref={containerRef}
        className={`overflow-hidden rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center ${className}`}
      >
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

  // ── PDF render ─────────────────────────────────────────────────────────
  const pageWidth = containerWidth
    ? Math.min(containerWidth * clampedScale, containerWidth * 2.5)
    : undefined;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col overflow-hidden rounded-md bg-gray-900 border border-gray-700 ${className}`}
    >
      {/* ── Scrollable page area ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Document
          file={blobUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-full py-20">
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Rendering…</span>
              </div>
            </div>
          }
        >
          {isThumbnail ? (
            // Thumbnail mode: render first N pages stacked
            Array.from({ length: visiblePages ?? 1 }, (_, i) => (
              <Page
                key={`thumb-page-${i + 1}`}
                pageNumber={i + 1}
                width={containerWidth || undefined}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="block"
              />
            ))
          ) : (
            // Reader mode: single page with nav
            <Page
              key={`page-${pageNumber}`}
              pageNumber={pageNumber}
              width={pageWidth || containerWidth || undefined}
              renderAnnotationLayer
              renderTextLayer
              className="mx-auto"
            />
          )}
        </Document>
      </div>

      {/* ── Controls (reader mode only) ── */}
      {displayControls && numPages && (
        <div className="flex items-center justify-between gap-4 px-4 py-2 bg-gray-800 border-t border-gray-700 shrink-0">
          {/* Page navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-400 tabular-nums whitespace-nowrap">
              {pageNumber} / {numPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
              disabled={clampedScale <= 0.5}
              className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-xs text-gray-400 tabular-nums w-10 text-center">
              {Math.round(clampedScale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2.5, s + 0.25))}
              disabled={clampedScale >= 2.5}
              className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Thumbnail footer ── */}
      {isThumbnail && (
        <div className="flex items-center justify-center gap-2 py-2 bg-gray-900 border-t border-gray-700 shrink-0">
          <BookOpen size={12} className="text-gray-500" />
          <span className="text-xs text-gray-500 tracking-wide">Preview · Click Read for full access</span>
        </div>
      )}
    </div>
  );
};

export default PDFReader;