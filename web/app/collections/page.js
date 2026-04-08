"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, BookOpen } from "lucide-react";
import Nav from "../Components/Nav/Nav";
import Footer from "../Components/Footer/Footer";
import PDFThumbnail from "../Components/Search/PDFThumbnail";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CollectionsInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const getConfig = () => {
    if (windowWidth < 640)   return { cardWidth: 140, cardHeight: 187, gap: 16, padX: 16, cols: 2 };
    if (windowWidth < 768)   return { cardWidth: 160, cardHeight: 213, gap: 20, padX: 24, cols: 3 };
    if (windowWidth < 1024)  return { cardWidth: 180, cardHeight: 240, gap: 24, padX: 32, cols: 4 };
    if (windowWidth < 1280)  return { cardWidth: 200, cardHeight: 267, gap: 28, padX: 32, cols: 5 };
    if (windowWidth <= 1440) return { cardWidth: 210, cardHeight: 280, gap: 32, padX: 32, cols: 5 };
    return                          { cardWidth: 220, cardHeight: 293, gap: 32, padX: 48, cols: 6 };
  };

  const cfg = getConfig();

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const url = category !== 'all' 
          ? `${API_BASE}/api/search?category=${encodeURIComponent(category)}&page=1&limit=20`
          : `${API_BASE}/api/search?page=1&limit=20`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        if (mounted) { 
          setBooks(data.data ?? data.results ?? []); 
          setError(null); 
        }
      } catch (err) {
        if (mounted) setError(`Failed to load ${category} collection.`);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBooks();
    return () => { mounted = false; };
  }, [category]);

  const handleBookClick = (book) => {
    const id = book.book_id ?? book.id;
    if (!id) return;
    router.push(`/book/${id}`);
  };

  const categoryTitles = {
    'all': 'All Collections',
    'books': 'Books',
    'sourcebooks': 'Sourcebooks',
    'periodicals': 'Periodicals',
    'thesis': 'Thesis / Research Papers',
    'statute': 'Statute / Legal Documents',
    'guides': 'Guide Manuals',
    'reports': 'Reports',
    'reference': 'Reference Materials'
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
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
        
        <section className="pt-24 pb-12">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-12 2xl:px-12">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {categoryTitles[category] || 'Collection'}
              </h1>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))` }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ minWidth: cfg.cardWidth, maxWidth: cfg.cardWidth, flexShrink: 0, border: "1px solid #e5e7eb", overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite" }}>
                    <div style={{ width: "100%", height: cfg.cardHeight, background: "#f3f4f6" }} />
                    <div style={{ padding: "12px 12px 14px" }}>
                      <div style={{ height: 12, background: "#f3f4f6", borderRadius: 2, marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
                      <div style={{ height: 11, background: "#f3f4f6", borderRadius: 2, width: "60%", animation: "pulse 1.5s ease-in-out infinite" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && books.length === 0 && (
              <div className="text-center py-12">
                <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No books found in this collection.</p>
              </div>
            )}

            {/* Books Grid */}
            {!loading && !error && books.length > 0 && (
              <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))` }}>
                {books.map((book) => (
                  <div
                    key={book.book_id ?? book.id}
                    className="book-card"
                    onClick={() => handleBookClick(book)}
                    style={{
                      minWidth: cfg.cardWidth,
                      maxWidth: cfg.cardWidth,
                      flexShrink: 0,
                      border: "1px solid #d1d5db",
                      borderRadius: 0,
                    }}
                  >
                    {/* Cover */}
                    <div style={{
                      width: "100%",
                      height: cfg.cardHeight,
                      background: "#f0f4ff",
                      position: "relative",
                    }}>
                      {book.upload_id ? (
                        <PDFThumbnail uploadId={book.upload_id} title={book.title} />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%", background: "#fff",
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center",
                          padding: "16px 10px", boxSizing: "border-box",
                        }}>
                          <BookOpen size={28} color="#000" strokeWidth={1.2} style={{ marginBottom: 10 }} />
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

                    {/* Info */}
                    <div style={{ padding: "12px 12px 14px" }}>
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
                ))}
              </div>
            )}
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading collection…</div>
      </div>
    }>
      <CollectionsInner />
    </Suspense>
  );
}