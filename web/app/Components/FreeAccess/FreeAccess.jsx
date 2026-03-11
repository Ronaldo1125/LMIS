"use client";

import React, { useState, useEffect } from 'react';

const FreeAccess = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  // ── responsive configuration ──────────────────────────────────────
  const getResponsiveConfig = () => {
    if (windowWidth < 640) { // Mobile
      return {
        sectionPadding: "py-12 px-4",
        titleSize: "text-2xl",
        descriptionSize: "text-sm",
        buttonSize: "text-base",
        buttonPadding: "py-3 px-6",
        gap: "gap-3",
        layoutDirection: "flex-col",
        contentWidth: "w-full",
        buttonTextMobile: true
      };
    } else if (windowWidth < 768) { // Tablet
      return {
        sectionPadding: "py-14 px-6",
        titleSize: "text-2xl",
        descriptionSize: "text-base",
        buttonSize: "text-base",
        buttonPadding: "py-3 px-7",
        gap: "gap-4",
        layoutDirection: "flex-col",
        contentWidth: "w-full",
        buttonTextMobile: false
      };
    } else { // Desktop
      return {
        sectionPadding: "py-16 px-8",
        titleSize: "text-2xl md:text-3xl",
        descriptionSize: "text-sm md:text-base",
        buttonSize: "text-base",
        buttonPadding: "py-4 px-8",
        gap: "gap-4",
        layoutDirection: "md:flex-row",
        contentWidth: "md:w-1/2",
        buttonTextMobile: false
      };
    }
  };

  const config = getResponsiveConfig();

  // ── window resize listener ────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className={`bg-blue-950 text-white ${config.sectionPadding}`}>
      <div className={`max-w-[1320px] mx-auto flex ${windowWidth >= 768 ? 'md:flex-row' : 'flex-col'} items-center justify-between`}>
        <div className={`${config.contentWidth} mb-8 ${windowWidth >= 768 ? 'md:mb-0' : ''}`}>
          <h2 className={`${config.titleSize} font-bold mb-4 ${windowWidth < 640 ? 'text-center' : ''}`}>
            Free for everyone, forever.
          </h2>
          <p className={`${config.descriptionSize} text-gray-200 leading-relaxed ${windowWidth < 640 ? 'text-center' : ''}`}>
            LMIS is an open-access digital library. No subscriptions, no paywalls, no late fees — just instant access to hundreds of thousands of titles from any device.
          </p>
        </div>
        <div className={`${config.contentWidth} flex ${config.layoutDirection} ${config.gap} justify-center ${windowWidth >= 768 ? 'md:justify-end' : ''}`}>
          <button className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold ${config.buttonPadding} transition-colors duration-200 ${config.buttonSize}`}>
            {config.buttonTextMobile ? "Start free" : "Start reading free"}
          </button>
          <button className={`bg-transparent border border-white hover:bg-white hover:text-blue-950 text-white font-semibold ${config.buttonPadding} transition-all duration-200 ${config.buttonSize}`}>
            {config.buttonTextMobile ? "Learn" : "Learn more"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeAccess;
