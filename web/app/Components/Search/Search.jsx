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

    <svg width="18" height="18" viewBox="0 0 24 24">

      <path fill="currentColor" d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />

    </svg>

  );

}



function PlusMinusIcon({ open }) {

  return (

    <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-400 shrink-0">

      {open ? (

        <path fill="currentColor" d="M19 13H5v-2h14v2z" />

      ) : (

        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />

      )}

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



function FilterDropdown({ label, options = [], value, onChange, disabled }) {

  const [open, setOpen]         = useState(false);

  const [animating, setAnimating] = useState(false);

  const [visible, setVisible]   = useState(false);

  const ref = useRef(null);



  const openDropdown = () => {

    setVisible(true);

    setAnimating(false);

    requestAnimationFrame(() => {

      requestAnimationFrame(() => setAnimating(true));

    });

    setOpen(true);

  };



  const closeDropdown = () => {

    setAnimating(false);

    setTimeout(() => {

      setVisible(false);

      setOpen(false);

    }, 320);

  };



  const toggleOpen = () => {

    if (open) closeDropdown();

    else openDropdown();

  };



  useEffect(() => {

    const handler = (e) => {

      if (ref.current && !ref.current.contains(e.target)) closeDropdown();

    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, [open]);



  const allOptions = [{ __clearAll: true }, ...options];



  return (

    <>

      <style>{`

        @keyframes bm-line-grow {

          from { transform: scaleX(0); }

          to   { transform: scaleX(1); }

        }

        .bm-dropdown-panel {

          transform-origin: top center;

          transition:

            opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1),

            transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),

            clip-path 0.32s cubic-bezier(0.22, 1, 0.36, 1);

        }

        .bm-dropdown-panel.closed {

          opacity: 0;

          transform: translateY(-6px) scaleY(0.96);

          clip-path: inset(0 0 100% 0);

          pointer-events: none;

        }

        .bm-dropdown-panel.open {

          opacity: 1;

          transform: translateY(0) scaleY(1);

          clip-path: inset(0 0 0% 0);

          pointer-events: all;

        }

        .bm-item {

          position: relative;

          opacity: 0;

          transform: translateY(8px);

          transition:

            opacity 0.22s ease,

            transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),

            background 0.15s ease,

            color 0.15s ease;

        }

        .bm-item.visible {

          opacity: 1;

          transform: translateY(0);

        }

        .bm-item::after {

          content: '';

          position: absolute;

          bottom: 0;

          left: 16px;

          right: 16px;

          height: 1px;

          background: #e5e7eb;

          transform: scaleX(0);

          transform-origin: left;

        }

        .bm-item.visible::after {

          animation: bm-line-grow 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;

        }

        .bm-item:last-child::after { display: none; }

        .bm-item:hover:not(.selected) { background: #f9fafb; }

        .bm-item.selected { background: #111827 !important; color: #fff !important; }

        .bm-item.selected:hover { background: #1f2937 !important; }

      `}</style>



      <div className="relative" ref={ref}>

        <button

          onClick={toggleOpen}

          disabled={disabled}

          className={`h-10 border px-4 flex items-center gap-2 text-[13px] transition min-w-[130px] rounded-[3px]

            ${value

              ? "border-[#f4f4f4] bg-[#f4f4f4] text-gray-900 font-semibold"

              : "border-[#f4f4f4] bg-[#f4f4f4] text-gray-700 hover:bg-gray-100"

            } disabled:opacity-40`}

        >

          <span className="truncate flex-1 text-left">{value || label}</span>

          {value ? (

            <span

              role="button"

              onClick={(e) => { e.stopPropagation(); onChange(""); }}

              className="shrink-0 text-gray-400 hover:text-gray-700 cursor-pointer"

            >

              <X size={12} />

            </span>

          ) : <PlusMinusIcon open={open} />}

        </button>



        {visible && (

          <div

            className={`bm-dropdown-panel absolute top-12 left-0 z-50 bg-white border border-gray-200 shadow-xl min-w-[200px] overflow-hidden ${animating ? "open" : "closed"}`}

            style={{ borderRadius: 0 }}

          >

            {allOptions.map((opt, i) => {

              const isClear    = opt.__clearAll;

              const optName    = isClear ? null : (typeof opt === "object" ? opt.name : opt);

              const isSelected = !isClear && value === optName;

              const delay      = `${i * 32}ms`;



              return (

                <button

                  key={isClear ? "__clear" : optName}

                  onClick={() => {

                    onChange(isClear ? "" : optName);

                    closeDropdown();

                  }}

                  className={`bm-item w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-2 ${animating ? "visible" : ""} ${isSelected ? "selected" : ""}`}

                  style={{

                    transitionDelay: animating ? delay : "0ms",

                    color: isSelected ? "#fff" : isClear ? "#9ca3af" : "#374151",

                  }}

                >

                  <span className="flex-1">{isClear ? `All ${label}s` : optName}</span>

                  {isSelected && (

                    <svg className="ml-auto shrink-0" width="13" height="13" viewBox="0 0 24 24">

                      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />

                    </svg>

                  )}

                </button>

              );

            })}

          </div>

        )}

      </div>

    </>

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

    <div className="relative" ref={ref}>

      <button

        onClick={() => setOpen((o) => !o)}

        className="h-9 border border-gray-200 rounded-full px-4 flex items-center gap-2 text-[13px] text-gray-700 hover:bg-gray-50 transition"

      >

        Sort: <span className="font-medium">{current.label}</span>

        <PlusMinusIcon open={open} />

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



function FilterChip({ label, onRemove }) {

  return (

    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-3 py-1 text-[12px] font-medium">

      {label}

      <button onClick={onRemove} className="hover:text-blue-600 transition"><X size={11} /></button>

    </span>

  );

}



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

  const [windowWidth, setWindowWidth] = useState(0);



  const LIMIT = 24;



  useEffect(() => {

    const handleResize = () => setWindowWidth(window.innerWidth);

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, []);



  const getGridColumns = () => {

    if (windowWidth === 0) return "repeat(2, 1fr)";

    if (windowWidth < 640)  return "repeat(2, 1fr)";

    if (windowWidth < 768)  return "repeat(3, 1fr)";

    if (windowWidth < 1024) return "repeat(4, 1fr)";

    if (windowWidth < 1280) return "repeat(5, 1fr)";

    if (windowWidth < 1440) return "repeat(5, 1fr)";

    return "repeat(6, 1fr)";

  };



  const getCardStyles = () => {

    const isMobile = windowWidth > 0 && windowWidth < 640;

    if (isMobile) {

      return {

        card: { width: "100%", border: "1px solid #d1d5db", overflow: "hidden" },

        cover: { width: "100%", aspectRatio: "3/4", background: "#f0f4ff", position: "relative" },

        coverFixed: false,

      };

    }

    return {

      card: { width: "100%", maxWidth: 200, border: "1px solid #d1d5db", overflow: "hidden" },

      cover: { width: "100%", height: 267, background: "#f0f4ff", position: "relative" },

      coverFixed: true,

    };

  };



  const cardStyles = getCardStyles();



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

            "Books",

            "Sourcebooks",

            "Periodicals",

            "Thesis / Research papers",

            "Statute / Law / Legal documents",

            "Guide / Manuals",

            "Report",

            "Reference Materials",

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



  useEffect(() => { setSearchInput(urlQuery);             }, [urlQuery]);

  useEffect(() => { setActiveField(urlField || "all");    }, [urlField]);

  useEffect(() => { setFilterCategory(urlCategory);       }, [urlCategory]);

  useEffect(() => { setFilterPublication(urlPublication); }, [urlPublication]);



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



  const onClearFilters = () => {

    setFilterCategory(""); setFilterPublication("");

    pushParams({ category: "", publication: "", yearFrom: "", yearTo: "", page: "1" });

  };



  const onPage       = (p) => pushParams({ page: String(p) });

  const onSortChange = (v) => pushParams({ sort: v, page: "1" });

  const onBookClick  = (id) => { recordBookClick(id); router.push(`/book/${id}`); };



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



  return (

    <>

      <style>{`

        @keyframes pulse {

          0%, 100% { opacity: 1; }

          50%       { opacity: 0.5; }

        }

        .book-card {

          cursor: pointer;

          overflow: hidden;

          transition: border-color 0.2s ease;

        }

        .book-card:hover {

          border-color: #003087 !important;

        }

      `}</style>



      <div className="min-h-screen bg-white">

        <Nav />



        <section className="w-full bg-blue-900 pt-16 pb-20">

          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-12 2xl:px-12">

            <h1 className="text-[40px] font-medium text-white mb-8">{pageTitle}</h1>



            <div className="w-full bg-white shadow-sm px-4 py-4 flex items-center gap-3 relative rounded-[3px]">

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



            <div className="mt-3">

              <button

                onClick={() => setShowAdvanced(!showAdvanced)}

                className="text-white/80 text-[13px] hover:text-white transition underline flex items-center gap-1.5"

              >

                <SlidersHorizontal size={13} />

                {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}

              </button>

            </div>



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



            <div className="mt-5 flex flex-wrap items-center gap-3">

              <div className="flex flex-wrap items-center gap-2 sm:hidden">

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

              <div className="hidden sm:flex flex-wrap items-center gap-3">

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

          </div>

        </section>



        <main className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-12 2xl:px-12 pt-10 pb-24">

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



          {error && !loading && (

            <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-red-600 text-sm mb-6">

              {error}. Please try again or refine your search.

            </div>

          )}



          {isGridView && (

            <div style={{

              display: "grid",

              gridTemplateColumns: getGridColumns(),

              gap: windowWidth < 640 ? 12 : 24,

              paddingBottom: 48,

            }}>

              {loading

                ? <SkeletonGrid count={LIMIT} />

                : books.map((book) => (

                <div

                  key={book.id}

                  className="book-card"

                  onClick={() => onBookClick(book.id)}

                  style={cardStyles.card}

                >

                  <div style={cardStyles.cover}>

                    {book.upload_id ? (

                      <PDFThumbnail uploadId={book.upload_id} title={book.title} />

                    ) : (

                      <div style={{

                        width: "100%",

                        height: "100%",

                        background: "#ffffff",

                        display: "flex",

                        flexDirection: "column",

                        alignItems: "center",

                        justifyContent: "center",

                        padding: "16px 10px",

                        boxSizing: "border-box",

                      }}>

                        <BookOpen size={28} color="#000000" strokeWidth={1.2} style={{ marginBottom: 10 }} />

                        <span style={{

                          color: "#000000",

                          fontSize: 11,

                          fontWeight: 600,

                          textAlign: "left",

                          lineHeight: 1.3,

                          display: "-webkit-box",

                          WebkitLineClamp: 4,

                          WebkitBoxOrient: "vertical",

                          overflow: "hidden",

                        }}>

                          {book.title}

                        </span>

                      </div>

                    )}

                  </div>



                  <div style={{ padding: windowWidth < 640 ? "8px 8px 10px" : "12px 12px 14px" }}>

                    <div style={{

                      fontSize: windowWidth < 640 ? 11 : 13,

                      fontWeight: 700,

                      color: "#111827",

                      lineHeight: 1.25,

                      marginBottom: 4,

                      display: "-webkit-box",

                      WebkitLineClamp: 2,

                      WebkitBoxOrient: "vertical",

                      overflow: "hidden",

                    }}>

                      {book.title}

                    </div>

                    <div style={{

                      fontSize: windowWidth < 640 ? 10 : 12,

                      color: "#4b5563",

                      display: "flex",

                      justifyContent: "space-between",

                      gap: 4,

                    }}>

                      <span style={{

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",

                        flex: 1,

                      }} title={book.author}>

                        {book.author || "Unknown Author"}

                      </span>

                      <span style={{ color: "#6b7280", fontWeight: 600, flexShrink: 0 }}>

                        {book.year ?? "—"}

                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}



          {!isGridView && (

            <div style={{

              maxWidth: 1600,

              margin: "0 auto",

              paddingBottom: 48,

              border: "1px solid #e6ecf7",

              overflow: "hidden",

              background: "#fff",

            }}>

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



          {!loading && books.length > 0 && (

            <Pagination page={urlPage} totalPages={totalPages} onPage={onPage} />

          )}

        </main>

        <Footer />

      </div>

    </>

  );

};



export default Search;