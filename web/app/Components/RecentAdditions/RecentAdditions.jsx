"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

const formatDate = (raw) => {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const API_BASE       = "http://localhost:5000";
const THUMBNAIL_BASE = `${API_BASE}/api/book-cover`; // GET /api/book-cover/:uploadId

// Pull the JWT stored by your auth flow (adjust key name if different)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const SPINE_COLORS = [
  "#1a3a6e","#0e5c8a","#1a4d6e","#283593","#115f7a",
  "#0a3d62","#1b4f72","#154360","#1a5276","#0e3460",
];
const spineColor = (id) => SPINE_COLORS[id % SPINE_COLORS.length];

// ─── PlaceholderCover ────────────────────────────────────────────────────────

const PlaceholderCover = ({ title, color }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: color,
      display: "flex",
      alignItems: "flex-end",
      padding: "10px 8px",
    }}
  >
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "rgba(255,255,255,0.85)",
        lineHeight: 1.3,
        display: "-webkit-box",
        WebkitLineClamp: 4,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {title}
    </span>
  </div>
);

// ─── BookCard (grid) ─────────────────────────────────────────────────────────

const BookCard = ({ book, onClick }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasCover = !!book.upload_id && !imgFailed;
  const coverSrc = book.upload_id ? `${THUMBNAIL_BASE}/${book.upload_id}` : null;

  return (
    <div
      onClick={() => onClick(book)}
      style={{
        cursor: "pointer",
        border: "1px solid #e6ecf7",
        borderRadius: 5,
        overflow: "hidden",
        transition: "box-shadow 0.18s, transform 0.18s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,48,135,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Cover */}
      <div style={{ aspectRatio: "3/4", background: "#f6f8ff", overflow: "hidden", position: "relative" }}>
        {hasCover ? (
          <Image
            src={coverSrc}
            alt={book.title}
            onError={() => setImgFailed(true)}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <PlaceholderCover title={book.title} color={spineColor(book.id)} />
        )}
      </div>

      {/* Info: title · author · date_of_publication */}
      <div style={{ padding: "12px 12px 14px" }}>
        <div
          title={book.title}
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.25,
            marginBottom: 6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {book.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#4b5563",
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}
            title={book.author}
          >
            {book.author}
          </span>
          <span style={{ color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>
            {formatDate(book.date_of_publication)}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── BookRow (list) ──────────────────────────────────────────────────────────

const BookRow = ({ book, onClick, isLast }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasCover = !!book.upload_id && !imgFailed;
  const coverSrc = book.upload_id ? `${THUMBNAIL_BASE}/${book.upload_id}` : null;

  return (
    <div
      onClick={() => onClick(book)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderBottom: isLast ? "none" : "1px solid #eef2ff",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#f7faff")}
      onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
    >
      <div
        style={{
          width: 44,
          height: 58,
          borderRadius: 6,
          overflow: "hidden",
          flexShrink: 0,
          border: "1px solid #e6ecf7",
          position: "relative",
        }}
      >
        {hasCover ? (
          <Image
            src={coverSrc}
            alt={book.title}
            onError={() => setImgFailed(true)}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <PlaceholderCover title="" color={spineColor(book.id)} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          title={book.title}
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.25,
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {book.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#4b5563",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}
            title={book.author}
          >
            {book.author}
          </span>
          <span style={{ fontWeight: 600, color: "#6b7280", whiteSpace: "nowrap" }}>
            {formatDate(book.date_of_publication)}
          </span>
        </div>
      </div>

      <ChevronRight size={18} style={{ opacity: 0.4, flexShrink: 0 }} />
    </div>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────

const GRID_PAGE_SIZE = 6;
const LIST_PAGE_SIZE = 5;

const GridIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const ListIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const RecentAdditions = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [page, setPage]             = useState(1);
  const [books, setBooks]           = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const pageSize = isGridView ? GRID_PAGE_SIZE : LIST_PAGE_SIZE;

  const toggleView = (grid) => {
    setIsGridView(grid);
    setPage(1);
  };

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/acquisitions?page=${page}&limit=${pageSize}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Unknown error");
      setBooks(json.data);
      setTotalPages(json.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const handleBookClick = (book) => {
    window.location.href = `/book/${book.book_id ?? book.id}`;
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  // Responsive configuration
  const getResponsiveConfig = () => {
    if (windowWidth < 640) { // Mobile
      return {
        headerPadding: "20px 16px 16px",
        contentPadding: "0 16px 32px",
        gridColumns: "repeat(2, 1fr)",
        gap: 12,
        titleSize: 24,
        showHeaderText: true
      };
    } else if (windowWidth < 768) { // Tablet
      return {
        headerPadding: "32px 24px 16px",
        contentPadding: "0 24px 40px",
        gridColumns: "repeat(3, 1fr)",
        gap: 16,
        titleSize: 26,
        showHeaderText: true
      };
    } else if (windowWidth < 1024) { // Small desktop
      return {
        headerPadding: "40px 32px 18px",
        contentPadding: "0 32px 48px",
        gridColumns: "repeat(4, 1fr)",
        gap: 18,
        titleSize: 28,
        showHeaderText: false
      };
    } else { // Large desktop
      return {
        headerPadding: "44px 48px 18px",
        contentPadding: "0 48px 56px",
        gridColumns: "repeat(5, 1fr)",
        gap: 18,
        titleSize: 28,
        showHeaderText: false
      };
    }
  };

  const config = getResponsiveConfig();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div style={{ background: "#fff" }}>
      {/* Header */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: config.headerPadding,
          display: "flex",
          alignItems: windowWidth < 640 ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 16,
          flexDirection: windowWidth < 640 ? "column" : "row",
        }}
      >
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: config.titleSize, fontWeight: 700, color: "#000000ff", margin: 0, letterSpacing: "-0.01em" }}>
            {config.showHeaderText && windowWidth < 640 ? "Recent" : "Recent Additions"}
          </h2>
          
          {/* View toggles and pagination - show beside title on mobile */}
          {windowWidth < 640 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* View toggles */}
              {[
                { grid: true,  Icon: GridIcon },
                { grid: false, Icon: ListIcon },
              ].map(({ grid, Icon }) => (
                <button
                  key={String(grid)}
                  onClick={() => toggleView(grid)}
                  title={grid ? "Grid view" : "List view"}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: "1px solid #d1d8e8",
                    background: isGridView === grid ? "#e8eeff" : "#fff",
                    color: isGridView === grid ? "#003087" : "#6b7280",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon size={14} />
                </button>
              ))}
              
              <div style={{ width: 6 }} />
              
              {/* Pagination arrows */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev || loading}
                style={{
                  width: 36, height: 32, borderRadius: 8,
                  border: "1px solid #d1d8e8", background: "#fff",
                  cursor: (!canPrev || loading) ? "not-allowed" : "pointer",
                  opacity: (!canPrev || loading) ? 0.45 : 1,
                  display: "grid", placeItems: "center",
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!canNext || loading}
                style={{
                  width: 36, height: 32, borderRadius: 8,
                  border: "1px solid #d1d8e8", background: "#fff",
                  cursor: (!canNext || loading) ? "not-allowed" : "pointer",
                  opacity: (!canNext || loading) ? 0.45 : 1,
                  display: "grid", placeItems: "center",
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop controls */}
        {windowWidth >= 640 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* View toggles - desktop only */}
            {[
              { grid: true,  Icon: GridIcon },
              { grid: false, Icon: ListIcon },
            ].map(({ grid, Icon }) => (
              <button
                key={String(grid)}
                onClick={() => toggleView(grid)}
                title={grid ? "Grid view" : "List view"}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: "1px solid #d1d8e8",
                  background: isGridView === grid ? "#e8eeff" : "#fff",
                  color: isGridView === grid ? "#003087" : "#6b7280",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon size={16} />
              </button>
            ))}

            <div style={{ width: 8 }} />

            {/* Pagination arrows */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev || loading}
              style={{
                width: 40, height: 36, borderRadius: 12,
                border: "1px solid #d1d8e8", background: "#fff",
                cursor: (!canPrev || loading) ? "not-allowed" : "pointer",
                opacity: (!canPrev || loading) ? 0.45 : 1,
                display: "grid", placeItems: "center",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!canNext || loading}
              style={{
                width: 40, height: 36, borderRadius: 12,
                border: "1px solid #d1d8e8", background: "#fff",
                cursor: (!canNext || loading) ? "not-allowed" : "pointer",
                opacity: (!canNext || loading) ? 0.45 : 1,
                display: "grid", placeItems: "center",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: config.contentPadding, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
          Loading…
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: config.contentPadding, color: "#dc2626", fontSize: 14, textAlign: "center" }}>
          Failed to load: {error}
        </div>
      )}

      {/* Grid view */}
      {!loading && !error && isGridView && (
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: config.contentPadding,
            display: "grid",
            gridTemplateColumns: config.gridColumns,
            gap: config.gap,
          }}
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={handleBookClick} />
          ))}
        </div>
      )}

      {/* List view */}
      {!loading && !error && !isGridView && (
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: config.contentPadding,
            border: "1px solid #e6ecf7",
            borderRadius: 14,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {books.map((book, index) => (
            <BookRow
              key={book.id}
              book={book}
              onClick={handleBookClick}
              isLast={index === books.length - 1}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && books.length === 0 && (
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: config.contentPadding, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
          No recent additions found.
        </div>
      )}
    </div>
  );
};

export default RecentAdditions;