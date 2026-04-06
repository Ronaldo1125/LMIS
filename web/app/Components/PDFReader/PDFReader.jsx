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







async function getPdfDoc(blobUrl) {



  return pdfjs.getDocument({ url: blobUrl }).promise;



}







async function detectSearchable(blobUrl) {



  try {



    const pdf = await getPdfDoc(blobUrl);



    const pagesToSample = Math.min(pdf.numPages, 5);



    for (let i = 1; i <= pagesToSample; i++) {



      const page    = await pdf.getPage(i);



      const content = await page.getTextContent();



      const text    = content.items.map((it) => it.str).join("").trim();



      if (text.length > 10) return true;



    }



    return false;



  } catch { return false; }



}







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







const PDFReader = ({ uploadId, title, author, onClose }) => {



  const windowWidth = useWindowWidth();



  const isMobile  = windowWidth > 0 && windowWidth < 640;



  const isTablet  = windowWidth >= 640 && windowWidth < 1024;



  const isDesktop = windowWidth >= 1024;







  const [blobUrl, setBlobUrl]         = useState(null);



  const [status, setStatus]           = useState("loading");



  const [numPages, setNumPages]       = useState(null);



  const [currentPage, setCurrentPage] = useState(1);



  const [scale, setScale]             = useState(isMobile ? 0.45 : 0.6);



  const [twoUp, setTwoUp]             = useState(false);







  const [isSearchable, setIsSearchable]   = useState(null);



  const [showSearch, setShowSearch]       = useState(false);



  const [searchQuery, setSearchQuery]     = useState("");



  const [searchResults, setSearchResults] = useState([]);



  const [searchIndex, setSearchIndex]     = useState(0);



  const [isSearching, setIsSearching]     = useState(false);



  const [noResults, setNoResults]         = useState(false);







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



          const searchable = await detectSearchable(url);



          if (!cancel) setIsSearchable(searchable);



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



  const padding   = isMobile ? 8 : 40;



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







  /* ── SEARCH ── */



  const runSearch = useCallback(async () => {



    if (!blobUrl || !searchQuery.trim() || !isSearchable) return;



    setIsSearching(true);



    setSearchResults([]);



    setSearchIndex(0);



    setNoResults(false);



    try {



      const pdf  = await getPdfDoc(blobUrl);



      const hits = [];



      const q    = searchQuery.trim().toLowerCase();



      for (let i = 1; i <= pdf.numPages; i++) {



        const page    = await pdf.getPage(i);



        const content = await page.getTextContent();



        const text    = content.items.map((it) => it.str).join("").toLowerCase();



        let idx = text.indexOf(q);



        while (idx !== -1) { hits.push({ page: i, charIndex: idx }); idx = text.indexOf(q, idx + 1); }



      }



      setSearchResults(hits);



      if (hits.length > 0) { setSearchIndex(0); jumpToPage(hits[0].page); }



      else setNoResults(true);



    } catch (err) { console.error("Search error:", err); }



    finally { setIsSearching(false); }



  }, [blobUrl, searchQuery, isSearchable, jumpToPage]);







  const goPrevMatch = () => {



    if (!searchResults.length) return;



    const ni = (searchIndex - 1 + searchResults.length) % searchResults.length;



    setSearchIndex(ni); jumpToPage(searchResults[ni].page);



  };



  const goNextMatch = () => {



    if (!searchResults.length) return;



    const ni = (searchIndex + 1) % searchResults.length;



    setSearchIndex(ni); jumpToPage(searchResults[ni].page);



  };







  /* ── STYLE HELPERS ── */



  const iconBtn = {



    border: "none", background: "transparent", cursor: "pointer",



    padding: 6, borderRadius: 6, display: "flex",



    alignItems: "center", justifyContent: "center", color: "#333",



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



    background: active ? "#1a1a2e" : "transparent",



    color: active ? "#fff" : "#555",



    fontSize: 12, fontWeight: active ? 600 : 400,



    cursor: "pointer", display: "flex", alignItems: "center", gap: 4,



    transition: "background 0.15s, color 0.15s", whiteSpace: "nowrap",



  });







  const zoomBtn = {



    ...iconBtn,



    width: isMobile ? 32 : 30,



    height: isMobile ? 32 : 30,



    border: "1px solid #e0e0e0", borderRadius: 6, background: "#fafafa",



  };







  /* ── HEADER HEIGHT ── */



  const headerHeight = isMobile ? 52 : 56;



  const toolbarHeight = isMobile ? 56 : 52;







  /* ── RENDER ── */



  return (



    <div style={{



      position: "fixed", inset: 0, background: "#e8ecf0",



      display: "flex", flexDirection: "column",



      zIndex: 9999, fontFamily: "'Segoe UI', system-ui, sans-serif",



    }}>







      {/* ══ HEADER ══ */}



      <div style={{



        height: headerHeight,



        display: "flex", alignItems: "center",



        padding: isMobile ? "0 10px" : "0 16px",



        background: "#fff",



        borderBottom: "1px solid #e0e0e0",



        gap: isMobile ? 8 : 10,



        flexShrink: 0,



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



          }}>



            {title}



          </div>



          {author && !isMobile && (



            <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{author}</div>



          )}



        </div>







        {/* Search icon */}



        <button



          onClick={() => isSearchable && setShowSearch((s) => !s)}



          style={{



            ...iconBtn, width: 34, height: 34, borderRadius: 8, position: "relative",



            color: isSearchable ? (showSearch ? "#3b5bdb" : "#444") : "#ccc",



            cursor: isSearchable ? "pointer" : "not-allowed",



            background: showSearch ? "#eef2ff" : "transparent",



          }}



          title={



            isSearchable === null ? "Detecting text…"



            : isSearchable        ? "Search (Ctrl+F)"



            :                       "Scanned document — search unavailable"



          }



        >



          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">



            <circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" />



          </svg>



          {isSearchable === false && (



            <span style={{



              position: "absolute", top: 5, right: 5,



              width: 6, height: 6, borderRadius: "50%", background: "#f59e0b",



            }} />



          )}



        </button>



      </div>







      {/* ══ SEARCH BAR ══ */}



      {showSearch && isSearchable && (



        <div style={{



          background: "#fff", borderBottom: "1px solid #e8e8e8",



          padding: isMobile ? "8px 10px" : "8px 16px",



          display: "flex", alignItems: "center",



          gap: isMobile ? 6 : 8,



          flexShrink: 0,



          flexWrap: isMobile ? "wrap" : "nowrap",



        }}>



          {/* Input row */}



          <div style={{



            display: "flex", alignItems: "center", gap: 6,



            width: isMobile ? "100%" : "auto",



            flex: isMobile ? "none" : 1,



          }}>



            <div style={{ position: "relative", flex: 1, maxWidth: isMobile ? "100%" : 380 }}>



              <input



                autoFocus



                placeholder="Search in document…"



                value={searchQuery}



                onChange={(e) => { setSearchQuery(e.target.value); setNoResults(false); }}



                onKeyDown={(e) => e.key === "Enter" && runSearch()}



                style={{



                  width: "100%", height: 36, borderRadius: 8,



                  border: `1px solid ${noResults ? "#fca5a5" : "#ddd"}`,



                  padding: "0 34px 0 12px", fontSize: 13, outline: "none",



                  boxSizing: "border-box",



                  background: noResults ? "#fff5f5" : "#fff",



                }}



              />



              {searchQuery && (



                <button



                  onClick={() => { setSearchQuery(""); setSearchResults([]); setNoResults(false); }}



                  style={{ ...iconBtn, position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", padding: 2 }}



                >



                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">



                    <path d="M6 6l12 12M6 18L18 6" />



                  </svg>



                </button>



              )}



            </div>







            <button



              onClick={runSearch}



              disabled={isSearching || !searchQuery.trim()}



              style={{



                height: 36, padding: "0 14px", borderRadius: 8, border: "none",



                background: isSearching || !searchQuery.trim() ? "#9ca3af" : "#1a1a2e",



                color: "#fff", fontSize: 13,



                cursor: isSearching || !searchQuery.trim() ? "default" : "pointer",



                fontWeight: 500, transition: "background 0.15s", whiteSpace: "nowrap",



              }}



            >



              {isSearching ? "…" : "Find"}



            </button>



          </div>







          {/* Results controls */}



          {searchResults.length > 0 && (



            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>



              <span style={{



                fontSize: 12, color: "#166534", background: "#dcfce7",



                padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", fontWeight: 500,



              }}>



                {searchIndex + 1} / {searchResults.length}



              </span>



              <button onClick={goPrevMatch} style={{ ...iconBtn, width: 28, height: 28 }} title="Previous match">



                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">



                  <path d="M15 18l-6-6 6-6" />



                </svg>



              </button>



              <button onClick={goNextMatch} style={{ ...iconBtn, width: 28, height: 28 }} title="Next match">



                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">



                  <path d="M9 18l6-6-6-6" />



                </svg>



              </button>



            </div>



          )}







          {noResults && (



            <span style={{ fontSize: 12, color: "#b91c1c", whiteSpace: "nowrap" }}>No results</span>



          )}



        </div>



      )}







      {/* Scanned notice */}



      {isSearchable === false && showSearch && (



        <div style={{



          background: "#fffbeb", borderBottom: "1px solid #fde68a",



          padding: "7px 16px", fontSize: 12, color: "#92400e",



          display: "flex", alignItems: "center", gap: 6, flexShrink: 0,



        }}>



          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">



            <path d="M12 9v4M12 17h.01" />



            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />



          </svg>



          Scanned document — text search is unavailable.



        </div>



      )}







      {/* ══ PDF SCROLL AREA ══ */}



      <div



        ref={containerRef}



        style={{



          flex: 1, overflowY: "auto",



          display: "flex", justifyContent: "center",



          padding: isMobile ? "16px 8px 12px" : "32px 20px 24px",



        }}



      >



        <div style={{ width: baseWidth, display: "flex", flexDirection: "column", alignItems: "center" }}>



          {status === "loading" && (



            <div style={{ marginTop: 80, color: "#888", fontSize: 14 }}>Loading PDF…</div>



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



                          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",



                          borderRadius: 3, overflow: "hidden",



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



                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",



                        borderRadius: 3, overflow: "hidden",



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



        background: "#fff", borderTop: "1px solid #e0e0e0",



        display: "flex", alignItems: "center",



        justifyContent: "space-between",



        padding: isMobile ? "0 8px" : "0 16px",



        gap: isMobile ? 4 : 8,



      }}>







        {/* LEFT — page navigation */}



        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 0 : 2 }}>



          {/* Hide first/last on mobile to save space */}



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



            fontSize: 13, color: "#444",



            minWidth: isMobile ? 60 : 80,



            textAlign: "center", padding: "0 4px",



          }}>



            {twoUp && numPages ? (



              <>



                <span style={{ fontWeight: 700 }}>{effectivePage}</span>



                <span style={{ color: "#bbb", margin: "0 2px" }}>–</span>



                <span style={{ fontWeight: 700 }}>{Math.min(effectivePage + 1, numPages)}</span>



                <span style={{ color: "#aaa" }}> / {numPages}</span>



              </>



            ) : (



              <>



                <span style={{ fontWeight: 700 }}>{currentPage}</span>



                <span style={{ color: "#aaa" }}> / {numPages || "–"}</span>



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







        {/* CENTRE — layout toggle (hidden on mobile: auto single-page) */}



        {!isMobile && (



          <div style={{



            display: "flex", alignItems: "center",



            background: "#f3f4f6", borderRadius: 8,



            padding: 3, gap: 2,



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



            fontSize: 12, fontWeight: 600, color: "#444",



            minWidth: isMobile ? 36 : 42,



            textAlign: "center",



            background: "#f3f4f6", borderRadius: 6,



            padding: "3px 4px",



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