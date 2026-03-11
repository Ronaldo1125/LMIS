"use client";

import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  // ── responsive configuration ──────────────────────────────────────
  const getResponsiveConfig = () => {
    if (windowWidth < 640) { // Mobile
      return {
        footerPadding: "py-12 px-4",
        gridCols: "grid-cols-1",
        gridGap: "gap-8",
        titleSize: "text-base",
        textSize: "text-xs",
        bottomPadding: "mt-6 pt-6",
        socialGap: "space-x-4",
        bottomMargin: "mt-4 md:mt-0"
      };
    } else if (windowWidth < 768) { // Tablet
      return {
        footerPadding: "py-14 px-8",
        gridCols: "grid-cols-2",
        gridGap: "gap-12",
        titleSize: "text-lg",
        textSize: "text-sm",
        bottomPadding: "mt-8 pt-8",
        socialGap: "space-x-5",
        bottomMargin: "mt-6 md:mt-0"
      };
    } else { // Desktop
      return {
        footerPadding: "py-16 px-20",
        gridCols: "grid-cols-1 md:grid-cols-4",
        gridGap: "gap-16",
        titleSize: "text-lg",
        textSize: "text-sm",
        bottomPadding: "mt-8 pt-8",
        socialGap: "space-x-6",
        bottomMargin: "mt-8 md:mt-0"
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
    <footer className={`w-full bg-[#1C1B1A] text-white ${config.footerPadding}`}>
      <div className="w-full mx-auto">
        <div className={`grid ${config.gridCols} ${config.gridGap}`}>
          {/* About Section */}
          <div>
            <h3 className={`${config.titleSize} font-semibold mb-4 text-[#D0674B]`}>LMIS</h3>
            <p className={`${config.textSize} text-gray-300 leading-relaxed`}>
              Library Management & Information System providing comprehensive access to digital resources and academic materials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`${config.titleSize} font-semibold mb-4`}>Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Home</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Categories</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Recommended</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>About</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h3 className={`${config.titleSize} font-semibold mb-4`}>Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Books</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Sourcebooks</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Periodicals</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Thesis/ Research papers</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Statute/ Law/ Legal documents</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Guide/ Manuals</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Report</a></li>
              <li><a href="#" className={`${config.textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>Reference Materials</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`${config.titleSize} font-semibold mb-4`}>Contact</h3>
            <ul className="space-y-2">
              <li className={`${config.textSize} text-gray-300`}>Email: info@lmis.edu</li>
              <li className={`${config.textSize} text-gray-300`}>Phone: +1 (555) 123-4567</li>
              <li className={`${config.textSize} text-gray-300`}>Hours: Mon-Fri 8AM-8PM</li>
            </ul>
          </div>
        </div>

        <div className={`${config.bottomPadding} border-t border-gray-700`}>
          <div className={`flex flex-col md:flex-row justify-between items-center`}>
            <p className={`${config.textSize} text-gray-400`}>
              © 2026 LMIS. All rights reserved. Made by Paw Patrol
            </p>
            <div className={`flex ${config.socialGap} ${config.bottomMargin}`}>
              <a href="#" className={`${config.textSize} text-gray-400 hover:text-[#D0674B] transition-colors`}>Privacy Policy</a>
              <a href="#" className={`${config.textSize} text-gray-400 hover:text-[#D0674B] transition-colors`}>Terms of Service</a>
              <a href="#" className={`${config.textSize} text-gray-400 hover:text-[#D0674B] transition-colors`}>Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
