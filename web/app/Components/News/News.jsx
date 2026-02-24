"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const newsData = [
  {
    category: "Announcement",
    title: "DepDev 5 Library Launches New Digital Resource Portal for 2025",
    excerpt: "Students and faculty can now access over 40 new databases and research tools through the expanded digital portal, available around the clock.",
    date: "February 18, 2025",
    size: "large",
    bg: "#dce8f5",
  },
  {
    category: "Workshop",
    title: "Research Methods Workshop Series — Spring 2025",
    excerpt: "Register now for free sessions on qualitative and quantitative methods every Tuesday.",
    date: "February 10, 2025",
    size: "small",
    bg: "#e0ecf8",
  },
  {
    category: "Collection Update",
    title: "500 New eBooks Added to Community Development Collection",
    excerpt: "Explore the latest titles now available through our online catalog with instant access.",
    date: "January 28, 2025",
    size: "small",
    bg: "#d6e5f5",
  },
  {
    category: "Announcement",
    title: "Library Extended Hours During Final Examination Week",
    excerpt: "The DepDev 5 Library will be open 24 hours during the final exam period to support students.",
    date: "January 15, 2025",
    size: "large",
    bg: "#dce8f5",
  },
  {
    category: "Event",
    title: "Book Fair and Author Talk: Community Development in Practice",
    excerpt: "Join us for a special author talk and book signing event open to all students and faculty.",
    date: "January 5, 2025",
    size: "small",
    bg: "#e0ecf8",
  },
  {
    category: "Collection Update",
    title: "New Thesis and Research Paper Submissions Now Open",
    excerpt: "Graduate students can now submit their theses digitally through the library portal for archiving.",
    date: "December 20, 2024",
    size: "small",
    bg: "#d6e5f5",
  },
];

// Group news into slides of 3 (1 large + 2 small)
const slides = [];
for (let i = 0; i < newsData.length; i += 3) {
  slides.push(newsData.slice(i, i + 3));
}

const NewsIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#0057b8" strokeWidth="1.2" opacity="0.35">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

const News = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prev = () => setCurrentSlide((s) => Math.max(s - 1, 0));
  const next = () => setCurrentSlide((s) => Math.min(s + 1, slides.length - 1));
  const current = slides[currentSlide];

  return (
    <div style={{ background: "#fff" }}>
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
          fontSize: 32,
          fontWeight: 700,
          color: "#003087",
          margin: 0,
        }}>
          Library News
        </h2>

        {/* Arrows + View All */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Prev / Next arrows */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={prev}
              disabled={currentSlide === 0}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "1px solid #d1d8e8",
                background: currentSlide === 0 ? "#f5f7fa" : "#fff",
                color: currentSlide === 0 ? "#c0c8d8" : "#003087",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentSlide === 0 ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              disabled={currentSlide === slides.length - 1}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "1px solid #d1d8e8",
                background: currentSlide === slides.length - 1 ? "#f5f7fa" : "#fff",
                color: currentSlide === slides.length - 1 ? "#c0c8d8" : "#003087",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentSlide === slides.length - 1 ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

        
        </div>
      </div>

      {/* News Grid — 2fr 1fr 1fr */}
      <div style={{
        maxWidth: 1600,
        margin: "0 auto",
        padding: "0 48px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: 32,
        marginBottom: 40,
      }}>
        {current.map((item, i) => (
          <div
            key={item.title}
            style={{ cursor: "pointer" }}
          >
            {/* Image placeholder */}
            <div style={{
              background: item.bg,
              borderRadius: 6,
              marginBottom: 18,
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <NewsIcon />
            </div>

            {/* Category */}
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#0057b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}>
              {item.category}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: i === 0 ? 20 : 16,
              fontWeight: 600,
              lineHeight: 1.4,
              marginBottom: 10,
              color: "#111827",
              margin: "0 0 10px 0",
            }}>
              {item.title}
            </h3>

            {/* Excerpt */}
            <p style={{
              fontSize: 14,
              color: "#6b7280",
              lineHeight: 1.6,
              marginBottom: 12,
              margin: "0 0 12px 0",
            }}>
              {item.excerpt}
            </p>

            {/* Date */}
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
