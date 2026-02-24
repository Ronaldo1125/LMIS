"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "../Components/Nav/Nav";
import Footer from "../Components/Footer/Footer";
import { allBooks, categories } from "../database";

// Icons
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

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isGridView, setIsGridView] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  // Get category from URL dynamic parameter
  const category = params.category || '';

  // Find category info
  const categoryInfo = useMemo(() => {
    return categories.find(cat => cat.path === category) || categories[0];
  }, [category]);

  // Filter books for this category
  const categoryBooks = useMemo(() => {
    return allBooks.filter(book => book.category === category);
  }, [category]);

  // Get unique years for filter
  const availableYears = useMemo(() => {
    const years = [...new Set(categoryBooks.map(book => book.year))];
    return years.sort((a, b) => b - a);
  }, [categoryBooks]);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');

  // Filter books based on search and year
  const filteredBooks = useMemo(() => {
    let filtered = categoryBooks;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query)
      );
    }

    // Year filter
    if (selectedYear !== 'All Years') {
      filtered = filtered.filter(book => book.year === parseInt(selectedYear));
    }

    return filtered;
  }, [categoryBooks, searchQuery, selectedYear]);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, filteredBooks.length));
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      <main className="mx-auto w-full max-w-[1800px] px-6 sm:px-8 lg:px-10 pt-8 pb-20">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] sm:text-[40px] font-medium text-gray-900 mb-2">
            {categoryInfo.title}
          </h1>
          <p className="text-[16px] text-gray-600">
            {categoryInfo.count} • Browse our collection of {categoryInfo.title.toLowerCase()}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder={`Search ${categoryInfo.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center gap-4">
              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Years">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 rounded-lg bg-gray-100">
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-2 rounded transition ${isGridView ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <IconGrid active={isGridView} />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-2 rounded transition ${!isGridView ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <IconList active={!isGridView} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'item' : 'items'} found
          </div>
        </div>

        {/* Results */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {isGridView && (
              <div className="grid grid-cols-4 gap-3 mt-6">
                {filteredBooks.slice(0, visibleCount).map((book, index) => (
                  <Link
                    key={book.id}
                    href={`/${category}/${book.id}`}
                    className="group block"
                  >
                    <div className="flex flex-col">
                      <div className="bg-[#f4f4f4] h-[400px] flex items-center justify-center">
                        <div className="h-[200px] flex items-center justify-center">
                          <Image
                            src={book.image}
                            alt={book.title}
                            width={300}
                            height={450}
                            className="h-full w-auto object-contain"
                            priority={index < 4}
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
                  </Link>
                ))}
              </div>
            )}

            {/* List View */}
            {!isGridView && (
              /* LIST VIEW (SEARCH STYLE) */
              <div className="mt-6 overflow-hidden rounded-xl border border-gray-200/70 bg-white/40">
                <div className="divide-y divide-gray-200/70">
                  {filteredBooks.slice(0, visibleCount).map((book, index) => (
                    <Link
                      key={book.id}
                      href={`/${category}/${book.id}`}
                      className="block"
                    >
                      <div
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
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Load More */}
            {visibleCount < filteredBooks.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load More ({filteredBooks.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
