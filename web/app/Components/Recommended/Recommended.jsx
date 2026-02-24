"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

/* =========================
   SAME ICONS AS SEARCH PAGE
========================= */

function IconGrid({ active }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      className={active ? "text-black" : "text-gray-400"}
    >
      <path
        fill="currentColor"
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
      />
    </svg>
  );
}

function IconList({ active }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      className={active ? "text-black" : "text-gray-400"}
    >
      <path
        fill="currentColor"
        d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
      />
    </svg>
  );
}

/* ========================= */

const Recommended = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [isGridView, setIsGridView] = useState(true);

  const [selectedMaterial, setSelectedMaterial] = useState("All Materials");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [showAllFilters, setShowAllFilters] = useState(false);
  const filterRef = useRef(null);

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowAllFilters(false);
      }
    };

    if (showAllFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAllFilters]);

  const books = useMemo(
    () => [
      {
        title: "The Vanishing Half: A Novel",
        author: "Brit Bennett",
        isbn: "978-1-234-56789-0",
        category: "Fiction",
        image: "/assets/BooksImages/200.png",
        year: 2020,
      },
      {
        title: "The Design of Books",
        author: "Debbie Berne",
        isbn: "978-1-234-56789-0",
        category: "Fiction",
        image: "/assets/BooksImages/200.png",
        year: 2023,
      },
      {
        title: "Echoes of Tomorrow",
        author: "Unknown",
        isbn: "978-1-234-56789-0",
        category: "Report",
        image: "/assets/BooksImages/3.jpg",
        year: 2024,
      },
      {
        title: "Modern Architecture",
        author: "Jane Doe",
        isbn: "978-1-234-56789-2",
        category: "Design",
        image: "/assets/BooksImages/200.png",
        year: 2022,
      },
      {
        title: "Science Today",
        author: "Robert Johnson",
        isbn: "978-1-234-56789-3",
        category: "Science",
        image: "/assets/BooksImages/2.avif",
        year: 2021,
      },
      {
        title: "Future Trends",
        author: "Michael Wilson",
        isbn: "978-1-234-56789-5",
        category: "Business",
        image: "/assets/BooksImages/200.png",
        year: 2023,
      },
    ],
    []
  );

  const categories = useMemo(
    () => ["All Materials", ...Array.from(new Set(books.map((b) => b.category)))],
    [books]
  );

  const years = useMemo(
    () => ["All Years", ...Array.from(new Set(books.map((b) => String(b.year))))],
    [books]
  );

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const materialMatch =
        selectedMaterial === "All Materials" || book.category === selectedMaterial;
      const yearMatch =
        selectedYear === "All Years" || String(book.year) === selectedYear;
      return materialMatch && yearMatch;
    });
  }, [books, selectedMaterial, selectedYear]);

  useEffect(() => {
    setVisibleCount(8);
  }, [selectedMaterial, selectedYear]);

  return (
    <div className="bg-[#fffffc] py-8">
      <div className="max-w-[1800px] mx-auto px-10">

        {/* FILTER BAR */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">

          {/* LEFT FILTERS */}
          <div className="flex items-center gap-5">

            {/* CATEGORY DROPDOWN */}
            <div className="relative">
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="px-6 py-2 bg-[#f4f4f4] rounded-lg text-sm font-medium appearance-none"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* YEAR DROPDOWN */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-6 py-2 bg-[#f4f4f4] rounded-lg text-sm font-medium appearance-none"
              >
                {years.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT SIDE COUNT + VIEW TOGGLE */}
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">
              {filteredBooks.length} books
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsGridView(true)}
                aria-label="Grid view"
              >
                <IconGrid active={isGridView} />
              </button>

              <button
                onClick={() => setIsGridView(false)}
                aria-label="List view"
              >
                <IconList active={!isGridView} />
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {isGridView ? (
          <div className="grid grid-cols-4 gap-3 mt-6">
            {filteredBooks.slice(0, visibleCount).map((book, index) => (
              <div key={index} className="flex flex-col">
                <div className="bg-[#f4f4f4] h-[400px] flex items-center justify-center">
                  <div className="h-[250px] flex items-center justify-center">
                    <Image
                      src={book.image}
                      alt={book.title}
                      width={300}
                      height={450}
                      className="h-full w-auto object-contain"
                      priority={index < 4}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-[18px] font-semibold">
                    {book.title}
                  </h3>
                  <p className="text-[14px] text-gray-700">
                    {book.author}
                  </p>
                  <p className="text-[13px] text-gray-500">
                    {book.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW (SEARCH STYLE) */
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200/70 bg-white/40">
            <div className="divide-y divide-gray-200/70">
              {filteredBooks.slice(0, visibleCount).map((book, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 px-6 py-5 hover:bg-white/60 transition"
                >
                  <div className="h-[96px] w-[72px] bg-[#e7e6e0] flex items-center justify-center">
                    <Image
                      src={book.image}
                      alt={book.title}
                      width={72}
                      height={96}
                      className="h-[86px] w-auto object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-semibold text-gray-900 truncate">
                      {book.title}
                    </div>
                    <div className="mt-1 text-[14px] text-gray-700 truncate">
                      {book.author}
                    </div>
                    <div className="mt-0.5 text-[13px] text-gray-500">
                      {book.year} • {book.category} • ISBN: {book.isbn}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Recommended;
