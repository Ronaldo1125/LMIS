"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import Nav from "../Nav/Nav";
import "../../globals.css";

const LandingPage = () => {
  const [query, setQuery] = useState("");
  const [activeField, setActiveField] = useState("all");

  const router = useRouter();

  const fieldLabel = { all: "All Fields", title: "Title", author: "Author", subject: "Subject", isbn: "ISBN / ISSN" };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}&field=${activeField}`);
    }
  };

  const handleAdvancedSearch = () => {
    router.push('/search?advanced=true');
  };

  return (
    <section className="relative w-full h-screen min-h-130 lg:min-h-160 overflow-hidden bg-black">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/other/hj.png')" }}
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
          <div className="w-full px-6 md:px-10 lg:px-16 pb-12 md:pb-16">

            <div className="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[620px] lg:max-w-[700px] xl:max-w-[740px]">

              {/* Title */}
              <h1 className="text-white leading-[1.05] tracking-tight text-[38px] sm:text-[46px] md:text-[54px] lg:text-[72px]">
                DEPDev Digital
                <br />
                E-Library
              </h1>

              {/* Accent */}
              <div className="mt-4 md:mt-5 h-1 w-14 bg-[#c23b2a]" />

              {/* Description */}
              <p className="mt-4 md:mt-5 text-white/90 text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] leading-relaxed max-w-[420px] sm:max-w-[500px] md:max-w-[560px]">
                Your comprehensive digital library for academic resources,
                research papers, and educational materials
              </p>

              {/* Search bar */}
              <div className="mt-6 md:mt-7">
                <form onSubmit={handleSearch}>
                  <div
                    className="flex flex-col w-full bg-white px-4 py-4 gap-3 rounded-[3px] transition-all duration-200"
                    style={{
                      boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 8px 25px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)"
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Input */}
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for books, sourcebooks, reports..."
                        className="flex-1 bg-transparent outline-none text-[13px] sm:text-[14px] md:text-[15px] text-gray-800 placeholder:text-gray-400 px-2 tracking-tight"
                      />

                      {/* Divider */}
                      <div className="hidden sm:block h-6 w-px bg-gray-200" />

                      {/* Search button */}
                      <button
                        type="submit"
                        className="shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-blue-800 transition text-white"
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

                    {/* Field pills */}
                    <div className="hidden sm:flex items-center gap-2 flex-wrap pt-3 border-t border-gray-200">
                      {Object.entries(fieldLabel).map(([f, lbl]) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setActiveField(f)}
                          className={`rounded-[3px] px-3 py-1 text-[12px] transition ${
                            activeField === f ? "bg-blue-900 text-white" : "bg-[#f4f4f4] text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Advanced search */}
              <div className="mt-3">
                <button
                  onClick={handleAdvancedSearch}
                  className="text-white/70 text-[12px] sm:text-[13px] hover:text-white transition underline flex items-center gap-1.5"
                >
                  <SlidersHorizontal size={12} />
                  Advanced Search
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