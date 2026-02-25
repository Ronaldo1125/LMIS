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
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[520px] lg:min-h-[640px] overflow-hidden bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/other/hj.png')" }}
      />

      {/* Left fade overlay (like screenshot) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
        {/* subtle overall dim (very light) */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <Nav />

        {/* HERO COPY (LEFT EDGE) */}
        <div className="h-full flex items-center">
          <div
            className="
              w-full
              px-6 md:px-10 lg:px-16
              pb-10
            "
          >
            <div className="max-w-[640px] md:max-w-[680px] lg:max-w-[720px]">
              {/* Headline */}
              <h1
                className="
                  text-white
                 
                  leading-[1.05]
                  tracking-tight
                  text-[46px] md:text-[56px] lg:text-[76px]
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
                  text-[15px] md:text-[16px] lg:text-[18px]
                  leading-relaxed
                  max-w-[480px] md:max-w-[520px] lg:max-w-[560px]
                "
              >
                Your comprehensive digital library for academic resources, 
                research papers, and educational materials
              </p>

              {/* Optional: Search (keep if you want it on hero) */}
              <form onSubmit={handleSearch} className="mt-10 max-w-[580px] md:max-w-[620px] lg:max-w-[640px]">
                <div className="flex w-full overflow-hidden bg-white/95 backdrop-blur-sm">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, author, subject, ISBN..."
                    className="
                      h-[54px] md:h-[58px] lg:h-[62px]
                      w-full
                      px-5 md:px-6 lg:px-8
                      text-[15px] md:text-[16px] lg:text-[17px]
                      text-black
                      placeholder:text-black/45
                      outline-none
                      bg-transparent
                    "
                  />
                  <button
                    type="submit"
                    className="
                      h-[54px] md:h-[58px] lg:h-[62px]
                      px-6 md:px-7 lg:px-8
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
              <p className="mt-6 text-white/70 text-[12px] md:text-[13px]">
                *Empowering education through digital innovation
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* SCROLL TO DISCOVER - Bottom Right */}
      <div className="absolute bottom-8 right-8 text-white text-sm font-bold tracking-wider md:text-base lg:text-lg">
        (SCROLL TO DISCOVER)
      </div>
    </section>
  );
};

export default LandingPage;