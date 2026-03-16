"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PDFThumbnail from "../Search/PDFThumbnail";

// ─── helpers ────────────────────────────────────────────────────────────────

const formatDate = (raw) => {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const API_BASE = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── BookCard (grid) ─────────────────────────────────────────────────────────

const BookCard = ({ book, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(book)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cover with hover overlay */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <PDFThumbnail uploadId={book.upload_id} title={book.title} />

        {/* Read overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s ease",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "8px 18px",
              border: "1.5px solid rgba(255,255,255,0.7)",
              borderRadius: 4,
            }}
          >
            Read
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 0px 14px" }}>
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
            textAlign: "left",
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(book)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderBottom: isLast ? "none" : "1px solid #eef2ff",
        cursor: "pointer",
        background: hovered ? "#f8faff" : "#fff",
        transition: "background 0.15s ease",
      }}
    >
      <div
        style={{
          width: 44,
          height: 58,
          overflow: "hidden",
          flexShrink: 0,
          border: "1px solid #e6ecf7",
          position: "relative",
        }}
      >
        <PDFThumbnail
          uploadId={book.upload_id}
          title={book.title}
          style={{ aspectRatio: "unset", width: "100%", height: "100%" }}
        />
        {hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Read
            </span>
          </div>
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

const LIST_PAGE_SIZE = 10;

const ROWS = 2; // always show 2 rows in grid view

const RecentAdditions = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [page, setPage]             = useState(1);
  const [books, setBooks]           = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  // ─── Responsive config ──────────────────────────────────────────────────────
  const getResponsiveConfig = useCallback(() => {
    if (windowWidth < 640) {
      return { headerPadding: "20px 16px 16px", contentPadding: "0 16px 32px", columns: 2, gap: 28, titleSize: 24, showHeaderText: true };
    } else if (windowWidth < 768) {
      return { headerPadding: "32px 24px 16px", contentPadding: "0 24px 40px", columns: 3, gap: 36, titleSize: 26, showHeaderText: true };
    } else if (windowWidth < 1024) {
      return { headerPadding: "40px 32px 18px", contentPadding: "0 32px 48px", columns: 4, gap: 40, titleSize: 28, showHeaderText: false };
    } else if (windowWidth < 1280) {
      return { headerPadding: "40px 32px 18px", contentPadding: "0 32px 48px", columns: 5, gap: 40, titleSize: 28, showHeaderText: false };
    } else {
      return { headerPadding: "44px 48px 18px", contentPadding: "0 48px 56px", columns: 6, gap: 40, titleSize: 28, showHeaderText: false };
    }
  }, [windowWidth]);

  const config = getResponsiveConfig();

  // Page size = columns × 2 rows for grid; fixed for list
  const pageSize = isGridView ? config.columns * ROWS : LIST_PAGE_SIZE;

  const toggleView = (grid) => {
    setIsGridView(grid);
    setPage(1);
  };

  const fetchBooks = useCallback(async () => {
    if (windowWidth === 0) return; // wait until we know the width
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
  }, [page, pageSize, windowWidth]);

  const handleBookClick = (book) => {
    window.location.href = `/book/${book.book_id ?? book.id}`;
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to page 1 when columns change (breakpoint crossed)
  useEffect(() => {
    setPage(1);
  }, [config.columns]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // ─── Pagination button style ─────────────────────────────────────────────
  const paginationBtn = (disabled, isMobile) => ({
    width: isMobile ? 36 : 40,
    height: isMobile ? 32 : 36,
    borderRadius: isMobile ? 8 : 12,
    border: "1px solid #d1d8e8",
    background: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    display: "grid",
    placeItems: "center",
  });

  const isMobile = windowWidth < 640;

  return (
    <div style={{ background: "#fff" }}>
      {/* ── Header ── */}
      <div
        style={{
          maxWidth: 1700,
          margin: "0 auto",
          padding: config.headerPadding,
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 16,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: config.titleSize, fontWeight: 700, color: "#000", margin: 0, letterSpacing: "-0.01em" }}>
            {config.showHeaderText && isMobile ? "Recent" : "Recent Additions"}
          </h2>

          {/* Mobile: arrows beside title */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!canPrev || loading} style={paginationBtn(!canPrev || loading, true)}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={!canNext || loading} style={paginationBtn(!canNext || loading, true)}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop: arrows on right */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!canPrev || loading} style={paginationBtn(!canPrev || loading, false)}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={!canNext || loading} style={paginationBtn(!canNext || loading, false)}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ maxWidth: 1700, margin: "0 auto", padding: config.contentPadding, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
          Loading…
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{ maxWidth: 1700, margin: "0 auto", padding: config.contentPadding, color: "#dc2626", fontSize: 14, textAlign: "center" }}>
          Failed to load: {error}
        </div>
      )}

      {/* ── Grid view ── */}
      {!loading && !error && isGridView && (
        <div
          style={{
            maxWidth: 1700,
            margin: "0 auto",
            padding: config.contentPadding,
            display: "grid",
            gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
            gap: config.gap,
          }}
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={handleBookClick} />
          ))}
        </div>
      )}

      {/* ── List view ── */}
      {!loading && !error && !isGridView && (
        <div
          style={{
            maxWidth: 1700,
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

      {/* ── Empty ── */}
      {!loading && !error && books.length === 0 && (
        <div style={{ maxWidth: 1700, margin: "0 auto", padding: config.contentPadding, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
          No recent additions found.
        </div>
      )}
    </div>
  );
};

export default RecentAdditions;