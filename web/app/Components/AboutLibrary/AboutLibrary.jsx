"use client";

import React from "react";
import { BookOpen, Globe, BarChart3 } from "lucide-react";




export default function AboutLibrary() {
  return (
    <>
    
      
      {/* How to Use Section */}
      <section id="how-to-use" className="w-full bg-white py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
          
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h2 className="text-[#111827] tracking-tight leading-[1.1] text-[36px] sm:text-[42px] lg:text-[48px] font-medium mb-6">
              How to Use the E-Library
            </h2>
            <p className="text-[18px] sm:text-[19px] leading-[1.7] text-[#4b5563] max-w-[65ch] mx-auto">
              Get started with DepDev 5 E-Library in minutes. Follow these simple steps to access thousands of verified academic resources.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Step 1 */}
            <div className="relative bg-white rounded-xl border border-gray-200 p-8">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>

              <div className="text-[#1e3a8a] mb-6 mt-2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>

              <h3 className="text-[20px] font-semibold text-[#111827] mb-4">
                Search for Resources
              </h3>
              
              <p className="text-[15px] leading-[1.7] text-[#4b5563]">
                Use our powerful search bar to find books, papers, and resources by title, author, subject, or ISBN. Filter by category or use advanced search for specific needs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-xl border border-gray-200 p-8">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>

              <div className="text-[#1e3a8a] mb-6 mt-2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>

              <h3 className="text-[20px] font-semibold text-[#111827] mb-4">
                Browse Categories
              </h3>
              
              <p className="text-[15px] leading-[1.7] text-[#4b5563]">
                Explore our organized categories to discover resources in your field of study. From community development to research methodologies, find exactly what you need.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-xl border border-gray-200 p-8">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>

              <div className="text-[#1e3a8a] mb-6 mt-2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>

              <h3 className="text-[20px] font-semibold text-[#111827] mb-4">
                Read Online or Download
              </h3>
              
              <p className="text-[15px] leading-[1.7] text-[#4b5563]">
                Access materials directly in your browser or download them for offline reading. All resources are available in multiple formats for your convenience.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative bg-white rounded-xl border border-gray-200 p-8">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>

              <div className="text-[#1e3a8a] mb-6 mt-2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>

              <h3 className="text-[20px] font-semibold text-[#111827] mb-4">
                Save & Share
              </h3>
              
              <p className="text-[15px] leading-[1.7] text-[#4b5563]">
                Create personal collections of your favorite resources, bookmark important pages, and share findings with colleagues and study groups.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}