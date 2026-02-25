"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, X, Menu } from "lucide-react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
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
              className="h-6 w-auto"
            />
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={closeMenu} />
      )}

      {/* Mobile Menu Content */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "60px" }}
      >
        <div className="px-6 py-6 space-y-6">
          {/* Navigation Links */}
          <nav className="space-y-4">
            <Link
              href="/about"
              className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
              onClick={closeMenu}
            >
              Browse
            </Link>
            <Link
              href="/catalog"
              className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
              onClick={closeMenu}
            >
              New release
            </Link>
            <Link
              href="/contact"
              className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
              onClick={closeMenu}
            >
              Collection
            </Link>
            <Link
              href="/news"
              className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
              onClick={closeMenu}
            >
              News
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
