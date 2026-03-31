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

      <div className="relative z-10 h-full">

        <Nav />



        <div className="h-full flex items-center">

          <div className="w-full px-6 md:px-10 lg:px-16 pb-20">

            

            <div className="max-w-160 md:max-w-170 lg:max-w-180">

              

              {/* Title */}

              <h1 className="text-white leading-[1.05] tracking-tight text-[42px] sm:text-[48px] md:text-[56px] lg:text-[76px]">

                DEPDev Digital

                <br />

                E-Library

              </h1>



              {/* Accent */}

              <div className="mt-6 h-1 w-16 bg-[#c23b2a]" />



              {/* Description */}

              <p className="mt-6 text-white/90 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] leading-relaxed max-w-120 md:max-w-130 lg:max-w-140">

                Your comprehensive digital library for academic resources,

                research papers, and educational materials

              </p>



              {/* 🔥 FIXED SEARCH BAR */}
              <form
                onSubmit={handleSearch}
                className="
                  mt-8
                  w-full
                  max-w-full
                  sm:max-w-[600px]
                  md:max-w-[680px]
                  lg:max-w-[760px]
                  xl:max-w-[820px]
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    w-full
                    bg-white
                    shadow-sm
                    px-4
                    py-4
                    gap-3
                    relative
                    rounded-[3px]
                    transition-all duration-200
                  "
                >
                  <div className="flex items-center gap-3">
                    {/* INPUT */}
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search for books, sourcebooks, reports..."
                      className="
                        flex-1
                        bg-transparent
                        outline-none
                        text-[14px]
                        sm:text-[14px]
                        md:text-[15px]
                        text-gray-800
                        placeholder:text-gray-400
                        px-2
                        tracking-tight
                      "
                    />

                    {/* DIVIDER */}
                    <div className="hidden sm:block h-6 w-px bg-gray-200" />

                    {/* SEARCH BUTTON */}
                    <button
                      type="submit"
                      className="
                        shrink-0
                        h-10
                        w-10
                        rounded-full
                        bg-blue-900
                        flex items-center
                        justify-center
                        hover:bg-blue-800
                        transition
                        text-white
                      "
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

                  {/* Field selection buttons inside searchbar */}
                  <div className="hidden sm:flex items-center gap-2 flex-wrap pt-3 border-t border-gray-200">
                    {Object.entries(fieldLabel).map(([f, lbl]) => (
                      <button
                        key={f}
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

              {/* Advanced search button */}
              <div className="mt-3">
                <button
                  onClick={handleAdvancedSearch}
                  className="text-white/80 text-[13px] hover:text-white transition underline flex items-center gap-1.5"
                >
                  <SlidersHorizontal size={13} />
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