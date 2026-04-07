"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();

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

  const handleHome = () => {
    router.push("/");
  };

  const handleBrowse = () => {
    router.push("/search");
  };

  const handleNewRelease = (section = "recent") => {
    if (section === "recent") {
      if (window.location.pathname !== "/") {
        router.push("/#recent-additions");
      } else {
        const element = document.getElementById("recent-additions");
        if (element) {
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    } else if (section === "news") {
      if (window.location.pathname !== "/") {
        router.push("/#news");
      } else {
        const element = document.getElementById("news");
        if (element) {
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    }
  };

  const getQuickLinkAction = (link) => {
    switch (link) {
      case "Home":
        return handleHome;
      case "Browse":
        return handleBrowse;
      case "Recent Additions":
        return () => handleNewRelease("recent");
      case "News":
        return () => handleNewRelease("news");
      default:
        return () => {};
    }
  };

  return (
    <footer className={`w-full bg-blue-950 text-white ${footerPadding}`}>
      <div className="max-w-[1600px] mx-auto w-full">
        <div className={`grid ${gridCols} ${gridGap}`}>

        
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

          
          <div>
            <h3 className={`${titleSize} font-semibold mb-4`}>Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Browse", "Recent Additions", "News"].map((link) => (
                <li key={link}>
                  <button 
                    onClick={getQuickLinkAction(link)}
                    className={`${textSize} text-gray-300 hover:text-[#D0674B] transition-colors text-left w-full bg-transparent border-none cursor-pointer`}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        
          <div>
            <h3 className={`${titleSize} font-semibold mb-4`}>Resources</h3>
            <ul className="space-y-2">
              {[
                { label: "Books", category: "books" },
                { label: "Sourcebooks", category: "sourcebooks" },
                { label: "Periodicals", category: "periodicals" },
                { label: "Thesis / Research papers", category: "thesis" },
                { label: "Statute / Law / Legal documents", category: "statute" },
                { label: "Guide / Manuals", category: "guides" },
                { label: "Report", category: "reports" },
                { label: "Reference Materials", category: "reference" },
              ].map((resource) => (
                <li key={resource.category}>
                  <a href={`/search?category=${resource.category}`} className={`${textSize} text-gray-300 hover:text-[#D0674B] transition-colors`}>
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

         
          <div>
            <h3 className={`${titleSize} font-semibold mb-4`}>Contact</h3>
            <ul className="space-y-2">
              <li className={`${textSize} text-gray-300`}>Email: info@lmis.edu</li>
              <li className={`${textSize} text-gray-300`}>Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

      
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`${textSize} text-gray-400 text-center md:text-left`}>
              © {new Date().getFullYear()} LMIS. All rights reserved. Developed by: <a href="https://www.linkedin.com/in/jake-macua/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Jake M.</a>, <a href="https://www.linkedin.com/in/michaelalatraca/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Michael A.</a>, <a href="https://www.linkedin.com/in/charles-loneza-282b15387/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Charles L.</a>, <a href="https://www.linkedin.com/in/anzelbotin/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Anzel Victor B.</a>
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