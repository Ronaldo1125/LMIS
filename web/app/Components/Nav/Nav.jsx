"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import MobileNav from "./MobileNav";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import MyProfile from "../MyProfile";

const dicebearUrl = (seed) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

// ── FIX: Extract seed from either a full DiceBear URL or a plain seed string ──
const extractSeed = (avatarValue) => {
  if (!avatarValue) return "default";
  try {
    const url = new URL(avatarValue);
    return url.searchParams.get("seed") || avatarValue;
  } catch {
    return avatarValue; // already a plain seed string
  }
};

const Nav = () => {
  const [isBookmarksOpen, setIsBookmarksOpen]     = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery]             = useState("");
  const [showLogin, setShowLogin]                 = useState(false);
  const [showRegister, setShowRegister]           = useState(false);
  const [showMyProfile, setShowMyProfile]         = useState(false);
  const [user, setUser]                           = useState(null);
  const [isProfileOpen, setIsProfileOpen]         = useState(false);
  const [isScrolled, setIsScrolled]               = useState(false);
  const [isVisible, setIsVisible]                 = useState(true);
  const [lastScrollY, setLastScrollY]             = useState(0);

  const profileRef = useRef(null);
  const router     = useRouter();

  /* ── Scroll behavior ── */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* ── Read user from localStorage on mount ── */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  /* ── Close profile dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setShowLogin(false);
  };

  const handleRegisterSuccess = (data) => {
    setUser(data.user);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    router.push("/");
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  /* First name only for display */
  const displayName = user?.full_name?.split(" ")[0] || user?.username || "";

  /* ── FIX: Avatar now uses extractSeed so full URLs and plain seeds both work ── */
  const Avatar = () => {
    const seed = extractSeed(user?.avatar || user?.username || "default");
    return (
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          border: "2px solid rgba(25,18,101,0.15)",
          backgroundColor: "#f4f4f5",
        }}
      >
        <img
          src={dicebearUrl(seed)}
          alt="avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  };

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNav />

      {/* Desktop Navigation */}
      <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}>
        <div className="w-full h-16 flex items-center">

          {/* LEFT: LOGO */}
          <div className="flex items-center px-4 sm:px-6 lg:px-8 min-w-[220px]">
            <Link href="/" className="block">
              <img
                src="/assets/other/depdevlogo.png"
                alt="Logo"
                className="h-4 w-auto sm:h-6 lg:h-8"
              />
            </Link>
          </div>

          {/* CENTER NAV */}
          <div className="flex-1 flex justify-center items-center">
            <ul className="flex items-center gap-6 lg:gap-10 text-black text-xs sm:text-xs lg:text-sm font-medium">
              <li>
                <Link href="/about" className="hover:text-black/80 transition">Browse</Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-black/80 transition">New release</Link>
              </li>
              <li className="relative">
                <div
                  className="flex items-center cursor-pointer hover:text-black/80 transition"
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                >
                  <Link href="/contact">Collection</Link>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth="1.5" stroke="currentColor" className="w-3 h-3 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                <div className={`absolute left-0 mt-2 w-56 bg-black/95 border border-white/10 rounded-md shadow-xl py-1 z-50 transition-all duration-200 ${
                  isCollectionsOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}>
                  <Link href="/collections/books"       className="block px-4 py-2 text-sm text-white hover:bg-white/10">Books</Link>
                  <Link href="/collections/sourcebooks" className="block px-4 py-2 text-sm text-white hover:bg-white/10">Sourcebooks</Link>
                  <Link href="/collections/periodicals" className="block px-4 py-2 text-sm text-white hover:bg-white/10">Periodicals</Link>
                  <Link href="/collections/thesis"      className="block px-4 py-2 text-sm text-white hover:bg-white/10">Thesis/Research Papers</Link>
                  <Link href="/collections/statute"     className="block px-4 py-2 text-sm text-white hover:bg-white/10">Statute/Legal Documents</Link>
                  <Link href="/collections/guides"      className="block px-4 py-2 text-sm text-white hover:bg-white/10">Guide Manuals</Link>
                  <Link href="/collections/reports"     className="block px-4 py-2 text-sm text-white hover:bg-white/10">Reports</Link>
                  <Link href="/collections/reference"   className="block px-4 py-2 text-sm text-white hover:bg-white/10">Reference Material</Link>
                </div>
              </li>
              <li>
                <Link href="/about" className="hover:text-black/80 transition">About</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-black/80 transition">News</Link>
              </li>
            </ul>
          </div>

          {/* RIGHT: Auth area */}
          <div className="flex items-center px-4 sm:px-6 lg:px-8 min-w-[220px] justify-end">

            {user ? (
              /* ── LOGGED IN: profile chip ── */
              <div ref={profileRef} className="relative flex items-center">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full pr-2 pl-1 py-1 hover:bg-gray-100 transition"
                >
                  <Avatar />
                  <span className="text-sm font-semibold text-gray-800 max-w-[110px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50"
                    style={{ boxShadow: "0 8px 32px rgba(0,48,135,0.13)" }}
                  >
                    {/* User info header */}
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <button
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => { setIsProfileOpen(false); setShowMyProfile(true); }}
                    >
                      <User size={15} className="text-gray-400" />
                      My Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
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
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-black hover:text-black/80 transition mr-6"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="h-16 px-10 flex items-center justify-center text-white font-semibold backdrop-blur-sm hover:bg-[#143961]/80 transition"
                  style={{ backgroundColor: "rgb(25, 18, 101)", width: "200px", marginRight: "-32px" }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE SPACER */}
      <div className="h-16" />

      {/* Overlay for bookmarks */}
      {isBookmarksOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsBookmarksOpen(false)} />
      )}

      {/* Close collections dropdown on outside click */}
      {isCollectionsOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsCollectionsOpen(false)} />
      )}

      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}

      {/* MyProfile Modal */}
      {showMyProfile && (
        <MyProfile
          onClose={() => setShowMyProfile(false)}
          user={user}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </>
  );
};

export default Nav;