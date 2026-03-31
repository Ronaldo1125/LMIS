"use client";



import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { SlidersHorizontal } from "lucide-react";

import Nav from "../Nav/Nav";

import "../../globals.css";



const LandingPage = () => {

  const [query, setQuery] = useState("");
  
  const router = useRouter();



  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
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

                    flex items-center

                    w-full

                    border border-white/25

                    bg-white

                    rounded-[3px]

                    overflow-hidden

                    transition-all duration-200

                    focus-within:border-blue-600

                  "

                >

                  {/* ICON */}

                  <div className="pl-4 sm:pl-5 md:pl-6 text-blue-700 flex-shrink-0">

                    <svg

                      xmlns="http://www.w3.org/2000/svg"

                      viewBox="0 0 24 24"

                      fill="none"

                      stroke="currentColor"

                      strokeWidth="1.8"

                      className="w-5 h-5"

                    >

                      <circle cx="11" cy="11" r="7" />

                      <line x1="16.65" y1="16.65" x2="21" y2="21" />

                    </svg>

                  </div>



                  {/* INPUT */}

                  <input

                    value={query}

                    onChange={(e) => setQuery(e.target.value)}

                    placeholder="Search books, reports, research..."

                    className="

                      flex-1

                      min-w-0

                      h-16 sm:h-14 md:h-15 lg:h-16

                      px-3 sm:px-4 md:px-5

                      text-[15px] sm:text-[15px] md:text-[16px]

                      text-black

                      placeholder:text-black/40

                      bg-transparent

                      outline-none

                      tracking-tight

                    "

                  />



                  {/* BUTTON */}

                  <button

                    type="submit"

                    className="

                      flex-shrink-0

                      h-12 sm:h-10 md:h-11 lg:h-12

                      mr-2

                      px-7 sm:px-7 md:px-8

                      bg-blue-800

                      text-white

                      text-[13px] sm:text-[13px] md:text-[14px]

                      font-medium

                      tracking-tight

                      rounded-[3px]

                      hover:bg-blue-900

                      active:bg-black

                      transition-colors

                    "

                  >

                    Search

                  </button>

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