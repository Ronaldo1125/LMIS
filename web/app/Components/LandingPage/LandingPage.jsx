"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../Nav/Nav";
import "../../globals.css";

const SearchIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className="ml-2"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const LandingPage = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/other/hj.png')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10">
        <Nav />

        {/* Content */}
        <div className="flex items-center min-h-[90vh] px-6 md:px-12 lg:px-24">

          <div className="max-w-3xl">

            {/* Title */}
            <h1 className="text-white text-[44px] md:text-[56px] lg:text-[64px] font-bold leading-tight mb-6">
              Depdev Digital Library
            </h1>

            {/* Description */}
            <p className="text-white/90 text-lg mb-12 max-w-2xl">
              Your gateway to comprehensive economic research, policy papers, 
              development reports, and statistical data for informed decision-making.
            </p>

            {/* White Content Section */}
            <div className="mt-12 bg-white p-8 shadow-lg">
              <h3 className="text-black text-2xl md:text-3xl font-semibold mb-6">
                Search library
              </h3>
              
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-[700px] bg-white p-1 rounded-lg border border-gray-200">

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for books, journals, articles, databases and more"
                  className="flex-1 h-[60px] px-6 text-gray-800 outline-none bg-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(e);
                  }}
                />

                <button
                  onClick={handleSearch}
                  className="h-[60px] px-10 bg-black text-white font-semibold hover:bg-black flex items-center"
                >
                  Search
                  <SearchIcon />
                </button>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LandingPage;