"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  BookOpen,
  MoreHorizontal,
  Trophy,
  Plus,
  List,
  Check,
  ChevronRight,
  ArrowLeft,
  Folder,
  FolderPlus,
  Trash2,
} from "lucide-react";
import { authFetch } from "./utils/authFetch";
import { getCategoryClass } from "./utils/profileUtils";
import PDFThumbnail from "../Search/PDFThumbnail";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function pagesLabel(book) {
  // Accept all common field names the backend might return
  const total =
    book.total_pages ??
    book.page_count ??
    book.num_pages ??
    book.pages ??
    null;

  if (!total) return null;

  const progress = book.reading_progress ?? 0; // 0-100
  const read = book.pages_read ?? Math.round((progress / 100) * total);
  const toGo = Math.max(0, total - read);

  if (toGo === 0) return `${total} pages | All pages read`;
  return `${total} pages | ${toGo} pages to go`;
}

// ─────────────────────────────────────────────
// Add-to-List popover
// ─────────────────────────────────────────────
function AddToListPopover({ book, lists, onAddToList, onCreateList, onClose }) {
  const [newListName, setNewListName] = useState("");
  const [creating, setCreating] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleCreate = () => {
    const name = newListName.trim();
    if (!name) return;
    onCreateList(name, book.id);
    setNewListName("");
    setCreating(false);
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-30 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 w-60"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="px-3 pb-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
        Save to list
      </p>

      {lists.length === 0 && (
        <p className="px-3 py-2 text-xs text-zinc-400 italic">No lists yet</p>
      )}

      {lists.map((list) => {
        const inList = list.bookIds.includes(book.id);
        return (
          <button
            key={list.id}
            onClick={() => onAddToList(list.id, book.id)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <span className="flex items-center gap-2 truncate">
              <Folder size={12} className="text-zinc-400 shrink-0" />
              <span className="truncate">{list.name}</span>
            </span>
            {inList && <Check size={11} className="text-emerald-500 shrink-0" />}
          </button>
        );
      })}

      <div className="border-t border-zinc-100 mt-1 pt-1">
        {creating ? (
          <div className="px-2 py-2 flex gap-1.5">
            <input
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setCreating(false);
              }}
              placeholder="List name…"
              className="flex-1 text-xs border border-zinc-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
            <button
              onClick={handleCreate}
              className="text-xs bg-zinc-800 text-white rounded-md px-1.5 py-1 hover:bg-zinc-700 transition-colors"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:bg-zinc-50 transition-colors"
          >
            <FolderPlus size={12} />
            New list
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// All Lists view
// ─────────────────────────────────────────────
function AllListsView({ lists, bookmarks, onBack, onDeleteList, onRemoveFromList, onClose }) {
  const [activeList, setActiveList] = useState(null);

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

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 mb-4 transition-colors"
      >
        <ArrowLeft size={13} />
        Bookmarks
      </button>

      <h3 className="text-base font-semibold text-zinc-800 mb-1">All Lists</h3>
      <p className="text-xs text-zinc-400 mb-5">Your curated reading lists</p>

      {lists.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <Folder size={36} className="text-zinc-200 mb-3" strokeWidth={1.3} />
          <p className="text-sm font-medium text-zinc-600 mb-1">No lists yet</p>
          <p className="text-xs text-zinc-400">
            Create lists from the three-dot menu on any bookmark.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {lists.map((list) => {
            const count = list.bookIds.length;
            return (
              <div
                key={list.id}
                className="group flex items-center justify-between gap-3 p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl cursor-pointer transition-colors"
                onClick={() => setActiveList(list.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                    <Folder size={14} className="text-zinc-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-800 truncate">{list.name}</p>
                    <p className="text-[10px] text-zinc-400">
                      {count} book{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteList(list.id);
                    }}
                    className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete list"
                  >
                    <Trash2 size={12} />
                  </button>
                  <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </div>
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
  const [addToListOpen, setAddToListOpen]       = useState(null); // book.id
  const [view, setView]                         = useState("bookmarks"); // "bookmarks" | "allLists"

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

  // ── Finished state (persisted locally, fallback if backend doesn't support) ──
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
      // Also remove from all lists
      persistLists(lists.map((l) => ({ ...l, bookIds: l.bookIds.filter((id) => id !== bookId) })));
      persistFinished(finishedIds.filter((id) => id !== bookId));
    } catch {}
  };

  // ── Mark as finished/unfinished ──
  const toggleFinished = async (bookId) => {
    const isFinished = finishedIds.includes(bookId);
    const next = isFinished
      ? finishedIds.filter((id) => id !== bookId)
      : [...finishedIds, bookId];
    persistFinished(next);

    // Optimistically update reading_progress in local state
    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, reading_progress: isFinished ? (b._prevProgress ?? 0) : 100, _prevProgress: b.reading_progress }
          : b
      )
    );

    // Optionally call backend
    try {
      await authFetch(`/api/bookmarks/${bookId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: isFinished ? 0 : 100 }),
      });
    } catch {}
  };

  // ── Lists CRUD ──
  const createList = (name, bookId = null) => {
    const newList = {
      id: `list_${Date.now()}`,
      name,
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

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen && !addToListOpen) return;
    const handler = () => { setMenuOpen(null); };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [menuOpen, addToListOpen]);

  // ─────────────────────────────────────────────
  // All Lists view
  // ─────────────────────────────────────────────
  if (view === "allLists") {
    return (
      <AllListsView
        lists={lists}
        bookmarks={bookmarks}
        onBack={() => setView("bookmarks")}
        onDeleteList={deleteList}
        onRemoveFromList={removeFromList}
        onClose={onClose}
      />
    );
  }

  // ─────────────────────────────────────────────
  // Bookmarks view
  // ─────────────────────────────────────────────
  return (
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
              // If marked finished, override progress to 100 regardless of backend value
              const progress = isFinished ? 100 : (book.reading_progress ?? 0);
              // Override pagesLabel so "All pages read" shows when finished
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
                    {/* Title */}
                    <Link
                      href={`/book/${book.id}`}
                      onClick={onClose}
                      className="block text-sm font-semibold text-zinc-800 leading-snug hover:text-zinc-950 transition-colors line-clamp-2 mb-1"
                    >
                      {book.title}
                    </Link>

                    {/* Author / Uploader */}
                    {(book.author || book.uploaded_by) && (
                      <p className="text-xs text-zinc-400 mb-1.5 truncate">
                        {book.author ? `By ${book.author}` : `Uploaded by ${book.uploaded_by}`}
                      </p>
                    )}

                    
                    {/* Badges */}
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
                        className="absolute right-0 top-7 z-20 bg-white border border-zinc-200 rounded-xl shadow-xl py-1.5 min-w-[170px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Open book */}
                        <Link
                          href={`/book/${book.id}`}
                          onClick={() => { setMenuOpen(null); onClose?.(); }}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
                        >
                          <BookOpen size={13} className="text-zinc-400" />
                          Open book
                        </Link>

                        {/* Mark as Finished / Unfinished */}
                        <button
                          onClick={() => { toggleFinished(book.id); setMenuOpen(null); }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
                        >
                          {isFinished ? (
                            <>
                              <Trophy size={13} className="text-amber-400" />
                              Mark as Unfinished
                            </>
                          ) : (
                            <>
                              <Check size={13} className="text-emerald-500" />
                              Mark as Finished
                            </>
                          )}
                        </button>

                        {/* Add to List */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(null);
                            setAddToListOpen(book.id);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
                        >
                          <Plus size={13} className="text-zinc-400" />
                          Add to List
                        </button>

                        <div className="my-1 border-t border-zinc-100" />

                        {/* Remove from Saved */}
                        <button
                          onClick={() => { removeBookmark(book.id); setMenuOpen(null); }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <X size={13} />
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
                        onCreateList={createList}
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
  );
}
