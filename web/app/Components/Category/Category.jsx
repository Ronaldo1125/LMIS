"use client";



import React, { useEffect, useState } from "react";

import Link from "next/link";

import {

  Book,

  FileText,

  Library,

  Newspaper,

  GraduationCap,

  Scale,

  Compass,

  Search,

} from "lucide-react";



const uiCategories = [

  { name: "Books", icon: Book },

  { name: "Reports", icon: FileText },

  { name: "Sourcebooks", icon: Library },

  { name: "Periodicals", icon: Newspaper },

  { name: "Thesis / Research Papers", icon: GraduationCap },

  { name: "Legal Documents", icon: Scale },

  { name: "Guides / Manuals", icon: Compass },

  { name: "Reference Materials", icon: Search },

];



export default function Category() {

  const [backendCategories, setBackendCategories] = useState([]);



  useEffect(() => {

    const fetchFilters = async () => {

      try {

        const res = await fetch(

          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/search/filters`

        );

        const data = await res.json();

        setBackendCategories(data.categories || []);

      } catch (err) {

        console.error("Failed to load categories", err);

      }

    };

    fetchFilters();

  }, []);



  const matchCategory = (uiName) => {

    return backendCategories.find(

      (c) =>

        c &&

        c.name &&

        typeof c.name === "string" &&

        c.name.toLowerCase().includes(uiName.toLowerCase().split(" ")[0])

    );

  };



  return (

    <section id="categories" className="w-full bg-white py-10 sm:py-12 lg:py-16">

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12">

        <div className="mb-6 sm:mb-8">

          <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-semibold text-black leading-tight">

            Browse Categories

          </h2>

          <p className="text-sm sm:text-base text-gray-600 mt-1.5 sm:mt-2 max-w-xl leading-snug">

            Explore curated knowledge collections across multiple disciplines

          </p>

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {uiCategories.map((cat) => {

            const backendValue = matchCategory(cat.name);

            return (

              <CategoryCard

                key={cat.name}

                cat={cat}

                backendValue={backendValue}

              />

            );

          })}

        </div>

      </div>

    </section>

  );

}



function CategoryCard({ cat, backendValue }) {

  const Icon = cat.icon;

  const categoryValue = backendValue ? backendValue.name : cat.name;



  return (

    <Link

      href={`/search?category=${encodeURIComponent(categoryValue)}`}

      className="group relative flex items-center gap-3 sm:gap-4 rounded-xl border border-gray-200 p-4 sm:p-5 bg-white transition-all duration-200 hover:border-blue-900 hover:shadow-sm active:scale-[0.98]"

    >

      {/* Icon box */}

      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#f4f4f4] transition-colors duration-200 group-hover:bg-blue-50">

        <Icon

          size={20}

          strokeWidth={1.8}

          className="text-blue-800 group-hover:text-blue-600 transition-colors duration-200"

        />

      </div>



      {/* Label */}

      <h3 className="text-[13px] sm:text-[14px] font-medium text-gray-800 leading-snug tracking-tight flex-1 min-w-0">

        {cat.name}

      </h3>



      {/* Arrow */}

      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

        <svg

          width="15"

          height="15"

          viewBox="0 0 24 24"

          fill="none"

          stroke="#1e3a8a"

          strokeWidth="2"

        >

          <path d="M9 18l6-6-6-6" />

        </svg>

      </div>

    </Link>

  );

}