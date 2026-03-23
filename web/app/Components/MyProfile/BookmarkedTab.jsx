"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, BookOpen } from "lucide-react";
import { authFetch } from "./utils/authFetch";
import { getCategoryClass } from "./utils/profileUtils";

/**
 * Displays the user's saved bookmarks with pagination and inline removal.
 */
export default function BookmarkedTab({ onClose }) {
  const [bookmarks, setBookmarks]               = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [bookmarksError, setBookmarksError]     = useState(null);
  const [pagination, setPagination]             = useState({ page: 1, totalPages: 1, total: 0 });

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
    } catch {}
  };

  useEffect(() => {
    fetchBookmarks(1);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-zinc-800">Bookmarked</h2>
        {pagination.total > 0 && (
          <span className="text-xs text-zinc-500 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full">
            {pagination.total} saved
          </span>
        )}
      </div>
      <p className="text-xs text-zinc-400 mb-6">Your saved books</p>

      {/* Loading skeletons */}
      {bookmarksLoading && (
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-zinc-100 rounded-lg animate-pulse"
              style={{ opacity: 1 - i * 0.2 }}
            />
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
        <div className="flex flex-col items-center justify-center h-56 gap-3">
          <BookOpen size={34} strokeWidth={1.4} className="text-zinc-200" />
          <p className="text-sm text-zinc-400">No bookmarks yet</p>
          <p className="text-xs text-zinc-300">Books you save will appear here</p>
        </div>
      )}

      {/* Bookmark list */}
      {!bookmarksLoading && bookmarks.length > 0 && (
        <>
          <div className="flex flex-col gap-2">
            {bookmarks.map((book) => (
              <div
                key={book.id}
                className="flex items-start gap-3 px-4 py-3 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1.5">
                    {/* Clickable title — closes modal then navigates */}
                    <Link
                      href={`/book/${book.id}`}
                      onClick={onClose}
                      className="flex-1 text-sm font-medium text-zinc-700 leading-snug hover:text-zinc-900 hover:underline transition-colors"
                    >
                      {book.title}
                    </Link>
                    {book.has_digital_copy && (
                      <span className="shrink-0 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Digital
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-zinc-400">{book.author}</span>
                    {book.category && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getCategoryClass(book.category)}`}>
                        {book.category}
                      </span>
                    )}
                    {book.call_number && (
                      <span className="text-[10px] text-zinc-400 font-mono">{book.call_number}</span>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeBookmark(book.id)}
                  className="shrink-0 mt-0.5 p-1 rounded text-zinc-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-5">
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