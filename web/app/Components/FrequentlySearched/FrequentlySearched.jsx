"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, ChevronLeft, TrendingUp, BookOpen } from "lucide-react";

const ITEMS_PER_PAGE = 10;
const GRID_COLUMNS   = 5; // books visible per page in grid

const FrequentlySearched = () => {
  const router = useRouter();
  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [page,    setPage]    = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // ── responsive configuration ──────────────────────────────────────
  const getResponsiveConfig = () => {
    if (windowWidth < 640) { // Mobile
      return {
        headerPadding: "20px 16px 16px",
        contentPadding: "0 16px 32px",
        gridColumns: "repeat(2, 1fr)",
        gap: 12,
        titleSize: 24,
        showHeaderText: true,
        itemsPerPage: 6
      };
    } else if (windowWidth < 768) { // Tablet
      return {
        headerPadding: "32px 24px 16px",
        contentPadding: "0 24px 40px",
        gridColumns: "repeat(3, 1fr)",
        gap: 16,
        titleSize: 26,
        showHeaderText: true,
        itemsPerPage: 9
      };
    } else if (windowWidth < 1024) { // Small desktop
      return {
        headerPadding: "40px 32px 18px",
        contentPadding: "0 32px 48px",
        gridColumns: "repeat(4, 1fr)",
        gap: 18,
        titleSize: 28,
        showHeaderText: false,
        itemsPerPage: 8
      };
    } else { // Large desktop
      return {
        headerPadding: "48px 48px 24px",
        contentPadding: "0 48px 56px",
        gridColumns: "repeat(5, 1fr)",
        gap: 18,
        titleSize: 29,
        showHeaderText: false,
        itemsPerPage: 10
      };
    }
  };

  const config = getResponsiveConfig();

  // ── window resize listener ────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── fetch from backend ──────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      try {
        const r = await fetch(`/api/most-searched?limit=20`);
        if (!r.ok) throw new Error(`Server error ${r.status}`);
        const data = await r.json();
        
        const booksData = (data.results ?? []).map((book) => ({
          ...book,
          // 👇 point at the new endpoint; ?w=300 controls thumbnail width
          cover_url: book.upload_id
            ? `/api/book-cover/${book.upload_id}`
            : null,
        }));
        
        if (isMounted) {
          setBooks(booksData);
          setError(null);
        }
      } catch (err) {
        console.error("[FrequentlySearched] fetch error:", err);
        if (isMounted) {
          setError("Failed to load most searched books.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  // ── pagination ──────────────────────────────────────────────────────────
  const itemsPerPage = config.itemsPerPage;
  const maxPage    = Math.max(0, Math.ceil(books.length / itemsPerPage) - 1);
  const visible    = books.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(maxPage, p + 1));

  const handleBookClick = (book) => {
    // navigate to book detail page — adjust to your router
    router.push(`/books/${book.id}`);
  };

  // ── skeleton card ───────────────────────────────────────────────────────
  const SkeletonCard = () => (
    <div style={{
      border: "1px solid #e6ecf7",
      borderRadius: 5,
      overflow: "hidden",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ aspectRatio: "3/4", background: "#eef2fb" }} />
      <div style={{ padding: "12px 12px 14px" }}>
        <div style={{ height: 13, background: "#eef2fb", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 11, background: "#eef2fb", borderRadius: 4, width: "60%" }} />
      </div>
    </div>
  );

  // ── empty state ─────────────────────────────────────────────────────────
  const EmptyState = () => (
    <div style={{
      gridColumn: `1 / -1`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 0",
      color: "#9ca3af",
      gap: 12,
    }}>
      <BookOpen size={40} strokeWidth={1.2} />
      <p style={{ margin: 0, fontSize: 14 }}>No search data yet — start searching!</p>
    </div>
  );

  // ── error state ─────────────────────────────────────────────────────────
  const ErrorState = () => (
    <div style={{
      gridColumn: `1 / -1`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 0",
      color: "#ef4444",
      gap: 12,
    }}>
      <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          fontSize: 13,
          color: "#003087",
          background: "none",
          border: "1px solid #003087",
          borderRadius: 8,
          padding: "6px 16px",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .book-card {
          cursor: pointer;
          border: 1px solid #e6ecf7;
          border-radius: 5px;
          overflow: hidden;
          transition: box-shadow 0.18s, transform 0.18s;
        }
        .book-card:hover {
          box-shadow: 0 6px 24px rgba(0,48,135,0.10);
          transform: translateY(-2px);
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
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid #d1d8e8;
          background: #fff;
          display: grid;
          place-items: center;
          transition: background 0.15s, border-color 0.15s;
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

      <div style={{ background: "#fff", maxWidth: 1440, margin: "0 auto" }}>

      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: windowWidth < 640 ? "flex-start" : "center",
        justifyContent: "space-between",
        padding: config.headerPadding,
        maxWidth: 1440,
        marginLeft: "auto",
        marginRight: "auto",
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
            {config.showHeaderText && windowWidth < 640 ? "Trending" : "Most Searched Books"}
          </h2>
          
          {/* Pagination arrows - show beside title on mobile */}
          {windowWidth < 640 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={handlePrev}
                disabled={page === 0}
                style={{
                  width: 36,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid #d1d8e8",
                  background: "#fff",
                  cursor: page === 0 ? "not-allowed" : "pointer",
                  opacity: page === 0 ? 0.5 : 1,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                disabled={page === maxPage}
                style={{
                  width: 36,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid #d1d8e8",
                  background: "#fff",
                  cursor: page === maxPage ? "not-allowed" : "pointer",
                  opacity: page === maxPage ? 0.5 : 1,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop pagination arrows */}
        {windowWidth >= 640 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 12 }} />
            <button
              onClick={handlePrev}
              disabled={page === 0}
              style={{
                width: 40,
                height: 36,
                borderRadius: 12,
                border: "1px solid #d1d8e8",
                background: "#fff",
                cursor: page === 0 ? "not-allowed" : "pointer",
                opacity: page === 0 ? 0.5 : 1,
                display: "grid",
                placeItems: "center",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              disabled={page === maxPage}
              style={{
                width: 40,
                height: 36,
                borderRadius: 12,
                border: "1px solid #d1d8e8",
                background: "#fff",
                cursor: page === maxPage ? "not-allowed" : "pointer",
                opacity: page === maxPage ? 0.5 : 1,
                display: "grid",
                placeItems: "center",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

        {/* ── Grid ── */}
        <div style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: config.contentPadding,
          display: "grid",
          gridTemplateColumns: config.gridColumns,
          gap: config.gap,
        }}>

          {/* Loading skeletons */}
          {loading && Array.from({ length: parseInt(config.gridColumns.match(/\d+/)[0]) }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

          {/* Error */}
          {!loading && error && <ErrorState />}

          {/* Empty */}
          {!loading && !error && books.length === 0 && <EmptyState />}

          {/* Book cards */}
          {!loading && !error && visible.map((book, idx) => {
            const globalRank = page * itemsPerPage + idx + 1;
            return (
              <div
                key={book.id}
                className="book-card"
                onClick={() => handleBookClick(book)}
              >
                {/* Cover */}
                <div style={{ aspectRatio: "3/4", background: "#f0f4ff", position: "relative" }}>
                  {book.cover_url ? (
                    <Image
                      src={book.cover_url}
                      alt={book.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    /* Fallback: colored spine with title */
                    <div style={{
                      width: "100%",
                      height: "100%",
                      background: `hsl(${(book.id * 47) % 360}, 35%, 28%)`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px 10px",
                      boxSizing: "border-box",
                    }}>
                      <BookOpen size={28} color="rgba(255,255,255,0.5)" strokeWidth={1.2} style={{ marginBottom: 10 }} />
                      <span style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 11,
                        fontWeight: 600,
                        textAlign: "center",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {book.title}
                      </span>
                    </div>
                  )}

                  {/* Rank badge */}
                  <span className="rank-badge">#{globalRank}</span>

                  {/* Search count pill */}
                  {book.search_count > 0 && (
                    <span style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.55)",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 4,
                      padding: "2px 6px",
                      backdropFilter: "blur(2px)",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}>
                      <TrendingUp size={9} />
                      {book.search_count.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "12px 12px 14px" }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.25,
                    marginBottom: 6,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {book.title}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: "#4b5563",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                  }}>
                    <span style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
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
    </>
  );
};

export default FrequentlySearched;