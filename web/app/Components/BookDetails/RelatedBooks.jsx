"use client";

import React, { useEffect, useState, useCallback } from "react";
import PDFThumbnail from "../Search/PDFThumbnail";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div style={{ overflow: "hidden", background: "#fff" }}>
    <div style={{
      width: "100%",
      aspectRatio: "3/4",
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
    <div style={{ padding: "12px 0px 14px" }}>
      <div style={{ height: 12, background: "#f0f0f0", borderRadius: 0, marginBottom: 8, width: "80%" }} />
      <div style={{ height: 12, background: "#f0f0f0", borderRadius: 0, width: "55%" }} />
    </div>
  </div>
);

// ─── BookCard ────────────────────────────────────────────────────────────────

const BookCard = ({ book, onClick }) => {
  // Resolve upload ID from either flat or nested API shape
  const uploadId = book.upload_id ?? book.upload?.id ?? null;

  return (
    <div
      onClick={() => onClick(book)}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#fff",
        transition: "box-shadow 0.15s, transform 0.15s",
        outline: "none",
        textAlign: "left",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/*
        FIX: wrap PDFThumbnail in a container with an explicit height.
        Without this, wrapper.offsetHeight inside PDFThumbnail is 0,
        which makes the scale calculation produce NaN and the render silently fails.
      */}
      <div style={{
        width: "100%",
        aspectRatio: "3/4",
        position: "relative",
        overflow: "hidden",
        background: "#f3f4f6",
      }}>
        <PDFThumbnail
          uploadId={uploadId}
          title={book.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "12px 0px 14px", textAlign: "left" }}>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#111827",
          lineHeight: 1.3,
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
            {book.author || "Unknown author"}
          </span>
          {book.year && (
            <span style={{ color: "#9ca3af", fontWeight: 600, flexShrink: 0 }}>
              {book.year}
            </span>
          )}
        </div>

        {book.category && (
          <div style={{ marginTop: 6 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.03em",
              color: "#1e40af",
              background: "#dbeafe",
              borderRadius: 4,
              padding: "2px 6px",
            }}>
              {book.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── component ────────────────────────────────────────────────────────────────

const RelatedBooks = ({ currentBookId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const getResponsiveConfig = useCallback(() => {
    if (windowWidth < 640) {
      return { headerPadding: "20px 16px 16px", contentPadding: "0 16px 32px", gridColumns: "repeat(2, 1fr)", gap: 28, titleSize: 24, maxWidth: 640 };
    } else if (windowWidth < 768) {
      return { headerPadding: "32px 24px 16px", contentPadding: "0 24px 40px", gridColumns: "repeat(3, 1fr)", gap: 36, titleSize: 26, maxWidth: 768 };
    } else if (windowWidth < 1024) {
      return { headerPadding: "40px 32px 18px", contentPadding: "0 32px 48px", gridColumns: "repeat(4, 1fr)", gap: 40, titleSize: 28, maxWidth: 1024 };
    } else {
      return { headerPadding: "44px 48px 18px", contentPadding: "0 48px 56px", gridColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 40, titleSize: 28, maxWidth: 1600 };
    }
  }, [windowWidth]);

  const config = getResponsiveConfig();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
          `${API_BASE}/api/books/${currentBookId}/related?limit=6`,
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

  const handleBookClick = (book) => {
    window.location.href = `/book/${book.id}`;
  };

  if (!loading && !error && books.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: config.maxWidth || 1600, margin: "0 auto", padding: config.headerPadding }}>
          <h2 style={{ fontSize: config.titleSize, fontWeight: 600, color: "#003087", margin: 0 }}>
            Related Books
          </h2>
        </div>

        {loading && (
          <div style={{
            maxWidth: config.maxWidth || 1600,
            margin: "0 auto",
            padding: config.contentPadding,
            display: "grid",
            gridTemplateColumns: config.gridColumns,
            gap: config.gap,
          }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && !loading && (
          <div style={{ maxWidth: config.maxWidth || 1600, margin: "0 auto", padding: config.contentPadding }}>
            <p style={{ fontSize: 13, color: "#ef4444" }}>Could not load related books.</p>
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div style={{
            maxWidth: config.maxWidth || 1600,
            margin: "0 auto",
            padding: config.contentPadding,
            display: "grid",
            gridTemplateColumns: config.gridColumns,
            gap: config.gap,
          }}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} onClick={handleBookClick} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RelatedBooks;