"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  BookOpen,
  MoreHorizontal,
  Trophy,
  Plus,
  Check,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { authFetch } from "./utils/authFetch";
import { getCategoryClass } from "./utils/profileUtils";
import PDFThumbnail from "../Search/PDFThumbnail";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function pagesLabel(book) {
  const total =
    book.total_pages ??
    book.page_count ??
    book.num_pages ??
    book.pages ??
    null;

  if (!total) return null;

  const progress = book.reading_progress ?? 0;
  const read = book.pages_read ?? Math.round((progress / 100) * total);
  const toGo = Math.max(0, total - read);

  if (toGo === 0) return `${total} pages | All pages read`;
  return `${total} pages | ${toGo} pages to go`;
}

// ─────────────────────────────────────────────
// New List Modal (Scribd-style)
// ─────────────────────────────────────────────
function NewListModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const ref = useRef(null);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdrop}
    >
      <div
        ref={ref}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-zinc-900">New List</h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <label className="block text-sm font-medium text-zinc-800 mb-2">
            What would you like to name this list?
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") onClose();
            }}
            placeholder="Enter a title..."
            className="w-full border border-zinc-300 rounded-md px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-5 py-2 text-sm font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Create list
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Add-to-List popover
// ─────────────────────────────────────────────
function AddToListPopover({ book, lists, onAddToList, onOpenNewListModal, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-30 bg-white border border-zinc-200 rounded-2xl shadow-lg py-3 w-52"
      onClick={(e) => e.stopPropagation()}
    >
      {/* "SAVE TO LIST" label — small caps, wide tracking */}
      <p className="px-4 pb-2 text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">
        Save to list
      </p>

      {lists.length === 0 && (
        <p className="px-4 py-2 text-sm text-zinc-400 italic">No lists yet</p>
      )}

      {lists.map((list) => {
        const inList = list.bookIds.includes(book.id);
        return (
          <button
            key={list.id}
            onClick={() => onAddToList(list.id, book.id)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            {/* Open folder outline — matches screenshot exactly */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 shrink-0">
              <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
            </svg>
            <span className="truncate flex-1 text-left">{list.name}</span>
            {inList && <Check size={13} className="text-zinc-400 shrink-0" />}
          </button>
        );
      })}

      {/* Divider + New list */}
      <div className="border-t border-zinc-100 mt-2 pt-1">
        <button
          onClick={() => { onClose(); onOpenNewListModal(); }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          <Plus size={15} className="text-zinc-500 shrink-0" strokeWidth={1.8} />
          New list
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// All Lists view — Scribd style
// ─────────────────────────────────────────────
function AllListsView({ lists, bookmarks, onBack, onDeleteList, onRemoveFromList, onClose, onOpenNewListModal }) {
  const [activeList, setActiveList] = useState(null);

  // ── Single list detail ──
  if (activeList) {
    const list = lists.find((l) => l.id === activeList);
    const books = bookmarks.filter((b) => list?.bookIds.includes(b.id));

    return (
      <div>
        <button
          onClick={() => setActiveList(null)}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 mb-4 transition-colors"
        >
          <ArrowLeft size={13} />
          All Lists
        </button>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-zinc-800">{list?.name}</h3>
          <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
            {books.length} book{books.length !== 1 ? "s" : ""}
          </span>
        </div>

        {books.length === 0 ? (
          <p className="text-sm text-zinc-400 italic py-6 text-center">This list is empty.</p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-100">
            {books.map((book) => (
              <div key={book.id} className="flex items-center gap-3 py-3">
                <Link
                  href={`/book/${book.id}`}
                  onClick={onClose}
                  className="shrink-0 block rounded overflow-hidden border border-zinc-200"
                  style={{ width: 48, height: 64 }}
                >
                  {book.upload_id ? (
                    <div style={{ width: 48, height: 64, background: "#f9fafb" }}>
                      <PDFThumbnail uploadId={book.upload_id} title={book.title} />
                    </div>
                  ) : (
                    <div style={{ width: 48, height: 64 }} className="flex items-center justify-center bg-zinc-100">
                      <BookOpen size={16} className="text-zinc-300" strokeWidth={1.3} />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/book/${book.id}`}
                    onClick={onClose}
                    className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 line-clamp-2 transition-colors"
                  >
                    {book.title}
                  </Link>
                  {book.author && (
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">By {book.author}</p>
                  )}
                </div>
                <button
                  onClick={() => onRemoveFromList(list.id, book.id)}
                  className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Remove from list"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Lists overview — Scribd style ──
  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 mb-4 transition-colors"
      >
        <ArrowLeft size={13} />
        Bookmarks
      </button>

      {/* Header row */}
      <div className="flex items-center justify-between mb-0">
        <h3 className="text-lg font-semibold text-zinc-900">Lists</h3>
      </div>

      {/* Scribd-style top bar: Create List | All Lists */}
      <div className="flex items-center justify-between border-b border-zinc-200 mt-3 pb-3">
        <button
          onClick={onOpenNewListModal}
          className="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 font-medium transition-colors"
        >
          {/* ≡+ icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="2" y1="4" x2="9" y2="4"/>
            <line x1="2" y1="8" x2="9" y2="8"/>
            <line x1="2" y1="12" x2="9" y2="12"/>
            <line x1="12" y1="6" x2="12" y2="12"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
          </svg>
          Create List
        </button>

        <button
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          {/* ≡ icon */}
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="1" y1="4" x2="3.5" y2="4"/>
            <line x1="6" y1="4" x2="15" y2="4"/>
            <line x1="1" y1="8" x2="3.5" y2="8"/>
            <line x1="6" y1="8" x2="15" y2="8"/>
            <line x1="1" y1="12" x2="3.5" y2="12"/>
            <line x1="6" y1="12" x2="15" y2="12"/>
          </svg>
          All Lists
        </button>
      </div>

      {/* List items */}
      {lists.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <Folder size={36} className="text-zinc-200 mb-3" strokeWidth={1.3} />
          <p className="text-sm font-medium text-zinc-600 mb-1">No lists yet</p>
          <p className="text-xs text-zinc-400">
            Create your first list to organise your reading.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {lists.map((list) => {
            const count = list.bookIds.length;
            return (
              <div
                key={list.id}
                className="group flex items-center justify-between py-4 border-b border-zinc-100 cursor-pointer"
                onClick={() => setActiveList(list.id)}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">{list.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {count} title{count !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteList(list.id);
                  }}
                  className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                  title="Delete list"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function BookmarkedTab({ onClose, isMobile = false }) {
  const [bookmarks, setBookmarks]               = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [bookmarksError, setBookmarksError]     = useState(null);
  const [pagination, setPagination]             = useState({ page: 1, totalPages: 1, total: 0 });
  const [menuOpen, setMenuOpen]                 = useState(null);
  const [addToListOpen, setAddToListOpen]       = useState(null);
  const [view, setView]                         = useState("bookmarks"); // "bookmarks" | "allLists"
  const [showNewListModal, setShowNewListModal] = useState(false);

  // ── Lists state (persisted locally) ──
  const [lists, setLists] = useState(() => {
    try {
      const saved = localStorage.getItem("dep_reading_lists");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const persistLists = (next) => {
    setLists(next);
    try { localStorage.setItem("dep_reading_lists", JSON.stringify(next)); } catch {}
  };

  // ── Finished state ──
  const [finishedIds, setFinishedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("dep_finished_ids");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const persistFinished = (next) => {
    setFinishedIds(next);
    try { localStorage.setItem("dep_finished_ids", JSON.stringify(next)); } catch {}
  };

  // ─── Fetch ───
  const fetchBookmarks = async (page = 1) => {
    setBookmarksLoading(true);
    setBookmarksError(null);
    try {
      const res = await authFetch(`/api/bookmarks?page=${page}&limit=8`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookmarks(data.bookmarks);
      setPagination(data.pagination);
    } catch {
      setBookmarksError("Could not load bookmarks.");
    } finally {
      setBookmarksLoading(false);
    }
  };

  const removeBookmark = async (bookId) => {
    try {
      await authFetch(`/api/bookmarks/${bookId}`, { method: "DELETE" });
      setBookmarks((prev) => prev.filter((b) => b.id !== bookId));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      persistLists(lists.map((l) => ({ ...l, bookIds: l.bookIds.filter((id) => id !== bookId) })));
      persistFinished(finishedIds.filter((id) => id !== bookId));
    } catch {}
  };

  const toggleFinished = async (bookId) => {
    const isFinished = finishedIds.includes(bookId);
    const next = isFinished
      ? finishedIds.filter((id) => id !== bookId)
      : [...finishedIds, bookId];
    persistFinished(next);

    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, reading_progress: isFinished ? (b._prevProgress ?? 0) : 100, _prevProgress: b.reading_progress }
          : b
      )
    );

    try {
      await authFetch(`/api/bookmarks/${bookId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: isFinished ? 0 : 100 }),
      });
    } catch {}
  };

  // ── Lists CRUD ──
  // isPrivate is stored but never displayed in list items
  const createList = (name, isPrivate = false, bookId = null) => {
    const newList = {
      id: `list_${Date.now()}`,
      name,
      isPrivate,
      bookIds: bookId ? [bookId] : [],
      createdAt: new Date().toISOString(),
    };
    persistLists([...lists, newList]);
  };

  const deleteList = (listId) => {
    persistLists(lists.filter((l) => l.id !== listId));
  };

  const toggleBookInList = (listId, bookId) => {
    persistLists(
      lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              bookIds: l.bookIds.includes(bookId)
                ? l.bookIds.filter((id) => id !== bookId)
                : [...l.bookIds, bookId],
            }
          : l
      )
    );
  };

  const removeFromList = (listId, bookId) => {
    persistLists(
      lists.map((l) =>
        l.id === listId ? { ...l, bookIds: l.bookIds.filter((id) => id !== bookId) } : l
      )
    );
  };

  useEffect(() => { fetchBookmarks(1); }, []);

  useEffect(() => {
    if (!menuOpen && !addToListOpen) return;
    const handler = () => { setMenuOpen(null); };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [menuOpen, addToListOpen]);

  // ─────────────────────────────────────────────
  // New List Modal
  // ─────────────────────────────────────────────
  const newListModal = showNewListModal && (
    <NewListModal
      onClose={() => setShowNewListModal(false)}
      onCreate={(name, isPrivate) => createList(name, isPrivate)}
    />
  );

  // ─────────────────────────────────────────────
  // All Lists view
  // ─────────────────────────────────────────────
  if (view === "allLists") {
    return (
      <>
        {newListModal}
        <AllListsView
          lists={lists}
          bookmarks={bookmarks}
          onBack={() => setView("bookmarks")}
          onDeleteList={deleteList}
          onRemoveFromList={removeFromList}
          onClose={onClose}
          onOpenNewListModal={() => setShowNewListModal(true)}
        />
      </>
    );
  }

  // ─────────────────────────────────────────────
  // Bookmarks view
  // ─────────────────────────────────────────────
  return (
    <>
      {newListModal}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-zinc-800">Bookmarked</h2>
          {pagination.total > 0 && (
            <span className="text-xs text-zinc-500 px-3 py-1">
              {pagination.total} saved
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-400 mb-5">Your saved books</p>

        {/* Loading skeletons */}
        {bookmarksLoading && (
          <div className="flex flex-col divide-y divide-zinc-100">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4" style={{ opacity: 1 - i * 0.2 }}>
                <div className="shrink-0 w-[72px] h-[96px] bg-zinc-100 rounded animate-pulse" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3.5 w-3/4 bg-zinc-100 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-zinc-100 rounded animate-pulse" />
                  <div className="h-1.5 w-full bg-zinc-100 rounded animate-pulse mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {bookmarksError && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            {bookmarksError}
          </div>
        )}

        {/* Empty state */}
        {!bookmarksLoading && !bookmarksError && bookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "22px" }}>
              <svg width="120" height="98" viewBox="0 0 120 98" fill="none">
                <rect x="6" y="32" width="88" height="58" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="2.4"/>
                <path d="M6 32 Q6 22 15 22 L40 22 Q48 22 50 32" fill="none" stroke="#1a1a1a" strokeWidth="2.4" strokeLinejoin="round"/>
                <line x1="22" y1="52" x2="70" y2="52" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="22" y1="63" x2="56" y2="63" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M78 20 Q90 10 100 20" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3.5 4.5" fill="none"/>
                <circle cx="100" cy="25" r="5.5" fill="none" stroke="#1a1a1a" strokeWidth="2.2"/>
                <circle cx="100" cy="25" r="2" fill="#1a1a1a"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-800 mb-2">Explore all you want to read</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-xs">Save your favorite titles, and access them easily.</p>
            <Link href="/search" onClick={onClose} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Explore Library
            </Link>
          </div>
        )}

        {/* Bookmark list */}
        {!bookmarksLoading && bookmarks.length > 0 && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3">
              <button className="flex items-center gap-1.5 text-xs text-zinc-500 border border-zinc-200 hover:border-zinc-300 bg-white rounded-md px-3 py-1.5 transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round"/>
                </svg>
                Filters
              </button>
              <button
                onClick={() => setView("allLists")}
                className="flex items-center gap-1.5 text-xs text-zinc-500 border border-zinc-200 hover:border-zinc-300 bg-white rounded-md px-3 py-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 3h2M6 3h8M2 8h2M6 8h8M2 13h2M6 13h8" strokeLinecap="round"/>
                </svg>
                All Lists
                {lists.length > 0 && (
                  <span className="bg-zinc-200 text-zinc-600 rounded-full px-1.5 py-0 text-[9px] font-semibold">
                    {lists.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex flex-col divide-y divide-zinc-100">
              {bookmarks.map((book) => {
                const isFinished = finishedIds.includes(book.id) || book.reading_progress === 100;
                const progress = isFinished ? 100 : (book.reading_progress ?? 0);
                const pagesInfo = isFinished
                  ? (() => {
                      const total =
                        book.total_pages ?? book.page_count ?? book.num_pages ?? book.pages ?? null;
                      return total ? `${total} pages | All pages read` : "All pages read";
                    })()
                  : pagesLabel(book);

                return (
                  <div
                    key={book.id}
                    className="group flex items-start gap-4 py-4 first:pt-0 last:pb-0 relative"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/book/${book.id}`}
                      onClick={onClose}
                      className="shrink-0 block rounded overflow-hidden border border-zinc-200"
                      style={{ width: 72, height: 96, flexShrink: 0, borderRadius: 2 }}
                    >
                      {book.upload_id ? (
                        <div style={{ width: 72, height: 96, background: "#f9fafb" }}>
                          <PDFThumbnail uploadId={book.upload_id} title={book.title} />
                        </div>
                      ) : (
                        <div style={{ width: 72, height: 96 }} className="flex flex-col items-center justify-center bg-zinc-100 p-2">
                          <BookOpen size={20} className="text-zinc-300 mb-1" strokeWidth={1.3} />
                          <span className="text-[9px] text-zinc-400 text-center leading-tight line-clamp-3">{book.title}</span>
                        </div>
                      )}
                    </Link>

                    {/* Main content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <Link
                        href={`/book/${book.id}`}
                        onClick={onClose}
                        className="block text-sm font-semibold text-zinc-800 leading-snug hover:text-zinc-950 transition-colors line-clamp-2 mb-1"
                      >
                        {book.title}
                      </Link>

                      {(book.author || book.uploaded_by) && (
                        <p className="text-xs text-zinc-400 mb-1.5 truncate">
                          {book.author ? `By ${book.author}` : `Uploaded by ${book.uploaded_by}`}
                        </p>
                      )}

                      {/* Badges — no private indicator shown */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {isFinished && (
                          <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                            <Trophy size={10} />
                            Finished
                          </span>
                        )}
                        {book.category && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-[2px] ${getCategoryClass(book.category)}`}>
                            {book.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Three-dot menu */}
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddToListOpen(null);
                          setMenuOpen(menuOpen === book.id ? null : book.id);
                        }}
                        className="mt-0.5 p-1.5 rounded text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {menuOpen === book.id && (
                        <div
                          className="absolute right-0 top-7 z-20 bg-white border border-zinc-200 rounded-2xl shadow-lg py-2 min-w-[200px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => { toggleFinished(book.id); setMenuOpen(null); }}
                            className="w-full text-left px-5 py-2.5 text-sm text-zinc-800 hover:bg-zinc-50 transition-colors"
                          >
                            {isFinished ? "Mark as Unfinished" : "Mark as Finished"}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(null);
                              setAddToListOpen(book.id);
                            }}
                            className="w-full text-left px-5 py-2.5 text-sm text-zinc-800 hover:bg-zinc-50 transition-colors"
                          >
                            Add to List
                          </button>

                          <div className="my-1 border-t border-zinc-100" />

                          <button
                            onClick={() => { removeBookmark(book.id); setMenuOpen(null); }}
                            className="w-full text-left px-5 py-2.5 text-sm text-zinc-800 hover:bg-zinc-50 transition-colors"
                          >
                            Remove from Saved
                          </button>
                        </div>
                      )}

                      {/* Add to List popover */}
                      {addToListOpen === book.id && (
                        <AddToListPopover
                          book={book}
                          lists={lists}
                          onAddToList={toggleBookInList}
                          onOpenNewListModal={() => setShowNewListModal(true)}
                          onClose={() => setAddToListOpen(null)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-zinc-100">
                <button
                  onClick={() => fetchBookmarks(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 text-zinc-500 rounded-md text-sm disabled:opacity-30 hover:border-zinc-400 transition-colors"
                >←</button>
                <span className="text-xs text-zinc-400">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchBookmarks(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 text-zinc-500 rounded-md text-sm disabled:opacity-30 hover:border-zinc-400 transition-colors"
                >→</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}