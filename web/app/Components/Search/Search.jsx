"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, Loader2, BookOpen } from "lucide-react";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import PDFThumbnail from "./PDFThumbnail";

// ─── helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function recordBookClick(bookId) {
  try {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    await fetch(`${API_BASE}/api/books/${bookId}/click`, {
      method: "POST",
      headers,
    });
  } catch {
    // fire-and-forget — never block navigation on this
  }
}

// ─── icon components ──────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-500">
      <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

function IconGrid({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className={active ? "text-black" : "text-gray-400"}>
      <path fill="currentColor" d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </svg>
  );
}

function IconList({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className={active ? "text-black" : "text-gray-400"}>
      <path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
    </svg>
  );
}

// ─── filter dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`h-10 rounded-full border px-4 flex items-center gap-2 text-[13px] transition
          ${value
            ? "border-gray-800 bg-gray-900 text-white"
            : "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
          }`}
      >
        <span className="font-medium">{value || label}</span>
        <ChevronDown />
      </button>

      {open && (
        <div className="absolute top-12 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[160px] py-1 overflow-hidden">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-[13px] text-gray-400 hover:bg-gray-50 transition"
          >
            All {label}s
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-[13px] transition
                ${value === opt ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── skeleton cards ───────────────────────────────────────────────────────────

function SkeletonGrid({ count = 12 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded border border-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-[3/4] bg-gray-100" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-4/5" />
            <div className="h-3 bg-gray-100 rounded w-3/5" />
          </div>
        </div>
      ))}
    </>
  );
}

function SkeletonList({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 animate-pulse">
          <div className="w-11 h-14 rounded bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left  = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push("…");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < totalPages - 1) pages.push("…");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="h-9 w-9 rounded-full flex items-center justify-center border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 transition"
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="h-9 w-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`h-9 w-9 rounded-full flex items-center justify-center text-sm transition font-medium
              ${page === p ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className="h-9 w-9 rounded-full flex items-center justify-center border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 transition"
      >
        ›
      </button>
    </div>
  );
}

// ─── filter options ───────────────────────────────────────────────────────────

const CATEGORIES = ["Fiction", "Non-Fiction", "Science", "History", "Technology", "Arts", "Law", "Medicine", "Philosophy", "Education"];
const FORMATS    = ["Hardcover", "Paperback", "E-Book", "Journal", "Magazine", "Thesis", "Report"];
const LANGUAGES  = ["English", "Filipino", "Spanish", "French", "Japanese", "Chinese", "German"];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── URL-driven state ──────────────────────────────────────────────────────
  const urlQuery    = searchParams.get("query")    || "";
  const urlCategory = searchParams.get("category") || "";
  const urlAuthor   = searchParams.get("author")   || "";
  const urlFormat   = searchParams.get("format")   || "";
  const urlLanguage = searchParams.get("language") || "";
  const urlPage     = parseInt(searchParams.get("page") || "1", 10);

  // ── local UI state ────────────────────────────────────────────────────────
  const [searchInput,    setSearchInput]    = useState(urlQuery);
  const [activeField,    setActiveField]    = useState("All fields");
  const [isGridView,     setIsGridView]     = useState(true);
  const [filterCategory, setFilterCategory] = useState(urlCategory);
  const [filterAuthor,   setFilterAuthor]   = useState(urlAuthor);
  const [filterFormat,   setFilterFormat]   = useState(urlFormat);
  const [filterLanguage, setFilterLanguage] = useState(urlLanguage);

  // ── API result state ──────────────────────────────────────────────────────
  const [books,      setBooks]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const LIMIT = 24;

  // ── push changes into URL ─────────────────────────────────────────────────
  const pushParams = useCallback((overrides = {}) => {
    const next = {
      query:    searchInput.trim(),
      category: filterCategory,
      author:   filterAuthor,
      format:   filterFormat,
      language: filterLanguage,
      page:     "1",
      ...overrides,
    };
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/search?${params.toString()}`);
  }, [searchInput, filterCategory, filterAuthor, filterFormat, filterLanguage, router]);

  // ── fetch from /api/search whenever URL params change ────────────────────
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (urlQuery)    params.set("query",    urlQuery);
        if (urlCategory) params.set("category", urlCategory);
        if (urlAuthor)   params.set("author",   urlAuthor);
        if (urlFormat)   params.set("format",   urlFormat);
        if (urlLanguage) params.set("language", urlLanguage);
        params.set("page",  String(urlPage));
        params.set("limit", String(LIMIT));

        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `${API_BASE}/api/search?${params.toString()}`,
          { headers }
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Server error ${res.status}`);
        }

        const data = await res.json();
        setBooks(data.results  ?? []);
        setTotal(data.total    ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        console.error("Search fetch error:", err);
        setError(err.message || "Something went wrong");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [urlQuery, urlCategory, urlAuthor, urlFormat, urlLanguage, urlPage]);

  // ── keep local filter state in sync when URL changes externally ───────────
  useEffect(() => { setSearchInput(urlQuery);       }, [urlQuery]);
  useEffect(() => { setFilterCategory(urlCategory); }, [urlCategory]);
  useEffect(() => { setFilterAuthor(urlAuthor);     }, [urlAuthor]);
  useEffect(() => { setFilterFormat(urlFormat);     }, [urlFormat]);
  useEffect(() => { setFilterLanguage(urlLanguage); }, [urlLanguage]);

  // ── event handlers ────────────────────────────────────────────────────────
  const onSubmitSearch = () => pushParams({ query: searchInput.trim(), page: "1" });

  const onFilterChange = (key, value) => {
    if (key === "category") setFilterCategory(value);
    if (key === "author")   setFilterAuthor(value);
    if (key === "format")   setFilterFormat(value);
    if (key === "language") setFilterLanguage(value);

    pushParams({
      query:    searchInput.trim(),
      category: key === "category" ? value : filterCategory,
      author:   key === "author"   ? value : filterAuthor,
      format:   key === "format"   ? value : filterFormat,
      language: key === "language" ? value : filterLanguage,
      page:     "1",
    });
  };

  const onClearFilters = () => {
    setFilterCategory(""); setFilterAuthor("");
    setFilterFormat("");   setFilterLanguage("");
    pushParams({ category: "", author: "", format: "", language: "", page: "1" });
  };

  const onPage = (p) => pushParams({ page: String(p) });

  // ── navigate to book (records click first) ────────────────────────────────
  const onBookClick = (bookId) => {
    recordBookClick(bookId);
    router.push(`/books/${bookId}`);
  };

  // ── derived values ────────────────────────────────────────────────────────
  const pageTitle = urlCategory
    ? urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)
    : urlQuery
    ? `Search: "${urlQuery}"`
    : "All Books";

  const hasActiveFilters = urlCategory || urlAuthor || urlFormat || urlLanguage;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="mx-auto w-full max-w-[1440px] px-6 2xl:px-10 pt-10 pb-24">

        {/* ── Title ── */}
        <h1 className="text-[40px] font-medium text-black">{pageTitle}</h1>

        {/* ── Search bar ── */}
        <div className="mt-6">
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-2 flex items-center gap-3">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmitSearch()}
              placeholder="Search for books, sourcebooks, reports..."
              className="flex-1 bg-transparent outline-none text-[14px] 2xl:text-[15px] text-gray-800 placeholder:text-gray-400 px-2"
            />
            <div className="hidden sm:block h-6 w-px bg-gray-200" />
            <div className="hidden sm:flex items-center gap-2">
              {["All fields", "Authors", "Title"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveField(t)}
                  className={`rounded-full px-3 py-1 text-[12px] transition ${
                    activeField === t
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={onSubmitSearch}
              className="shrink-0 h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-black transition text-white"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>

          {/* ── Filter dropdowns ── */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <FilterDropdown
              label="Category"
              options={CATEGORIES}
              value={filterCategory}
              onChange={(v) => onFilterChange("category", v)}
            />
            <FilterDropdown
              label="Author"
              options={[]}
              value={filterAuthor}
              onChange={(v) => onFilterChange("author", v)}
            />
            <FilterDropdown
              label="Format"
              options={FORMATS}
              value={filterFormat}
              onChange={(v) => onFilterChange("format", v)}
            />
            <FilterDropdown
              label="Language"
              options={LANGUAGES}
              value={filterLanguage}
              onChange={(v) => onFilterChange("language", v)}
            />

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="h-10 rounded-full border border-red-200 bg-red-50 px-4 text-[13px] text-red-600 hover:bg-red-100 transition font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── Results header ── */}
        <div className="mt-12 flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Searching…
              </span>
            ) : (
              `${total.toLocaleString()} book${total !== 1 ? "s" : ""}`
            )}
          </span>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsGridView(true)}  aria-label="Grid view"  className="p-1"><IconGrid active={isGridView}  /></button>
            <button onClick={() => setIsGridView(false)} aria-label="List view"  className="p-1"><IconList active={!isGridView} /></button>
          </div>
        </div>

        {/* ── Error state ── */}
        {error && !loading && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-red-600 text-sm mb-6">
            {error}. Please try again or refine your search.
          </div>
        )}

        {/* ── Grid View ── */}
        {isGridView && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: 18,
            }}
          >
            {loading ? (
              <SkeletonGrid count={LIMIT} />
            ) : (
              books.map((book) => (
                <div
                  key={book.id}
                  style={{ cursor: "pointer", border: "1px solid #e6ecf7", borderRadius: 8, overflow: "hidden", transition: "box-shadow 0.15s" }}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                  onMouseOut={(e)  => (e.currentTarget.style.boxShadow = "none")}
                  onClick={() => onBookClick(book.id)}
                >
                  <PDFThumbnail uploadId={book.upload_id} title={book.title} />

                  <div style={{ padding: "12px 12px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#4b5563", display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }} title={book.author}>
                        {book.author}
                      </span>
                      <span style={{ color: "#9ca3af", fontWeight: 600, flexShrink: 0 }}>{book.year}</span>
                    </div>
                    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", color: "#166534", background: "#dcfce7", borderRadius: 4, padding: "2px 6px" }}>
                        PDF
                      </span>
                      {book.upload_size && (
                        <span style={{ fontSize: 10, color: "#9ca3af" }}>
                          {(book.upload_size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      )}
                      {book.access_level === "staff_only" && (
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", color: "#92400e", background: "#fef3c7", borderRadius: 4, padding: "2px 6px" }}>
                          STAFF ONLY
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── List View ── */}
        {!isGridView && (
          <div style={{ border: "1px solid #e6ecf7", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
            {loading ? (
              <SkeletonList count={LIMIT} />
            ) : (
              books.map((book, idx) => (
                <div
                  key={book.id}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: idx < books.length - 1 ? "1px solid #eef2ff" : "none", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f7faff")}
                  onMouseOut={(e)  => (e.currentTarget.style.background = "#fff")}
                  onClick={() => onBookClick(book.id)}
                >
                  <div style={{ width: 44, height: 58, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid #e6ecf7" }}>
                    <PDFThumbnail
                      uploadId={book.upload_id}
                      title={book.title}
                      style={{ aspectRatio: "unset", width: "100%", height: "100%" }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.25, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={book.title}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#4b5563", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }} title={book.author}>
                        {book.author}
                      </span>
                      <span style={{ fontWeight: 700, color: "#9ca3af", flexShrink: 0 }}>{book.year}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", color: "#166534", background: "#dcfce7", borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>
                        PDF
                      </span>
                      {book.upload_size && (
                        <span style={{ fontSize: 10, color: "#9ca3af", flexShrink: 0 }}>
                          {(book.upload_size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      )}
                      {book.access_level === "staff_only" && (
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", color: "#92400e", background: "#fef3c7", borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>
                          STAFF ONLY
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ opacity: 0.4, flexShrink: 0 }} />
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && books.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center gap-4 text-gray-400">
            <BookOpen size={48} strokeWidth={1} />
            <div>
              <p className="text-lg font-medium text-gray-600">No results found</p>
              <p className="text-sm mt-1">
                {urlQuery ? `Try different keywords for "${urlQuery}"` : "Try adjusting your filters"}
              </p>
            </div>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && books.length > 0 && (
          <Pagination page={urlPage} totalPages={totalPages} onPage={onPage} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Search;