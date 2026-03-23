"use client";

import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth > 0 && windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 768;

  const textSize = isMobile ? "text-xs" : "text-sm";
  const titleSize = isMobile ? "text-base" : "text-lg";
  const footerPadding = isMobile ? "py-12 px-4" : isTablet ? "py-14 px-8" : "py-16 px-20";
  const gridCols = isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-4";
  const gridGap = isMobile ? "gap-8" : isTablet ? "gap-12" : "gap-16";
  const socialGap = isMobile ? "space-x-4" : isTablet ? "space-x-5" : "space-x-6";
  const bottomMargin = isMobile ? "mt-4" : "mt-0";

  return (
    <footer className={`w-full bg-blue-950 text-white ${footerPadding}`}>
      <div className="max-w-[1600px] mx-auto w-full">
        <div className={`grid ${gridCols} ${gridGap}`}>

          {/* Brand / Logo Section */}
          <div className="flex items-start">
            <div className="w-full max-w-[160px]">
              <img
                src="/assets/other/depdevlogo.png"
                alt="Depdev Logo"
                className="w-full h-auto object-contain filter brightness-0 invert"
                style={{ maxHeight: '48px', width: 'auto', maxWidth: '100%' }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`${titleSize} font-semibold mb-4`}>Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Browse", "Recent Additions", "News"].map((link) => (
                <li key={link}>
                  <a href="#" className={`${textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={`${titleSize} font-semibold mb-4`}>Resources</h3>
            <ul className="space-y-2">
              {[
                "Books",
                "Sourcebooks",
                "Periodicals",
                "Thesis / Research papers",
                "Statute / Law / Legal documents",
                "Guide / Manuals",
                "Report",
                "Reference Materials",
              ].map((resource) => (
                <li key={resource}>
                  <a href="#" className={`${textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`${titleSize} font-semibold mb-4`}>Contact</h3>
            <ul className="space-y-2">
              <li className={`${textSize} text-gray-300`}>Email: info@lmis.edu</li>
              <li className={`${textSize} text-gray-300`}>Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`${textSize} text-gray-400 text-center md:text-left`}>
              © {new Date().getFullYear()} LMIS. All rights reserved. Developed by: Jake M., Michael A., Charles Ethan L., Anzel Victor B.
            </p>
            <div className={`flex ${socialGap} ${bottomMargin} md:mt-0 mt-4`}>
              {["Privacy Policy", "Terms of Service", "Support"].map((item) => (
                <a key={item} href="#" className={`${textSize} text-gray-400 hover:text-[#D0674B] transition-colors`}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;