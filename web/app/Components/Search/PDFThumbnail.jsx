"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * PDFThumbnail
 *
 * Renders the first page of a PDF upload as a cover image using PDF.js.
 *
 * Props:
 *   uploadId   – the `upload_id` returned by the search API
 *   title      – used for alt text / aria-label
 *   className  – optional class override for the wrapper
 *   style      – optional inline styles for the wrapper
 *
 * It fetches the PDF from:
 *   GET /api/uploads/:uploadId/file
 *   (Authorization: Bearer <token> if present in localStorage/sessionStorage)
 *
 * Adjust the URL below if your endpoint differs.
 */

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

// PDF.js CDN — loaded once globally
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let pdfjsLoadPromise = null;

function loadPdfJs() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (pdfjsLoadPromise) return pdfjsLoadPromise;

  pdfjsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PDFJS_CDN;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      resolve(window.pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return pdfjsLoadPromise;
}

export default function PDFThumbnail({ uploadId, title = "Book cover", style, className }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  useEffect(() => {
    if (!uploadId) return;

    let cancelled = false;
    setStatus("loading");

    async function render() {
      try {
        const pdfjs = await loadPdfJs();
        if (cancelled) return;

        // Stream the PDF for preview (does not increment download_count)
        const pdfUrl = `${API_BASE}/api/uploads/${uploadId}/preview`;

        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch the PDF as an ArrayBuffer so we can pass auth headers
        const res = await fetch(pdfUrl, { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        const pdf = await pdfjs.getDocument({ data: buffer }).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Scale to fit the canvas width (retina-aware)
        const desiredWidth = canvas.parentElement?.clientWidth || 170;
        const deviceRatio  = window.devicePixelRatio || 1;
        const viewport     = page.getViewport({ scale: 1 });
        const scale        = (desiredWidth / viewport.width) * deviceRatio;
        const scaled       = page.getViewport({ scale });

        canvas.width  = scaled.width;
        canvas.height = scaled.height;
        canvas.style.width  = `${scaled.width  / deviceRatio}px`;
        canvas.style.height = `${scaled.height / deviceRatio}px`;

        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport: scaled }).promise;
        if (cancelled) return;

        setStatus("done");
      } catch (err) {
        if (!cancelled) {
          console.warn("[PDFThumbnail] render failed:", err);
          setStatus("error");
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [uploadId]);

  // ── Wrapper keeps the 3:4 book-cover aspect ratio ──────────────────────
  const wrapperStyle = {
    position: "relative",
    width: "100%",
    aspectRatio: "3/4",
    background: "#f6f8ff",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  return (
    <div style={wrapperStyle} className={className} aria-label={title}>

      {/* Loading shimmer */}
      {status === "loading" && (
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, #f0f4ff 25%, #e0e7ff 50%, #f0f4ff 75%)",
            backgroundSize: "200% 100%",
            animation: "pdf-shimmer 1.4s infinite",
          }}
        />
      )}

      {/* Canvas — hidden until rendered */}
      <canvas
        ref={canvasRef}
        style={{
          display: status === "done" ? "block" : "none",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Fallback icon */}
      {(status === "idle" || status === "error" || !uploadId) && (
        <div style={{ color: "#c7d2e7" }}>
          <BookOpen size={32} />
        </div>
      )}

      {/* Shimmer keyframes — injected once */}
      <style>{`
        @keyframes pdf-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}