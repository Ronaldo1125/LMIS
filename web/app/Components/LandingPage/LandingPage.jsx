"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../Nav/Nav";
import "../../globals.css";

const LandingPage = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/course-search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[520px] 2xl:min-h-[640px] overflow-hidden bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/other/hj.png')" }}
      />

      {/* Left fade overlay (like screenshot) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        {/* subtle overall dim (very light) */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <Nav />

        {/* HERO COPY (LEFT EDGE) */}
        <div className="h-full flex items-center">
          <div
            className="
              w-full
              px-6 sm:px-10 lg:px-16 2xl:px-24
              pb-10
            "
          >
            <div className="max-w-[720px] 2xl:max-w-[860px]">
              {/* Headline */}
              <h1
                className="
                  text-white
                  font-inter 
                  leading-[1.05]
                  tracking-tight
                  text-[44px] sm:text-[56px] lg:text-[64px] 2xl:text-[78px]
                "
              >
                Depdev Digital
                <br />
                E-Library
              </h1>

              {/* Red underline */}
              <div className="mt-6 h-[4px] w-[64px] bg-[#c23b2a]" />

              {/* Subtext */}
              <p
                className="
                  mt-7
                  text-white/90
                  text-[15px] sm:text-[16px] lg:text-[18px] 2xl:text-[20px]
                  leading-relaxed
                  max-w-[560px] 2xl:max-w-[640px]
                "
              >
                Your comprehensive digital library for academic resources, 
                research papers, and educational materials
              </p>

              {/* Optional: Search (keep if you want it on hero) */}
              <form onSubmit={handleSearch} className="mt-10 max-w-[640px] 2xl:max-w-[760px]">
                <div className="flex w-full overflow-hidden border border-white/25 bg-white/95 backdrop-blur-sm">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, author, subject, ISBN..."
                    className="
                      h-[54px] 2xl:h-[62px]
                      w-full
                      px-5 2xl:px-6
                      text-[15px] 2xl:text-[17px]
                      text-black
                      placeholder:text-black/45
                      outline-none
                      bg-transparent
                    "
                  />
                  <button
                    type="submit"
                    className="
                      h-[54px] 2xl:h-[62px]
                      px-6 2xl:px-8
                      bg-blue-800
                      text-white
                      font-semibold
                      hover:brightness-95 active:brightness-90
                    "
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Footnote (optional) */}
              <p className="mt-6 text-white/70 text-[12px] 2xl:text-[13px]">
                *Empowering education through digital innovation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;