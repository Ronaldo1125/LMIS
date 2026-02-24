"use client";

import React, { useState } from "react";
import books from "../../data/books.js";

export default function RecentAdditions() {
  const [visibleCount, setVisibleCount] = useState(10);
  const visible = books.slice(0, visibleCount);

  return (
    <section style={{ background: "#fff" }}>
      {/* Header */}
      <div
        style={{
          padding: "48px 48px 24px",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 32,
            fontWeight: 700,
            color: "#003087",
            margin: 0,
          }}
        >
          Recent Additions
        </h2>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "0 48px",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 32,
          marginBottom: 40,
        }}
      >
        {visible.map((book, idx) => (
          <div key={book.id} style={{ cursor: "pointer" }}>
            {/* Cover */}
            <img
              src={book.cover}
              alt={book.title}
              style={{
                borderRadius: 4,
                marginBottom: 10,
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />

            {/* ONLY: title, author, year */}
            <div style={{ lineHeight: 1.25 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: 4,
                }}
              >
                {book.title}
              </div>

              <div style={{ fontSize: 11, color: "#6b7280" }}>
                {book.author}
              </div>

              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                {book.year}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      {visibleCount < books.length && (
        <div style={{ textAlign: "center", paddingBottom: 64 }}>
          <button
            onClick={() => setVisibleCount((v) => v + 6)}
            style={{
              background: "#fff",
              border: "1px solid #003087",
              color: "#003087",
              padding: "10px 28px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}