"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import books from "../../data/books.js"; // ✅ adjust path if needed

export default function FindBooksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const qParam = searchParams.get("q") || "";
  const [q, setQ] = useState(qParam);

  // sort
  const [sortBy, setSortBy] = useState("relevance"); // relevance | title-asc | year-desc

  // left filter radio
  const [showFor, setShowFor] = useState("courses"); // just UI

  // Filters (left)
  const [studentType, setStudentType] = useState({
    domestic: false,
    international: false,
  });

  const [studyLevel, setStudyLevel] = useState({
    undergraduate: false,
    postgraduate: false,
  });

  const [startYears, setStartYears] = useState({}); // { "2025": true }

  useEffect(() => setQ(qParam), [qParam]);

  const normalizedQ = q.trim().toLowerCase();

  // derive year options from books
  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(books.map((b) => String(b.year || "")).filter(Boolean))
    )
      .map((y) => Number(y))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => b - a);

    return years;
  }, []);

  // optional fields if you have them (safe fallbacks)
  const getBookLevel = (b) => (b.level || "").toLowerCase(); // "undergraduate"/"postgraduate"
  const getBookStudentType = (b) => (b.studentType || "").toLowerCase(); // "domestic"/"international"

  const filteredResults = useMemo(() => {
    let items = books;

    // search filter
    if (normalizedQ) {
      items = items.filter((b) => {
        const title = (b.title || "").toLowerCase();
        const author = (b.author || "").toLowerCase();
        const year = String(b.year || "").toLowerCase();
        return (
          title.includes(normalizedQ) ||
          author.includes(normalizedQ) ||
          year.includes(normalizedQ)
        );
      });
    }

    // student type filter
    const studentPicked = studentType.domestic || studentType.international;
    if (studentPicked) {
      items = items.filter((b) => {
        const t = getBookStudentType(b);
        if (!t) return true; // if not present in data, don't block
        if (studentType.domestic && t === "domestic") return true;
        if (studentType.international && t === "international") return true;
        return false;
      });
    }

    // level filter
    const levelPicked = studyLevel.undergraduate || studyLevel.postgraduate;
    if (levelPicked) {
      items = items.filter((b) => {
        const lvl = getBookLevel(b);
        if (!lvl) return true;
        if (studyLevel.undergraduate && lvl === "undergraduate") return true;
        if (studyLevel.postgraduate && lvl === "postgraduate") return true;
        return false;
      });
    }

    // year filter
    const yearPicked = Object.values(startYears).some(Boolean);
    if (yearPicked) {
      items = items.filter((b) => {
        const y = String(b.year || "");
        return Boolean(startYears[y]);
      });
    }

    // sorting
    if (sortBy === "title-asc") {
      items = [...items].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    } else if (sortBy === "year-desc") {
      items = [...items].sort(
        (a, b) => Number(b.year || 0) - Number(a.year || 0)
      );
    } else {
      // relevance
      if (normalizedQ) {
        const score = (book) => {
          const t = (book.title || "").toLowerCase();
          const a = (book.author || "").toLowerCase();
          let s = 0;
          if (t.startsWith(normalizedQ)) s += 3;
          if (t.includes(normalizedQ)) s += 2;
          if (a.includes(normalizedQ)) s += 1;
          return s;
        };
        items = [...items].sort((x, y) => score(y) - score(x));
      }
    }

    return items;
  }, [normalizedQ, sortBy, studentType, studyLevel, startYears]);

  const pageSize = 8; // ✅ for grid (4 per row, 2 rows)
  const pageItems = filteredResults.slice(0, pageSize);

  const onSubmit = (e) => {
    e.preventDefault();
    const next = q.trim();
    router.push(next ? `/find?q=${encodeURIComponent(next)}` : "/find");
  };

  const clearAll = () => {
    setQ("");
    setStudentType({ domestic: false, international: false });
    setStudyLevel({ undergraduate: false, postgraduate: false });
    setStartYears({});
    setSortBy("relevance");
    router.push("/find");
  };

  const toggleYear = (y) => {
    setStartYears((prev) => ({ ...prev, [String(y)]: !prev[String(y)] }));
  };

  return (
    <main className="w-full bg-white text-black">
      <Nav />

      {/* SEARCH BAR */}
      <section className="w-full border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <form onSubmit={onSubmit} className="flex items-stretch">
            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="w-full h-[64px] border border-gray-200 px-6 pr-16 text-[18px] outline-none"
              />
              {q.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    router.push("/find");
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-[76px] h-[64px] bg-[#c23b22] text-white flex items-center justify-center"
              aria-label="Search"
            >
              🔍
            </button>
          </form>
        </div>
      </section>

      {/* 2-column layout */}
      <section className="w-full">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="grid grid-cols-12 gap-10">
            {/* LEFT FILTERS */}
            <aside className="col-span-12 md:col-span-4 lg:col-span-3">
              <div className="md:sticky md:top-24">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <span className="text-[18px]">🎚️</span> Filters
                  </button>

                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[#c23b22] font-medium"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-6 border-t border-gray-200" />

                {/* Show results for */}
                <div className="py-6">
                  <div className="font-semibold mb-4">Show results for</div>

                  <label className="flex items-center gap-3 mb-3 cursor-pointer">
                    <input
                      type="radio"
                      name="showfor"
                      checked={showFor === "courses"}
                      onChange={() => setShowFor("courses")}
                    />
                    <span>Courses</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="showfor"
                      checked={showFor === "subject"}
                      onChange={() => setShowFor("subject")}
                    />
                    <span>Subject Areas</span>
                  </label>
                </div>

                <div className="border-t border-gray-200" />

                {/* Student type */}
                <FilterSection title="Student type">
                  <CheckRow
                    label="Domestic"
                    checked={studentType.domestic}
                    onChange={() =>
                      setStudentType((p) => ({ ...p, domestic: !p.domestic }))
                    }
                  />
                  <CheckRow
                    label="International"
                    checked={studentType.international}
                    onChange={() =>
                      setStudentType((p) => ({
                        ...p,
                        international: !p.international,
                      }))
                    }
                  />
                </FilterSection>

                <div className="border-t border-gray-200" />

                {/* Study Level */}
                <FilterSection title="Study Level">
                  <CheckRow
                    label="Undergraduate"
                    checked={studyLevel.undergraduate}
                    onChange={() =>
                      setStudyLevel((p) => ({
                        ...p,
                        undergraduate: !p.undergraduate,
                      }))
                    }
                  />
                  <CheckRow
                    label="Postgraduate"
                    checked={studyLevel.postgraduate}
                    onChange={() =>
                      setStudyLevel((p) => ({
                        ...p,
                        postgraduate: !p.postgraduate,
                      }))
                    }
                  />
                </FilterSection>

                <div className="border-t border-gray-200" />

                {/* Start Year */}
                <FilterSection title="Start Year">
                  {yearOptions.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No year values found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {yearOptions.slice(0, 8).map((y) => (
                        <CheckRow
                          key={y}
                          label={String(y)}
                          checked={Boolean(startYears[String(y)])}
                          onChange={() => toggleYear(y)}
                        />
                      ))}
                    </div>
                  )}
                </FilterSection>
              </div>
            </aside>

            {/* RIGHT RESULTS (✅ 4-grid like second image) */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              {/* top info row */}
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-5">
                <div className="text-[15px] text-gray-700">
                  Showing{" "}
                  <span className="font-semibold text-black">
                    {filteredResults.length === 0
                      ? "0"
                      : `1-${Math.min(pageSize, filteredResults.length)}`}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-black">
                    {filteredResults.length}
                  </span>{" "}
                  results{qParam ? (
                    <>
                      {" "}
                      for <span className="font-semibold text-black">{qParam}</span>
                    </>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-[42px] border border-gray-200 px-4 bg-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="title-asc">Title (A–Z)</option>
                    <option value="year-desc">Year (Newest)</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {pageItems.length === 0 ? (
                <div className="py-14 text-gray-600">
                  No results found{qParam ? ` for "${qParam}"` : ""}.
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                  {pageItems.map((book, index) => (
                    <BookCard key={book.id} book={book} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ---------- small components ---------- */

function FilterSection({ title, children }) {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold">{title}</div>
        <div className="text-gray-500">—</div>
      </div>
      {children}
    </div>
  );
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function BookCard({ book, index }) {
  return (
    <div className="group cursor-pointer">
      {/* cover */}
      <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-gray-100">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* number bubble */}
        <div className="absolute top-3 left-3 w-8 h-8 bg-white/80 backdrop-blur flex items-center justify-center rounded-full text-sm font-semibold">
          {index + 1}
        </div>
      </div>

      {/* meta */}
      <div className="mt-4">
        <div className="text-[14px] font-semibold text-gray-900 line-clamp-2">
          {book.title}
        </div>

        <div className="text-[12px] text-gray-500 mt-1">{book.author}</div>

        <div className="text-[12px] text-gray-500">{book.year}</div>
      </div>
    </div>
  );
}