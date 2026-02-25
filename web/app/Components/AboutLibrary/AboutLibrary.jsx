"use client";

import React from "react";

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
   <section className="w-full bg-white mt-12 sm:mt-16 pb-10">
      <div 
        style={{
          maxWidth: 1440,
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0 24px",
        }}
      >
        {/* Smaller Heading */}
        <h3 className="text-[#111827] tracking-tight leading-[1.1] 
                       text-[28px] sm:text-[34px] lg:text-[40px]">
          Why use DepDev 5 E-Library?
        </h3>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {items.map((it) => (
            <a key={it.title} href={it.href} className="group block">

              {/* Icon */}
              <div className="text-[#ef4444]">
                <FeatureIcon name={it.icon} />
              </div>

              {/* Title */}
              <div className="mt-5 flex items-center gap-2">
                <h4 className="text-[18px] sm:text-[19px] font-semibold text-[#111827]">
                  {it.title}
                </h4>
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-[#ef4444] translate-x-0 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>

              {/* Description */}
              <p className="mt-2 text-[14px] sm:text-[15px] leading-[1.7] text-[#4b5563] max-w-[42ch]">
                {it.desc}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutLibrary = () => {
  return (
    <>
      <section className="w-full bg-[#ffffff]">
        <div
          style={{
            maxWidth: 1440,
            marginLeft: "auto",
            marginRight: "auto",
            padding: "24px 48px 24px",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="w-full">
              <div className="overflow-hidden rounded-none">
                <img
                  src="/assets/other/hj.png"
                  alt="DepDev 5 Library"
                  className="w-full h-[280px] sm:h-[380px] lg:h-[460px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="max-w-[620px] lg:ml-2">
              <h2 className=" text-[#111827] tracking-tight leading-[1.05] text-[30px] sm:text-[45px] lg:text-[52px]">
                About DepDev 5 Library
              </h2>

              <p className="mt-6 text-[#1f2937] text-[16px]  sm:text-[17px] leading-[1.9] max-w-[58ch]">
                The DepDev 5 Library is the region’s dedicated learning and research
                space for community development students and practitioners.
              </p>

              <p className="mt-5 text-[#1f2937] text-[16px] sm:text-[17px] leading-[1.9] max-w-[58ch]">
                We provide academic support, research help, and access to digital and
                print resources to help you build strong foundations, write better
                papers, and graduate job-ready.
              </p>
            </div>
          </div>
        </div>

        {/* BELOW ABOUT: "Why use …" section */}
        <div 
          style={{
            maxWidth: 1440,
            marginLeft: "auto",
            marginRight: "auto",
            padding: "0 24px",
          }}
        >
          <DepDevELibrarySection />
        </div>
      </section>
    </>
  );
};

export default AboutLibrary;