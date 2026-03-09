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
    <section className="w-full bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Title */}
        <h2 className="text-[34px] md:text-[42px] font-semibold text-[#0b1c48] mb-12">
          Explore our library resources 
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">

          {/* LEFT SIDE - CATEGORIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.name} cat={cat} />
            ))}
          </div>

          {/* RIGHT SIDE - OPENING HOURS */}
          <div className="bg-white rounded-lg p-8 shadow-sm h-fit">

            <h3 className="text-[28px] font-semibold text-[#0b1c48] mb-4">
              Today's opening hours
            </h3>

            <p className="text-gray-600 leading-relaxed mb-6">
              The DEPDEV Region V e-Library is open today for research,
              government publications access, and academic study.
            </p>

            <h4 className="text-[18px] font-semibold text-[#0b1c48]">
              Ask Library
            </h4>

            <p className="text-gray-600 mt-2 mb-6">
              Opening hours:
              <span className="font-semibold ml-2 text-black">
                10:00 AM – 6:00 PM
              </span>
            </p>

            <button className="border border-[#3556e8] text-[#3556e8] px-5 py-3 rounded-md flex items-center gap-2 hover:bg-[#3556e8] hover:text-white transition">
              Contact us
              <ArrowIcon />
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat }) {
  return (
    <Link
      href={`/search?category=${encodeURIComponent(cat.name.toLowerCase())}`}
      className="group bg-white rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center gap-4">
        <span className="text-[#3556e8]">{cat.icon}</span>
        <span className="font-medium text-[#0b1c48]">{cat.name}</span>
      </div>

      <span className="text-gray-400 group-hover:text-black transition">
        <ArrowIcon />
      </span>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* --- Icons --- */

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