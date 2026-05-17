"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PDFThumbnail from "../Search/PDFThumbnail";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

const RecentBookCard = () => {
  const router = useRouter();
  const [recentBook, setRecentBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastValidBook, setLastValidBook] = useState(null); 

  useEffect(() => {
    const fetchRecentBook = async () => {
      try {
        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}/api/search?page=1&limit=10`, { headers });
        if (!res.ok) throw new Error(`Server error ${res.status}`);

        const data = await res.json();
        const books = data.results || data.data || [];
        
        
        const filteredBooks = books.filter(book => {
          const title = book.title || "";
          return title.length <= 35; 
        });
        
        if (filteredBooks.length > 0) {
          const newestShortBook = filteredBooks[0];
          setRecentBook(newestShortBook);
          setLastValidBook(newestShortBook); 
        } else {
         
          setRecentBook(lastValidBook);
        }
      } catch (err) {
        console.error("Failed to fetch recent book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBook();
  }, []);

  const handleReadHere = () => {
    if (recentBook?.id) router.push(`/book/${recentBook.id}`);
  };

  if (loading) {
    return (
      <div className="bg-[#f4f4f4] rounded shadow-sm p-4 flex gap-4 min-w-[200px] sm:min-w-[240px] md:min-w-[260px] max-w-[300px] animate-pulse">
        <div className="w-[56px] h-[52px] sm:w-[64px] sm:h-[60px] bg-gray-200 rounded flex-shrink-0" />
        <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
          <div className="space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-2.5 bg-gray-200 rounded w-12 self-end" />
        </div>
      </div>
    );
  }

  if (!recentBook) return null;

  return (
    <div onClick={handleReadHere} className="group/card relative bg-[#ffff] rounded shadow-sm  p-4 flex gap-4 min-w-[200px] sm:min-w-[240px] md:min-w-[260px] max-w-[300px] overflow-hidden transition-shadow duration-200 hover:shadow-md cursor-pointer">
      
      <div className="pointer-events-none absolute inset-0 bg-blue-900 translate-x-[-100%] group-hover/card:translate-x-0 transition-transform duration-300 ease-in-out" />

     
      <div className="relative z-10 w-[56px] h-[52px] sm:w-[64px] sm:h-[60px] flex-shrink-0 rounded overflow-hidden shadow-sm">
        {recentBook.upload_id ? (
          <PDFThumbnail
            uploadId={recentBook.upload_id}
            title={recentBook.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 group-hover/card:bg-blue-800 flex items-center justify-center transition-colors duration-300">
            <span className="text-gray-400 group-hover/card:text-blue-200 text-[9px] text-center leading-tight px-1 transition-colors duration-300">
              No cover
            </span>
          </div>
        )}
      </div>

     
      <div className="relative z-10 flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover/card:text-white text-[11px] leading-tight line-clamp-2 mb-0.5 transition-colors duration-300">
            {recentBook.title}
          </h3>
          <p className="text-gray-500 group-hover/card:text-blue-200 text-[11px] leading-snug transition-colors duration-300">
            {[recentBook.author, recentBook.year].filter(Boolean).join(", year ")}
          </p>
        </div>

        <div className="flex justify-end">
          <span className="text-gray-600 group-hover/card:text-white text-[11px] font-medium transition-colors duration-300 flex items-center gap-0.5">
            Read Here
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentBookCard;