"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import PDFThumbnail from "../Search/PDFThumbnail";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ThesisPapersSection = () => {
  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [canScrollL, setCanScrollL] = useState(false);
  const [canScrollR, setCanScrollR] = useState(true);
  const [thesisCategory, setThesisCategory] = useState(null);

  const scrollRef = useRef(null);

  const getConfig = () => {
    if (windowWidth < 640)   return { cardWidth: 140, cardHeight: 187, gap: 16, padX: 16, cols: 2 };
    if (windowWidth < 768)   return { cardWidth: 160, cardHeight: 213, gap: 20, padX: 24, cols: 3 };
    if (windowWidth < 1024)  return { cardWidth: 180, cardHeight: 240, gap: 24, padX: 32, cols: 4 };
    if (windowWidth < 1280)  return { cardWidth: 200, cardHeight: 267, gap: 28, padX: 32, cols: 5 };
    if (windowWidth <= 1440) return { cardWidth: 210, cardHeight: 280, gap: 32, padX: 32, cols: 5 };
    return                          { cardWidth: 220, cardHeight: 293, gap: 32, padX: 48, cols: 6 };
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
    const fetchData = async () => {
      try {
        const headers = { "Content-Type": "application/json" };
        const filterRes = await fetch(`${API_BASE}/api/search/filters`, { headers });
        if (!filterRes.ok) throw new Error("Failed to fetch filters");
        const filterData = await filterRes.json();
        const thesisCat = filterData.categories.find((c) => c.toLowerCase().includes("thesis"));
        if (!thesisCat) throw new Error("Thesis category not found");
        if (mounted) setThesisCategory(thesisCat);
        const res = await fetch(`${API_BASE}/api/search?category=${encodeURIComponent(thesisCat)}&page=1&limit=20`);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        if (mounted) { setBooks(data.data ?? data.results ?? []); setError(null); }
      } catch (err) {
        if (mounted) setError("Failed to load thesis papers.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const updateScrollBtns = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollL(el.scrollLeft > 4);
    setCanScrollR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollBtns);
    updateScrollBtns();
    return () => el.removeEventListener("scroll", updateScrollBtns);
  }, [books]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = (cfg.cardWidth + cfg.gap) * cfg.cols;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleBookClick = (book) => {
    const id = book.book_id ?? book.id;
    if (!id) return;
    router.push(`/book/${id}`);
  };

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

  return (
    <>
      <style>{`
        @keyframes lmis-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        .lmis-book-card { cursor: pointer; transition: all 0.2s ease; }
        .lmis-book-card:hover { border-color: #1e3a8a !important; }
        .lmis-scroll::-webkit-scrollbar { display: none; }
        .lmis-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <section style={{ background: "#fff", borderTop: "1px solid #f0f2f5" }}>
        <div style={{
          maxWidth: 1600,
          margin: "0 auto",
          overflow: "hidden",
          padding: windowWidth < 640
            ? `32px ${cfg.padX}px 40px`
            : `44px ${cfg.padX}px 40px`,
        }}>

          {/* ── Header ── */}
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
              Thesis / Research Papers
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: windowWidth < 640 ? 8 : 12 }}>
              <NavBtn dir="left"  disabled={!canScrollL} onClick={() => scroll("left")}  />
              <NavBtn dir="right" disabled={!canScrollR} onClick={() => scroll("right")} />
              {windowWidth >= 768 && (
                <button
                  onClick={() => thesisCategory && router.push(`/search?category=${encodeURIComponent(thesisCategory)}`)}
                  style={{
                    marginLeft: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#000000",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px 0",
                    whiteSpace: "nowrap",
                  }}
                >
                  VIEW ALL
                </button>
              )}
            </div>
          </div>

          {/* ── Scroll Row ── */}
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
          >
            {loading && Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ minWidth: cfg.cardWidth, maxWidth: cfg.cardWidth, flexShrink: 0, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                <div style={{ width: cfg.cardWidth, height: cfg.cardHeight, background: "#f3f4f6", animation: "lmis-pulse 1.5s ease-in-out infinite" }} />
                <div style={{ padding: "12px 12px 14px" }}>
                  <div style={{ height: 12, background: "#f3f4f6", borderRadius: 2, marginBottom: 8, animation: "lmis-pulse 1.5s ease-in-out infinite" }} />
                  <div style={{ height: 11, background: "#f3f4f6", borderRadius: 2, width: "60%", animation: "lmis-pulse 1.5s ease-in-out infinite" }} />
                </div>
              </div>
            ))}

            {!loading && error && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "60px 40px", color: "#9ca3af", width: "100%", textAlign: "center" }}>
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
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "60px 40px", color: "#9ca3af", width: "100%", textAlign: "center" }}>
                <BookOpen size={36} strokeWidth={1.2} />
                <p style={{ margin: 0, fontSize: 13 }}>No thesis papers available</p>
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
                    border: "1px solid #d1d5db",
                    borderRadius: 0,
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  {/* Cover */}
                  <div style={{ width: cfg.cardWidth, height: cfg.cardHeight, background: "#f0f4ff", position: "relative", overflow: "hidden" }}>
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

                  {/* Info */}
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

          {/* ── Mobile View All ── */}
          {windowWidth < 768 && (
            <div style={{ textAlign: "center", marginTop: -16 }}>
              <button
                onClick={() => thesisCategory && router.push(`/search?category=${encodeURIComponent(thesisCategory)}`)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 600, color: "#000000",
                  background: "none", border: "1px solid #000000",
                  borderRadius: 8, padding: "8px 20px", cursor: "pointer",
                }}
              >
                VIEW ALL
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default ThesisPapersSection;