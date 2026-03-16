"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, Loader2, BookOpen, X, SlidersHorizontal } from "lucide-react";
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
    await fetch(`${API_BASE}/api/books/${bookId}/click`, { method: "POST", headers });
  } catch { /* fire-and-forget */ }
}

// ─── icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-400 shrink-0">
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

function FilterDropdown({ label, options = [], value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        className={`h-10 border px-4 flex items-center gap-2 text-[13px] transition min-w-[130px]
          ${value
            ? "border-white bg-white text-gray-900 font-semibold"
            : "border-white/30 bg-white/10 text-white hover:bg-white/20"
          } disabled:opacity-40`}
      >
        <span className="truncate flex-1 text-left">{value || label}</span>
        {value
          ? <button onClick={(e) => { e.stopPropagation(); onChange(""); }} className="shrink-0 text-gray-400 hover:text-gray-700"><X size={12} /></button>
          : <ChevronDownIcon />
        }
      </button>

      {open && (
        <div className="absolute top-12 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[200px] py-1 max-h-64 overflow-y-auto">
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

// ─── sort dropdown ────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "title",      label: "Title A–Z" },
  { value: "title_desc", label: "Title Z–A" },
  { value: "year_desc",  label: "Newest First" },
  { value: "year_asc",   label: "Oldest First" },
  { value: "author",     label: "Author A–Z" },
  { value: "relevance",  label: "Relevance" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-9 border border-gray-200 rounded-full px-4 flex items-center gap-2 text-[13px] text-gray-700 hover:bg-gray-50 transition"
      >
        Sort: <span className="font-medium">{current.label}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div className="absolute top-11 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[160px] py-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-[13px] transition
                ${value === opt.value ? "bg-gray-900 text-white font-medium" : "text-gray-700 hover:bg-gray-50"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── skeletons ────────────────────────────────────────────────────────────────

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
  const left  = Math.max(2, page - 2);
  const right = Math.min(totalPages - 1, page + 2);
  pages.push(1);
  if (left > 2) pages.push("…");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < totalPages - 1) pages.push("…");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button disabled={page === 1} onClick={() => onPage(page - 1)}
        className="h-9 w-9 rounded-full flex items-center justify-center border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 transition">‹</button>
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e-${i}`} className="h-9 w-9 flex items-center justify-center text-gray-400 text-sm">…</span>
          : <button key={p} onClick={() => onPage(p)}
              className={`h-9 w-9 rounded-full flex items-center justify-center text-sm transition font-medium
                ${page === p ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              {p}
            </button>
      )}
      <button disabled={page === totalPages} onClick={() => onPage(page + 1)}
        className="h-9 w-9 rounded-full flex items-center justify-center border border-gray-200 text-sm disabled:opacity-30 hover:bg-gray-50 transition">›</button>
    </div>
  );
}

// ─── filter chip ──────────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-3 py-1 text-[12px] font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-blue-600 transition"><X size={11} /></button>
    </span>
  );
}

// ─── suggestions ─────────────────────────────────────────────────────────────

function Suggestions({ suggestions, onSelect, visible }) {
  if (!visible || suggestions.length === 0) return null;
  return (
    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl mt-1 overflow-hidden">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition text-[13px]"
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0
            ${s.type === "title" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
            {s.type}
          </span>
          <span className="text-gray-800 truncate">{s.value}</span>
        </button>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const Search = () => {
  const searchParams = useSearchParams();
  const router       = useRouter();

  // ── URL-driven state ──────────────────────────────────────────────────────
  const urlQuery       = searchParams.get("query")       || "";
  const urlField       = searchParams.get("field")       || "all";
  const urlCategory    = searchParams.get("category")    || "";
  const urlPublication = searchParams.get("publication") || "";
  const urlYearFrom    = searchParams.get("yearFrom")    || "";
  const urlYearTo      = searchParams.get("yearTo")      || "";
  const urlSort        = searchParams.get("sort")        || "title";
  const urlPage        = parseInt(searchParams.get("page") || "1", 10);

  // ── local UI state ────────────────────────────────────────────────────────
  const [searchInput,    setSearchInput]    = useState(urlQuery);
  const [activeField,    setActiveField]    = useState(urlField);
  const [isGridView,     setIsGridView]     = useState(true);
  const [showAdvanced,   setShowAdvanced]   = useState(false);
  const [filterCategory,    setFilterCategory]    = useState(urlCategory);
  const [filterPublication, setFilterPublication] = useState(urlPublication);

  // advanced form
  const [advTitle,     setAdvTitle]     = useState("");
  const [advAuthor,    setAdvAuthor]    = useState("");
  const [advSubject,   setAdvSubject]   = useState("");
  const [advPublisher, setAdvPublisher] = useState("");
  const [advYearFrom,  setAdvYearFrom]  = useState("");
  const [advYearTo,    setAdvYearTo]    = useState("");
  const [advISBN,      setAdvISBN]      = useState("");

  // suggestions
  const [suggestions,     setSuggestions]     = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestTimer = useRef(null);

  // dynamic filter options
  const [filterOptions, setFilterOptions] = useState({ categories: [], publications: [], yearMin: null, yearMax: null });
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // results
  const [books,      setBooks]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const LIMIT = 24;

  // ── window resize listener ────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── responsive configuration ──────────────────────────────────────
  const getResponsiveConfig = () => {
    if (windowWidth < 640) { // Mobile
      return {
        headerPadding: "20px 16px 16px",
        contentPadding: "0 16px 32px",
        gridColumns: "repeat(2, 1fr)",
        gap: 28,
        titleSize: 24,
        showHeaderText: true
      };
    } else if (windowWidth < 768) { // Tablet
      return {
        headerPadding: "32px 24px 16px",
        contentPadding: "0 24px 40px",
        gridColumns: "repeat(4, 1fr)",
        gap: 36,
        titleSize: 26,
        showHeaderText: true
      };
    } else if (windowWidth < 1024) { // Small desktop
      return {
        headerPadding: "40px 32px 18px",
        contentPadding: "0 32px 48px",
        gridColumns: "repeat(5, 1fr)",
        gap: 40,
        titleSize: 28,
        showHeaderText: false
      };
    } else { // Large desktop
      return {
        headerPadding: "44px 48px 18px",
        contentPadding: "0 48px 56px",
        gridColumns: "repeat(6, 1fr)",
        gap: 40,
        titleSize: 28,
        showHeaderText: false
      };
    }
  };

  const config = getResponsiveConfig();

  // ── load dynamic filter options ───────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/api/search/filters`, { headers });
        if (res.ok) setFilterOptions(await res.json());
      } catch { /* non-critical */ }
      finally { setFiltersLoaded(true); }
    })();
  }, []);

  // ── push changes into URL ─────────────────────────────────────────────────
  const pushParams = useCallback((overrides = {}) => {
    const next = {
      query:       searchInput.trim(),
      field:       activeField,
      category:    filterCategory,
      publication: filterPublication,
      sort:        urlSort,
      page:        "1",
      ...overrides,
    };
    const p = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v && v !== "all") p.set(k, String(v));
    });
    if (next.page && next.page !== "1") p.set("page", next.page);
    router.push(`/search?${p.toString()}`);
  }, [searchInput, activeField, filterCategory, filterPublication, urlSort, router]);

  // ── fetch books ───────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const p = new URLSearchParams();
        if (urlQuery)       p.set("query",       urlQuery);
        if (urlField && urlField !== "all") p.set("field", urlField);
        if (urlCategory)    p.set("category",    urlCategory);
        if (urlPublication) p.set("publication", urlPublication);
        if (urlYearFrom)    p.set("yearFrom",    urlYearFrom);
        if (urlYearTo)      p.set("yearTo",      urlYearTo);
        if (urlSort)        p.set("sort",        urlSort);
        p.set("page",  String(urlPage));
        p.set("limit", String(LIMIT));

        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}/api/search?${p.toString()}`, { headers });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Server error ${res.status}`);
        }
        const data = await res.json();
        setBooks(data.results  ?? []);
        setTotal(data.total    ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [urlQuery, urlField, urlCategory, urlPublication, urlYearFrom, urlYearTo, urlSort, urlPage]);

  // ── sync local state ──────────────────────────────────────────────────────
  useEffect(() => { setSearchInput(urlQuery);               }, [urlQuery]);
  useEffect(() => { setActiveField(urlField || "all");      }, [urlField]);
  useEffect(() => { setFilterCategory(urlCategory);         }, [urlCategory]);
  useEffect(() => { setFilterPublication(urlPublication);   }, [urlPublication]);

  // ── suggestions ───────────────────────────────────────────────────────────
  const fetchSuggestions = useCallback(async (val) => {
    if (!val || val.length < 2) { setSuggestions([]); return; }
    try {
      const headers = { "Content-Type": "application/json" };
      const token = getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/search/suggestions?q=${encodeURIComponent(val)}`, { headers });
      if (res.ok) setSuggestions((await res.json()).suggestions || []);
    } catch { setSuggestions([]); }
  }, []);

  const onSearchInputChange = (val) => {
    setSearchInput(val);
    clearTimeout(suggestTimer.current);
    suggestTimer.current = setTimeout(() => fetchSuggestions(val), 250);
    setShowSuggestions(true);
  };

  const onSuggestionSelect = (s) => {
    setSearchInput(s.value);
    setShowSuggestions(false);
    pushParams({ query: s.value, field: s.type === "title" ? "title" : "author" });
  };

  // ── handlers ──────────────────────────────────────────────────────────────
  const onSubmitSearch = () => {
    setShowSuggestions(false);
    pushParams({ query: searchInput.trim(), field: activeField, page: "1" });
  };

  const onAdvancedSearch = () => {
    const parts = [];
    if (advTitle)     parts.push(`title:"${advTitle}"`);
    if (advAuthor)    parts.push(`author:"${advAuthor}"`);
    if (advSubject)   parts.push(`subject:"${advSubject}"`);
    if (advPublisher) parts.push(`publisher:"${advPublisher}"`);
    if (advYearFrom)  parts.push(`year_from:${advYearFrom}`);
    if (advYearTo)    parts.push(`year_to:${advYearTo}`);
    if (advISBN)      parts.push(`isbn:${advISBN.replace(/-/g, "")}`);
    pushParams({ query: parts.join(" "), field: "all", page: "1" });
    setShowAdvanced(false);
  };

  const onClearAdvanced = () => {
    setAdvTitle(""); setAdvAuthor(""); setAdvSubject("");
    setAdvPublisher(""); setAdvYearFrom(""); setAdvYearTo(""); setAdvISBN("");
  };

  const onFilterChange = (key, value) => {
    if (key === "category")    setFilterCategory(value);
    if (key === "publication") setFilterPublication(value);
    pushParams({
      category:    key === "category"    ? value : filterCategory,
      publication: key === "publication" ? value : filterPublication,
      page: "1",
    });
  };

  const onClearFilters = () => {
    setFilterCategory(""); setFilterPublication("");
    pushParams({ category: "", publication: "", yearFrom: "", yearTo: "", page: "1" });
  };

  const onPage      = (p) => pushParams({ page: String(p) });
  const onSortChange = (v) => pushParams({ sort: v, page: "1" });
  const onBookClick  = (id) => { recordBookClick(id); router.push(`/book/${id}`); };

  // ── derived ───────────────────────────────────────────────────────────────
  const pageTitle = urlCategory
    ? urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)
    : urlQuery ? `Search: "${urlQuery}"` : "All Books";

  const activeFilters = [
    urlCategory    && { key: "category",    label: `Category: ${urlCategory}` },
    urlPublication && { key: "publication", label: `Publication: ${urlPublication}` },
    urlYearFrom    && { key: "yearFrom",    label: `From: ${urlYearFrom}` },
    urlYearTo      && { key: "yearTo",      label: `To: ${urlYearTo}` },
  ].filter(Boolean);

  const fieldLabel = { all: "All Fields", title: "Title", author: "Author", subject: "Subject", isbn: "ISBN / ISSN" };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* HERO */}
      <section className="w-full bg-blue-900 pt-16 pb-20">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-12 2xl:px-12">
          <h1 className="text-[40px] font-medium text-white mb-8">{pageTitle}</h1>

          {/* Search bar */}
          <div className="w-full bg-white shadow-sm px-4 py-4 flex items-center gap-3 relative">
            <input
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSubmitSearch(); if (e.key === "Escape") setShowSuggestions(false); }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search for books, sourcebooks, reports..."
              className="flex-1 bg-transparent outline-none text-[14px] 2xl:text-[15px] text-gray-800 placeholder:text-gray-400 px-2"
            />
            <div className="hidden sm:block h-6 w-px bg-gray-200" />
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              {Object.entries(fieldLabel).map(([f, lbl]) => (
                <button
                  key={f}
                  onClick={() => setActiveField(f)}
                  className={`rounded-full px-3 py-1 text-[12px] transition ${
                    activeField === f ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {lbl}
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
            <Suggestions suggestions={suggestions} onSelect={onSuggestionSelect} visible={showSuggestions} />
          </div>

          {/* Advanced search toggle */}
          <div className="mt-3">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-white/80 text-[13px] hover:text-white transition underline flex items-center gap-1.5"
            >
              <SlidersHorizontal size={13} />
              {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
            </button>
          </div>

          {/* Advanced Search Form */}
          {showAdvanced && (
            <div className="mt-6 bg-white p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Search</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Title",              value: advTitle,     setter: setAdvTitle,     placeholder: "Enter book title" },
                  { label: "Author",             value: advAuthor,    setter: setAdvAuthor,    placeholder: "Enter author name" },
                  { label: "Subject / Keywords", value: advSubject,   setter: setAdvSubject,   placeholder: "Enter subject or keywords" },
                  { label: "Publisher",          value: advPublisher, setter: setAdvPublisher, placeholder: "Enter publisher name" },
                ].map(({ label, value, setter, placeholder }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && onAdvancedSearch()}
                      className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
                      placeholder={placeholder}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publication Year From</label>
                  <input
                    type="number"
                    value={advYearFrom}
                    onChange={(e) => setAdvYearFrom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onAdvancedSearch()}
                    className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder={filterOptions.yearMin ? `e.g. ${filterOptions.yearMin}` : "e.g. 2000"}
                    min={filterOptions.yearMin || 1900}
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publication Year To</label>
                  <input
                    type="number"
                    value={advYearTo}
                    onChange={(e) => setAdvYearTo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onAdvancedSearch()}
                    className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder={filterOptions.yearMax ? `e.g. ${filterOptions.yearMax}` : "e.g. 2024"}
                    min={filterOptions.yearMin || 1900}
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN / ISSN</label>
                  <input
                    type="text"
                    value={advISBN}
                    onChange={(e) => setAdvISBN(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onAdvancedSearch()}
                    className="w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="Enter ISBN or ISSN (hyphens optional)"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={onAdvancedSearch} className="px-6 py-2 bg-blue-900 text-white hover:bg-blue-700 transition font-medium">
                  Search
                </button>
                <button onClick={onClearAdvanced} className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium">
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Filter dropdowns */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <FilterDropdown
              label="Category"
              options={filtersLoaded ? filterOptions.categories : []}
              value={filterCategory}
              onChange={(v) => onFilterChange("category", v)}
              disabled={!filtersLoaded}
            />
            <FilterDropdown
              label="Publication"
              options={filtersLoaded ? filterOptions.publications : []}
              value={filterPublication}
              onChange={(v) => onFilterChange("publication", v)}
              disabled={!filtersLoaded}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-12 2xl:px-12 pt-10 pb-24">

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filters:</span>
            {activeFilters.map((f) => (
              <FilterChip key={f.key} label={f.label} onRemove={() => onFilterChange(f.key, "")} />
            ))}
            <button onClick={onClearFilters} className="text-xs text-gray-400 hover:text-gray-700 transition underline ml-1">
              Clear all
            </button>
          </div>
        )}

        {/* Results header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500">
            {loading
              ? <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Searching…</span>
              : `${total.toLocaleString()} book${total !== 1 ? "s" : ""}`
            }
          </span>
          <div className="flex items-center gap-3">
            <SortDropdown value={urlSort} onChange={onSortChange} />
            <div className="w-px h-5 bg-gray-200" />
            <button onClick={() => setIsGridView(true)}  aria-label="Grid view" className="p-1"><IconGrid active={isGridView}  /></button>
            <button onClick={() => setIsGridView(false)} aria-label="List view" className="p-1"><IconList active={!isGridView} /></button>
          </div>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-red-600 text-sm mb-6">
            {error}. Please try again or refine your search.
          </div>
        )}

        {/* Grid View */}
        {isGridView && (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: config.gridColumns, 
            gap: config.gap, 
            paddingBottom: 56 
          }}>
            {loading ? <SkeletonGrid count={LIMIT} /> : books.map((book) => (
              <div
                key={book.id}
                style={{ cursor: "pointer", overflow: "hidden" }}
                onClick={() => onBookClick(book.id)}
              >
                <PDFThumbnail uploadId={book.upload_id} title={book.title} />
                <div style={{ padding: "12px 0px 14px", textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#4b5563", display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }} title={book.author}>{book.author}</span>
                    <span style={{ color: "#9ca3af", fontWeight: 600, flexShrink: 0 }}>{book.year}</span>
                  </div>
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#166534", background: "#dcfce7", borderRadius: 4, padding: "2px 6px" }}>PDF</span>
                    {book.upload_size && (
                      <span style={{ fontSize: 10, color: "#9ca3af" }}>{(book.upload_size / (1024 * 1024)).toFixed(1)} MB</span>
                    )}
                    {book.edition && (
                      <span style={{ fontSize: 10, color: "#6b7280" }}>{book.edition}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!isGridView && (
          <div style={{ border: "1px solid #e6ecf7", overflow: "hidden", background: "#fff" }}>
            {loading ? <SkeletonList count={LIMIT} /> : books.map((book, idx) => (
              <div
                key={book.id}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: idx < books.length - 1 ? "1px solid #eef2ff" : "none", cursor: "pointer" }}
                onClick={() => onBookClick(book.id)}
              >
                <div style={{ width: 44, height: 58, overflow: "hidden", flexShrink: 0, border: "1px solid #e6ecf7" }}>
                  <PDFThumbnail uploadId={book.upload_id} title={book.title} style={{ aspectRatio: "unset", width: "100%", height: "100%" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.25, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={book.title}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#4b5563", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }} title={book.author}>{book.author}</span>
                    {book.edition && <span style={{ color: "#6b7280", flexShrink: 0 }}>{book.edition}</span>}
                    <span style={{ fontWeight: 700, color: "#9ca3af", flexShrink: 0 }}>{book.year}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#166534", background: "#dcfce7", borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>PDF</span>
                    {book.upload_size && (
                      <span style={{ fontSize: 10, color: "#9ca3af", flexShrink: 0 }}>{(book.upload_size / (1024 * 1024)).toFixed(1)} MB</span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} style={{ opacity: 0.4, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
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

        {/* Pagination */}
        {!loading && books.length > 0 && (
          <Pagination page={urlPage} totalPages={totalPages} onPage={onPage} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Search;