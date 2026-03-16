"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, LogOut, User, ChevronDown, Bell } from "lucide-react";
import MobileNav from "./MobileNav";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import MyProfile from "../MyProfile";


const Nav = () => {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(false);

  const profileRef = useRef(null);
  const collectionBtnRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  /* Scroll behavior */
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

  /* Load user */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  /* Close profile on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        collectionBtnRef.current &&
        !collectionBtnRef.current.contains(e.target)
      ) {
        setIsCollectionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    router.push("/");
  };

  /* Avatar */
  const Avatar = () => {
    const initials = (user?.full_name || user?.username || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <div style={{
        width: "34px", height: "34px", borderRadius: "50%",
        backgroundColor: "rgb(25,18,101)", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", fontWeight: "700",
        border: "2px solid rgba(255,255,255,0.25)",
      }}>
        {initials}
      </div>
    );
  };

  return (
    <>
      <MobileNav />

      <nav
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="w-full h-16 flex items-center">

          {/* LOGO */}
          <div className="flex items-center px-6 min-w-[220px]">
            <Link href="/">
              <img src="/assets/other/depdevlogo.png" alt="Logo" className="h-7 w-auto" />
            </Link>
          </div>

          {/* CENTER NAV */}
          <div className="flex-1 flex justify-center">
            <ul className="flex items-center gap-10 text-sm font-medium text-black">

              <li>
                <Link href="/search" className="hover:text-black/70 transition">
                  Browse
                </Link>
              </li>

              <li>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    // If not on homepage, navigate first
                    if (window.location.pathname !== '/') {
                      window.location.href = '/#recent-additions';
                      return;
                    }
                    // Smooth scroll to section
                    const element = document.querySelector('#recent-additions');
                    if (element) {
                      const offset = 80; // Account for header
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="hover:text-black/70 transition"
                >
                  New Release
                </button>
              </li>

              {/* COLLECTION — British Museum style */}
              <li className="relative h-16 flex items-center">
                <button
                  ref={collectionBtnRef}
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                  className="flex items-center gap-1 hover:text-black/70 transition relative h-full"
                  style={{ paddingBottom: "2px" }}
                >
                  Collection
                  <ChevronDown
                    size={14}
                    style={{
                      transition: "transform 0.3s ease",
                      transform: isCollectionsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                  {/* Active underline */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "rgb(25,18,101)",
                      transform: isCollectionsOpen ? "scaleX(1)" : "scaleX(0)",
                      transition: "transform 0.25s ease",
                      transformOrigin: "left",
                    }}
                  />
                </button>

                {/* ── MEGA MENU DROPDOWN ── */}
                <div
                  ref={dropdownRef}
                  style={{
                    position: "fixed",
                    top: "64px",
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    overflow: "hidden",
                    // Clip animation: max-height 0 → full height
                    maxHeight: isCollectionsOpen ? "280px" : "0px",
                    transition: "max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    pointerEvents: isCollectionsOpen ? "all" : "none",
                  }}
                >
                  <div style={{ background: "#fff", position: "relative" }}>

                    {/* Menu items */}
                    <div
                      style={{
                        maxWidth: "1440px",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "0 30px",
                        padding: "28px 40px 24px",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {/* COL 1 */}
                      <div>
                        {[
                          { label: "Books", href: "/collections/books" },
                          { label: "Sourcebooks", href: "/collections/sourcebooks" },
                          { label: "Periodicals", href: "/collections/periodicals" },
                        ].map((item, i) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "14px 0",
                              borderBottom: "1px solid rgba(0,0,0,0.12)",
                              color: "#000",
                              textDecoration: "none",
                              fontSize: "14px",
                            }}
                          >
                            <span>{item.label}</span>
                            <ArrowCircle />
                          </Link>
                        ))}
                      </div>

                      {/* COL 2 */}
                      <div>
                        {[
                          { label: "Thesis / Research Papers", href: "/collections/thesis" },
                          { label: "Statute / Legal Documents", href: "/collections/statute" },
                          { label: "Guide Manuals", href: "/collections/guides" },
                        ].map((item, i) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "14px 0",
                              borderBottom: "1px solid rgba(0,0,0,0.12)",
                              color: "#000",
                              textDecoration: "none",
                              fontSize: "14px",
                            }}
                          >
                            <span>{item.label}</span>
                            <ArrowCircle />
                          </Link>
                        ))}
                      </div>

                      {/* COL 3 */}
                      <div>
                        {[
                          { label: "Reports", href: "/collections/reports" },
                          { label: "Reference Materials", href: "/collections/reference" },
                        ].map((item, i) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "14px 0",
                              borderBottom: "1px solid rgba(0,0,0,0.12)",
                              color: "#000",
                              textDecoration: "none",
                              fontSize: "14px",
                            }}
                          >
                            <span>{item.label}</span>
                            <ArrowCircle />
                          </Link>
                        ))}
                      </div>
                    </div>


                  </div>
                </div>
              </li>

              <li>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    // If not on homepage, navigate first
                    if (window.location.pathname !== '/') {
                      window.location.href = '/#news';
                      return;
                    }
                    // Smooth scroll to section
                    const element = document.querySelector('#news');
                    if (element) {
                      const offset = 80; // Account for header
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="hover:text-black/70 transition"
                >
                  News
                </button>
              </li>

            </ul>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center min-w-[220px] justify-between">
            {user ? (
              <div ref={profileRef} className="relative flex items-center gap-3">
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                  <Bell size={18} className="text-gray-600" />
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 transition"
                >
                  <Avatar />
                  <span className="text-sm font-semibold text-gray-800">
                    {user?.full_name?.split(" ")[0] || user?.username}
                  </span>
                  <ChevronDown size={14} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border rounded-xl shadow-xl py-2">
                    <button
                      onClick={() => setShowMyProfile(true)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                    >
                      <User size={15} /> My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-black hover:text-black/80 transition mr-6"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="h-16 flex-1 flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: "rgb(25,18,101)" }}
                >
                  Register
                </button>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* Dim overlay behind dropdown */}
      <div
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.25)",
          opacity: isCollectionsOpen ? 1 : 0,
          pointerEvents: isCollectionsOpen ? "all" : "none",
          transition: "opacity 0.4s ease",
          zIndex: 40,
        }}
        onClick={() => setIsCollectionsOpen(false)}
      />

      <div className="h-16" />

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSuccess={(data) => { setUser(data.user); setShowLogin(false); }}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSuccess={(data) => { setUser(data.user); setShowRegister(false); }}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
      {showMyProfile && (
        <MyProfile onClose={() => setShowMyProfile(false)} user={user} />
      )}
    </>
  );
};

/* ── Small arrow-circle icon ── */
const ArrowCircle = () => (
  <span style={{
    width: "24px", height: "24px",
    backgroundColor: "rgb(25,18,101)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginLeft: "12px",
  }}>
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </span>
);

export default Nav;
