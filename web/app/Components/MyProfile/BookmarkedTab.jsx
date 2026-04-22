"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X, BookOpen, MoreHorizontal, Trophy, Plus, Check, ArrowLeft, Trash2,
} from "lucide-react";
import { authFetch } from "./utils/authFetch";
import { getCategoryClass } from "./utils/profileUtils";
import PDFThumbnail from "../Search/PDFThumbnail";

// ─────────────────────────────────────────────
// New List Modal
// ─────────────────────────────────────────────
function NewListModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const handleCreate = () => { const t = name.trim(); if (!t) return; onCreate(t); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-zinc-900">New List</h2>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-zinc-700 transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-6">
          <label className="block text-sm font-medium text-zinc-800 mb-2">What would you like to name this list?</label>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") onClose(); }}
            placeholder="Enter a title..."
            className="w-full border border-zinc-300 rounded-md px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition" />
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100">
          <button onClick={onClose} className="px-5 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors">Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim()}
            className="px-5 py-2 text-sm font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
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
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute right-0 top-8 z-30 bg-white border border-zinc-200 rounded-2xl shadow-lg py-3 w-52"
      onClick={(e) => e.stopPropagation()}>
      <p className="px-4 pb-2 text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Save to list</p>
      {lists.length === 0 && <p className="px-4 py-2 text-sm text-zinc-400 italic">No lists yet</p>}
      {lists.map((list) => {
        const inList = list.bookIds.includes(book.id);
        return (
          <button key={list.id} onClick={() => onAddToList(list.id, book.id)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 shrink-0">
              <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
            </svg>
            <span className="truncate flex-1 text-left">{list.name}</span>
            {inList && <Check size={13} className="text-zinc-400 shrink-0" />}
          </button>
        );
      })}
      <div className="border-t border-zinc-100 mt-2 pt-1">
        <button onClick={() => { onClose(); onOpenNewListModal(); }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors">
          <Plus size={15} className="text-zinc-500 shrink-0" strokeWidth={1.8} /> New list
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Folder helpers
// ─────────────────────────────────────────────
const FOLDER_ACCENTS = ["#C9A96E","#7B9E87","#8FA3BF","#C17F6B","#A08BBB","#B5A07A","#7AABB5"];
function folderAccent(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return FOLDER_ACCENTS[Math.abs(hash) % FOLDER_ACCENTS.length];
}

function PremiumFolderSVG({ accent }) {
  const shadeMap = {
    "#C9A96E": { body: "#C8A86A", tab: "#B8975A" },
    "#7B9E87": { body: "#7A9E84", tab: "#6A8E74" },
    "#8FA3BF": { body: "#8FA8C8", tab: "#7C95B8" },
    "#C17F6B": { body: "#C08070", tab: "#A86E5E" },
    "#A08BBB": { body: "#A08CC0", tab: "#8E7AAE" },
    "#B5A07A": { body: "#B4A078", tab: "#A28E66" },
    "#7AABB5": { body: "#7AAAB8", tab: "#6898A6" },
  };
  const s = shadeMap[accent] || { body: "#8FA8C8", tab: "#7C95B8" };
  return (
    <svg width="100%" viewBox="0 0 220 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 48 Q12 36 24 36 L74 36 Q82 36 86 44 L94 56 L208 56 Q216 56 216 64 L216 152 Q216 160 208 160 L12 160 Q4 160 4 152 L4 56 Q4 48 12 48 Z" fill={s.tab} />
      <rect x="4" y="56" width="212" height="104" rx="14" fill={s.body} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Collections tab — matte folder grid
// ─────────────────────────────────────────────
function CollectionsView({ lists, bookmarks, onDeleteList, onRemoveFromList, onClose, onOpenNewListModal }) {
  const [activeList, setActiveList] = useState(null);
  const [hovered, setHovered] = useState(null);

  if (activeList) {
    const list = lists.find((l) => l.id === activeList);
    const books = bookmarks.filter((b) => list?.bookIds.includes(b.id));
    return (
      <div>
        <button onClick={() => setActiveList(null)}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 mb-4 transition-colors">
          <ArrowLeft size={13} /> All Collections
        </button>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-zinc-800">{list?.name}</h3>
          <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
            {books.length} book{books.length !== 1 ? "s" : ""}
          </span>
        </div>
        {books.length === 0
          ? <p className="text-sm text-zinc-400 italic py-6 text-center">This collection is empty.</p>
          : (
            <div className="flex flex-col divide-y divide-zinc-100">
              {books.map((book) => (
                <div key={book.id} className="flex items-center gap-3 py-3">
                  <Link href={`/book/${book.id}`} onClick={onClose}
                    className="shrink-0 block rounded overflow-hidden border border-zinc-200" style={{ width: 64, height: 86 }}>
                    {book.upload_id
                      ? <div style={{ width: 64, height: 86, background: "#f9fafb" }}><PDFThumbnail uploadId={book.upload_id} title={book.title} /></div>
                      : <div style={{ width: 64, height: 86 }} className="flex items-center justify-center bg-zinc-100"><BookOpen size={18} className="text-zinc-300" strokeWidth={1.3} /></div>
                    }
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/book/${book.id}`} onClick={onClose}
                      className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 line-clamp-2 transition-colors">
                      {book.title}
                    </Link>
                    {book.author && <p className="text-[10px] text-zinc-400 truncate mt-0.5">By {book.author}</p>}
                  </div>
                  <button onClick={() => onRemoveFromList(list.id, book.id)}
                    className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>
    );
  }

  return (
    <div>
      {lists.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <p className="text-sm font-medium text-zinc-600 mb-1">No collections yet</p>
          <p className="text-xs text-zinc-400 mb-4">Create your first collection to organise your reading.</p>
          <button onClick={onOpenNewListModal}
            className="text-sm font-medium text-zinc-700 border border-zinc-200 rounded-full px-5 py-2 hover:border-zinc-400 transition-colors">
            + New collection
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 16 }}>
          {lists.map((list) => {
            const books = bookmarks.filter((b) => list.bookIds.includes(b.id));
            const accent = folderAccent(list.id);
            const isHovered = hovered === list.id;
            return (
              <div key={list.id} style={{ position: "relative" }}
                onMouseEnter={() => setHovered(list.id)} onMouseLeave={() => setHovered(null)}>
                {/* Delete X */}
                <button onClick={(e) => { e.stopPropagation(); onDeleteList(list.id); }}
                  style={{
                    position: "absolute", top: 8, right: 8, zIndex: 10,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(0,0,0,0.45)", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "scale(1)" : "scale(0.7)",
                    transition: "opacity 0.15s, transform 0.15s",
                    pointerEvents: isHovered ? "auto" : "none",
                  }}>
                  <X size={9} color="white" strokeWidth={2.5} />
                </button>
                <button onClick={() => setActiveList(list.id)}
                  style={{
                    width: "100%", background: "none", border: "none", padding: 0,
                    cursor: "pointer", textAlign: "left",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    transition: "transform 0.2s cubic-bezier(.22,.68,0,1.2)",
                  }}>
                  <PremiumFolderSVG accent={accent} />
                  <div style={{ padding: "6px 2px 0" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {list.name}
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: "1px 0 0" }}>
                      {books.length} book{books.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
          {/* Ghost new folder */}
          <button onClick={onOpenNewListModal}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", opacity: 0.4, transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "0.4"}>
            <svg width="100%" viewBox="0 0 220 170" fill="none">
              <path d="M12 48 Q12 36 24 36 L74 36 Q82 36 86 44 L94 56 L208 56 Q216 56 216 64 L216 152 Q216 160 208 160 L12 160 Q4 160 4 152 L4 56 Q4 48 12 48 Z" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="6 4" />
              <rect x="4" y="56" width="212" height="104" rx="14" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="110" y1="90" x2="110" y2="126" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="92" y1="108" x2="128" y2="108" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div style={{ padding: "6px 2px 0" }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF", margin: 0 }}>New collection</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function BookmarkedTab({ onClose, isMobile = false }) {
  const [activeTab, setActiveTab]               = useState("bookmarked");
  const [bookmarks, setBookmarks]               = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [bookmarksError, setBookmarksError]     = useState(null);
  const [pagination, setPagination]             = useState({ page: 1, totalPages: 1, total: 0 });
  const [menuOpen, setMenuOpen]                 = useState(null);
  const [addToListOpen, setAddToListOpen]       = useState(null);
  const [showNewListModal, setShowNewListModal] = useState(false);

  const [lists, setLists] = useState(() => {
    try { const s = localStorage.getItem("dep_reading_lists"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const persistLists = (next) => { setLists(next); try { localStorage.setItem("dep_reading_lists", JSON.stringify(next)); } catch {} };

  const [finishedIds, setFinishedIds] = useState(() => {
    try { const s = localStorage.getItem("dep_finished_ids"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const persistFinished = (next) => { setFinishedIds(next); try { localStorage.setItem("dep_finished_ids", JSON.stringify(next)); } catch {} };

  const fetchBookmarks = async (page = 1) => {
    setBookmarksLoading(true); setBookmarksError(null);
    try {
      const res = await authFetch(`/api/bookmarks?page=${page}&limit=8`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookmarks(data.bookmarks); setPagination(data.pagination);
    } catch { setBookmarksError("Could not load bookmarks."); }
    finally { setBookmarksLoading(false); }
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
    const next = isFinished ? finishedIds.filter((id) => id !== bookId) : [...finishedIds, bookId];
    persistFinished(next);
    setBookmarks((prev) => prev.map((b) =>
      b.id === bookId ? { ...b, reading_progress: isFinished ? (b._prevProgress ?? 0) : 100, _prevProgress: b.reading_progress } : b
    ));
    try {
      await authFetch(`/api/bookmarks/${bookId}/progress`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: isFinished ? 0 : 100 }),
      });
    } catch {}
  };

  const createList = (name) => persistLists([...lists, { id: `list_${Date.now()}`, name, bookIds: [], createdAt: new Date().toISOString() }]);
  const deleteList = (id) => persistLists(lists.filter((l) => l.id !== id));
  const toggleBookInList = (listId, bookId) => persistLists(lists.map((l) =>
    l.id === listId ? { ...l, bookIds: l.bookIds.includes(bookId) ? l.bookIds.filter((id) => id !== bookId) : [...l.bookIds, bookId] } : l
  ));
  const removeFromList = (listId, bookId) => persistLists(lists.map((l) =>
    l.id === listId ? { ...l, bookIds: l.bookIds.filter((id) => id !== bookId) } : l
  ));

  useEffect(() => { fetchBookmarks(1); }, []);

  useEffect(() => {
    if (!menuOpen && !addToListOpen) return;
    const handler = () => setMenuOpen(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [menuOpen, addToListOpen]);

  return (
    <>
      {showNewListModal && <NewListModal onClose={() => setShowNewListModal(false)} onCreate={createList} />}

      {/* ── Pill tabs ── */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: isMobile ? 16 : 20 }}>
        <div style={{ display: "flex", gap: 2, background: "#F3F4F6", borderRadius: 99, padding: isMobile ? 4 : 4, flexShrink: 0 }}>
          {[
            { id: "bookmarked", label: "Bookmarked", count: pagination.total },
            { id: "collections", label: "Collections", count: lists.length },
          ].map(({ id, label, count }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: isMobile ? 6 : 7,
                padding: isMobile ? "6px 14px" : "7px 18px", borderRadius: 99, fontSize: isMobile ? 12 : 13,
                fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s",
                background: activeTab === id ? "white" : "transparent",
                color: activeTab === id ? "#111827" : "#9CA3AF",
                boxShadow: activeTab === id ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
              }}>
              {isMobile ? label.slice(0, 6) : label}
              <span style={{ fontSize: isMobile ? 11 : 11, padding: "1px 6px", borderRadius: 99, background: activeTab === id ? "#F3F4F6" : "transparent", color: activeTab === id ? "#6B7280" : "#C4C4C4" }}>
                {count}
              </span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowNewListModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: isMobile ? "6px 12px" : "7px 14px", borderRadius: 10, fontSize: isMobile ? 12 : 12, fontWeight: 500, border: "1px solid #E5E7EB", background: "white", color: "#374151", cursor: "pointer" }}>
          <Plus size={13} strokeWidth={2} /> New folder
        </button>
      </div>

      {/* ── Collections ── */}
      {activeTab === "collections" && (
        <CollectionsView
          lists={lists} bookmarks={bookmarks}
          onDeleteList={deleteList} onRemoveFromList={removeFromList}
          onClose={onClose} onOpenNewListModal={() => setShowNewListModal(true)}
        />
      )}

      {/* ── Bookmarked ── */}
      {activeTab === "bookmarked" && (
        <>
          {bookmarksLoading && (
            <div className="flex flex-col divide-y divide-zinc-100">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4" style={{ opacity: 1 - i * 0.2 }}>
                  <div className="shrink-0 w-[72px] h-[96px] bg-zinc-100 rounded animate-pulse" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3.5 w-3/4 bg-zinc-100 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-zinc-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {bookmarksError && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">{bookmarksError}</div>
          )}
          {!bookmarksLoading && !bookmarksError && bookmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <svg width="120" height="98" viewBox="0 0 120 98" fill="none" style={{ marginBottom: 20 }}>
                <rect x="6" y="32" width="88" height="58" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="2.4"/>
                <path d="M6 32 Q6 22 15 22 L40 22 Q48 22 50 32" fill="none" stroke="#1a1a1a" strokeWidth="2.4" strokeLinejoin="round"/>
                <line x1="22" y1="52" x2="70" y2="52" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="22" y1="63" x2="56" y2="63" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              <h3 className="text-lg font-semibold text-zinc-800 mb-2">Explore all you want to read</h3>
              <p className="text-sm text-zinc-500 mb-6 max-w-xs">Save your favorite titles, and access them easily.</p>
              <Link href="/search" onClick={onClose} className="text-blue-600 hover:text-blue-700 font-medium text-sm">Explore Library</Link>
            </div>
          )}
          {!bookmarksLoading && bookmarks.length > 0 && (
            <>
              <div className="flex flex-col divide-y divide-zinc-100">
                {bookmarks.map((book) => {
                  const isFinished = finishedIds.includes(book.id) || book.reading_progress === 100;
                  const progress = isFinished ? 100 : (book.reading_progress ?? 0);
                  return (
                    <div key={book.id} style={{ position: "relative" }} className="flex items-start gap-4 py-4 first:pt-0">
                      {/* Thumbnail */}
                      <Link href={`/book/${book.id}`} onClick={onClose}
                        style={{ width: 64, height: 86, flexShrink: 0, borderRadius: 3, overflow: "hidden", border: "1px solid #e5e7eb", display: "block" }}>
                        {book.upload_id
                          ? <div style={{ width: 64, height: 86, background: "#f9fafb" }}><PDFThumbnail uploadId={book.upload_id} title={book.title} /></div>
                          : <div style={{ width: 64, height: 86 }} className="flex flex-col items-center justify-center bg-zinc-100 p-2">
                              <BookOpen size={18} className="text-zinc-300 mb-1" strokeWidth={1.3} />
                              <span className="text-[9px] text-zinc-400 text-center leading-tight line-clamp-3">{book.title}</span>
                            </div>
                        }
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0 pt-1">
                        <Link href={`/book/${book.id}`} onClick={onClose}
                          className="block text-sm font-semibold text-zinc-800 leading-snug hover:text-zinc-950 transition-colors line-clamp-2 mb-1">
                          {book.title}
                        </Link>
                        {(book.author || book.uploaded_by) && (
                          <p className="text-xs text-zinc-400 mb-1.5 truncate">
                            {book.author ? `By ${book.author}` : `Uploaded by ${book.uploaded_by}`}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {isFinished && (
                            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                              <Trophy size={10} /> Finished
                            </span>
                          )}
                          {book.category && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-[2px] ${getCategoryClass(book.category)}`}>
                              {book.category}
                            </span>
                          )}
                        </div>
                        {progress > 0 && !isFinished && (
                          <div className="mt-2">
                            <div style={{ height: 2, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                              <div style={{ width: `${progress}%`, height: "100%", background: "#111827", borderRadius: 99 }} />
                            </div>
                            <p style={{ fontSize: 9, color: "#9CA3AF", marginTop: 3 }}>{progress}%</p>
                          </div>
                        )}
                      </div>

                      {/* Three-dot */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <button onClick={(e) => { e.stopPropagation(); setAddToListOpen(null); setMenuOpen(menuOpen === book.id ? null : book.id); }}
                          className="mt-1 p-1.5 rounded text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 transition-colors">
                          <MoreHorizontal size={15} />
                        </button>
                        {menuOpen === book.id && (
                          <div className="absolute right-0 top-7 z-20 bg-white border border-zinc-200 rounded-2xl shadow-lg py-2 min-w-[200px]"
                            onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => { toggleFinished(book.id); setMenuOpen(null); }}
                              className="w-full text-left px-5 py-2.5 text-sm text-zinc-800 hover:bg-zinc-50 transition-colors">
                              {isFinished ? "Mark as Unfinished" : "Mark as Finished"}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(null); setAddToListOpen(book.id); }}
                              className="w-full text-left px-5 py-2.5 text-sm text-zinc-800 hover:bg-zinc-50 transition-colors">
                              Add to List
                            </button>
                            <div className="my-1 border-t border-zinc-100" />
                            <button onClick={() => { removeBookmark(book.id); setMenuOpen(null); }}
                              className="w-full text-left px-5 py-2.5 text-sm text-zinc-800 hover:bg-zinc-50 transition-colors">
                              Remove from Saved
                            </button>
                          </div>
                        )}
                        {addToListOpen === book.id && (
                          <AddToListPopover book={book} lists={lists} onAddToList={toggleBookInList}
                            onOpenNewListModal={() => setShowNewListModal(true)} onClose={() => setAddToListOpen(null)} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-zinc-100">
                  <button onClick={() => fetchBookmarks(pagination.page - 1)} disabled={pagination.page <= 1}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 text-zinc-500 rounded-md text-sm disabled:opacity-30 hover:border-zinc-400 transition-colors">←</button>
                  <span className="text-xs text-zinc-400">{pagination.page} / {pagination.totalPages}</span>
                  <button onClick={() => fetchBookmarks(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 text-zinc-500 rounded-md text-sm disabled:opacity-30 hover:border-zinc-400 transition-colors">→</button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}