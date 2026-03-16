"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, Menu, ChevronDown, AlignJustify, User, LogOut } from "lucide-react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Read user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    
    // Cleanup: restore body scroll on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    closeMenu();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Toggle body scroll
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    closeMenu();
    
    // If not on homepage, navigate first
    if (window.location.pathname !== '/') {
      window.location.href = `/${targetId}`;
      return;
    }
    
    // Smooth scroll to section
    const element = document.querySelector(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    // Restore body scroll
    document.body.style.overflow = '';
  };

  const displayName = user?.full_name?.split(" ")[0] || user?.username || "";

  const Avatar = () => {
    const initials = (user?.full_name || user?.username || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          backgroundColor: "rgb(25, 18, 101)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: "700",
          flexShrink: 0,
          border: "2px solid rgba(255,255,255,0.25)",
        }}
      >
        {initials}
      </div>
    );
  };

  const collectionItems = [
    { label: "Books", cat: "books" },
    { label: "Sourcebooks", cat: "sourcebooks" },
    { label: "Databases & Reports", cat: "databases & reports" },
    { label: "Periodicals", cat: "periodicals" },
    { label: "Thesis / Research Papers", cat: "thesis / research papers" },
    { label: "Statute / Legal Documents", cat: "statute / law / legal documents" },
    { label: "Guide / Manuals", cat: "guide / manuals" },
    { label: "Reference Materials", cat: "reference materials" },
  ];

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link href="/" className="block">
            <img
              src="/assets/other/depdevlogo.png"
              alt="Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 8h22" />
                <path d="M1 16h22" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={closeMenu} />
      )}

      {/* Mobile Menu Content */}
      <div
        className={`lg:hidden fixed top-0 right-0 left-0 z-50 bg-white transform transition-transform duration-500 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "64px", height: "calc(100vh - 64px)" }}
      >
        <div className="px-6 py-6 space-y-6 min-h-full flex flex-col">
          {/* Navigation Links */}
          <div className="mt-16">
            <nav className="space-y-2">
              <Link
                href="/"
                className="block text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2"
                onClick={closeMenu}
              >
                Home
              </Link>
              <div className="border-t border-gray-200"></div>
              <Link
                href="/search"
                className="block text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2"
                onClick={closeMenu}
              >
                Browse
              </Link>
              <div className="border-t border-gray-200"></div>
              <button
                onClick={(e) => handleSmoothScroll(e, '#recent-additions')}
                className="block text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2 text-left w-full"
              >
                Recent additions
              </button>
              <div className="border-t border-gray-200"></div>

              {/* ── COLLECTION — only this section changed ── */}
              <div className="relative">
                <button
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                  className="flex items-center justify-between w-full text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2"
                >
                  <span>Collection</span>
                  <ChevronDown
                    size={24}
                    style={{
                      transition: "transform 0.3s ease",
                      transform: isCollectionsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* White panel — max-height clip, same as desktop */}
                <div style={{
                  maxHeight: isCollectionsOpen ? "600px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "#fff",
                  marginLeft: "-24px",
                  marginRight: "-24px",
                }}>
                  {/* 2-column grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    {collectionItems.map((item, i) => (
                      <Link
                        key={item.cat}
                        href={`/search?category=${encodeURIComponent(item.cat)}`}
                        onClick={closeMenu}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "13px 14px 13px 20px",
                          fontSize: "13px",
                          color: "#000",
                          textDecoration: "none",
                        }}
                      >
                        {item.label}
                        <span style={{
                          width: "20px", height: "20px",
                          backgroundColor: "#1a1d31",
                          borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, marginLeft: "6px",
                        }}>
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none"
                            stroke="#fff" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {/* ── END COLLECTION ── */}

              <div className="border-t border-gray-200"></div>
              <button
                onClick={(e) => handleSmoothScroll(e, '#news')}
                className="block text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2 text-left w-full"
              >
                News
              </button>
            </nav>
          </div>

          {/* Spacer to push buttons to bottom */}
          <div className="flex-grow"></div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200">
            {user ? (
              /* ── LOGGED IN: Profile Section ── */
              <div className="space-y-3">
                {/* User Profile Header */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="bg-white border border-gray-200 rounded-lg p-2 space-y-1">
                    <button
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition rounded-lg"
                      onClick={() => {
                        setIsProfileOpen(false);
                        closeMenu();
                      }}
                    >
                      <User size={15} className="text-gray-400" />
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition rounded-lg"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── LOGGED OUT: Login + Register ── */
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="flex-1 text-center py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-3 px-4 text-white font-semibold transition-colors"
                  style={{ backgroundColor: 'rgb(25, 18, 101)' }}
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

};

export default MobileNav;