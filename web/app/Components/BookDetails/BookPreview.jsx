"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { AlignJustify, Columns, ZoomOut, ZoomIn } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

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
    if (!uploadId) { setFetchStatus("error"); return; }
    let cancelled = false;
    setFetchStatus("loading");
    (async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/api/uploads/${uploadId}/preview`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Cache-Control": "no-store",
          },
          cache: "no-store",
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
      setBlobUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
    };
  }, [uploadId]);

  const clamp = s => Math.min(Math.max(s, 0.4), 2);
  const baseW = areaW > 0 ? areaW - 40 : 700;
  const pageW = twoUp ? Math.floor((baseW - 4) / 2) : baseW;
  const scaledW = Math.round(pageW * clamp(scale));
  const totalPrev = numPages ? Math.min(5, numPages) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#e8e8e8" }}>
      <div style={{
        height: 42, padding: "0 12px", display: "flex", alignItems: "center", gap: 6,
        background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderBottom: "1px solid #f4f4f4"
      }}>
        <span style={{ flex: 1, fontSize: 12, color: "#111", opacity: 0.6, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {title}
        </span>
        <button onClick={() => setTwoUp(false)}><AlignJustify size={12} strokeWidth={1.5} /></button>
        <button onClick={() => setTwoUp(true)}><Columns size={12} strokeWidth={1.5} /></button>
        <button onClick={() => setScale(s => clamp(s - 0.1))}><ZoomOut size={12} strokeWidth={1.5} /></button>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => clamp(s + 0.1))}><ZoomIn size={12} strokeWidth={1.5} /></button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "50px 0 80px" }}>
        <div style={{ width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {fetchStatus === "loading" && <div style={{ marginTop: 100, color: "#999" }}>Loading preview...</div>}
          {(fetchStatus === "error" || pdfError) && <div style={{ marginTop: 100, color: "#999" }}>Preview unavailable</div>}
          {blobUrl && (
            <Document
              file={blobUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => setPdfError(true)}
            >
              {Array.from({ length: totalPrev }, (_, i) => i + 1).map(n => (
                <div key={n} style={{ marginBottom: 32, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                  <Page pageNumber={n} width={scaledW} renderTextLayer={false} renderAnnotationLayer={false} />
                  {n === totalPrev && numPages > 5 && (
                    <div style={{
                      position: "relative", height: 120, marginTop: -120,
                      background: "linear-gradient(to top, white, transparent)",
                      display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 20
                    }}>
                      <button onClick={onReadClick} style={{ padding: "8px 18px", borderRadius: 999, background: "#111", color: "#fff", border: "none", fontSize: 12, cursor: "pointer" }}>
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

      <div style={{ height: 40, display: "flex", alignItems: "center", padding: "0 12px", background: "rgba(255,255,255,0.7)", borderTop: "1px solid #f4f4f4" }}>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>{totalPrev} pages preview</span>
      </div>
    </div>
  );
};

export default BookPreview;