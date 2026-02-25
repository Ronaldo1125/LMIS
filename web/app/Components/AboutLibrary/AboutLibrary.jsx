"use client";

import React from "react";

/* ---------- ICONS ---------- */
const FeatureIcon = ({ name, className = "" }) => {
  const common = "w-14 h-14";
  const stroke = "currentColor";

  if (name === "insights") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${common} ${className}`}
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M7 15l3-3 3 2 4-6" />
        <path d="M17 8h2v2" />
      </svg>
    );
  }

  if (name === "anywhere") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${common} ${className}`}
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7.5 18.5h9" />
        <path d="M9 18.5v-2.2c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6v2.2" />
        <path d="M6.5 7.8A6.8 6.8 0 0 1 12 5c3.7 0 6.8 3 6.8 6.8 0 .8-.1 1.6-.4 2.3" />
        <path d="M5 12.3c0-1.7.7-3.3 1.8-4.5" />
        <path d="M16.4 14.1l1.4 1.4" />
        <path d="M14.8 15.7l1.1 1.1" />
        <path d="M17.6 11.2a5.6 5.6 0 0 0-9.9-3.5" />
      </svg>
    );
  }

  // "resources"
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${common} ${className}`}
      fill="none"
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 6.5A3.5 3.5 0 0 1 8 3h10.5v16.5A1.5 1.5 0 0 1 17 21H8a3.5 3.5 0 0 1-3.5-3.5z" />
      <path d="M18.5 17H8a3.5 3.5 0 0 0 0 7" />
      <path d="M8 7h7" />
      <path d="M8 10h7" />
      <path d="M8 13h5" />
    </svg>
  );
};

/* ---------- WHY USE SECTION ---------- */
const DepDevELibrarySection = () => {
  const items = [
    {
      title: "Trusted learning resources",
      desc: "Explore verified books, reports, and references tailored for community development work.",
      icon: "resources",
      href: "#resources",
    },
    {
      title: "Access anywhere, anytime",
      desc: "Read on mobile or desktop and keep learning even outside office or campus hours.",
      icon: "anywhere",
      href: "#access",
    },
    {
      title: "Research made easier",
      desc: "Find materials faster and build stronger papers with organized categories and search.",
      icon: "insights",
      href: "#research",
    },
  ];

  return (
    <section className="w-full bg-white pt-8 pb-12 sm:pb-16">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
        <h3 className="text-[#111827] tracking-tight leading-[1.1] text-[28px] sm:text-[34px] lg:text-[40px] font-medium text-center">
          Why use DepDev 5 E-Library?
        </h3>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-[1240px] mx-auto">
          {items.map((it) => (
            <div key={it.title} className="group block">
              <div className="text-[#ef4444]">
                <FeatureIcon name={it.icon} />
              </div>

              <div className="mt-5">
                <h4 className="text-[18px] sm:text-[19px] font-semibold text-[#111827]">
                  {it.title}
                </h4>
              </div>

              <p className="mt-2 text-[14px] sm:text-[15px] leading-[1.7] text-[#4b5563] max-w-[42ch]">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default function AboutLibrary() {
  return (
    <>
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 py-16 sm:py-20 lg:py-24">
            {/* LEFT */}
            <div className="max-w-[620px]">
              <h1 className="text-[#111827] tracking-tight leading-[1.05] text-[44px] sm:text-[56px] lg:text-[64px] font-medium">
                About DepDev 5 Library
              </h1>

              <p className="mt-8 text-[#4b5563] text-[16px] sm:text-[17px] leading-[1.9] max-w-[62ch]">
                The DepDev 5 Library is the region's dedicated learning and research
                space for community development students and practitioners. Explore
                trusted resources, discover references, and understand what to expect
                when building papers and projects.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href="#how"
                  className="block w-fit text-[#2563eb] text-[16px] sm:text-[17px] hover:underline underline-offset-4"
                >
                  How to use the E-Library
                </a>

                <a
                  href="#dates"
                  className="block w-fit text-[#2563eb] text-[16px] sm:text-[17px] hover:underline underline-offset-4"
                >
                  Find resources by category
                </a>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:justify-self-end w-full">
              <div className="w-full lg:w-[640px]">
                <div className="relative overflow-hidden rounded-2xl border]">
                  {/* If you want a real embed later, replace this <img> with an iframe */}
                  <img
                    src="/assets/other/background.png"
                    alt="Library preview"
                    className="w-full h-[260px] sm:h-[340px] lg:h-[360px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DepDevELibrarySection />
    </>
  );
}