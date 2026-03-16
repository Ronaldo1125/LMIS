"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import RelatedBooks from "./RelatedBooks";
import Nav from "../Nav/Nav";
import dynamic from "next/dynamic";
import { BookOpen, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

const FullScreenPDFReader = dynamic(
  () => import("../PDFReader/PDFReader"),
  { ssr: false }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

// ─── PDF.js loader ────────────────────────────────────────────────────────────
let _pdfJsPromise = null;
function loadPdfJs() {
  if (_pdfJsPromise) return _pdfJsPromise;
  _pdfJsPromise = new Promise((resolve, reject) => {
    const BASE = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174";
    const done = () => {
      const lib = window["pdfjs-dist/build/pdf"];
      if (!lib) { _pdfJsPromise = null; reject(new Error("PDF.js global missing")); return; }
      lib.GlobalWorkerOptions.workerSrc = `${BASE}/pdf.worker.min.js`;
      resolve(lib);
    };
    if (window["pdfjs-dist/build/pdf"]) { done(); return; }
    const existing = document.querySelector("script[data-pdfjs]");
    if (existing) { existing.addEventListener("load", done); return; }
    const s = document.createElement("script");
    s.src = `${BASE}/pdf.min.js`;
    s.setAttribute("data-pdfjs", "true");
    s.onload = done;
    s.onerror = () => { _pdfJsPromise = null; reject(new Error("CDN load failed")); };
    document.head.appendChild(s);
  });
  return _pdfJsPromise;
}

// ─── Single canvas page ───────────────────────────────────────────────────────
function BpCanvas({ pdfDoc, pageNum, scale, style }) {
  const ref     = useRef(null);
  const taskRef = useRef(null);
  const lastKey = useRef("");

  useEffect(() => {
    if (!pdfDoc || !pageNum || pageNum < 1 || pageNum > pdfDoc.numPages) return;
    const k = `${pageNum}@${scale.toFixed(3)}`;
    if (lastKey.current === k) return;
    lastKey.current = k;
    let dead = false;

    (async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const vp   = page.getViewport({ scale });
        const c    = ref.current;
        if (!c || dead) return;
        c.width  = vp.width;
        c.height = vp.height;
        if (taskRef.current) taskRef.current.cancel();
        taskRef.current = page.render({ canvasContext: c.getContext("2d"), viewport: vp });
        await taskRef.current.promise;
      } catch (e) {
        if (e?.name !== "RenderingCancelledException") console.warn(e);
      }
    })();
    return () => { dead = true; if (taskRef.current) taskRef.current.cancel(); };
  }, [pdfDoc, pageNum, scale]);

  return <canvas ref={ref} style={{ display: "block", ...style }} />;
}

// ─── Flip CSS (injected once) ─────────────────────────────────────────────────
const BP_CSS = `
  @keyframes bpspin { to { transform: rotate(360deg) } }
  @keyframes bp-rtl  { from{transform:rotateY(0)} to{transform:rotateY(-180deg)} }
  @keyframes bp-ltr  { from{transform:rotateY(0)} to{transform:rotateY(180deg)}  }
  .bp-flip-card {
    position:absolute; top:0; bottom:0; width:50%;
    transform-style:preserve-3d; will-change:transform;
    pointer-events:none; z-index:20;
  }
  .bp-flip-card.r { right:0; transform-origin:left center; }
  .bp-flip-card.l { left:0;  transform-origin:right center; }
  .bp-face {
    position:absolute; inset:0;
    backface-visibility:hidden; -webkit-backface-visibility:hidden;
    overflow:hidden; background:#fff;
  }
  .bp-face.back { transform:rotateY(180deg); }
  .bp-sheen {
    position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(110deg,rgba(255,255,255,.14) 0%,rgba(255,255,255,.02) 45%,rgba(0,0,0,.07) 100%);
  }
  .bp-rtl { animation:bp-rtl .50s cubic-bezier(.645,.045,.355,1) forwards; }
  .bp-ltr { animation:bp-ltr .50s cubic-bezier(.645,.045,.355,1) forwards; }
  .bp-scroll-area::-webkit-scrollbar { width:3px }
  .bp-scroll-area::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:2px }
`;
function injectBpCss() {
  if (typeof document === "undefined" || document.getElementById("bp-css")) return;
  const s = document.createElement("style"); s.id = "bp-css"; s.textContent = BP_CSS;
  document.head.appendChild(s);
}

const PREVIEW_PAGES = 5;
const BV = { DOUBLE: "double", SCROLL: "scroll" };

// ─── BookPreview ──────────────────────────────────────────────────────────────
const BookPreview = ({ uploadId, title, onReadClick }) => {
  const [pdfDoc,   setPdfDoc]   = useState(null);
  const [status,   setStatus]   = useState("loading");
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [scale,    setScale]    = useState(0.6);
  const [view,     setView]     = useState(BV.DOUBLE);
  const [pageSize, setPageSize] = useState(null); // { w, h } at scale=1
  // Flip state
  const [flipDir,  setFlipDir]  = useState(null);
  const [snapPage, setSnapPage] = useState(null);
  const flipping = useRef(false);

  const containerRef = useRef(null);
  const pageRefs     = useRef({});

  useEffect(() => { injectBpCss(); }, []);

  // ── Load PDF ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!uploadId) { setStatus("error"); return; }
    let dead = false;
    setStatus("loading");
    (async () => {
      try {
        const lib   = await loadPdfJs();
        const token = getToken();
        const res   = await fetch(`${API_BASE_URL}/api/uploads/${uploadId}/preview`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        if (dead) return;
        const doc = await lib.getDocument({ data: buf }).promise;
        if (dead) return;
        setPdfDoc(doc);
        setTotal(doc.numPages);

        // Store natural page size (at scale=1) for auto-fit
        const p0  = await doc.getPage(1);
        const vp0 = p0.getViewport({ scale: 1 });
        setPageSize({ w: vp0.width, h: vp0.height });

        setStatus("ready");
      } catch (e) {
        if (!dead) { console.warn(e); setStatus("error"); }
      }
    })();
    return () => { dead = true; };
  }, [uploadId]);

  // ── Auto-fit scale whenever container resizes or pageSize is known ──────────
  const computeScale = useCallback(() => {
    if (!pageSize || !containerRef.current) return;
    const el = containerRef.current;
    // Use getBoundingClientRect for accurate rendered dimensions
    const rect = el.getBoundingClientRect();
    const W = rect.width  || el.clientWidth;
    const H = rect.height || el.clientHeight;
    const availH = H - 38 - 40; // minus top bar (38) + bottom bar (40)
    if (availH <= 0 || W <= 0) return;
    const scaleByW = view === BV.DOUBLE
      ? (W * 0.46) / pageSize.w
      : (W * 0.88) / pageSize.w;
    const scaleByH = (availH * 0.90) / pageSize.h;
    const s = Math.max(0.12, Math.min(scaleByW, scaleByH, 3));
    setScale(+(s.toFixed(3)));
  }, [pageSize, view]);

  useEffect(() => {
    // Delay one frame so the container has its final rendered size
    const id = requestAnimationFrame(() => computeScale());
    return () => cancelAnimationFrame(id);
  }, [computeScale]);

  // Re-fit on window resize
  useEffect(() => {
    const handler = () => computeScale();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [computeScale]);

  const maxPage = Math.min(PREVIEW_PAGES, total);

  // ── Flip logic ──────────────────────────────────────────────────────────────
  const sL = snapPage ?? page;
  const sR = sL + 1 <= maxPage ? sL + 1 : null;
  const canFlipNext = page + 2 <= maxPage;
  const canFlipPrev = page > 1;

  const flipNext = () => {
    if (flipping.current || !canFlipNext) return;
    flipping.current = true; setSnapPage(page); setFlipDir("next");
  };
  const flipPrev = () => {
    if (flipping.current || !canFlipPrev) return;
    flipping.current = true; setSnapPage(page); setFlipDir("prev");
  };
  const onFlipEnd = () => {
    if (flipDir === "next") setPage(p => Math.min(maxPage, p + 2));
    if (flipDir === "prev") setPage(p => Math.max(1, p - 2));
    setFlipDir(null); setSnapPage(null); flipping.current = false;
  };
  const frontPage = flipDir === "next" ? sR  : sL;
  const backPage  = flipDir === "next"
    ? (sL + 2 <= maxPage ? sL + 2 : null)
    : (sL - 1 >= 1 ? sL - 1 : null);

  // ── Scroll nav ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (view !== BV.SCROLL) return;
    const el = pageRefs.current[page];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page, view]);

  const zoomIn  = () => setScale(s => Math.min(+(s + 0.1).toFixed(3), 3));
  const zoomOut = () => setScale(s => Math.max(+(s - 0.1).toFixed(3), 0.15));

  const pageLabel = view === BV.DOUBLE && sR
    ? `${page}–${page + 1} / ${maxPage}`
    : `${page} / ${maxPage}`;

  const isLastPreview = (n) => n === maxPage && total > PREVIEW_PAGES;

  // ── Preview CTA overlay ─────────────────────────────────────────────────────
  const PreviewBanner = () => (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: "44%",
      background: "linear-gradient(to top, rgba(17,17,17,.97) 40%, transparent)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "flex-end", paddingBottom: 16, gap: 8, zIndex: 10,
    }}>
      <span style={{ color: "#666", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        This is a preview
      </span>
      <button onClick={onReadClick} style={{
        padding: "7px 20px", background: "#fff", color: "#111",
        border: "none", borderRadius: 4, fontSize: 11,
        fontWeight: 600, cursor: "pointer",
      }}>
        Read Full Book
      </button>
    </div>
  );

  const barBg  = "#111";
  const barBdr = "#2c2c2c";

  const iconBtn = (onClick, disabled, title, children) => (
    <button
      onClick={onClick} disabled={disabled} title={title}
      style={{
        background: "none", border: "none", padding: "2px 4px",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "#3a3a3a" : "#888",
        display: "flex", alignItems: "center", flexShrink: 0,
        transition: "color .12s",
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.color = disabled ? "#3a3a3a" : "#888"; }}
    >
      {children}
    </button>
  );

  const viewBtn = (v, children, label) => (
    <button
      onClick={() => setView(v)} title={label}
      style={{
        background: view === v ? "rgba(255,255,255,.15)" : "none",
        border: "none", padding: "3px 5px", borderRadius: 4,
        cursor: "pointer", color: view === v ? "#fff" : "#777",
        display: "flex", alignItems: "center", flexShrink: 0,
        transition: "color .12s",
      }}
      onMouseEnter={e => { if (view !== v) e.currentTarget.style.color = "#ccc"; }}
      onMouseLeave={e => { e.currentTarget.style.color = view === v ? "#fff" : "#777"; }}
    >
      {children}
    </button>
  );

  return (
    <div ref={containerRef} style={{
      display: "flex", flexDirection: "column",
      width: "100%", height: "100%",
      background: "#1c1c1c",
      border: "1px solid #2c2c2c",
      borderRadius: 8, overflow: "hidden",
      fontFamily: "system-ui, sans-serif",
      userSelect: "none",
      minHeight: 0, // allows flex children to shrink properly
    }}>

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 38, padding: "0 12px", flexShrink: 0,
        background: barBg, borderBottom: `1px solid ${barBdr}`,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{
          color: "#777", fontSize: 11, letterSpacing: "0.03em",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          maxWidth: "55%", textAlign: "center",
        }}>
          {title}
        </span>
        <span style={{ color: "#555", fontSize: 10 }}>
          {status === "ready" ? "Preview" : ""}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", background: "#3a3a3a", position: "relative", minHeight: 0 }}>

        {/* Loading */}
        {status === "loading" && (
          <div style={{ height:"100%",display:"flex",flexDirection:"column",
            alignItems:"center",justifyContent:"center",gap:10,color:"#666" }}>
            <div style={{ width:26,height:26,border:"3px solid #333",borderTopColor:"#888",
              borderRadius:"50%",animation:"bpspin 0.9s linear infinite" }} />
            <span style={{ fontSize:12 }}>Loading preview…</span>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={{ height:"100%",display:"flex",flexDirection:"column",
            alignItems:"center",justifyContent:"center",gap:8,color:"#555" }}>
            <BookOpen size={32} style={{ opacity:0.35 }} />
            <span style={{ fontSize:12 }}>Preview unavailable</span>
          </div>
        )}

        {/* Scroll mode */}
        {status === "ready" && pdfDoc && view === BV.SCROLL && (
          <div className="bp-scroll-area"
            style={{ height:"100%", overflowY:"scroll", padding:"16px 0" }}>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:12 }}>
              {Array.from({ length: maxPage }, (_, i) => i + 1).map(n => (
                <div key={n}
                  ref={el => { pageRefs.current[n] = el; }}
                  style={{ boxShadow:"0 6px 28px rgba(0,0,0,.55)",lineHeight:0,
                    background:"#fff",position:"relative" }}>
                  <BpCanvas pdfDoc={pdfDoc} pageNum={n} scale={scale} />
                  {isLastPreview(n) && <PreviewBanner />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-page flip mode */}
        {status === "ready" && pdfDoc && view === BV.DOUBLE && (
          <div style={{
            height:"100%", perspective:"2200px",
            display:"flex",alignItems:"center",justifyContent:"center",
            position:"relative",
          }}>
            <div style={{
              display:"flex",alignItems:"stretch",position:"relative",
              filter:"drop-shadow(0 14px 40px rgba(0,0,0,.70))",
            }}>
              {/* Left page */}
              <div style={{ background:"#fff",lineHeight:0,position:"relative",zIndex:1 }}>
                {sL && <BpCanvas pdfDoc={pdfDoc} pageNum={sL} scale={scale} />}
                {sL && isLastPreview(sL) && !flipDir && <PreviewBanner />}
                <div style={{ position:"absolute",inset:"0 0 0 auto",width:18,pointerEvents:"none",
                  background:"linear-gradient(to right,transparent,rgba(0,0,0,.18))" }} />
              </div>
              {/* Right page */}
              <div style={{ background:"#fff",lineHeight:0,position:"relative",zIndex:1,minWidth:1 }}>
                {sR
                  ? <BpCanvas pdfDoc={pdfDoc} pageNum={sR} scale={scale} />
                  : <div style={{ width:"100%",height:"100%",background:"#f4f3ee" }} />}
                <div style={{ position:"absolute",inset:"0 auto 0 0",width:18,pointerEvents:"none",
                  background:"linear-gradient(to left,transparent,rgba(0,0,0,.14))" }} />
                {sR && isLastPreview(sR) && !flipDir && <PreviewBanner />}
              </div>

              {/* Flip card */}
              {flipDir && (
                <div
                  className={`bp-flip-card ${flipDir==="next"?"r bp-rtl":"l bp-ltr"}`}
                  onAnimationEnd={onFlipEnd}
                >
                  <div className="bp-face">
                    {frontPage && <BpCanvas pdfDoc={pdfDoc} pageNum={frontPage} scale={scale}
                      style={{ width:"100%",height:"100%" }} />}
                    <div className="bp-sheen" />
                  </div>
                  <div className="bp-face back">
                    {backPage && <BpCanvas pdfDoc={pdfDoc} pageNum={backPage} scale={scale}
                      style={{ width:"100%",height:"100%" }} />}
                    <div className="bp-sheen" style={{ transform:"scaleX(-1)" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Edge click zones */}
            {!flipDir && (
              <>
                <button onClick={flipPrev} disabled={!canFlipPrev}
                  style={{ position:"absolute",left:0,top:0,bottom:0,width:"14%",
                    background:"transparent",border:"none",zIndex:30,
                    cursor:canFlipPrev?"pointer":"default" }} />
                <button onClick={flipNext} disabled={!canFlipNext}
                  style={{ position:"absolute",right:0,top:0,bottom:0,width:"14%",
                    background:"transparent",border:"none",zIndex:30,
                    cursor:canFlipNext?"pointer":"default" }} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div style={{
        display:"flex",alignItems:"center",height:40,padding:"0 8px",
        background:barBg,borderTop:`1px solid ${barBdr}`,
        gap:2,flexShrink:0,
      }}>
        <span style={{ color:"#555",fontSize:10,whiteSpace:"nowrap",minWidth:52,flexShrink:0 }}>
          p.{pageLabel}
        </span>

        <input type="range" min={1} max={maxPage||1} value={page}
          onChange={e => {
            const v = +e.target.value;
            const t = view===BV.DOUBLE ? (v%2===0?v-1:v) : v;
            setPage(Math.max(1, Math.min(maxPage, t)));
          }}
          style={{ flex:1,minWidth:20,height:3,accentColor:"#fff",cursor:"pointer" }}
        />

        {iconBtn(view===BV.DOUBLE?flipPrev:()=>setPage(p=>Math.max(1,p-1)), page<=1, "Previous",
          <ChevronLeft size={13} strokeWidth={1.8} />)}
        {iconBtn(view===BV.DOUBLE?flipNext:()=>setPage(p=>Math.min(maxPage,p+1)), page>=maxPage, "Next",
          <ChevronRight size={13} strokeWidth={1.8} />)}

        <div style={{ width:1,height:14,background:"rgba(255,255,255,.1)",margin:"0 2px",flexShrink:0 }} />

        {viewBtn(BV.DOUBLE,
          <svg width="14" height="12" viewBox="0 0 17 14" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="0.8" y="0.8" width="6.5" height="12.4" rx="0.5"/>
            <rect x="9.7" y="0.8" width="6.5" height="12.4" rx="0.5"/>
          </svg>,
          "Two pages"
        )}
        {viewBtn(BV.SCROLL,
          <svg width="12" height="13" viewBox="0 0 13 16" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="1" y="1" width="11" height="14" rx="0.5"/>
            <line x1="3" y1="5" x2="10" y2="5"/>
            <line x1="3" y1="8" x2="10" y2="8"/>
            <line x1="3" y1="11" x2="8" y2="11"/>
          </svg>,
          "Scroll"
        )}

        <div style={{ width:1,height:14,background:"rgba(255,255,255,.1)",margin:"0 2px",flexShrink:0 }} />

        {iconBtn(zoomOut, scale<=0.15, "Zoom out", <ZoomOut size={13} strokeWidth={1.8} />)}
        <span style={{ color:"#555",fontSize:9,width:24,textAlign:"center",flexShrink:0 }}>
          {Math.round(scale*100)}%
        </span>
        {iconBtn(zoomIn, scale>=3, "Zoom in", <ZoomIn size={13} strokeWidth={1.8} />)}
      </div>
    </div>
  );
};

// ─── Main BookDetails ─────────────────────────────────────────────────────────
const BookDetails = ({ bookId }) => {
  const [book,          setBook]          = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [showReader,    setShowReader]    = useState(false);
  const [downloadCount, setDownloadCount] = useState(null);
  const [downloading,   setDownloading]   = useState(false);
  const [bookmarked,    setBookmarked]    = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = showReader ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showReader]);

  const handleDownloadBook = async () => {
    if (!book?.upload?.id || downloading) return;
    setDownloading(true);
    try {
      const token = getToken();
      const res   = await fetch(`${API_BASE_URL}/api/uploads/${book.upload.id}/download`, {
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
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading book details...</span>
        </div>
      </div>
    </>
  );

  if (error) return (
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

  if (!book) return null;

  const uploadId    = book.upload?.id || null;
  const coverImage  = "/assets/BooksImages/2.avif";
  const accessionNo = book.accession?.accession_no || "—";
  const isAvailable = book.copies > 0;

  return (
    <>
      <Nav />
      <div className="bg-white">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 sm:py-8 font-sans">

          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-800 text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Books
            </button>
          </div>

          {/* Main grid — stacks on mobile, side-by-side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-10">

            {/* ── Left: Preview ── */}
            <div className="w-full">
              {uploadId ? (
                <div className="w-full">
                  <style>{`
                    .bp-preview-wrapper {
                      width: 100%;
                      /* Mobile: taller aspect ratio so toolbar + pages all fit */
                      aspect-ratio: 1.2 / 1;
                      min-height: 320px;
                    }
                    @media (min-width: 640px) {
                      .bp-preview-wrapper {
                        aspect-ratio: 1.35 / 1;
                        min-height: 380px;
                      }
                    }
                    @media (min-width: 1024px) {
                      .bp-preview-wrapper {
                        aspect-ratio: unset !important;
                        height: 720px !important;
                        min-height: unset !important;
                      }
                    }
                    @media (min-width: 1280px) {
                      .bp-preview-wrapper {
                        height: 800px !important;
                      }
                    }
                  `}</style>
                  <div className="bp-preview-wrapper rounded-lg overflow-hidden">
                    <BookPreview
                      uploadId={uploadId}
                      title={book.title}
                      onReadClick={() => setShowReader(true)}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center"
                  style={{ aspectRatio: "1.35 / 1" }}>
                  <img src={coverImage} alt={book.title} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* ── Right: Info ── */}
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
                {book.title}
              </h1>

              <div className="mt-2 text-gray-500 text-sm">
                <span className="font-medium text-gray-700">{book.author}</span>
                {book.date_of_publication && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{new Date(book.date_of_publication).getFullYear()}</span>
                  </>
                )}
              </div>

              {downloadCount != null && downloadCount > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-gray-400 text-xs">
                  <Download size={13} />
                  <span>{downloadCount.toLocaleString()} download{downloadCount !== 1 ? "s" : ""}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReader(true)}
                    disabled={!uploadId}
                    className="flex-1 py-3 text-sm font-semibold rounded bg-blue-900 text-white hover:bg-blue-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <BookOpen size={15} />
                    Read
                  </button>
                  <button
                    onClick={handleDownloadBook}
                    disabled={!uploadId || downloading}
                    className="flex-1 py-3 text-sm font-semibold rounded bg-gray-900 text-white hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {downloading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Downloading…</>
                    ) : (
                      <><Download size={15} />Download</>
                    )}
                  </button>
                  <button
                    onClick={() => setBookmarked(b => !b)}
                    className={`px-5 py-3 text-sm font-semibold rounded border transition-colors flex items-center justify-center ${
                      bookmarked ? "bg-amber-50 border-amber-300 text-amber-600" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-5 h-5" fill={bookmarked?"currentColor":"none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                    isAvailable ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${isAvailable?"bg-green-500":"bg-red-500"}`} />
                    {isAvailable ? "Available" : "Currently Unavailable"}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-6 border-t border-gray-200 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <InfoRow label="Author"           value={book.author || "—"} />
                  <InfoRow label="Editor"           value={book.editor || "—"} />
                  <InfoRow label="Edition"          value={book.edition || "—"} />
                  <InfoRow label="Publisher"        value={book.publisher || "—"} />
                  <InfoRow label="Publication Date" value={book.date_of_publication
                    ? new Date(book.date_of_publication).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})
                    : "—"} />
                  <InfoRow label="ISBN"         value={book.isbn || "—"} />
                  <InfoRow label="ISSN"         value={book.issn || "—"} />
                  <InfoRow label="Category"     value={book.category || "—"} />
                  <InfoRow label="Call Number"  value={book.call_number || "—"} />
                  <InfoRow label="Subjects"     value={book.subjects || "—"} />
                  <InfoRow label="Extent"       value={book.extent || "—"} />
                  <InfoRow label="Copies"       value={book.copies ?? "—"} />
                  <InfoRow label="Accession No." value={accessionNo} />
                  {book.accession?.date_accessioned && (
                    <InfoRow label="Date Accessioned"
                      value={new Date(book.accession.date_accessioned).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})} />
                  )}
                  {book.access_level && (
                    <InfoRow label="Access Level" value={book.access_level==="staff_only"?"Staff Only":"Public"} />
                  )}
                  {book.upload && (
                    <>
                      <InfoRow label="File Type" value={book.upload.file_type?.toUpperCase()||"—"} />
                      {downloadCount != null && <InfoRow label="Downloads" value={downloadCount.toLocaleString()} />}
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

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}

export default BookDetails;