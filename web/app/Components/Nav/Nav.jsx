"use client";



import React, { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";



const Nav = () => {

  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();



  const handleSearch = (e) => {

    e.preventDefault();

    if (searchQuery.trim()) {

      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);

    }

  };



  return (

    <>

      {/* NAVBAR */}

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">

        <div className="w-full h-16 flex items-center">

          {/* LEFT: LOGO only */}

          <div className="flex items-center px-4 sm:px-6 lg:px-8 min-w-[220px]">

            <Link href="/" className="block">

              <img

                src="/assets/other/depdevlogo.png"

                alt="Logo"

                className="h-4 w-auto sm:h-6 lg:h-8"

              />

            </Link>

          </div>



          {/* CENTER NAV (texts unchanged) */}

          <div className="flex-1 flex justify-center items-center">

            <ul className="flex items-center gap-6 lg:gap-10 text-black text-xs sm:text-xs lg:text-sm font-medium">

              <li>

                <Link href="/about" className="hover:text-black/80 transition">

                  Browse

                </Link>

              </li>



              <li>

                <Link href="/catalog" className="hover:text-black/80 transition">

                  New release

                </Link>

              </li>



              <li className="relative">

                <div

                  className="flex items-center cursor-pointer hover:text-black/80 transition"

                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}

                >

                  {/* keep your exact text */}

                  <Link href="/contact">Collection</Link>

                  <svg

                    xmlns="http://www.w3.org/2000/svg"

                    fill="none"

                    viewBox="0 0 24 24"

                    strokeWidth="1.5"

                    stroke="currentColor"

                    className="w-3 h-3 ml-1"

                  >

                    <path

                      strokeLinecap="round"

                      strokeLinejoin="round"

                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"

                    />

                  </svg>

                </div>



                {/* DROPDOWN (unchanged items) */}

                <div

                  className={`absolute left-0 mt-2 w-56 bg-black/95 border border-white/10 rounded-md shadow-xl py-1 z-50 transition-all duration-200 ${

                    isCollectionsOpen ? "opacity-100 visible" : "opacity-0 invisible"

                  }`}

                >

                  <Link

                    href="/collections/books"

                    className="block px-4 py-2 text-sm text-white hover:bg-white/10"

                  >

                    Books

                  </Link>

                  <Link

                    href="/collections/sourcebooks"

                    className="block px-4 py-2 text-sm text-white hover:bg-white/10"

                  >

                    Sourcebooks

                  </Link>

                  <Link

                    href="/collections/periodicals"

                    className="block px-4 py-2 text-sm text-white hover:bg-white/10"

                  >

                    Periodicals

                  </Link>

                  <Link

                    href="/collections/thesis"

                    className="block px-4 py-2 text-sm text-white hover:bg-white/10"

                  >

                    Thesis/Research Papers

                  </Link>

                  <Link

                    href="/collections/statute"

                    className="block px-4 py-2 text-sm text-white hover:bg-white/10"

                  >

                    Statute/Legal Documents

                  </Link>

                  <Link

                    href="/collections/guides"

                    className="block px-4 py-2 text-sm text-white hover:bg-white/10"

                  >

                    Guide Manuals

                  </Link>

                  <Link

                    href="/collections/reports"

                    className="block px-4 py-2 text-sm text-white hover:bg-white/10"

                  >

                    Reports

                  </Link>

                  <Link

                    href="/collections/reference"

                    className="block px-4 py-2 text-sm text-white hover:bg-white/10"

                  >

                    Reference Material

                  </Link>

                </div>

              </li>



              <li>

                <Link href="/news" className="hover:text-black/80 transition">

                  News

                </Link>

              </li>

            </ul>

          </div>



          {/* RIGHT: SEARCH ICON + Login + Register (Register looks like Download) */}

          <div className="flex items-center px-4 sm:px-6 lg:px-8 min-w-[220px] justify-end">

            {/* SEARCH ICON ONLY */}

            <button className="text-black/70 hover:text-black transition-colors mr-6">

              <Search size={20} />

            </button>



            <Link

              href="/login"

              className="text-sm font-medium text-black hover:text-black/80 transition mr-6"

            >

              Login

            </Link>



            {/* Register styled like the screenshot "Download" */}

            <Link

              href="/register"

              className="h-16 px-10 flex items-center justify-center text-white font-semibold backdrop-blur-sm hover:bg-[#143961]/80 transition"

              style={{

                backgroundColor: 'rgb(25, 18, 101)',

                width: '200px',

                marginRight: '-32px'

              }}

            >

              Register

            </Link>

          </div>

        </div>

      </nav>



      {/* PAGE SPACER */}

      <div className="h-16" />



      {/* Overlay */}

      {isBookmarksOpen && (

        <div

          className="fixed inset-0 bg-black/50 z-40"

          onClick={() => setIsBookmarksOpen(false)}

        />

      )}



      {/* Close dropdown when clicking outside */}

      {isCollectionsOpen && (

        <div

          className="fixed inset-0 z-40"

          onClick={() => setIsCollectionsOpen(false)}

        />

      )}

    </>

  );

};



export default Nav;



