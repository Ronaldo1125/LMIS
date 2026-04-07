"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, TrendingUp, BookOpen } from "lucide-react";
import PDFThumbnail from "../Search/PDFThumbnail";

const FrequentlySearched = () => {
  const router = useRouter();

  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isDragging   = useRef(false);
  const startX       = useRef(0);
  const scrollLeft   = useRef(0);
  const lastX        = useRef(0);
  const velocity     = useRef(0);
  const rafId        = useRef(null);
  const hasDragged   = useRef(false);
  const scrollRef    = useRef();

  const [hasDraggedState, setHasDraggedState] = useState(false);

  const getResponsiveConfig = () => {
    if (windowWidth < 640) {
      return {
        sectionPadding: "20px 16px 32px",
        titleSize:      24,
        showHeaderText: true,
        cardWidth:      120,
        cardHeight:     160,
        gap:            12,
      };
    } else if (windowWidth < 768) {
      return {
        sectionPadding: "32px 24px 40px",
        titleSize:      26,
        showHeaderText: true,
        cardWidth:      140,
        cardHeight:     187,
        gap:            16,
      };
    } else if (windowWidth < 1024) {
      return {
        sectionPadding: "40px 32px 48px",
        titleSize:      28,
        showHeaderText: false,
        cardWidth:      160,
        cardHeight:     213,
        gap:            20,
      };
    } else if (windowWidth < 1280) {
      return {
        sectionPadding: "40px 32px 48px",
        titleSize:      28,
        showHeaderText: false,
        cardWidth:      180,
        cardHeight:     240,
        gap:            20,
      };
    } else if (windowWidth <= 1440) {
      return {
        sectionPadding: "40px 32px 48px",
        titleSize:      28,
        showHeaderText: false,
        cardWidth:      190,
        cardHeight:     253,
        gap:            20,
      };
    } else {
      return {
        sectionPadding: "44px 48px 56px",
        titleSize:      28,
        showHeaderText: false,
        cardWidth:      200,
        cardHeight:     267,
        gap:            24,
      };
    }
  };

  const config = getResponsiveConfig();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchBooks = async () => {
      try {
        const r = await fetch(`/api/most-searched?limit=20`);
        if (!r.ok) throw new Error(`Server error ${r.status}`);
        const data = await r.json();
        const booksData = (data.results ?? []).map((book) => ({ ...book }));
        if (isMounted) { setBooks(booksData); setError(null); }
      } catch (err) {
        console.error("[FrequentlySearched] fetch error:", err);
        if (isMounted) setError("Failed to load most searched books.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBooks();
    return () => { isMounted = false; };
  }, []);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    
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
    
    const resizeObserver = new ResizeObserver(() => {
      updateScrollButtons();
    });
    resizeObserver.observe(el);
    
    setTimeout(updateScrollButtons, 100);
    
    return () => {
      el.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [books]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = (config.cardWidth + config.gap) * 3;
    el.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const cancelMomentum = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const applyMomentum = () => {
    const el = scrollRef.current;
    if (!el) return;

    velocity.current *= 0.92;

    if (Math.abs(velocity.current) < 0.5) {
      velocity.current = 0;
      rafId.current = null;
      return;
    }

    el.scrollLeft -= velocity.current;
    rafId.current = requestAnimationFrame(applyMomentum);
  };

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
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  const handleMouseLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
    rafId.current = requestAnimationFrame(applyMomentum);
  };

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

  const handleBookClick = (book) => {
    if (hasDragged.current) return;
    router.push(`/book/${book.id}`);
  };

  useEffect(() => () => cancelMomentum(), []);

  const SkeletonCard = () => (
    <div style={{
      minWidth: config.cardWidth, maxWidth: config.cardWidth, flexShrink: 0,
      border: "1px solid #e5e7eb", overflow: "hidden",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ width: "100%", height: config.cardHeight, background: "#eef2fb" }} />
      <div style={{ padding: "12px 12px 14px" }}>
        <div style={{ height: 13, background: "#eef2fb", marginBottom: 8, borderRadius: 3 }} />
        <div style={{ height: 11, background: "#eef2fb", width: "60%", borderRadius: 3 }} />
      </div>
    </div>
  );

  const EmptyState = () => (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "60px 0", color: "#9ca3af", gap: 12, width: "100%",
    }}>
      <BookOpen size={40} strokeWidth={1.2} />
      <p style={{ margin: 0, fontSize: 14 }}>No search data yet — start searching!</p>
    </div>
  );

  const ErrorState = () => (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "60px 0", color: "#ef4444", gap: 12, width: "100%",
    }}>
      <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          fontSize: 13, color: "#003087", background: "none",
          border: "1px solid #003087", borderRadius: 8,
          padding: "6px 16px", cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .book-card {
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s ease;
          user-select: none;
        }
        .book-card:hover {
          border-color: #003087 !important;
        }
        .scroll-container {
          cursor: grab;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scroll-container:active {
          cursor: grabbing;
        }
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
        .rank-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0,48,135,0.82);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          padding: 2px 7px;
          letter-spacing: 0.5px;
          backdrop-filter: blur(2px);
        }
        .nav-btn {
          border-radius: 10px;
          border: 1px solid #d1d8e8;
          background: #fff;
          display: grid;
          place-items: center;
          transition: background 0.15s, border-color 0.15s;
          cursor: pointer;
        }
        .nav-btn:not(:disabled):hover {
          background: #f0f4ff;
          border-color: #003087;
        }
        .nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{ background: "#fff" }}>
        <div style={{
          maxWidth: 1700,
          margin: "0 auto",
          padding: config.sectionPadding,
          overflow: "hidden",
        }}>

          <div style={{
            display: "flex",
            alignItems: windowWidth < 640 ? "flex-start" : "center",
            justifyContent: "space-between",
            marginBottom: 24,
            gap: 16,
            flexDirection: windowWidth < 640 ? "column" : "row",
          }}>
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{
                fontSize: config.titleSize,
                fontWeight: 600,
                color: "#000000ff",
                margin: 0,
              }}>
                {config.showHeaderText && windowWidth < 640 ? "Most Searched" : "Most Searched Books"}
              </h2>

              {windowWidth < 640 && (
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
              )}
            </div>

            {windowWidth >= 640 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{ width: 12 }} />
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
            )}
          </div>

          <div
            ref={scrollRef}
            className="scroll-container"
            style={{
              display: "flex",
              gap: config.gap,
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {loading && Array.from({ length: 20 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}

            {!loading && error && <ErrorState />}
            {!loading && !error && books.length === 0 && <EmptyState />}

            {!loading && !error && books.map((book, idx) => {
              const globalRank = idx + 1;
              return (
                <div
                  key={book.id}
                  className="book-card"
                  onClick={() => handleBookClick(book)}
                  style={{
                    minWidth: config.cardWidth,
                    maxWidth: config.cardWidth,
                    width: config.cardWidth,
                    flexShrink: 0,
                    border: "1px solid #e5e7eb",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div style={{
                    width: config.cardWidth,
                    height: config.cardHeight,
                    background: "#f0f4ff",
                    position: "relative",
                  }}>
                    {book.upload_id ? (
                      <PDFThumbnail uploadId={book.upload_id} title={book.title} />
                    ) : (
                      <div style={{
                        width: "100%", height: "100%", background: "#ffffff",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        padding: "16px 10px", boxSizing: "border-box",
                      }}>
                        <BookOpen size={28} color="#000000" strokeWidth={1.2} style={{ marginBottom: 10 }} />
                        <span style={{
                          color: "#000000", fontSize: 11, fontWeight: 600,
                          textAlign: "left", lineHeight: 1.3,
                          display: "-webkit-box", WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                          {book.title}
                        </span>
                      </div>
                    )}

                    <span className="rank-badge">#{globalRank}</span>

                    {book.search_count > 0 && (
                      <span style={{
                        position: "absolute", bottom: 8, right: 8,
                        background: "rgba(0,0,0,0.55)", color: "#fff",
                        fontSize: 10, fontWeight: 600, borderRadius: 4,
                        padding: "2px 6px", backdropFilter: "blur(2px)",
                        display: "flex", alignItems: "center", gap: 3,
                      }}>
                        <TrendingUp size={9} />
                        {book.search_count.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: "12px 12px 14px" }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700, color: "#111827",
                      lineHeight: 1.25, marginBottom: 6,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {book.title}
                    </div>
                    <div style={{
                      fontSize: 12, color: "#4b5563",
                      display: "flex", justifyContent: "space-between", gap: 8,
                    }}>
                      <span style={{
                        overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: "nowrap", flex: 1,
                      }} title={book.author}>
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
      </div>
    </>
  );
};

export default FrequentlySearched;