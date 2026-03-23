"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

const PDFJS_CDN    = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const CMAP_URL     = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/";

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
  const canvasRef  = useRef(null);
  const wrapperRef = useRef(null);
  const [status, setStatus] = useState("idle");

  // Fallback cover: show title text when PDF can't be rendered
  const FallbackCover = () => (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px 10px",
      boxSizing: "border-box",
      gap: 8,
    }}>
      <BookOpen size={24} color="#9ca3af" strokeWidth={1.2} />
      <span style={{
        color: "#6b7280",
        fontSize: 10,
        fontWeight: 600,
        textAlign: "center",
        lineHeight: 1.3,
        display: "-webkit-box",
        WebkitLineClamp: 4,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {title}
      </span>
    </div>
  );

  useEffect(() => {
    if (!uploadId) return;
    let cancelled = false;
    setStatus("loading");

    async function render() {
      try {
        const pdfjs = await loadPdfJs();
        if (cancelled) return;

        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // FIX 1: cache: "no-store" prevents ERR_CACHE_WRITE_FAILURE
        const res = await fetch(`${API_BASE}/api/uploads/${uploadId}/preview`, {
          headers,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        // FIX 2: provide cMapUrl + cMapPacked to fix font loading warnings
        const pdf = await pdfjs.getDocument({
          data: buffer,
          cMapUrl: CMAP_URL,
          cMapPacked: true,
        }).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas  = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        const deviceRatio = window.devicePixelRatio || 1;
        const PADDING     = 12;
        const containerW  = (wrapper.offsetWidth  || 200) - PADDING;
        const containerH  = (wrapper.offsetHeight || 267) - PADDING;

        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          (containerW * deviceRatio) / viewport.width,
          (containerH * deviceRatio) / viewport.height,
        ) * 0.8;

        const scaled = page.getViewport({ scale });

        canvas.width  = scaled.width;
        canvas.height = scaled.height;
        canvas.style.width  = `${scaled.width  / deviceRatio}px`;
        canvas.style.height = `${scaled.height / deviceRatio}px`;

        await page.render({ canvasContext: canvas.getContext("2d"), viewport: scaled }).promise;

        if (cancelled) return;
        setStatus("done");
      } catch (err) {
        if (!cancelled) {
          console.warn("[PDFThumbnail]", err);
          setStatus("error");
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [uploadId]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#ffffff",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px",
        boxSizing: "border-box",
        ...style,
      }}
      className={className}
      aria-label={title}
    >
      {/* SHIMMER while loading */}
      {status === "loading" && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, #f9fafb 25%, #f3f4f6 50%, #f9fafb 75%)",
          backgroundSize: "200% 100%",
          animation: "pdf-shimmer 1.4s infinite",
        }} />
      )}

      {/* CANVAS when done */}
      <canvas
        ref={canvasRef}
        style={{
          display: status === "done" ? "block" : "none",
          maxWidth: "100%",
          maxHeight: "100%",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)",
          borderRadius: "2px",
        }}
      />

      {/* FALLBACK: show title instead of blank when error or no uploadId */}
      {(status === "error" || status === "idle" || !uploadId) && (
        <FallbackCover />
      )}

      <style>{`
        @keyframes pdf-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}