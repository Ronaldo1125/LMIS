"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

/* ── Theme definitions ── */
const THEMES = {
  light: {
    key: "light",
    label: "Light",
    icon: "☀️",
    bg: "#e8ecf0",
    surface: "#ffffff",
    border: "#e0e0e0",
    text: "#1a1a1a",
    textMuted: "#888888",
    textFaint: "#aaaaaa",
    pageShadow: "0 4px 20px rgba(0,0,0,0.12)",
    pageNumBg: "#f3f4f6",
    pageNumColor: "#444444",
    iconColor: "#333333",
    zoomBtnBg: "#fafafa",
    zoomBtnBorder: "#e0e0e0",
    layoutActiveBg: "#1a1a2e",
    layoutActiveColor: "#ffffff",
    layoutInactiveColor: "#555555",
    layoutGroupBg: "#f3f4f6",
    toggleHoverBg: "#f0f0f0",
  },
  sepia: {
    key: "sepia",
    label: "Sepia",
    icon: "📜",
    bg: "#f0e6d3",
    surface: "#fdf6e3",
    border: "#d4b896",
    text: "#3b2f1e",
    textMuted: "#8a6f4e",
    textFaint: "#b09070",
    pageShadow: "0 4px 20px rgba(80,50,20,0.18)",
    pageNumBg: "#ede0cc",
    pageNumColor: "#5c3d1e",
    iconColor: "#5c3d1e",
    zoomBtnBg: "#fdf6e3",
    zoomBtnBorder: "#c9a87a",
    layoutActiveBg: "#6b3f1a",
    layoutActiveColor: "#fff8ee",
    layoutInactiveColor: "#8a6f4e",
    layoutGroupBg: "#ede0cc",
    toggleHoverBg: "#e8d5be",
  },
  dark: {
    key: "dark",
    label: "Dark",
    icon: "🌙",
    bg: "rgb(18, 18, 18)",
    surface: "rgb(26, 26, 26)",
    border: "rgb(38, 38, 38)",
    text: "#e4e6ed",
    textMuted: "#7a7f8e",
    textFaint: "#555a66",
    pageShadow: "0 4px 24px rgba(0,0,0,0.6)",
    pageNumBg: "rgb(32, 32, 32)",
    pageNumColor: "#c0c4d0",
    iconColor: "#c0c4d0",
    zoomBtnBg: "rgb(32, 32, 32)",
    zoomBtnBorder: "rgb(48, 48, 48)",
    layoutActiveBg: "#4f6ef7",
    layoutActiveColor: "#ffffff",
    layoutInactiveColor: "#7a7f8e",
    layoutGroupBg: "rgb(32, 32, 32)",
    toggleHoverBg: "rgb(32, 32, 32)",
  },
};

/* ── Hook: returns current window width, SSR-safe ── */
function useWindowWidth() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

/* ── SVG icons for each theme ── */
const ThemeIcons = {
  light: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  sepia: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  dark: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

/* ── Theme Toggle — inline 3-button group ── */
function ThemeToggle({ theme, onThemeChange, t }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      background: t.layoutGroupBg,
      border: `1px solid ${t.border}`,
      borderRadius: 8,
      padding: 3,
      gap: 2,
      transition: "background 0.25s, border-color 0.25s",
    }}>
      {Object.values(THEMES).map((th) => {
        const active = theme === th.key;
        return (
          <button
            key={th.key}
            onClick={() => onThemeChange(th.key)}
            title={th.label}
            style={{
              width: 28,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: 5,
              background: active ? t.layoutActiveBg : "transparent",
              color: active ? t.layoutActiveColor : t.layoutInactiveColor,
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {ThemeIcons[th.key]}
          </button>
        );
      })}
    </div>
  );
}

const PDFReader = ({ uploadId, title, author, onClose }) => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth > 0 && windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  /* ── Theme ── */
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("pdfreader-theme") || "light";
  });

  const handleThemeChange = useCallback((key) => {
    setTheme(key);
    try { localStorage.setItem("pdfreader-theme", key); } catch {}
  }, []);

  const t = THEMES[theme];

  const [blobUrl, setBlobUrl]         = useState(null);
  const [status, setStatus]           = useState("loading");
  const [numPages, setNumPages]       = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale]             = useState(isMobile ? 0.45 : 0.6);
  const [twoUp, setTwoUp]             = useState(false);

  const containerRef = useRef(null);
  const pageRefs     = useRef({});
  const observerRef  = useRef(null);
  const [width, setWidth] = useState(0);

  /* ── Disable two-up on mobile automatically ── */
  useEffect(() => {
    if (isMobile && twoUp) setTwoUp(false);
  }, [isMobile, twoUp]);

  /* ── FETCH ── */
  useEffect(() => {
    if (!uploadId) return;
    let cancel = false;
    (async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/uploads/${uploadId}/preview`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        if (!cancel) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setStatus("done");
        }
      } catch { if (!cancel) setStatus("error"); }
    })();
    return () => {
      cancel = true;
      setBlobUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    };
  }, [uploadId]);

  /* ── RESIZE observer ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* ── INTERSECTION observer ── */
  useEffect(() => {
    if (!numPages || !containerRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();
    const visibleRatios = {};
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageNum = Number(entry.target.dataset.page);
          visibleRatios[pageNum] = entry.intersectionRatio;
        });
        let best = 1, bestRatio = -1;
        Object.entries(visibleRatios).forEach(([p, r]) => {
          if (r > bestRatio) { bestRatio = r; best = Number(p); }
        });
        setCurrentPage(best);
      },
      {
        root: containerRef.current,
        threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
      }
    );
    Object.values(pageRefs.current).forEach((el) => {
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current && observerRef.current.disconnect();
  }, [numPages, twoUp]);

  const registerPageRef = useCallback((el, pageNum) => {
    if (!el) return;
    pageRefs.current[pageNum] = el;
    el.dataset.page = pageNum;
    if (observerRef.current) observerRef.current.observe(el);
  }, []);

  /* ── DIMENSIONS ── */
  const clamp     = (s) => Math.min(Math.max(s, 0.2), 3);
  const maxW      = isMobile ? 500 : isTablet ? 720 : 900;
  const baseWidth = Math.min(width || maxW, maxW);
  const pageWidth = twoUp ? (baseWidth - 24) / 2 : baseWidth;
  const finalWidth = pageWidth * scale;

  /* ── PAGE JUMPS ── */
  const effectivePage = twoUp
    ? currentPage % 2 === 0 ? currentPage - 1 : currentPage
    : currentPage;

  const jumpToPage = useCallback((p) => {
    if (!numPages) return;
    const clamped = Math.min(Math.max(1, p), numPages);
    const ref = pageRefs.current[clamped];
    if (ref) ref.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [numPages]);

  const prevPage  = () => jumpToPage(twoUp ? effectivePage - 2 : currentPage - 1);
  const nextPage  = () => jumpToPage(twoUp ? effectivePage + 2 : currentPage + 1);
  const firstPage = () => jumpToPage(1);
  const lastPage  = () => jumpToPage(numPages || 1);

  const atStart = twoUp ? effectivePage <= 1 : currentPage <= 1;
  const atEnd   = twoUp
    ? effectivePage + 2 > (numPages || 1)
    : currentPage >= (numPages || 1);

  /* ── STYLE HELPERS ── */
  const iconBtn = {
    border: "none", background: "transparent", cursor: "pointer",
    padding: 6, borderRadius: 6, display: "flex",
    alignItems: "center", justifyContent: "center", color: t.iconColor,
    transition: "background 0.12s",
  };

  const navBtn = (disabled) => ({
    ...iconBtn,
    width: isMobile ? 32 : 30,
    height: isMobile ? 32 : 30,
    opacity: disabled ? 0.3 : 1,
    cursor: disabled ? "default" : "pointer",
  });

  const layoutBtn = (active) => ({
    height: isMobile ? 32 : 30,
    padding: isMobile ? "0 8px" : "0 11px",
    borderRadius: 6, border: "none",
    background: active ? t.layoutActiveBg : "transparent",
    color: active ? t.layoutActiveColor : t.layoutInactiveColor,
    fontSize: 12, fontWeight: active ? 600 : 400,
    cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
    transition: "background 0.15s, color 0.15s", whiteSpace: "nowrap",
  });

  const zoomBtn = {
    ...iconBtn,
    width: isMobile ? 32 : 30,
    height: isMobile ? 32 : 30,
    border: `1px solid ${t.zoomBtnBorder}`,
    borderRadius: 6,
    background: t.zoomBtnBg,
  };

  /* ── HEADER HEIGHT ── */
  const headerHeight  = isMobile ? 52 : 56;
  const toolbarHeight = isMobile ? 56 : 52;

  /* ── RENDER ── */
  return (
    <div style={{
      position: "fixed", inset: 0, background: t.bg,
      display: "flex", flexDirection: "column",
      zIndex: 9999, fontFamily: "'Segoe UI', system-ui, sans-serif",
      transition: "background 0.25s",
    }}>

      {/* ══ HEADER ══ */}
      <div style={{
        height: headerHeight,
        display: "flex", alignItems: "center",
        padding: isMobile ? "0 10px" : "0 16px",
        background: t.surface,
        borderBottom: `1px solid ${t.border}`,
        gap: isMobile ? 8 : 10,
        flexShrink: 0,
        transition: "background 0.25s, border-color 0.25s",
      }}>
        <button
          onClick={onClose}
          style={{ ...iconBtn, width: 34, height: 34, marginRight: isMobile ? 0 : 4 }}
          title="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: isMobile ? 13 : 14,
            fontWeight: 600,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            color: t.text,
            transition: "color 0.25s",
          }}>
            {title}
          </div>
          {author && !isMobile && (
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1, transition: "color 0.25s" }}>
              {author}
            </div>
          )}
        </div>

        {/* Theme toggle in header */}
        <ThemeToggle theme={theme} onThemeChange={handleThemeChange} t={t} />
      </div>

      {/* ══ PDF SCROLL AREA ══ */}
      <div
        ref={containerRef}
        style={{
          flex: 1, overflowY: "auto",
          display: "flex", justifyContent: "center",
          padding: isMobile ? "16px 8px 12px" : "32px 20px 24px",
          transition: "background 0.25s",
        }}
      >
        <div style={{ width: baseWidth, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {status === "loading" && (
            <div style={{ marginTop: 80, color: t.textMuted, fontSize: 14 }}>Loading PDF…</div>
          )}
          {status === "error" && (
            <div style={{ marginTop: 80, color: "#e03131", fontSize: 14 }}>Failed to load PDF.</div>
          )}

          {blobUrl && (
            <Document
              file={blobUrl}
              onLoadSuccess={({ numPages }) => { setNumPages(numPages); setCurrentPage(1); }}
            >
              {twoUp
                ? Array.from({ length: numPages || 0 }, (_, i) => i + 1)
                    .filter((n) => n % 2 !== 0)
                    .map((n) => (
                      <div
                        key={n}
                        ref={(el) => {
                          if (!el) return;
                          registerPageRef(el, n);
                          if (n + 1 <= (numPages || 0)) registerPageRef(el, n + 1);
                        }}
                        style={{
                          display: "flex", gap: 12, marginBottom: 28,
                          boxShadow: t.pageShadow,
                          borderRadius: 3, overflow: "hidden",
                          // Sepia filter on pages for sepia mode
                          filter: theme === "sepia" ? "sepia(0.35) brightness(0.97)" : "none",
                          transition: "filter 0.25s, box-shadow 0.25s",
                        }}
                      >
                        <Page pageNumber={n} width={finalWidth} />
                        {n + 1 <= (numPages || 0) && <Page pageNumber={n + 1} width={finalWidth} />}
                      </div>
                    ))
                : Array.from({ length: numPages || 0 }, (_, i) => i + 1).map((n) => (
                    <div
                      key={n}
                      ref={(el) => { if (el) registerPageRef(el, n); }}
                      style={{
                        marginBottom: isMobile ? 12 : 20,
                        boxShadow: t.pageShadow,
                        borderRadius: 3, overflow: "hidden",
                        filter: theme === "sepia" ? "sepia(0.35) brightness(0.97)" : "none",
                        transition: "filter 0.25s, box-shadow 0.25s",
                      }}
                    >
                      <Page pageNumber={n} width={finalWidth} />
                    </div>
                  ))}
            </Document>
          )}
        </div>
      </div>

      {/* ══ BOTTOM TOOLBAR ══ */}
      <div style={{
        flexShrink: 0,
        height: toolbarHeight,
        background: t.surface,
        borderTop: `1px solid ${t.border}`,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 8px" : "0 16px",
        gap: isMobile ? 4 : 8,
        transition: "background 0.25s, border-color 0.25s",
      }}>

        {/* LEFT — page navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 0 : 2 }}>
          {!isMobile && (
            <button onClick={firstPage} style={navBtn(atStart)} disabled={atStart} title="First page">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 17l-5-5 5-5" /><path d="M18 17l-5-5 5-5" />
              </svg>
            </button>
          )}
          <button onClick={prevPage} style={navBtn(atStart)} disabled={atStart} title="Previous">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div style={{
            fontSize: 13, color: t.pageNumColor,
            minWidth: isMobile ? 60 : 80,
            textAlign: "center", padding: "0 4px",
            transition: "color 0.25s",
          }}>
            {twoUp && numPages ? (
              <>
                <span style={{ fontWeight: 700 }}>{effectivePage}</span>
                <span style={{ color: t.textFaint, margin: "0 2px" }}>–</span>
                <span style={{ fontWeight: 700 }}>{Math.min(effectivePage + 1, numPages)}</span>
                <span style={{ color: t.textFaint }}> / {numPages}</span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 700 }}>{currentPage}</span>
                <span style={{ color: t.textFaint }}> / {numPages || "–"}</span>
              </>
            )}
          </div>

          <button onClick={nextPage} style={navBtn(atEnd)} disabled={atEnd} title="Next">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          {!isMobile && (
            <button onClick={lastPage} style={navBtn(atEnd)} disabled={atEnd} title="Last page">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 17l5-5-5-5" /><path d="M6 17l5-5-5-5" />
              </svg>
            </button>
          )}
        </div>

        {/* CENTRE — layout toggle (hidden on mobile) */}
        {!isMobile && (
          <div style={{
            display: "flex", alignItems: "center",
            background: t.layoutGroupBg, borderRadius: 8,
            padding: 3, gap: 2,
            transition: "background 0.25s",
          }}>
            <button onClick={() => setTwoUp(false)} style={layoutBtn(!twoUp)} title="Single page">
              <svg width="13" height="14" viewBox="0 0 13 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="1" y="1" width="11" height="12" rx="1" />
              </svg>
              {!isTablet && "Single Page"}
            </button>
            <button onClick={() => setTwoUp(true)} style={layoutBtn(twoUp)} title="Double page">
              <svg width="17" height="14" viewBox="0 0 17 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="1" y="1" width="7" height="12" rx="1" />
                <rect x="9" y="1" width="7" height="12" rx="1" />
              </svg>
              {!isTablet && "Double Page"}
            </button>
          </div>
        )}

        {/* RIGHT — zoom */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 6 }}>
          <button onClick={() => setScale((s) => clamp(s - 0.1))} style={zoomBtn} title="Zoom out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14" />
            </svg>
          </button>
          <span style={{
            fontSize: 12, fontWeight: 600, color: t.pageNumColor,
            minWidth: isMobile ? 36 : 42,
            textAlign: "center",
            background: t.pageNumBg, borderRadius: 6,
            padding: "3px 4px",
            transition: "background 0.25s, color 0.25s",
          }}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={() => setScale((s) => clamp(s + 0.1))} style={zoomBtn} title="Zoom in">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PDFReader;