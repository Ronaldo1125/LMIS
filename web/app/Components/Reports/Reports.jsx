"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import PDFThumbnail from "../Search/PDFThumbnail";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ReportsSection = () => {
  const router = useRouter();

  const [books,       setBooks]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ── Drag state (all in refs to avoid re-renders during RAF loop) ──
  const isDragging   = useRef(false);
  const startX       = useRef(0);
  const scrollLeft   = useRef(0);
  const lastX        = useRef(0);
  const velocity     = useRef(0);
  const rafId        = useRef(null);
  const hasDragged   = useRef(false);

  // We still need a React state version of hasDragged for the click guard
  const [hasDraggedState, setHasDraggedState] = useState(false);

  const scrollRef = useRef(null);

  const getConfig = () => {
    if (windowWidth < 640)   return { cardWidth: 120, cardHeight: 160, gap: 16, padX: 16, cols: 2 };
    if (windowWidth < 768)   return { cardWidth: 140, cardHeight: 187, gap: 20, padX: 24, cols: 3 };
    if (windowWidth < 1024)  return { cardWidth: 140, cardHeight: 187, gap: 24, padX: 32, cols: 4 };
    if (windowWidth < 1280)  return { cardWidth: 160, cardHeight: 213, gap: 28, padX: 32, cols: 5 };
    if (windowWidth <= 1440) return { cardWidth: 170, cardHeight: 227, gap: 32, padX: 32, cols: 5 };
    return                          { cardWidth: 180, cardHeight: 240, gap: 32, padX: 48, cols: 6 };
  };

  const cfg = getConfig();

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/search?category=Reports&page=1&limit=20`);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        if (mounted) { setBooks(data.data ?? data.results ?? []); setError(null); }
      } catch (err) {
        if (mounted) setError("Failed to load reports.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch_();
    return () => { mounted = false; };
  }, []);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Simple logic: if there are books, assume scrolling is possible
    // Let the scroll behavior handle the actual limits
    const hasBooks = books.length > 0;
    const isAtStart = el.scrollLeft <= 4;
    const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
    
    setCanScrollLeft(hasBooks && !isAtStart);
    setCanScrollRight(hasBooks && !isAtEnd);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const handleScroll = () => updateScrollButtons();
    el.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check and resize observer
    const resizeObserver = new ResizeObserver(() => {
      updateScrollButtons();
    });
    resizeObserver.observe(el);
    
    // Initial check after content loads
    setTimeout(updateScrollButtons, 100);
    
    return () => {
      el.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [books]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = (cfg.cardWidth + cfg.gap) * 3;
    el.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  // ── Momentum helpers ──

  const cancelMomentum = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const applyMomentum = () => {
    const el = scrollRef.current;
    if (!el) return;

    // Decelerate at ~92% per frame (~60 fps → feels natural)
    velocity.current *= 0.92;

    if (Math.abs(velocity.current) < 0.5) {
      velocity.current = 0;
      rafId.current = null;
      return;
    }

    el.scrollLeft -= velocity.current;
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  // ── Mouse events ──

  const handleMouseDown = (e) => {
    cancelMomentum();
    isDragging.current  = true;
    hasDragged.current  = false;
    setHasDraggedState(false);
    startX.current      = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current  = scrollRef.current.scrollLeft;
    lastX.current       = e.pageX;
    velocity.current    = 0;
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();

    const x    = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;

    // Update velocity for momentum (negative: scroll follows finger direction)
    velocity.current = e.pageX - lastX.current;
    lastX.current    = e.pageX;

    scrollRef.current.scrollLeft = scrollLeft.current - walk;

    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
      setHasDraggedState(true);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
    // Kick off momentum coast
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  const handleMouseLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  // ── Touch events ──

  const handleTouchStart = (e) => {
    cancelMomentum();
    isDragging.current  = true;
    hasDragged.current  = false;
    setHasDraggedState(false);
    startX.current      = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft.current  = scrollRef.current.scrollLeft;
    lastX.current       = e.touches[0].pageX;
    velocity.current    = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;

    const x    = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;

    velocity.current = e.touches[0].pageX - lastX.current;
    lastX.current    = e.touches[0].pageX;

    scrollRef.current.scrollLeft = scrollLeft.current - walk;

    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
      setHasDraggedState(true);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  // ── Click guard ──
  const handleBookClick = (book) => {
    if (hasDragged.current) return;
    const id = book.book_id ?? book.id;
    if (!id) return;
    router.push(`/book/${id}`);
  };

  // Cleanup RAF on unmount
  useEffect(() => () => cancelMomentum(), []);

  const NavBtn = ({ dir, disabled, onClick }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: windowWidth < 640 ? 34 : 40,
        height: windowWidth < 640 ? 34 : 40,
        borderRadius: 8,
        border: "1.5px solid",
        borderColor: disabled ? "#e5e7eb" : "#cbd5e1",
        background: disabled ? "#fafafa" : "#fff",
        display: "grid",
        placeItems: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s",
        opacity: disabled ? 0.45 : 1,
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = "#003087"; e.currentTarget.style.background = "#f0f4ff"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = disabled ? "#e5e7eb" : "#cbd5e1"; e.currentTarget.style.background = disabled ? "#fafafa" : "#fff"; }}
    >
      {dir === "left"
        ? <ChevronLeft  size={windowWidth < 640 ? 15 : 18} color={disabled ? "#d1d5db" : "#374151"} />
        : <ChevronRight size={windowWidth < 640 ? 15 : 18} color={disabled ? "#d1d5db" : "#374151"} />
      }
    </button>
  );

  const SkeletonCard = ({ width, height }) => (
    <div style={{ minWidth: width, maxWidth: width, flexShrink: 0, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <div style={{ width, height, background: "#f3f4f6", animation: "lmis-pulse 1.5s ease-in-out infinite" }} />
      <div style={{ padding: "12px 12px 14px" }}>
        <div style={{ height: 12, background: "#f3f4f6", borderRadius: 2, marginBottom: 8, animation: "lmis-pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 11, background: "#f3f4f6", borderRadius: 2, width: "60%", animation: "lmis-pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );


  return (
    <>
      <style>{`
        @keyframes lmis-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        .nav-btn {
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .nav-btn:hover:not(:disabled) {
          background: #f0f4ff;
          border-color: #003087;
        }
        .nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .lmis-scroll {
          cursor: grab;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .lmis-scroll:active {
          cursor: grabbing;
        }
        .lmis-scroll::-webkit-scrollbar {
          display: none;
        }
        .lmis-book-card {
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s ease;
          user-select: none;
        }
        .lmis-book-card:hover {
          border-color: #003087 !important;
        }
      `}</style>

      <section style={{ background: "#fff", borderTop: "1px solid #f0f2f5" }}>
       
        <div style={{
          maxWidth: 1700,
          margin: "0 auto",
          overflow: "hidden",
          padding: windowWidth < 640
            ? `32px ${cfg.padX}px 40px`
            : `44px ${cfg.padX}px 40px`,
        }}>

        
          {windowWidth < 768 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}>
              <h2 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#0a0f1e",
                letterSpacing: "-0.4px",
                lineHeight: 1.2,
              }}>
                Reports
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button 
                  className="nav-btn" 
                  onClick={() => scroll("left")} 
                  disabled={!canScrollLeft}
                  style={{ width: 36, height: 32 }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  className="nav-btn" 
                  onClick={() => scroll("right")} 
                  disabled={!canScrollRight}
                  style={{ width: 36, height: 32 }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          
          {windowWidth >= 768 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}>
              <h2 style={{
                margin: 0,
                fontSize: windowWidth < 640 ? 20 : 26,
                fontWeight: 700,
                color: "#0a0f1e",
                letterSpacing: "-0.4px",
                lineHeight: 1.2,
              }}>
                Reports
              </h2>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <button 
                  className="nav-btn" 
                  onClick={() => scroll("left")} 
                  disabled={!canScrollLeft}
                  style={{ width: 40, height: 36 }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  className="nav-btn" 
                  onClick={() => scroll("right")} 
                  disabled={!canScrollRight}
                  style={{ width: 40, height: 36 }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

      
          <div
            ref={scrollRef}
            className="lmis-scroll"
            style={{
              display: "flex",
              gap: cfg.gap,
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: 40,
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {loading && Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} width={cfg.cardWidth} height={cfg.cardHeight} />
            ))}

            {!loading && error && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 12, padding: "60px 40px",
                color: "#9ca3af", width: "100%", textAlign: "center",
              }}>
                <BookOpen size={36} strokeWidth={1.2} />
                <p style={{ margin: 0, fontSize: 13 }}>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  style={{ fontSize: 12, color: "#003087", background: "none", border: "1px solid #003087", borderRadius: 6, padding: "5px 14px", cursor: "pointer" }}
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && books.length === 0 && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 10, padding: "60px 40px",
                color: "#9ca3af", width: "100%", textAlign: "center",
              }}>
                <BookOpen size={36} strokeWidth={1.2} />
                <p style={{ margin: 0, fontSize: 13 }}>No reports available</p>
              </div>
            )}

            {!loading && !error && books.map((book) => {
              const id = book.book_id ?? book.id;
              return (
                <div
                  key={id}
                  className="lmis-book-card"
                  onClick={() => handleBookClick(book)}
                  style={{
                    minWidth: cfg.cardWidth,
                    maxWidth: cfg.cardWidth,
                    flexShrink: 0,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                 
                  <div style={{
                    width: cfg.cardWidth, height: cfg.cardHeight,
                    background: "#f0f4ff", position: "relative", overflow: "hidden",
                  }}>
                    {book.upload_id ? (
                      <PDFThumbnail uploadId={book.upload_id} title={book.title} />
                    ) : (
                      <div style={{
                        width: "100%", height: "100%", background: "#ffffff",
                        display: "flex", flexDirection: "column", alignItems: "center",
                        justifyContent: "center", padding: "16px 10px", boxSizing: "border-box",
                      }}>
                        <BookOpen size={26} color="#000" strokeWidth={1.2} style={{ marginBottom: 10 }} />
                        <span style={{
                          color: "#000", fontSize: 11, fontWeight: 600, textAlign: "center",
                          lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                          {book.title}
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "12px 12px 14px" }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.25,
                      marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#4b5563", display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }} title={book.author}>
                        {book.author || "Unknown Author"}
                      </span>
                      <span style={{ color: "#6b7280", fontWeight: 600, flexShrink: 0 }}>
                        {book.year ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
};

export default ReportsSection;