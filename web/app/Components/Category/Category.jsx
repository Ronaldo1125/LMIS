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

/* ───────────────────────────────────────────── */
/* YOUR UI (DO NOT CHANGE) */
/* ───────────────────────────────────────────── */

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

/* ───────────────────────────────────────────── */
/* MAIN */
/* ───────────────────────────────────────────── */

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

  // 🔥 MATCH UI → BACKEND VALUE
  const matchCategory = (uiName) => {
    return backendCategories.find((c) =>
      c.toLowerCase().includes(uiName.toLowerCase().split(" ")[0])
    );
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">

        <div className="mb-8">
          <h2 className="text-[32px] font-semibold text-black leading-tight">
            Browse Categories
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl leading-tight">
            Explore curated knowledge collections across multiple disciplines
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

/* ───────────────────────────────────────────── */
/* CARD */
/* ───────────────────────────────────────────── */

function CategoryCard({ cat, backendValue }) {
  const Icon = cat.icon;

  return (
    <Link
      href={
        backendValue
          ? `/search?category=${encodeURIComponent(backendValue)}`
          : "#"
      }
      className="group relative rounded-xl border border-gray-300 p-6 bg-white transition-all duration-200 hover:border-blue-900"
    >
      <Icon
        size={22}
        strokeWidth={2}
        className="text-blue-800 mb-5 group-hover:text-blue-600 transition"
      />

      <h3 className="text-[15px] font-medium text-black leading-snug tracking-tight">
        {cat.name}
      </h3>

      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
}