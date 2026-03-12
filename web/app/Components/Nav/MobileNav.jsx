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
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // First name only for display
  const displayName = user?.full_name?.split(" ")[0] || user?.username || "";

  // Avatar: Google picture or initials fallback
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
        className={`lg:hidden fixed top-0 right-0 left-0 z-50 bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "64px", height: "calc(100vh - 64px)" }}
      >
        <div className="px-6 py-6 space-y-6 min-h-full flex flex-col">
          {/* Navigation Links */}
          <div className="mt-16">
            <nav className="space-y-2">
            <Link
              href="/about"
              className="block text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2"
              onClick={closeMenu}
            >
              Browse
            </Link>
            <div className="border-t border-gray-200"></div>
            <Link
              href="/catalog"
              className="block text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2"
              onClick={closeMenu}
            >
              New release
            </Link>
            <div className="border-t border-gray-200"></div>
            <div className="relative">
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                className="flex items-center justify-between w-full text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2"
              >
                <span>Collection</span>
                <ChevronDown 
                  size={24} 
                  className={`transition-transform duration-200 ${isCollectionsOpen ? "rotate-180" : ""}`}
                />
              </button>
              
              {/* Collection Dropdown */}
              <div className={`mt-2 grid grid-cols-2 gap-1 overflow-hidden transition-all duration-300 ${
                isCollectionsOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
              }`}>
                <Link
                  href="/collections/books"
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Books & Monographs
                </Link>
                <Link
                  href="/collections/sourcebooks"
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Sourcebooks
                </Link>
                <Link
                  href="/collections/journals"
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Journals & Articles
                </Link>
                <Link
                  href="/collections/databases"
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Databases & Reports
                </Link>
                <Link
                  href="/collections/periodicals"
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Periodicals
                </Link>
                <Link
                  href="/collections/thesis"
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Thesis / Research Papers
                </Link>
                <Link
                  href="/collections/statute"
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Statute / Legal Documents
                </Link>
                <Link
                  href="/collections/guides"
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Guide / Manuals
                </Link>
                <Link
                  href="/collections/reference"
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Reference Materials
                </Link>
              </div>
            </div>
            <div className="border-t border-gray-200"></div>
            <Link
              href="/news"
              className="block text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2"
              onClick={closeMenu}
            >
              News
            </Link>
          </nav>
          </div>

          {/* Spacer to push buttons to bottom */}
          <div className="flex-grow"></div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
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
                        // Navigate to profile page (you can add this route later)
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
              <>
                <Link
                  href="/login"
                  className="block w-full text-center py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center py-3 px-4 text-white font-semibold transition-colors rounded-lg"
                  style={{
                    backgroundColor: 'rgb(25, 18, 101)',
                  }}
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
