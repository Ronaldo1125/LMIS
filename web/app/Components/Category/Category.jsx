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
    return backendCategories.find((c) =>
      c && c.name && typeof c.name === 'string' &&
      c.name.toLowerCase().includes(uiName.toLowerCase().split(" ")[0])
    );
  };

  return (
    <section className="w-full bg-white py-10 sm:py-12 lg:py-16">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12">

        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-semibold text-black leading-tight">
            Browse Categories
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1.5 sm:mt-2 max-w-xl leading-snug">
            Explore curated knowledge collections across multiple disciplines
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
      className="group relative rounded-xl border border-gray-300 p-4 sm:p-5 lg:p-6 bg-white transition-all duration-200 hover:border-blue-900 active:scale-[0.98]"
    >
      <Icon
        size={20}
        strokeWidth={2}
        className="text-blue-800 mb-3 sm:mb-4 lg:mb-5 group-hover:text-blue-600 transition"
      />

      <h3 className="text-[13px] sm:text-[14px] lg:text-[15px] font-medium text-black leading-snug tracking-tight pr-5">
        {cat.name}
      </h3>

      <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 opacity-0 group-hover:opacity-100 transition">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
}