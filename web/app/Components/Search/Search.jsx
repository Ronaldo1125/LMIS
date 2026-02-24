"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

// Sample books data (keep yours)
const books = [
  {
    title: "The Vanishing Half: A Novel",
    author: "Brit Bennett",
    isbn: "978-1-234-56789-0",
    category: "Fiction",
    image: "/assets/BooksImages/200.png",
    year: 2020,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "The Design of Books",
    author: "Debbie Berne",
    isbn: "978-1-234-56789-0",
    category: "Fiction",
    image: "/assets/BooksImages/200.png",
    year: 2023,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "The Light Beyond the Garden Wall",
    author: "Scott Whitehead",
    isbn: "978-1-234-56789-0",
    category: "Magazine",
    image: "/assets/BooksImages/200.png",
    year: 2022,
    isNew: false,
    readingAge: "Teen",
  },
  {
    title: "Echoes of Tomorrow",
    author: "Unknown",
    isbn: "978-1-234-56789-0",
    category: "Report",
    image: "/assets/BooksImages/3.jpg",
    year: 2024,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    isbn: "978-1-234-56789-0",
    category: "Non-Fiction",
    image: "/assets/BooksImages/200.png",
    year: 2021,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Daily Archive",
    author: "Debbie Berne",
    isbn: "978-1-234-56789-0",
    category: "Newspaper",
    image: "/assets/BooksImages/4.png",
    year: 2023,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "Digital Revolution",
    author: "John Smith",
    isbn: "978-1-234-56789-1",
    category: "Technology",
    image: "/assets/BooksImages/200.png",
    year: 2024,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "Modern Architecture",
    author: "Jane Doe",
    isbn: "978-1-234-56789-2",
    category: "Design",
    image: "/assets/BooksImages/200.png",
    year: 2022,
    isNew: false,
    readingAge: "Adult",
  },
  {
    title: "Science Today",
    author: "Robert Johnson",
    isbn: "978-1-234-56789-3",
    category: "Science",
    image: "/assets/BooksImages/2.avif",
    year: 2021,
    isNew: false,
    readingAge: "Teen",
  },
  {
    title: "History Revisited",
    author: "Emily Brown",
    isbn: "978-1-234-56789-4",
    category: "History",
    image: "/assets/BooksImages/200.png",
    year: 2023,
    isNew: true,
    readingAge: "Adult",
  },
  {
    title: "Future Trends",
    author: "Michael Wilson",
    isbn: "978-1-234-56789-5",
    category: "Business",
    image: "/assets/BooksImages/200.png",
    year: 2024,
    isNew: true,
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

  // filter UI state (visual only; you can wire later)
  const [activeField, setActiveField] = useState("All fields");

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
      <main className="mx-auto w-full max-w-[1450px] px-6 2xl:px-10 pt-10 pb-24">
        {/* Title */}
        <h1 className="text-[40px] font-medium text-black">
          Search for: <span className="text-gray-900">{searchInput || 'All Books'}</span>
        </h1>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="w-full rounded-full border border-gray-200 bg-white shadow-sm px-4 py-2 flex items-center gap-3">
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
            {["Author", "Format", "Language", "Book Series"].map((label) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="bg-[#f4f4f4] h-[500px] flex items-center justify-center">
                    <div className="h-[250px] flex items-center justify-center">
                      <Image
                        src={book.image}
                        alt={book.title}
                        width={300}
                        height={450}
                        className="h-full w-auto object-contain"
                        priority={idx < 8}
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <h3 className="text-[18px] font-semibold">
                      {book.title}
                    </h3>
                    <p className="text-[14px] text-gray-700">
                      {book.author}
                    </p>
                    <p className="text-[13px] text-gray-500">
                      {book.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="overflow-hidden rounded-xl border border-gray-200/70 bg-white/40">
              <div className="divide-y divide-gray-200/70">
                {filteredBooks.map((book, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-6 px-6 py-5 hover:bg-white/60 transition"
                  >
                    <div className="h-[96px] w-[72px] bg-[#e7e6e0] flex items-center justify-center">
                      <Image
                        src={book.image}
                        alt={book.title}
                        width={72}
                        height={96}
                        className="h-[86px] w-auto object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[16px] font-semibold text-gray-900 truncate">
                        {book.title}
                      </div>
                      <div className="mt-1 text-[14px] text-gray-700 truncate">
                        {book.author}
                      </div>
                      <div className="mt-0.5 text-[13px] text-gray-500">
                        {book.year} • {book.category} • ISBN: {book.isbn}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
