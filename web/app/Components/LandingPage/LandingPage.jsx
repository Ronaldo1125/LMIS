"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import Nav from "../Nav/Nav";
import RecentBookCard from "./RecentBookCard";
import "../../globals.css";

const LandingPage = () => {
  const [query, setQuery] = useState("");
  const [activeField, setActiveField] = useState("all");

  const router = useRouter();

  const fieldLabel = {
    all: "All Fields",
    title: "Title",
    author: "Author",
    subject: "Subject",
    isbn: "ISBN / ISSN",
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(
        `/search?query=${encodeURIComponent(query.trim())}&field=${activeField}`
      );
    }
  };

  const handleAdvancedSearch = () => {
    router.push("/search?advanced=true");
  };

  return (
    <section className="relative w-full h-screen min-h-130 lg:min-h-160 overflow-hidden bg-black">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/other/fix.png')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-black/25 via-black/15 to-transparent" />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <Nav />

        <div className="flex-1 flex items-center">
          <div className="w-full px-6 md:px-10 lg:px-16 2xl:px-20 pb-12 md:pb-16">
            <div className="max-w-[480px] sm:max-w-[540px] md:max-w-[620px] lg:max-w-[700px] xl:max-w-[740px] 2xl:max-w-[860px]">

              <h1 className="text-white leading-[1] tracking-tight text-[30px] sm:text-[48px] md:text-[54px] lg:text-[68px] 2xl:text-[76px]">
                Discover Knowledge,
                <br />
                Preserve Heritage.
              </h1>

              
              <div className="mt-6 md:mt-7">
                <form onSubmit={handleSearch}>
                  <div
                    className="flex flex-col w-full bg-white px-4 py-3 sm:py-4 2xl:py-5 gap-3 2xl:gap-4 rounded-[3px] transition-all duration-200"
                    style={{
                      boxShadow:
                        "0 20px 60px rgba(0,0,0,0.35), 0 8px 25px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for books, sourcebooks, reports..."
                        className="flex-1 bg-transparent outline-none text-[13px] sm:text-[14px] md:text-[15px] 2xl:text-[17px] text-gray-800 placeholder:text-gray-400 px-2 2xl:px-3 tracking-tight"
                      />
                      <div className="hidden sm:block h-6 w-px bg-gray-200" />
                      <button
                        type="submit"
                        className="shrink-0 h-9 w-9 md:h-10 md:w-10 2xl:h-12 2xl:w-12 rounded-full bg-blue-900 flex items-center justify-center hover:bg-blue-800 transition text-white cursor-pointer"
                        aria-label="Search"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="w-4 h-4"
                        >
                          <circle cx="11" cy="11" r="7" />
                          <line x1="16.65" y1="16.65" x2="21" y2="21" />
                        </svg>
                      </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 flex-wrap pt-3 border-t border-gray-200">
                      {Object.entries(fieldLabel).map(([f, lbl]) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setActiveField(f)}
                          className={`rounded-[3px] px-3 py-1 text-[12px] transition cursor-pointer ${
                            activeField === f
                              ? "bg-blue-900 text-white"
                              : "bg-[#f4f4f4] text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="mt-3">
                <button
                  onClick={handleAdvancedSearch}
                  className="text-white/70 text-[12px] sm:text-[13px] hover:text-white transition underline flex items-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal size={12} />
                  Advanced Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RecentBookCard — bottom-right, pushed further right */}
        <div className="absolute bottom-4 right-4 lg:bottom-4 lg:right-4 xl:bottom-5 xl:right-8">
          <RecentBookCard />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;