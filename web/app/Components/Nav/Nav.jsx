"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown, Bell } from "lucide-react";
import MobileNav from "./MobileNav";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import MyProfile from "../MyProfile";
import NotificationsModal, { getReadIds, markAllRead } from "./NotificationsModal";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

const dicebearUrl = (seed) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

const extractSeed = (avatarValue) => {
  if (!avatarValue) return "default";
  try {
    const url = new URL(avatarValue);
    return url.searchParams.get("seed") || avatarValue;
  } catch {
    return avatarValue;
  }
};

const Nav = () => {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [showLogin,         setShowLogin]         = useState(false);
  const [showRegister,      setShowRegister]      = useState(false);
  const [showMyProfile,     setShowMyProfile]     = useState(false);
  const [user,              setUser]              = useState(null);
  const [isProfileOpen,     setIsProfileOpen]     = useState(false);
  const [isVisible,         setIsVisible]         = useState(true);
  const [lastScrollY,       setLastScrollY]       = useState(0);

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [announcements,     setAnnouncements]     = useState([]);
  const [annLoading,        setAnnLoading]        = useState(false);
  const [annError,          setAnnError]          = useState("");
  const [unreadCount,       setUnreadCount]       = useState(0);

  const profileRef       = useRef(null);
  const collectionBtnRef = useRef(null);
  const dropdownRef      = useRef(null);
  const router           = useRouter();

  /* ── Scroll hide/show ── */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsVisible(!(y > lastScrollY && y > 100));
      setLastScrollY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* ── Restore user from localStorage ── */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
  }, []);

  /* ── Close profile dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Fetch announcements ── */
  const fetchAnnouncements = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setAnnLoading(true); setAnnError("");
    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setAnnouncements(data);
      const readIds = getReadIds();
      setUnreadCount(data.filter((a) => !readIds.has(String(a.id))).length);
    } catch (err) {
      setAnnError(err.message || "Failed to load.");
    } finally {
      setAnnLoading(false);
    }
  }, []);

  /* ── Poll every 2 min when logged in ── */
  useEffect(() => {
    if (!user) return;
    fetchAnnouncements();
    const id = setInterval(fetchAnnouncements, 2 * 60 * 1000);
    return () => clearInterval(id);
  }, [user, fetchAnnouncements]);

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    setUnreadCount(0); // clear badge immediately on open
  };

  const handleLoginSuccess = (data) => { setUser(data.user); setShowLogin(false); };
  const handleRegisterSuccess = (data) => { setUser(data.user); setShowRegister(false); };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    setAnnouncements([]);
    setUnreadCount(0);
    router.push("/");
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const displayName = user?.full_name?.split(" ")[0] || user?.username || "";

  const Avatar = () => {
    const seed = extractSeed(user?.avatar || user?.username || "default");
    return (
      <div style={{
        width: "34px", height: "34px", borderRadius: "50%",
        overflow: "hidden", flexShrink: 0,
        border: "2px solid rgba(25,18,101,0.15)",
        backgroundColor: "#f4f4f5",
      }}>
        <img src={dicebearUrl(seed)} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  };

  return (
    <>
      <MobileNav />

      <nav className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}>
        <div className="w-full h-16 flex items-center">

          {/* LEFT: Logo */}
          <div className="flex items-center px-4 sm:px-6 lg:px-8 min-w-[220px]">
            <Link href="/" className="block">
              <img src="/assets/other/depdevlogo.png" alt="Logo" className="h-4 w-auto sm:h-6 lg:h-8" />
            </Link>
          </div>

          {/* CENTER: Nav links */}
          <div className="flex-1 flex justify-center items-center">
            <ul className="flex items-center gap-6 lg:gap-10 text-black text-xs sm:text-xs lg:text-sm font-medium">
              <li><Link href="/about"   className="hover:text-black/80 transition">Browse</Link></li>
              <li><Link href="/catalog" className="hover:text-black/80 transition">New release</Link></li>

              {/* Collection mega-menu */}
              <li className="relative h-16 flex items-center">
                <button
                  ref={collectionBtnRef}
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                  className="flex items-center gap-1 hover:text-black/70 transition relative h-full"
                  style={{ paddingBottom: "2px" }}
                >
                  Collection
                  <ChevronDown size={14} style={{ transition: "transform 0.3s ease", transform: isCollectionsOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  <span style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "2px", backgroundColor: "rgb(25,18,101)",
                    transform: isCollectionsOpen ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 0.25s ease", transformOrigin: "left",
                  }} />
                </button>

                <div
                  ref={dropdownRef}
                  style={{
                    position: "fixed", top: "64px", left: 0, right: 0, zIndex: 50,
                    overflow: "hidden",
                    maxHeight: isCollectionsOpen ? "280px" : "0px",
                    transition: "max-height 0.8s cubic-bezier(0.4,0,0.2,1)",
                    pointerEvents: isCollectionsOpen ? "all" : "none",
                  }}
                >
                  <div style={{ background: "#fff" }}>
                    <div style={{
                      maxWidth: "1440px", margin: "0 auto",
                      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "0 30px", padding: "28px 40px 24px",
                    }}>
                      <div>
                        {[
                          { label: "Books",       href: "/collections/books" },
                          { label: "Sourcebooks", href: "/collections/sourcebooks" },
                          { label: "Periodicals", href: "/collections/periodicals" },
                        ].map((item) => (
                          <Link key={item.href} href={item.href} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(0,0,0,0.12)", color: "#000", textDecoration: "none", fontSize: "14px" }}>
                            <span>{item.label}</span><ArrowCircle />
                          </Link>
                        ))}
                      </div>
                      <div>
                        {[
                          { label: "Thesis / Research Papers",  href: "/collections/thesis" },
                          { label: "Statute / Legal Documents", href: "/collections/statute" },
                          { label: "Guide Manuals",             href: "/collections/guides" },
                        ].map((item) => (
                          <Link key={item.href} href={item.href} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(0,0,0,0.12)", color: "#000", textDecoration: "none", fontSize: "14px" }}>
                            <span>{item.label}</span><ArrowCircle />
                          </Link>
                        ))}
                      </div>
                      <div>
                        {[
                          { label: "Reports",             href: "/collections/reports" },
                          { label: "Reference Materials", href: "/collections/reference" },
                        ].map((item) => (
                          <Link key={item.href} href={item.href} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(0,0,0,0.12)", color: "#000", textDecoration: "none", fontSize: "14px" }}>
                            <span>{item.label}</span><ArrowCircle />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li><Link href="/about" className="hover:text-black/80 transition">About</Link></li>
              <li><Link href="/news"  className="hover:text-black/80 transition">News</Link></li>
            </ul>
          </div>

          {/* RIGHT: Auth */}
          <div className="flex items-center px-4 sm:px-6 lg:px-8 min-w-[220px] justify-end">
            {user ? (
              <div ref={profileRef} className="relative flex items-center gap-3">

                {/* Bell / notifications button */}
                <button
                  onClick={handleOpenNotifications}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition"
                  title="Notifications"
                >
                  <Bell size={18} className="text-gray-600" />
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute", top: "4px", right: "4px",
                      minWidth: "16px", height: "16px",
                      background: "rgb(25,18,101)",
                      borderRadius: "9999px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.58rem", fontWeight: 800, color: "#fff",
                      padding: "0 3px", border: "1.5px solid #fff",
                      animation: "navPopIn 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                    }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile chip */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full pr-2 pl-1 py-1 hover:bg-gray-100 transition"
                >
                  <Avatar />
                  <span className="text-sm font-semibold text-gray-800 max-w-[110px] truncate">{displayName}</span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50" style={{ boxShadow: "0 8px 32px rgba(0,48,135,0.13)" }}>
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => { setIsProfileOpen(false); setShowMyProfile(true); }}
                    >
                      <User size={15} className="text-gray-400" /> My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => setShowLogin(true)} className="text-sm font-medium text-black hover:text-black/80 transition mr-6">
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

      <div className="h-16" />

      {isCollectionsOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsCollectionsOpen(false)} />
      )}

      {/* Notifications drawer */}
      {showNotifications && (
        <NotificationsModal
          announcements={announcements}
          loading={annLoading}
          error={annError}
          onClose={() => setShowNotifications(false)}
          onRefresh={fetchAnnouncements}
        />
      )}

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
      {showMyProfile && (
        <MyProfile onClose={() => setShowMyProfile(false)} user={user} onUserUpdate={handleUserUpdate} />
      )}

      <style>{`
        @keyframes navPopIn {
          from { transform: scale(0.5); opacity: 0 }
          to   { transform: scale(1);   opacity: 1 }
        }
      `}</style>
    </>
  );
};

const ArrowCircle = () => (
  <span style={{ width: "24px", height: "24px", backgroundColor: "rgb(25,18,101)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "12px" }}>
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </span>
);

export default Nav;