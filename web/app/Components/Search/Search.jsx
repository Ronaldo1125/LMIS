"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

// Sample books data (keep yours)
const books = [
  {
    title: "The Vanishing Half: A Novel",
    author: "Brit Bennett",
    isbn: "978-1-234-56789-0",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2020,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "The Design of Books",
    author: "Debbie Berne",
    isbn: "978-1-234-56789-0",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2023,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "The Light Beyond the Garden Wall",
    author: "Scott Whitehead",
    isbn: "978-1-234-56789-0",
    category: "Sourcebook",
    image: "/assets/BooksImages/200.png",
    year: 2022,
    isNew: false,
    readingAge: "Teen",
  },
  {
    title: "Echoes of Tomorrow",
    author: "Unknown",
    isbn: "978-1-234-56789-0",
    category: "Sourcebook",
    image: "/assets/BooksImages/3.jpg",
    year: 2024,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    isbn: "978-1-234-56789-0",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2021,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Daily Archive",
    author: "Debbie Berne",
    isbn: "978-1-234-56789-0",
    category: "Sourcebook",
    image: "/assets/BooksImages/4.png",
    year: 2023,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "Digital Revolution",
    author: "John Smith",
    isbn: "978-1-234-56789-1",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2024,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "Modern Architecture",
    author: "Jane Doe",
    isbn: "978-1-234-56789-2",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2022,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Science Today",
    author: "Robert Johnson",
    isbn: "978-1-234-56789-3",
    category: "Books",
    image: "/assets/BooksImages/2.avif",
    year: 2021,
    isNew: false,
    readingAge: "Teen",
  },
  {
    title: "History Revisited",
    author: "Emily Brown",
    isbn: "978-1-234-56789-4",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2023,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "Future Trends",
    author: "Michael Wilson",
    isbn: "978-1-234-56789-5",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2024,
    isNew: true,
    readingAge: "Adult",
  },
  // Frequently Searched books
  {
    title: "Community Development in an Uncertain World",
    author: "Ife & Tesoriero",
    isbn: "978-0190304296",
    category: "Books",
    image: "/assets/BooksImages/2.avif",
    year: 2016,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Understanding Social Policy",
    author: "Alcock et al.",
    isbn: "978-0190858704",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2021,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Research Design: Qualitative & Mixed",
    author: "Creswell",
    isbn: "978-1506386706",
    category: "Books",
    image: "/assets/BooksImages/3.jpg",
    year: 2018,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Collaborative Planning: Shaping Places",
    author: "Healey",
    isbn: "978-0761944375",
    category: "Books",
    image: "/assets/BooksImages/4.png",
    year: 2006,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Geographies of Development",
    author: "Potter et al.",
    isbn: "978-0415424758",
    category: "Books",
    image: "/assets/BooksImages/2.avif",
    year: 2008,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Participatory Action Research in Practice",
    author: "Kindon, Pain & Kesby",
    isbn: "978-0415436607",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2007,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Social Innovation and Impact Measurement",
    author: "Mulgan",
    isbn: "978-1911117515",
    category: "Books",
    image: "/assets/BooksImages/3.jpg",
    year: 2019,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Youth Development Frameworks",
    author: "Eccles & Gootman",
    isbn: "978-0309072755",
    category: "Books",
    image: "/assets/BooksImages/4.png",
    year: 2002,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Intersectionality in Public Policy",
    author: "Hankivsky",
    isbn: "978-1447356789",
    category: "Books",
    image: "/assets/BooksImages/2.avif",
    year: 2021,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Sustainable Development Goals Handbook",
    author: "UN Global Compact",
    isbn: "978-9213614352",
    category: "Books",
    image: "/assets/BooksImages/200.png",
    year: 2025,
    isNew: true,
    readingAge: "Adult",
  },
  // Recent Additions books
  {
    title: "Community Development in an Uncertain World",
    author: "Ife & Tesoriero",
    isbn: "978-0190304296",
    category: "Books",
    image: "/assets/BooksImages/2.avif",
    year: 2016,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Understanding Social Policy",
    author: "Alcock et al.",
    isbn: "978-0190858704",
    category: "Books",
    image: "/assets/BooksImages/3.jpg",
    year: 2021,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Research Design: Qualitative & Mixed",
    author: "Creswell",
    isbn: "978-1506386706",
    category: "Books",
    image: "/assets/BooksImages/4.png",
    year: 2018,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Collaborative Planning: Shaping Places",
    author: "Healey",
    isbn: "978-0761944375",
    category: "Books",
    image: "/assets/BooksImages/2.avif",
    year: 2006,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Geographies of Development",
    author: "Potter et al.",
    isbn: "978-0415424758",
    category: "Books",
    image: "/assets/BooksImages/3.jpg",
    year: 2008,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Participatory Action Research in Practice",
    author: "Kindon, Pain & Kesby",
    isbn: "978-0415436607",
    category: "Books",
    image: "/assets/BooksImages/4.png",
    year: 2007,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Social Innovation and Impact Measurement",
    author: "Mulgan",
    isbn: "978-1911117515",
    category: "Books",
    image: "/assets/BooksImages/2.avif",
    year: 2019,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Youth Development Frameworks",
    author: "Eccles & Gootman",
    isbn: "978-0309072755",
    category: "Books",
    image: "/assets/BooksImages/3.jpg",
    year: 2002,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Intersectionality in Public Policy",
    author: "Hankivsky",
    isbn: "978-1447356789",
    category: "Books",
    image: "/assets/BooksImages/4.png",
    year: 2021,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Sustainable Development Goals Handbook",
    author: "UN Global Compact",
    isbn: "978-9213614352",
    category: "Books",
    image: "/assets/BooksImages/2.avif",
    year: 2025,
    isNew: true,
    readingAge: "Adult",
  },
  // Placeholder books for Periodicals
  {
    title: "Tech Magazine",
    author: "Various",
    isbn: "978-1-234-56789-6",
    category: "Sourcebook",
    image: "/assets/BooksImages/3.jpg",
    year: 2023,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Science Weekly",
    author: "Editorial Team",
    isbn: "978-1-234-56789-7",
    category: "Sourcebook",
    image: "/assets/BooksImages/4.png",
    year: 2024,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "Business Report",
    author: "Corporate Publishers",
    isbn: "978-1-234-56789-8",
    category: "Sourcebook",
    image: "/assets/BooksImages/2.avif",
    year: 2022,
    isNew: false,
    readingAge: "Adult",
  },
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-white">
      <path
        fill="currentColor"
        d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-600">
      <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
    </svg>
  );
}

function IconGrid({ active }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      className={active ? "text-black" : "text-gray-400"}
    >
      <path
        fill="currentColor"
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
      />
    </svg>
  );
}

function IconList({ active }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      className={active ? "text-black" : "text-gray-400"}
    >
      <path
        fill="currentColor"
        d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
      />
    </svg>
  );
}

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [isGridView, setIsGridView] = useState(true);

  const [activeField, setActiveField] = useState("All fields");

  console.log('Books length:', books.length);
  console.log('Query:', query);
  console.log('Category:', category);

  const filteredBooks = useMemo(() => {
    let filtered = books;
    
    // Filter by category if selected
    if (category) {
      filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }
    
    // Filter by search query
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((b) => {
        const hay = `${b.title} ${b.author} ${b.category} ${b.isbn} ${b.year}`.toLowerCase();
        return hay.includes(q);
      });
    }
    
    return filtered;
  }, [query, category]);

  // choose featured 3 for big cards (like screenshot)
  const featured = useMemo(() => filteredBooks.slice(0, 3), [filteredBooks]);

  // best sellers list on the right
  const bestSellers = useMemo(() => filteredBooks.slice(3, 6), [filteredBooks]);

  const onSubmitSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) params.set("query", searchInput.trim());
    else params.delete("query");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* PAGE WRAP */}
      <main className="mx-auto w-full max-w-[1440px] px-6 2xl:px-10 pt-10 pb-24">
        {/* Title */}
        <h1 className="text-[40px] font-medium text-black">
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : `Search for: ${searchInput || 'All Books'}`}
        </h1>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-2 flex items-center gap-3">
            {/* input */}
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmitSearch()}
              placeholder="Search for books, sourcebooks, reports..."
              className="flex-1 bg-transparent outline-none text-[14px] 2xl:text-[15px] text-gray-800 placeholder:text-gray-400 px-2"
            />

            {/* divider */}
            <div className="hidden sm:block h-6 w-px bg-gray-200" />

            {/* chips (right inside bar) */}
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

            {/* search button */}
            <button
              onClick={onSubmitSearch}
              className="shrink-0 h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-black transition"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>

          {/* Filter dropdown row */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {["Author", "Format", "Language", "Book Series", "Category"].map((label) => (
              <button
                key={label}
                className="h-10 rounded-full border border-gray-200 bg-gray-50 px-4 flex items-center gap-3 text-[13px] text-gray-800 hover:bg-gray-100 transition"
              >
                <span className="font-medium">{label}</span>
                <ChevronDown />
              </button>
            ))}
          </div>
        </div>

        {/* Results section */}
        <div className="mt-12">
          {/* View toggle and count */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              {filteredBooks.length} books
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsGridView(true)}
                aria-label="Grid view"
                className="p-1"
              >
                <IconGrid active={isGridView} />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                aria-label="List view"
                className="p-1"
              >
                <IconList active={!isGridView} />
              </button>
            </div>
          </div>

          {/* Grid View */}
          {isGridView ? (
            <div
              style={{
                maxWidth: 1440,
                margin: "0 auto",
                padding: "0 48px 56px",
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 18,
              }}
            >
              {filteredBooks.map((book, idx) => (
                <div
                  key={idx}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #e6ecf7",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ aspectRatio: "3/4", background: "#f6f8ff" }}>
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  <div style={{ padding: "12px 12px 14px" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#111827",
                        lineHeight: 1.25,
                        marginBottom: 6,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {book.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#4b5563",
                        lineHeight: 1.2,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                        title={book.author}
                      >
                        {book.author}
                      </span>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>
                        {book.year}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div
              style={{
                maxWidth: 1440,
                margin: "0 auto",
                padding: "0 48px 56px",
                border: "1px solid #e6ecf7",
                borderRadius: 14,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {filteredBooks.map((book, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderBottom:
                      idx < filteredBooks.length - 1 ? "1px solid #eef2ff" : "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f7faff")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  <div
                    style={{
                      width: 44,
                      height: 58,
                      borderRadius: 10,
                      overflow: "hidden",
                      flexShrink: 0,
                      border: "1px solid #e6ecf7",
                      background: "#f6f8ff",
                    }}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#111827",
                        lineHeight: 1.25,
                        marginBottom: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={book.title}
                    >
                      {book.title}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#4b5563",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          flex: 1,
                        }}
                        title={book.author}
                      >
                        {book.author}
                      </span>
                      <span style={{ fontWeight: 700, color: "#6b7280" }}>
                        {book.year}
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={18} style={{ opacity: 0.5 }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional: if no results */}
        {filteredBooks.length === 0 && (
          <div className="mt-16 text-center text-gray-500">
            No results found for “{query}”
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Search;
