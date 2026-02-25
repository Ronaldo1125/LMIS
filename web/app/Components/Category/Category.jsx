"use client";

import React, { useMemo } from "react";
import Link from "next/link";

const rawCategories = [
  { name: "Books", icon: <BooksIcon /> },
  { name: "Sourcebooks", icon: <SourcebookIcon /> },
  { name: "Periodicals", icon: <PeriodicalIcon /> },
  { name: "Thesis / Research Papers", icon: <ThesisIcon /> },
  { name: "Statute / Law / Legal Documents", icon: <LawIcon /> },
  { name: "Guide / Manuals", icon: <GuideIcon /> },
  { name: "Report", icon: <ReportIcon /> },
  { name: "Reference Materials", icon: <ReferenceIcon /> },
];

export default function Category() {
  const categories = useMemo(() => rawCategories, []);

  return (
    <section className="w-full bg-white pt-15">
      <div style={{
        maxWidth: 1440,
        marginLeft: "auto",
        marginRight: "auto",
        padding: "48px 48px 24px",
      }}>
        {/* Title */}
        <div className="text-center">
          <h2 className="text-[40px] sm:text-[56px] font-medium leading-[1.05] tracking-tight text-black" >
            Browse Categories
          </h2>

          <p className="mt-4 text-[14px] sm:text-[16px] text-black/60 max-w-[760px] mx-auto leading-relaxed">
            Explore thousands of government publications, research materials, journals, and reference documents
            available in DEPDEV Region V e-Library.
          </p>
        </div>

        {/* Category list (2 columns like screenshot) */}
        <div className="mt-12 sm:mt-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {/* LEFT column */}
            <div className="border-t border-black/15">
              {categories
                .filter((_, i) => i % 2 === 0)
                .map((cat) => (
                  <CategoryRow key={cat.name} cat={cat} />
                ))}
            </div>

            {/* RIGHT column */}
            <div className="border-t border-black/15">
              {categories
                .filter((_, i) => i % 2 === 1)
                .map((cat) => (
                  <CategoryRow key={cat.name} cat={cat} />
                ))}
            </div>
          </div>

          {/* Optional small note */}
          <p className="mt-14 text-[12px] text-black/55 text-center">
            Browse by format and document type to quickly find what you need.
          </p>
        </div>
      </div>
    </section>
  );
}

function CategoryRow({ cat }) {
  return (
    <Link
      href={`/search?category=${encodeURIComponent(cat.name.toLowerCase())}`}
      className="
        group flex items-center gap-4
        py-6
        border-b border-black/15
        text-black
      "
    >
      {/* Icon */}
      <span className="inline-flex h-6 w-6 items-center justify-center text-[#0B5ED7]">
        {cat.icon}
      </span>

      {/* Text */}
      <span className="text-[16px] sm:text-[17px] font-medium tracking-tight group-hover:opacity-80">
        {cat.name}
      </span>
    </Link>
  );
}

/* --- Icons: outline, small --- */
function I({ children }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function BooksIcon() {
  return (
    <I>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </I>
  );
}
function SourcebookIcon() {
  return (
    <I>
      <path d="M7 3h10v18H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" />
      <path d="M17 3v18" />
      <path d="M8.5 8h5" />
      <path d="M8.5 12h5" />
    </I>
  );
}
function PeriodicalIcon() {
  return (
    <I>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h16" />
      <path d="M9 20V9" />
    </I>
  );
}
function ThesisIcon() {
  return (
    <I>
      <path d="M14 2v6h6" />
      <path d="M20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6z" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </I>
  );
}
function LawIcon() {
  return (
    <I>
      <path d="M14 2v6h6" />
      <path d="M20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6z" />
      <path d="M9 11h.01" />
      <path d="M8 15h8" />
    </I>
  );
}
function GuideIcon() {
  return (
    <I>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a3 3 0 1 1 4.7 2.4c-.9.6-1.2 1-1.2 2" />
      <path d="M12 17h.01" />
    </I>
  );
}
function ReportIcon() {
  return (
    <I>
      <path d="M4 19V5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M14 3v4h4" />
      <path d="M8 12h8" />
      <path d="M8 16h6" />
    </I>
  );
}
function ReferenceIcon() {
  return (
    <I>
      <path d="M10.5 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8l4 4v2" />
      <path d="M14 4v4h4" />
      <circle cx="16.5" cy="16.5" r="3.5" />
      <path d="M21 21l-2.2-2.2" />
    </I>
  );
}