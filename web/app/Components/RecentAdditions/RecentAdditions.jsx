"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import PDFThumbnail from "../Search/PDFThumbnail";

const RecentAdditions = () => {
  const router = useRouter();

  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  // ── Drag state (all in refs to avoid re-renders during RAF loop) ──
  const isDragging   = useRef(false);
  const startX       = useRef(0);
  const scrollLeft   = useRef(0);
  const lastX        = useRef(0);
  const velocity     = useRef(0);
  const rafId        = useRef(null);
  const hasDragged   = useRef(false);
  const scrollRef    = useRef();

  // We still need a React state version of hasDragged for the click guard
  const [hasDraggedState, setHasDraggedState] = useState(false);

  const getResponsiveConfig = () => {
    if (windowWidth < 640) {
      return {
        sectionPadding: "20px 16px 32px",
        titleSize:      24,
        showHeaderText: true,
        cardWidth:      140,
        cardHeight:     187,
        gap:            12,
      };
    } else if (windowWidth < 768) {
      return {
        sectionPadding: "32px 24px 40px",
        titleSize:      26,
        showHeaderText: true,
        cardWidth:      160,
        cardHeight:     213,
        gap:            16,
      };
    } else if (windowWidth < 1024) {
      return {
        sectionPadding: "40px 32px 48px",
        titleSize:      28,
        showHeaderText: false,
        cardWidth:      180,
        cardHeight:     240,
        gap:            20,
      };
    } else if (windowWidth < 1280) {
      return {
        sectionPadding: "40px 32px 48px",
        titleSize:      28,
        showHeaderText: false,
        cardWidth:      200,
        cardHeight:     267,
        gap:            20,
      };
    } else if (windowWidth <= 1440) {
      return {
        sectionPadding: "40px 32px 48px",
        titleSize:      28,
        showHeaderText: false,
        cardWidth:      210,
        cardHeight:     280,
        gap:            20,
      };
    } else {
      return {
        sectionPadding: "44px 48px 56px",
        titleSize:      28,
        showHeaderText: false,
        cardWidth:      220,
        cardHeight:     293,
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
        const r = await fetch(`http://localhost:5000/api/acquisitions`);
        if (!r.ok) throw new Error(`Server error ${r.status}`);
        const data = await r.json();
        if (isMounted) { setBooks(data.data ?? []); setError(null); }
      } catch (err) {
        console.error("[RecentAdditions] fetch error:", err);
        if (isMounted) setError("Failed to load recent additions.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBooks();
    return () => { isMounted = false; };
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = (config.cardWidth + config.gap) * 3;
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

  // ── Sub-components ──

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
      <p style={{ margin: 0, fontSize: 14 }}>No recent additions available</p>
    </div>
  );

  const ErrorState = () => (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "60px 0", color: "#ef4444", gap: 12, width: "100%",
    }}>
      <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
      <button onClick={() => window.location.reload()} style={{
        fontSize: 13, color: "#003087", background: "none",
        border: "1px solid #003087", borderRadius: 8,
        padding: "6px 16px", cursor: "pointer",
      }}>Retry</button>
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
        .nav-btn {
          border-radius: 12px;
          border: 1px solid #d1d8e8;
          background: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .nav-btn:hover {
          background: #f0f4ff;
          border-color: #003087;
        }
      `}</style>

      <div style={{ background: "#fff" }}>
        <div style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: config.sectionPadding,
          overflow: "hidden",
        }}>

          {/* ── Header ── */}
          <div style={{
            display: "flex",
            alignItems: windowWidth < 640 ? "flex-start" : "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexDirection: windowWidth < 640 ? "column" : "row",
            gap: 16,
          }}>
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: config.titleSize, fontWeight: 600, color: "#000", margin: 0 }}>
                {config.showHeaderText && windowWidth < 640 ? "New Release" : "Recent Additions"}
              </h2>

              {/* Mobile arrows */}
              {windowWidth < 640 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button className="nav-btn" onClick={() => scroll("left")} style={{ width: 36, height: 32 }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="nav-btn" onClick={() => scroll("right")} style={{ width: 36, height: 32 }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Desktop arrows */}
            {windowWidth >= 640 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <button className="nav-btn" onClick={() => scroll("left")} style={{ width: 40, height: 36 }}>
                  <ChevronLeft size={18} />
                </button>
                <button className="nav-btn" onClick={() => scroll("right")} style={{ width: 40, height: 36 }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* ── Scroll Row ── */}
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
            {loading && Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
            {!loading && error && <ErrorState />}
            {!loading && !error && books.length === 0 && <EmptyState />}

            {!loading && !error && books.map((book) => (
              <div
                key={book.book_id ?? book.id}
                className="book-card"
                onClick={() => handleBookClick(book)}
                style={{
                  minWidth: config.cardWidth,
                  maxWidth: config.cardWidth,
                  flexShrink: 0,
                  border: "1px solid #d1d5db",
                  borderRadius: 0,
                }}
              >
                {/* Cover */}
                <div style={{
                  width: "100%",
                  height: config.cardHeight,
                  background: "#f0f4ff",
                  position: "relative",
                }}>
                  {book.upload_id ? (
                    <PDFThumbnail uploadId={book.upload_id} title={book.title} />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%", background: "#fff",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      padding: "16px 10px", boxSizing: "border-box",
                    }}>
                      <BookOpen size={28} color="#000" strokeWidth={1.2} style={{ marginBottom: 10 }} />
                      <span style={{
                        color: "#000", fontSize: 11, fontWeight: 600,
                        textAlign: "center", lineHeight: 1.3,
                        display: "-webkit-box", WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {book.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
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
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default RecentAdditions;