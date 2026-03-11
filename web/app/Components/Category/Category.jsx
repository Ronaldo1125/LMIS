"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

const rawCategories = [
  { name: "Books & Monographs", icon: <BooksIcon /> },
  { name: "Journals & Articles", icon: <PeriodicalIcon /> },
  { name: "Databases & Reports", icon: <ReportIcon /> },
  { name: "Sourcebooks", icon: <SourcebookIcon /> },
  { name: "Periodicals", icon: <PeriodicalIcon /> },
  { name: "Thesis / Research Papers", icon: <ThesisIcon /> },
  { name: "Statute / Law / Legal Documents", icon: <LawIcon /> },
  { name: "Guide / Manuals", icon: <GuideIcon /> },
  { name: "Reference Materials", icon: <ReferenceIcon /> },
];

export default function Category() {
  const categories = useMemo(() => rawCategories, []);
  const featuredCategories = categories.slice(0, 6);
  const remainingCategories = categories.slice(6);
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1440px] mx-auto px-6">

        {/* Title */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[32px] font-semibold text-[#0b1c48]">
            Categories
          </h2>
          {!showAll && remainingCategories.length > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center text-[#3556e8] hover:text-[#2a4bc7] font-medium transition-colors"
            >
              View All Collections
              <ArrowIcon />
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(showAll ? categories : featuredCategories).map((cat, index) => (
            <CategoryCard key={cat.name} cat={cat} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

function CategoryCard({ cat, index }) {
  const categoryData = {
    "Books & Monographs": {
      description: "Browse our curated catalog of government publications, academic books, and policy documents across all development sectors.",
      bgColor: "bg-[#0b1c48]",
      textColor: "text-white",
      iconColor: "text-green-400",
    },
    "Journals & Articles": {
      description: "Access peer-reviewed journals and research articles on economics, planning, infrastructure, and sustainable development.",
      bgColor: "bg-white",
      textColor: "text-[#0b1c48]",
      iconColor: "text-blue-500",
    },
    "Databases & Reports": {
      description: "Dive into statistical databases, annual reports, and data repositories produced by DEPDev and partner agencies.",
      bgColor: "bg-[#d4af37]",
      textColor: "text-[#0b1c48]",
      iconColor: "text-purple-500",
    },
    "Sourcebooks": {
      description: "Comprehensive reference materials and primary source documents for in-depth research and analysis.",
      bgColor: "bg-[#2c5282]",
      textColor: "text-white",
      iconColor: "text-yellow-400",
    },
    "Periodicals": {
      description: "Current and archived newspapers, magazines, and journals covering contemporary issues and historical events.",
      bgColor: "bg-white",
      textColor: "text-[#0b1c48]",
      iconColor: "text-red-500",
    },
    "Thesis / Research Papers": {
      description: "Academic theses, dissertations, and research papers from universities and research institutions.",
      bgColor: "bg-[#1a365d]",
      textColor: "text-white",
      iconColor: "text-cyan-400",
    },
    "Statute / Law / Legal Documents": {
      description: "Legal frameworks, statutes, regulations, and judicial decisions from various jurisdictions.",
      bgColor: "bg-[#8b4513]",
      textColor: "text-white",
      iconColor: "text-orange-400",
    },
    "Guide / Manuals": {
      description: "Practical guides, training manuals, and instructional materials for various procedures and processes.",
      bgColor: "bg-white",
      textColor: "text-[#0b1c48]",
      iconColor: "text-green-500",
    },
    "Reference Materials": {
      description: "Dictionaries, encyclopedias, almanacs, and other reference works for quick information lookup.",
      bgColor: "bg-[#4a5568]",
      textColor: "text-white",
      iconColor: "text-pink-400",
    },
  };

  const data = categoryData[cat.name] || { 
    description: "Explore this collection of resources and materials.",
    bgColor: "bg-white", 
    textColor: "text-[#0b1c48]", 
    iconColor: "text-[#3556e8]" 
  };

  return (
    <Link
      href={`/search?category=${encodeURIComponent(cat.name.toLowerCase())}`}
      className={`group relative rounded-sm p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${data.bgColor}`}
    >
      {/* Icon */}
      <div className={`mb-4 ${data.iconColor}`}>
        {cat.icon}
      </div>

      {/* Category Name */}
      <h3 className={`font-semibold text-lg mb-3 ${data.textColor}`}>
        {cat.name}
      </h3>

      {/* Description */}
      <p className={`text-sm leading-relaxed ${data.textColor} opacity-90`}>
        {data.description}
      </p>

      {/* Hover Arrow - Bottom Right */}
      <div className={`absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${data.textColor}`}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
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