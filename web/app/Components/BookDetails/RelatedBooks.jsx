"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import PDFThumbnail from "../Search/PDFThumbnail";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getResponsiveConfig = (w) => {
  if (w < 640) {
    return { sectionPadding: "20px 16px 32px", titleSize: 22, cardWidth: 100, cardHeight: 133, gap: 12 };
  } else if (w < 768) {
    return { sectionPadding: "28px 24px 40px", titleSize: 24, cardWidth: 120, cardHeight: 160, gap: 14 };
  } else if (w < 1024) {
    return { sectionPadding: "36px 32px 48px", titleSize: 26, cardWidth: 140, cardHeight: 187, gap: 16 };
  } else if (w < 1280) {
    return { sectionPadding: "40px 40px 52px", titleSize: 28, cardWidth: 160, cardHeight: 213, gap: 20 };
  } else if (w < 1536) {
    return { sectionPadding: "44px 48px 56px", titleSize: 28, cardWidth: 170, cardHeight: 227, gap: 22 };
  } else {
    return { sectionPadding: "48px 64px 64px", titleSize: 28, cardWidth: 180, cardHeight: 240, gap: 24 };
  }
};

const RelatedBooks = ({ currentBookId }) => {
  const router = useRouter();
  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollLeft  = useRef(0);
  const lastX       = useRef(0);
  const velocity    = useRef(0);
  const rafId       = useRef(null);
  const hasDragged  = useRef(false);
  const scrollRef   = useRef();

  const config = getResponsiveConfig(windowWidth);

  const SkeletonCard = () => (
    <div style={{
      minWidth: config.cardWidth, maxWidth: config.cardWidth, flexShrink: 0,
      border: "1px solid #e5e7eb", overflow: "hidden",
      animation: "rb-pulse 1.5s ease-in-out infinite",
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
      <p style={{ margin: 0, fontSize: 14 }}>No related books available</p>
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

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left"
        ? -((config.cardWidth + config.gap) * 3)
        : ((config.cardWidth + config.gap) * 3),
      behavior: "smooth",
    });
  };

  const cancelMomentum = () => {
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
  };

  const applyMomentum = () => {
    const el = scrollRef.current;
    if (!el) return;
    velocity.current *= 0.92;
    if (Math.abs(velocity.current) < 0.5) { velocity.current = 0; rafId.current = null; return; }
    el.scrollLeft -= velocity.current;
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  const handleMouseDown = (e) => {
    cancelMomentum();
    isDragging.current = true;
    hasDragged.current = false;
    startX.current     = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    lastX.current      = e.pageX;
    velocity.current   = 0;
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
    if (Math.abs(walk) > 5) hasDragged.current = true;
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
    isDragging.current = true;
    hasDragged.current = false;
    startX.current     = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    lastX.current      = e.touches[0].pageX;
    velocity.current   = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x    = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    velocity.current = e.touches[0].pageX - lastX.current;
    lastX.current    = e.touches[0].pageX;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
    if (Math.abs(walk) > 5) hasDragged.current = true;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  const handleBookClick = (book) => {
    if (hasDragged.current) return;
    const id = book.book_id ?? book.id;
    if (!id) return;
    router.push(`/book/${id}`);
  };

  useEffect(() => () => cancelMomentum(), []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!currentBookId) return;
    let cancelled = false;

    const fetchRelated = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `${API_BASE}/api/books/${currentBookId}/related?limit=20`,
          { headers }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Error ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) setBooks(data.results ?? []);
      } catch (err) {
        console.error("RelatedBooks fetch error:", err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRelated();
    return () => { cancelled = true; };
  }, [currentBookId]);

  if (!loading && !error && books.length === 0) return null;

  const isMobile = windowWidth > 0 && windowWidth < 640;

  return (
    <>
      <style>{`
        @keyframes rb-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .rb-book-card {
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s ease;
          user-select: none;
        }
        .rb-book-card:hover {
          border-color: rgb(25, 18, 101) !important;
        }
        .rb-scroll {
          cursor: grab;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .rb-scroll:active { cursor: grabbing; }
        .rb-scroll::-webkit-scrollbar { display: none; }
        .rb-nav-btn {
          border-radius: 12px;
          border: 1px solid #d1d8e8;
          background: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          flex-shrink: 0;
        }
        .rb-nav-btn:hover {
          background: #f0f4ff;
          border-color: rgb(25, 18, 101);
        }
      `}</style>

      <div style={{
        background: "#fff",
        borderTop: "1px solid #f0f0f0",
        paddingTop: windowWidth < 640 ? "20px" : windowWidth < 768 ? "28px" : windowWidth < 1024 ? "36px" : windowWidth < 1280 ? "40px" : windowWidth < 1536 ? "44px" : "48px",
        paddingBottom: windowWidth < 640 ? "32px" : windowWidth < 768 ? "40px" : windowWidth < 1024 ? "48px" : windowWidth < 1280 ? "52px" : windowWidth < 1536 ? "56px" : "64px",
        boxSizing: "border-box",
        marginLeft: `calc(-1 * ${
          windowWidth < 640 ? "16px" :
          windowWidth < 1024 ? "24px" :
          "32px"
        })`,
        marginRight: `calc(-1 * ${
          windowWidth < 640 ? "16px" :
          windowWidth < 1024 ? "24px" :
          "32px"
        })`,
        paddingLeft: windowWidth < 640 ? "16px" : windowWidth < 1024 ? "24px" : "32px",
        paddingRight: windowWidth < 640 ? "16px" : windowWidth < 1024 ? "24px" : "32px",
      }}>
        <div style={{
          maxWidth: 1600,
          margin: "0 auto",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            gap: 16,
          }}>
            <h2 style={{
              fontSize: config.titleSize,
              fontWeight: 600,
              color: "#000",
              margin: 0,
              lineHeight: 1.2,
            }}>
              Related Books
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 10, flexShrink: 0 }}>
              <button
                className="rb-nav-btn"
                onClick={() => scroll("left")}
                style={{ width: isMobile ? 34 : 40, height: isMobile ? 30 : 36 }}
              >
                <ChevronLeft size={isMobile ? 15 : 18} />
              </button>
              <button
                className="rb-nav-btn"
                onClick={() => scroll("right")}
                style={{ width: isMobile ? 34 : 40, height: isMobile ? 30 : 36 }}
              >
                <ChevronRight size={isMobile ? 15 : 18} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="rb-scroll"
            style={{ display: "flex", gap: config.gap }}
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
                className="rb-book-card"
                onClick={() => handleBookClick(book)}
                style={{
                  minWidth: config.cardWidth,
                  maxWidth: config.cardWidth,
                  flexShrink: 0,
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                }}
              >
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

export default RelatedBooks;