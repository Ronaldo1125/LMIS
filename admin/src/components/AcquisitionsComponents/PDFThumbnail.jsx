"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen } from "lucide-react";

const API_BASE = "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || null;
}

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
  const wrapperRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  useEffect(() => {
    if (!uploadId) return;

    let cancelled = false;
    setStatus("loading");

    async function render() {
      try {
        const pdfjs = await loadPdfJs();
        if (cancelled) return;

        const pdfUrl = `${API_BASE}/api/uploads/${uploadId}/preview`;

        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

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

        // Use the full wrapper dimensions for high-res rendering
        const wrapper = wrapperRef.current;
        const desiredWidth = wrapper?.clientWidth || 300;
        const desiredHeight = wrapper?.clientHeight || 400;
        const deviceRatio = window.devicePixelRatio || 1;

        const viewport = page.getViewport({ scale: 1 });

        // Scale to fill the container (cover behavior)
        const scaleX = (desiredWidth / viewport.width) * deviceRatio;
        const scaleY = (desiredHeight / viewport.height) * deviceRatio;
        const scale = Math.max(scaleX, scaleY);

        const scaled = page.getViewport({ scale });

        canvas.width = scaled.width;
        canvas.height = scaled.height;
        // Always fill the wrapper — CSS handles clipping via overflow:hidden
        canvas.style.width = "100%";
        canvas.style.height = "100%";

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

  const wrapperStyle = {
    position: "relative",
    width: "100%",
    height: "100%",        // ← fill parent height, not just aspect-ratio
    aspectRatio: "3/4",    // fallback if parent has no explicit height
    background: "#f6f8ff",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  return (
    <div ref={wrapperRef} style={wrapperStyle} className={className} aria-label={title}>

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

      <style>{`
        @keyframes pdf-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}