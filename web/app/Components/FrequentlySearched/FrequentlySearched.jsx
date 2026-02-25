"use client";

import React, { useState } from "react";
import { LayoutGrid, List, ChevronRight, ChevronLeft } from "lucide-react";

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
  { rank: 1, id: 1, title: "Community Development in an Uncertain World", author: "Ife & Tesoriero", edition: "4th Edition · 2016", label: "Community Development", badge: "Available", year: 2016, coverImage: "/assets/BooksImages/2.avif" },
  { rank: 2, id: 2, title: "Understanding Social Policy", author: "Alcock et al.", edition: "9th Edition · 2021", label: "Social Policy & Practice", badge: "Available", year: 2021, coverImage: "/assets/BooksImages/200.png" },
  { rank: 3, id: 3, title: "Research Design: Qualitative & Mixed", author: "Creswell", edition: "5th Edition · 2018", label: "Research Methods", badge: "eBook", year: 2018, coverImage: "/assets/BooksImages/3.jpg" },
  { rank: 4, id: 4, title: "Collaborative Planning: Shaping Places", author: "Healey", edition: "2nd Edition · 2006", label: "Urban Planning", badge: "Available", year: 2006, coverImage: "/assets/BooksImages/4.png" },
  { rank: 5, id: 5, title: "Geographies of Development", author: "Potter et al.", edition: "3rd Edition · 2008", label: "Development Studies", badge: "eBook", year: 2008, coverImage: "/assets/BooksImages/2.avif" },
  { rank: 6, id: 6, title: "Participatory Action Research in Practice", author: "Kindon, Pain & Kesby", edition: "1st Edition · 2007", label: "Research Methods", badge: "Available", year: 2007, coverImage: "/assets/BooksImages/200.png" },
  { rank: 7, id: 7, title: "Social Innovation and Impact Measurement", author: "Mulgan", edition: "1st Edition · 2019", label: "Social Work", badge: "eBook", year: 2019, coverImage: "/assets/BooksImages/3.jpg" },
  { rank: 8, id: 8, title: "Youth Development Frameworks", author: "Eccles & Gootman", edition: "1st Edition · 2002", label: "Education", badge: "Available", year: 2002, coverImage: "/assets/BooksImages/4.png" },
  { rank: 9, id: 9, title: "Intersectionality in Public Policy", author: "Hankivsky", edition: "2nd Edition · 2021", label: "Policy Studies", badge: "Available", year: 2021, coverImage: "/assets/BooksImages/2.avif" },
  { rank: 10, id: 10, title: "Sustainable Development Goals Handbook", author: "UN Global Compact", edition: "2025 Edition", label: "Development Studies", badge: "eBook", year: 2025, coverImage: "/assets/BooksImages/200.png" },
];

const FrequentlySearched = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isGridView, setIsGridView] = useState(true);
  const [page, setPage] = useState(0);

  const itemsPerPage = 10;
  const maxPage = Math.ceil(sampleBooks.length / itemsPerPage) - 1;

  const handlePrev = () => setPage(prev => Math.max(0, prev - 1));
  const handleNext = () => setPage(prev => Math.min(maxPage, prev + 1));

  const handleBookClick = (book) => {
    console.log('Clicked book:', book);
  };

  const visible = sampleBooks.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div style={{ background: "#fff", maxWidth: 1440, margin: "0 auto" }}>

      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "48px 48px 24px",
        maxWidth: 1440,
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <h2 style={{
          fontSize: 29,
          fontWeight: 600,
          color: "#003087",
          margin: 0,
        }}>
          Most Searched Books
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Arrows */}
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
      </div>

      {/* GRID VIEW */}
      {isGridView && (
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 48px 56px",
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 18,
          }}
        >
          {visible.map((book) => (
            <div
              key={book.rank}
              onClick={() => handleBookClick(book)}
              style={{
                cursor: "pointer",
                border: "1px solid #e6ecf7",
                borderRadius:5,
                overflow: "hidden",
              
              }}
             
            >
              {/* Cover */}
              <div style={{ aspectRatio: "3/4", background: "#f6f8ff" }}>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Minimal Info (ONLY Title, Author, Year) */}
              <div style={{ padding: "12px 12px 14px" }}>
                <div
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
                    lineHeight: 1.2,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                    title={book.author}
                  >
                    {book.author}
                  </span>
                  <span style={{ color: "#6b7280", fontWeight: 600 }}>
                    {book.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {!isGridView && (
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 48px 56px",
            border: "1px solid #e6ecf7",
            borderRadius: 14,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {visible.map((book, index) => (
            <div
              key={book.rank}
              onClick={() => handleBookClick(book)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderBottom:
                  index < visible.length - 1 ? "1px solid #eef2ff" : "none",
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
                  borderRadius: 10,
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid #e6ecf7",
                  background: "#f6f8ff",
                }}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
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
                  title={book.title}
                >
                  {book.title}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#4b5563",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flex: 1,
                    }}
                    title={book.author}
                  >
                    {book.author}
                  </span>
                  <span style={{ fontWeight: 700, color: "#6b7280" }}>
                    {book.year}
                  </span>
                </div>
              </div>

              <ChevronRight size={18} style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrequentlySearched;
