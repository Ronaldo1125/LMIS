"use client";

import React, { useState } from "react";
import { LayoutGrid, List } from "lucide-react";

const BOOK_COLORS = [
  "#1a3a6e",
  "#0e5c8a",
  "#1a4d6e",
  "#283593",
  "#115f7a",
  "#1a4d6e",
  "#0a3d62",
  "#1b4f72",
  "#154360",
  "#1a5276",
  "#0e3460",
  "#1b4f72",
  "#1a5276",
  "#0e3460",
];

const sampleBooks = [
  { rank: 1,  title: "Community Development in an Uncertain World", author: "Ife & Tesoriero",       edition: "4th Edition · 2016", label: "Community Development",        badge: "Available" },
  { rank: 2,  title: "Understanding Social Policy",                 author: "Alcock et al.",          edition: "9th Edition · 2021", label: "Social Policy & Practice",     badge: "Available" },
  { rank: 3,  title: "Research Design: Qualitative & Mixed",        author: "Creswell",               edition: "5th Edition · 2018", label: "Research Methods",             badge: "eBook"     },
  { rank: 4,  title: "Collaborative Planning: Shaping Places",      author: "Healey",                 edition: "2nd Edition · 2006", label: "Urban Planning",               badge: "Available" },
  { rank: 5,  title: "Geographies of Development",                  author: "Potter et al.",          edition: "3rd Edition · 2008", label: "Development Studies",          badge: "eBook"     },
  { rank: 6,  title: "Participatory Action Research in Practice",   author: "Kindon, Pain & Kesby",   edition: "1st Edition · 2007", label: "Research Methods",             badge: "Available" },
  { rank: 7,  title: "Social Innovation and Impact Measurement",    author: "Mulgan",                 edition: "1st Edition · 2019", label: "Social Work",                  badge: "eBook"     },
  { rank: 8,  title: "Youth Development Frameworks",                author: "Eccles & Gootman",       edition: "1st Edition · 2002", label: "Education",                    badge: "Available" },
  { rank: 9,  title: "Intersectionality in Public Policy",          author: "Hankivsky",              edition: "2nd Edition · 2021", label: "Policy Studies",               badge: "Available" },
  { rank: 10, title: "Sustainable Development Goals Handbook",      author: "UN Global Compact",      edition: "2025 Edition",       label: "Development Studies",          badge: "eBook"     },
];

const FrequentlySearched = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isGridView, setIsGridView] = useState(true);

  const visible = sampleBooks.slice(0, visibleCount);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>

      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "48px 48px 24px",
        marginBottom: 32,
        maxWidth: 1600,
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          fontWeight: 700,
          color: "#003087",
          margin: 0,
        }}>
          Most Searched Books
        </h2>
      </div>

      {/* GRID VIEW */}
      {isGridView && (
        <div style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "0 48px",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 32,
          marginBottom: 40,
        }}>
          {visible.map((book) => (
            <div
              key={book.rank}
              style={{ cursor: "pointer" }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {/* Book Cover */}
              <div style={{
                background: BOOK_COLORS[(book.rank - 1) % BOOK_COLORS.length],
                borderRadius: 4,
                marginBottom: 10,
                aspectRatio: "2/3",
                display: "flex",
                alignItems: "flex-end",
                padding: 12,
                position: "relative",
                transition: "transform 0.15s",
              }}>
                {/* Rank Badge */}
                <div style={{
                  position: "absolute", top: 10, left: 10,
                  width: 24, height: 24,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#fff",
                }}>
                  {book.rank}
                </div>

                {/* Label + Author */}
                <div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 13, fontWeight: 700,
                    color: "rgba(255,255,255,0.95)",
                    lineHeight: 1.3,
                  }}>
                    {book.label}
                  </div>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>
                    {book.author}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3, color: "#111827" }}>
                {book.title}
              </div>
              {/* Edition */}
              <div style={{ fontSize: 11, color: "#6b7280" }}>{book.edition}</div>
              {/* Badge */}
              <span style={{
                display: "inline-block",
                fontSize: 10, fontWeight: 600,
                padding: "2px 7px", borderRadius: 3, marginTop: 6,
                background: "#e8f0fb", color: "#003087",
              }}>
                {book.badge}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {!isGridView && (
        <div style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "0 48px",
          border: "1px solid #d1d8e8",
          borderRadius: 6,
          overflow: "hidden",
          marginBottom: 40,
        }}>
          {visible.map((book, i) => (
            <div
              key={book.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "16px 24px",
                borderBottom: i < visible.length - 1 ? "1px solid #d1d8e8" : "none",
                cursor: "pointer",
                background: "#fff",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#f4f7fd")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {/* Rank */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#003087",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {book.rank}
              </div>

              {/* Mini cover */}
              <div style={{
                width: 36, height: 50, borderRadius: 3,
                background: BOOK_COLORS[(book.rank - 1) % BOOK_COLORS.length],
                flexShrink: 0,
              }} />

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                  {book.title}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  {book.author} · {book.edition}
                </div>
              </div>

              {/* Badge */}
              <span style={{
                fontSize: 10, fontWeight: 600,
                padding: "3px 9px", borderRadius: 3,
                background: "#e8f0fb", color: "#003087",
                flexShrink: 0,
              }}>
                {book.badge}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {visibleCount < sampleBooks.length && (
        <div style={{ textAlign: "center", paddingBottom: 64 }}>
          <button
            onClick={() => setVisibleCount((v) => v + 5)}
            style={{
              background: "#fff",
              border: "1px solid #003087",
              color: "#003087",
              padding: "10px 28px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#003087";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#003087";
            }}
          >
            Load More
          </button>
        </div>
      )}

    </div>
  );
};

export default FrequentlySearched;
