"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, Loader2, BookOpen, X, SlidersHorizontal } from "lucide-react";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import PDFThumbnail from "./PDFThumbnail";

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
  } catch { }
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="currentColor" d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
    </svg>
  );
}

function PlusMinusIcon({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ color: "#9ca3af", flexShrink: 0 }}>
      {open ? (
        <path fill="currentColor" d="M19 13H5v-2h14v2z" />
      ) : (
        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      )}
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconGrid({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ color: active ? "#111827" : "#9ca3af" }}>
      <path fill="currentColor" d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </svg>
  );
}

function IconList({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ color: active ? "#111827" : "#9ca3af" }}>
      <path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
    </svg>
  );
}

function CategoryDropdown({ label, options = [], value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = !!value;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (name) => {
    onChange(value === name ? "" : name);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          borderRadius: 20,
          fontSize: 13,
          fontWeight: isActive ? 600 : 400,
          border: "none",
          background: isActive ? "#e8e8e8" : "#f4f4f4",
          color: "#374151",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "background 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        {isActive ? value : label}
        {isActive ? (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            style={{ color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <X size={12} />
          </span>
        ) : (
          <ChevronDown />
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          padding: "8px 0",
          minWidth: 220,
          zIndex: 50,
          maxHeight: 320,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db transparent",
        }}
          className="aww-scroll aww-dropdown"
        >
          {options.length === 0 ? (
            <div style={{ padding: "10px 16px", fontSize: 13, color: "#9ca3af", textAlign: "center" }}>
              No {label.toLowerCase()}s available
            </div>
          ) : options.map((opt) => {
            const name = typeof opt === "object" ? opt.name : opt;
            const selected = value === name;
            return (
              <button
                key={name}
                onClick={() => handleSelect(name)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 16px",
                  fontSize: 13,
                  border: "none",
                  cursor: "pointer",
                  background: "transparent",
                  color: "#111827",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontWeight: selected ? 600 : 400,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  border: selected ? "3.5px solid #111827" : "1.5px solid #d1d5db",
                  flexShrink: 0,
                  background: "#fff",
                  transition: "border 0.15s",
                  boxSizing: "border-box",
                }} />
                {name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
    <div style={{ position: "relative" }} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          height: 36,
          border: "1px solid #e5e7eb",
          borderRadius: 20,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#374151",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        Sort: <span style={{ fontWeight: 600 }}>{current.label}</span>
        <PlusMinusIcon open={open} />
      </button>
      {open && (
        <div style={{
          position: "absolute",
          top: 44,
          right: 0,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          minWidth: 160,
          padding: 4,
          zIndex: 50,
        }}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 14px",
                fontSize: 13,
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                background: value === opt.value ? "#111827" : "transparent",
                color: value === opt.value ? "#fff" : "#374151",
                fontWeight: value === opt.value ? 600 : 400,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid({ count = 12 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          border: "1px solid #f3f4f6",
          borderRadius: 2,
          overflow: "hidden",
          animation: "pulse 1.5s infinite",
        }}>
          <div style={{ width: "100%", aspectRatio: "3/4", background: "#eef2fb" }} />
          <div style={{ padding: "12px 12px 14px" }}>
            <div style={{ height: 13, background: "#eef2fb", borderRadius: 3, marginBottom: 8, width: "80%" }} />
            <div style={{ height: 11, background: "#eef2fb", borderRadius: 3, width: "60%" }} />
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
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 16px",
          borderBottom: "1px solid #f3f4f6",
          animation: "pulse 1.5s infinite",
        }}>
          <div style={{ width: 44, height: 56, background: "#f3f4f6", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4, marginBottom: 8, width: "66%" }} />
            <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4, width: "40%" }} />
          </div>
        </div>
      ))}
    </>
  );
}

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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 40 }}>
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        style={{
          height: 36, width: 36, borderRadius: "50%",
          border: "1px solid #e5e7eb", background: "#fff",
          fontSize: 14, cursor: page === 1 ? "not-allowed" : "pointer",
          opacity: page === 1 ? 0.3 : 1,
        }}
      >‹</button>
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e-${i}`} style={{ width: 36, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>…</span>
          : <button
              key={p}
              onClick={() => onPage(p)}
              style={{
                height: 36, width: 36, borderRadius: "50%",
                border: page === p ? "none" : "1px solid #e5e7eb",
                background: page === p ? "#111827" : "#fff",
                color: page === p ? "#fff" : "#374151",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              {p}
            </button>
      )}
      <button
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        style={{
          height: 36, width: 36, borderRadius: "50%",
          border: "1px solid #e5e7eb", background: "#fff",
          fontSize: 14, cursor: page === totalPages ? "not-allowed" : "pointer",
          opacity: page === totalPages ? 0.3 : 1,
        }}
      >›</button>
    </div>
  );
}

function Suggestions({ suggestions, onSelect, visible }) {
  if (!visible || suggestions.length === 0) return null;
  return (
    <div style={{
      position: "absolute",
      top: "calc(100% + 6px)",
      left: 0,
      right: 0,
      zIndex: 50,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      overflow: "hidden",
    }}>
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 13,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            borderBottom: i < suggestions.length - 1 ? "1px solid #f9fafb" : "none",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.05em", padding: "2px 8px", borderRadius: 20, flexShrink: 0,
            background: s.type === "title" ? "#dbeafe" : "#ede9fe",
            color: s.type === "title" ? "#1d4ed8" : "#6d28d9",
          }}>
            {s.type}
          </span>
          <span style={{ color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {s.value}
          </span>
        </button>
      ))}
    </div>
  );
}

const Search = () => {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const urlQuery       = searchParams.get("query")       || "";
  const urlField       = searchParams.get("field")       || "all";
  const urlCategory    = searchParams.get("category")    || "";
  const urlPublication = searchParams.get("publication") || "";
  const urlYearFrom    = searchParams.get("yearFrom")    || "";
  const urlYearTo      = searchParams.get("yearTo")      || "";
  const urlSort        = searchParams.get("sort")        || "title";
  const urlPage        = parseInt(searchParams.get("page") || "1", 10);
  const urlAdvanced    = searchParams.get("advanced") === "true";

  const [searchInput,       setSearchInput]       = useState(urlQuery);
  const [activeField,       setActiveField]       = useState(urlField);
  const [isGridView,        setIsGridView]        = useState(true);
  const [showAdvanced,      setShowAdvanced]      = useState(urlAdvanced);
  const [filterCategory,    setFilterCategory]    = useState(urlCategory);
  const [filterPublication, setFilterPublication] = useState(urlPublication);

  const [advTitle,     setAdvTitle]     = useState("");
  const [advAuthor,    setAdvAuthor]    = useState("");
  const [advSubject,   setAdvSubject]   = useState("");
  const [advPublisher, setAdvPublisher] = useState("");
  const [advYearFrom,  setAdvYearFrom]  = useState("");
  const [advYearTo,    setAdvYearTo]    = useState("");
  const [advISBN,      setAdvISBN]      = useState("");

  const [suggestions,     setSuggestions]     = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestTimer = useRef(null);

  const [filterOptions, setFilterOptions] = useState({ categories: [], publications: [], yearMin: null, yearMax: null });
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  const [books,      setBooks]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const LIMIT = 24;

  useEffect(() => {
    (async () => {
      try {
        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/api/search/filters`, { headers });
        if (res.ok) {
          const apiData = await res.json();
          const defaultCategories = [
            "Books", "Sourcebooks", "Periodicals", "Thesis / Research papers",
            "Statute / Law / Legal documents", "Guide / Manuals", "Report", "Reference Materials",
          ];
          setFilterOptions({
            ...apiData,
            categories: apiData.categories && apiData.categories.length > 2
              ? apiData.categories
              : defaultCategories,
          });
        }
      } catch { }
      finally { setFiltersLoaded(true); }
    })();
  }, []);

  useEffect(() => { setSearchInput(urlQuery);             }, [urlQuery]);
  useEffect(() => { setActiveField(urlField || "all");    }, [urlField]);
  useEffect(() => { setFilterCategory(urlCategory);       }, [urlCategory]);
  useEffect(() => { setFilterPublication(urlPublication); }, [urlPublication]);

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
        setBooks(Array.isArray(data.results) ? data.results : (data.data ?? []));
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

  const onPage       = (p) => pushParams({ page: String(p) });
  const onSortChange = (v) => pushParams({ sort: v, page: "1" });
  const onBookClick  = (id) => { recordBookClick(id); router.push(`/book/${id}`); };

  const pageTitle = urlCategory
    ? urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)
    : urlQuery ? `Search: "${urlQuery}"` : "All Books";

  const fieldLabel = {
    all:     "All Fields",
    title:   "Title",
    author:  "Author",
    subject: "Subject",
    isbn:    "ISBN / ISSN",
  };

  return (
    <>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .book-card {
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s ease;
          user-select: none;
        }
        .book-card:hover {
          border-color: #003087 !important;
        }

        .adv-input {
          width: 100%;
          padding: 8px 0;
          border: none;
          border-bottom: 1.5px solid #e5e7eb;
          outline: none;
          font-size: 14px;
          color: #111827;
          background: transparent;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .adv-input:focus { border-bottom-color: #111827; }
        .adv-input::placeholder { color: #9ca3af; }

        .aww-scroll::-webkit-scrollbar { width: 3px; }
        .aww-scroll::-webkit-scrollbar-track { background: transparent; }
        .aww-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
        .aww-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

        @keyframes dropdownIn {
          0%   { opacity: 0; transform: translateY(-8px) scaleY(0.94); }
          100% { opacity: 1; transform: translateY(0)    scaleY(1); }
        }
        .aww-dropdown {
          animation: dropdownIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top center;
        }

        .field-pill {
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 12px;
          cursor: pointer;
          border: none;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .field-pill.active   { background: #1e3a8a; color: #fff; }
        .field-pill.inactive { background: #f3f4f6; color: #374151; }
        .field-pill.inactive:hover { background: #e5e7eb; }

        /* ─── CSS Grid for book cards ─── */
        /*
          Breakpoints (matching your px-* padding pattern):
          < 480px  → 2 columns  (small mobile)
          480-639  → 3 columns
          640-767  → 3 columns
          768-1023 → 4 columns
          1024-1279→ 5 columns
          1280-1439→ 6 columns
          1440-1699→ 7 columns
          ≥ 1900   → 8 columns
        */
        .books-grid {
          display: grid;
          gap: 12px;
          padding-bottom: 32px;
          /* default: 2 col mobile */
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 480px) {
          .books-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
        }
        @media (min-width: 640px) {
          .books-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }
        @media (min-width: 768px) {
          .books-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; }
        }
        @media (min-width: 1024px) {
          .books-grid { grid-template-columns: repeat(5, 1fr); gap: 20px; }
        }
        @media (min-width: 1280px) {
          .books-grid { grid-template-columns: repeat(6, 1fr); gap: 20px; }
        }
        @media (min-width: 1440px) {
          .books-grid { grid-template-columns: repeat(7, 1fr); gap: 22px; }
        }
        @media (min-width: 1900px) {
          .books-grid { grid-template-columns: repeat(8, 1fr); gap: 24px; }
        }

        /* Card cover: fixed aspect ratio, no need for JS width/height */
        .book-cover {
          width: 100%;
          aspect-ratio: 3 / 4;
          background: #f0f4ff;
          position: relative;
          overflow: hidden;
        }

        .book-meta {
          padding: 10px 10px 12px;
        }
        @media (min-width: 768px) {
          .book-meta { padding: 12px 12px 14px; }
        }
      `}</style>

      <div className="min-h-screen bg-white flex flex-col">
        <Nav />

        <main className="flex-1 flex flex-col">

          {/* ── Search header ── */}
          <section className="w-full bg-white border-b border-gray-200 pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8">
            <div className="max-w-[1900px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">

              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-medium text-gray-900 mb-5 sm:mb-6 tracking-tight">
                {pageTitle}
              </h1>

              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="flex flex-1 items-center bg-white relative"
                  style={{ border: "1px solid #e5e7eb", borderRadius: 40, height: 56 }}
                >
                  <input
                    value={searchInput}
                    onChange={(e) => onSearchInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")  onSubmitSearch();
                      if (e.key === "Escape") setShowSuggestions(false);
                    }}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder="Search for books, sourcebooks, reports..."
                    className="flex-1 bg-transparent outline-none text-[13px] sm:text-[14px] text-gray-800 placeholder:text-gray-400 px-4 sm:px-5"
                  />

                  <div className="hidden md:block h-6 w-px bg-gray-200 shrink-0" />
                  <div className="hidden md:flex items-center gap-1 px-3 lg:px-4 flex-nowrap">
                    {Object.entries(fieldLabel).map(([f, lbl]) => (
                      <button
                        key={f}
                        onClick={() => setActiveField(f)}
                        className={`field-pill ${activeField === f ? "active" : "inactive"}`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>

                  <Suggestions
                    suggestions={suggestions}
                    onSelect={onSuggestionSelect}
                    visible={showSuggestions}
                  />
                </div>

                <button
                  onClick={onSubmitSearch}
                  className="shrink-0 flex items-center justify-center rounded-full text-white transition-colors"
                  style={{ width: 56, height: 56, background: "#1e3a8a", border: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#1e40af"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#1e3a8a"}
                  aria-label="Search"
                >
                  <SearchIcon />
                </button>
              </div>

             
              <div className="flex md:hidden items-center gap-1.5 flex-wrap mt-3">
                {Object.entries(fieldLabel).map(([f, lbl]) => (
                  <button
                    key={f}
                    onClick={() => setActiveField(f)}
                    className={`field-pill ${activeField === f ? "active" : "inactive"}`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 sm:mt-4 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <CategoryDropdown
                    label="Category"
                    options={filtersLoaded ? filterOptions.categories : []}
                    value={filterCategory}
                    onChange={(v) => onFilterChange("category", v)}
                    disabled={!filtersLoaded}
                  />
                  <CategoryDropdown
                    label="Publication"
                    options={filtersLoaded ? filterOptions.publications : []}
                    value={filterPublication}
                    onChange={(v) => onFilterChange("publication", v)}
                    disabled={!filtersLoaded}
                  />
                </div>

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800 underline transition-colors bg-transparent border-none cursor-pointer"
                >
                  <SlidersHorizontal size={13} />
                  {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
                </button>
              </div>

             
              {showAdvanced && (
                <div
                  className="mt-4 rounded-lg p-4 sm:p-6"
                  style={{ border: "1px solid #d1d5db", background: "transparent" }}
                >
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-5">Advanced Search</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    {[
                      { label: "Title",              value: advTitle,     setter: setAdvTitle,     placeholder: "Enter book title" },
                      { label: "Author",             value: advAuthor,    setter: setAdvAuthor,    placeholder: "Enter author name" },
                      { label: "Subject / Keywords", value: advSubject,   setter: setAdvSubject,   placeholder: "Enter subject or keywords" },
                      { label: "Publisher",          value: advPublisher, setter: setAdvPublisher, placeholder: "Enter publisher name" },
                    ].map(({ label, value, setter, placeholder }) => (
                      <div key={label}>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                          {label}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && onAdvancedSearch()}
                          className="adv-input"
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Year From
                      </label>
                      <input
                        type="number"
                        value={advYearFrom}
                        onChange={(e) => setAdvYearFrom(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onAdvancedSearch()}
                        className="adv-input"
                        placeholder={filterOptions.yearMin ? `e.g. ${filterOptions.yearMin}` : "e.g. 2000"}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Year To
                      </label>
                      <input
                        type="number"
                        value={advYearTo}
                        onChange={(e) => setAdvYearTo(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onAdvancedSearch()}
                        className="adv-input"
                        placeholder={filterOptions.yearMax ? `e.g. ${filterOptions.yearMax}` : "e.g. 2024"}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                        ISBN / ISSN
                      </label>
                      <input
                        type="text"
                        value={advISBN}
                        onChange={(e) => setAdvISBN(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onAdvancedSearch()}
                        className="adv-input"
                        placeholder="Enter ISBN or ISSN (hyphens optional)"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={onAdvancedSearch}
                      className="bg-blue-900 text-white rounded-md text-[13px] font-semibold cursor-pointer hover:bg-blue-800 transition-colors border-none"
                      style={{ height: 38, width: 100 }}
                    >
                      Search
                    </button>
                    <button
                      onClick={onClearAdvanced}
                      className="bg-white text-gray-700 border border-gray-200 rounded-md text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ height: 38, width: 100 }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

       
          <div className="flex-1 flex flex-col">

           
            <div className="max-w-[1900px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 pt-6 sm:pt-8">
              <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-3">
                <span className="text-[13px] text-gray-500">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={13} className="animate-spin" /> Searching...
                    </span>
                  ) : (
                    `${total.toLocaleString()} book${total !== 1 ? "s" : ""}`
                  )}
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <SortDropdown value={urlSort} onChange={onSortChange} />
                  <div className="w-px h-5 bg-gray-200" />
                  <button
                    onClick={() => setIsGridView(true)}
                    aria-label="Grid view"
                    className="p-1 bg-transparent border-none cursor-pointer"
                  >
                    <IconGrid active={isGridView} />
                  </button>
                  <button
                    onClick={() => setIsGridView(false)}
                    aria-label="List view"
                    className="p-1 bg-transparent border-none cursor-pointer"
                  >
                    <IconList active={!isGridView} />
                  </button>
                </div>
              </div>
            </div>

           
            <div className="max-w-[1900px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 pb-20 flex-1 flex flex-col">

              {error && !loading && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-[13px] mb-5">
                  {error}. Please try again or refine your search.
                </div>
              )}

            
              {isGridView && (
                <div className="books-grid">
                  {loading ? (
                    <SkeletonGrid count={LIMIT} />
                  ) : (
                    books.map((book) => (
                      <div
                        key={book.id}
                        className="book-card"
                        onClick={() => onBookClick(book.id)}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        
                        <div className="book-cover">
                          {book.upload_id ? (
                            <PDFThumbnail uploadId={book.upload_id} title={book.title} />
                          ) : (
                            <div style={{
                              width: "100%", height: "100%", background: "#fff",
                              display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "center",
                              padding: "16px 10px", boxSizing: "border-box",
                            }}>
                              <BookOpen
                                size={28}
                                color="#000"
                                strokeWidth={1.2}
                                style={{ marginBottom: 10 }}
                              />
                              <span style={{
                                color: "#000", fontSize: 11, fontWeight: 600,
                                textAlign: "center", lineHeight: 1.3,
                                display: "-webkit-box", WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical", overflow: "hidden",
                              }}>
                                {book.title}
                              </span>
                            </div>
                          )}
                        </div>

                      
                        <div className="book-meta">
                          <div style={{
                            fontSize: 13, fontWeight: 700, color: "#111827",
                            lineHeight: 1.25, marginBottom: 6,
                            display: "-webkit-box", WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical", overflow: "hidden",
                          }}>
                            {book.title}
                          </div>
                          <div style={{
                            fontSize: 12, color: "#4b5563",
                            display: "flex", justifyContent: "space-between", gap: 8,
                          }}>
                            <span style={{
                              overflow: "hidden", textOverflow: "ellipsis",
                              whiteSpace: "nowrap", flex: 1,
                            }} title={book.author}>
                              {book.author || "Unknown Author"}
                            </span>
                            <span style={{ color: "#6b7280", fontWeight: 600, flexShrink: 0 }}>
                              {book.year ?? "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              
              {!isGridView && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  {loading ? (
                    <SkeletonList count={LIMIT} />
                  ) : (
                    books.map((book, idx) => (
                      <div
                        key={book.id}
                        className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50"
                        style={{ borderBottom: idx < books.length - 1 ? "1px solid #f3f4f6" : "none" }}
                        onClick={() => onBookClick(book.id)}
                      >
                        <div className="w-10 h-14 sm:w-11 sm:h-[58px] overflow-hidden shrink-0 border border-gray-200">
                          <PDFThumbnail
                            uploadId={book.upload_id}
                            title={book.title}
                            style={{ aspectRatio: "unset", width: "100%", height: "100%" }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-[13px] sm:text-[14px] font-bold text-gray-900 leading-tight mb-1 truncate"
                            title={book.title}
                          >
                            {book.title}
                          </div>
                          <div className="text-[11px] sm:text-[12px] text-gray-500 flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span className="truncate flex-1" title={book.author}>{book.author}</span>
                            {book.edition && <span className="shrink-0">{book.edition}</span>}
                            <span className="font-bold text-gray-400 shrink-0">{book.year}</span>
                            <span className="text-[10px] font-bold text-green-800 bg-green-100 rounded px-1.5 py-0.5 shrink-0">
                              PDF
                            </span>
                            {book.upload_size && (
                              <span className="text-[10px] text-gray-400 shrink-0">
                                {(book.upload_size / (1024 * 1024)).toFixed(1)} MB
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={15} className="opacity-30 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              )}

              
              {!loading && !error && books.length === 0 && (
                <div style={{
                  flex: 1,
                  minHeight: "40vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  color: "#9ca3af",
                  textAlign: "center",
                }}>
                  <BookOpen size={44} strokeWidth={1} />
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 500, color: "#4b5563", margin: "0 0 4px" }}>
                      No results found
                    </p>
                    <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                      {urlQuery
                        ? `Try different keywords for "${urlQuery}"`
                        : "Try adjusting your filters"}
                    </p>
                  </div>
                </div>
              )}

              
              {!loading && books.length > 0 && (
                <Pagination page={urlPage} totalPages={totalPages} onPage={onPage} />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Search;