"use client";



import React, { useState, useEffect, useRef } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { LogOut, User, ChevronDown, Bell } from "lucide-react";

import MobileNav from "./MobileNav";

import Login from "../Auth/Login";

import Register from "../Auth/Register";

import MyProfile from "../MyProfile";

import NotificationsModal from "./NotificationsModal";

import { getReadIds } from "./NotificationsModal";

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
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);
  const profileRef = useRef(null);
  const collectionBtnRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const router = useRouter();

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      setNotificationsError(null);
      const token = getToken();
      if (!token) {
        setNotificationsError("Authentication required");
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/announcements`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAnnouncements(data || []);
      const readIds = getReadIds();
      const unreadCount = data?.filter((a) => !readIds.has(String(a.id))).length || 0;
      setHasNotifications(unreadCount > 0);
    } catch (err) {
      console.error("Notifications fetch error:", err);
      setNotificationsError("Failed to load notifications");
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleHome = () => {
    router.push("/");
  };

  const handleBrowse = () => {
    router.push("/search");
  };

  const handleCollections = (category = null) => {
    setIsCollectionsOpen(false);
    if (category) {
      router.push(`/search?category=${encodeURIComponent(category.toLowerCase())}`);
    } else {
      router.push("/search");
    }
  };

  const handleNewRelease = (section = "recent") => {
    if (section === "recent") {
      if (window.location.pathname !== "/") {
        router.push("/#recent-additions");
      } else {
        const element = document.getElementById("recent-additions");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else if (section === "news") {
      if (window.location.pathname !== "/") {
        router.push("/#news");
      } else {
        const element = document.getElementById("news");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

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

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleOpenProfileBookmarked = () => {
      setProfileInitialTab("bookmarked");
      setShowMyProfile(true);
    };
    window.addEventListener("openProfileBookmarked", handleOpenProfileBookmarked);
    return () => window.removeEventListener("openProfileBookmarked", handleOpenProfileBookmarked);
  }, []);

  useEffect(() => {
    const handleShowLoginWithMessage = (event) => {
      setShowLogin(true);
      window.loginMessage = event.detail;
    };
    window.addEventListener("showLoginWithMessage", handleShowLoginWithMessage);
    return () => window.removeEventListener("showLoginWithMessage", handleShowLoginWithMessage);
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

  const displayName = user?.full_name?.split(" ")[0] || user?.username || "";

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

      <MobileNav />

      <nav
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white ${
          isVisible ? "transform translate-y-0" : "transform -translate-y-full"
        }`}
      >
        <div className="w-full h-16 flex items-center">

          <div className="flex items-center px-4 sm:px-6 lg:px-8 min-w-[220px]">
            <Link href="/" className="block">
              <img
                src="/assets/other/depdevlogo.png"
                alt="Logo"
                className="h-4 w-auto sm:h-6 lg:h-8"
              />
            </Link>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <ul className="flex items-center gap-6 lg:gap-10 text-black text-xs sm:text-xs lg:text-sm font-medium">
              <li>
                <button onClick={handleHome} className="hover:text-blue-600 transition cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={handleBrowse} className="hover:text-blue-600 transition cursor-pointer">
                  Browse
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNewRelease("recent")}
                  className="hover:text-blue-600 transition cursor-pointer"
                >
                  New release
                </button>
              </li>
              <li>
                <button
                  ref={collectionBtnRef}
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                  className="flex items-center gap-1 hover:text-blue-600 transition relative h-full cursor-pointer"
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

                <div
                  ref={dropdownRef}
                  style={{
                    position: "fixed",
                    top: "64px",
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    overflow: "hidden",
                    maxHeight: isCollectionsOpen ? "280px" : "0px",
                    transition: "max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    pointerEvents: isCollectionsOpen ? "all" : "none",
                  }}
                >
                  <div style={{ background: "#fff", position: "relative" }}>
                    <div
                      style={{
                        maxWidth: "1600px",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "0 30px",
                        padding: "28px 40px 24px",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      <div>
                        {[
                          { label: "Books", category: "Books" },
                          { label: "Sourcebooks", category: "Sourcebooks" },
                          { label: "Periodicals", category: "Periodicals" },
                        ].map((item, i) => (
                          <button
                            key={item.category}
                            className="text-black hover:text-blue-600 transition-colors duration-200"
                            onClick={() => handleCollections(item.category)}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "14px 0",
                              borderBottom: "1px solid rgba(0,0,0,0.12)",
                              textDecoration: "none",
                              fontSize: "14px",
                              width: "100%",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <span>{item.label}</span>
                            <ArrowCircle />
                          </button>
                        ))}
                      </div>
                      <div>
                        {[
                          { label: "Thesis", category: "Thesis" },
                          { label: "Statute / Legal documents", category: "Statute / Legal documents" },
                          { label: "Guides", category: "Guides" },
                        ].map((item, i) => (
                          <button
                            key={item.category}
                            className="text-black hover:text-blue-600 transition-colors duration-200"
                            onClick={() => handleCollections(item.category)}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "14px 0",
                              borderBottom: "1px solid rgba(0,0,0,0.12)",
                              textDecoration: "none",
                              fontSize: "14px",
                              width: "100%",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <span>{item.label}</span>
                            <ArrowCircle />
                          </button>
                        ))}
                      </div>
                      <div>
                        {[
                          { label: "Reports", category: "Reports" },
                          { label: "Reference", category: "Reference" },
                        ].map((item, i) => (
                          <button
                            key={item.category}
                            className="text-black hover:text-blue-600 transition-colors duration-200"
                            onClick={() => handleCollections(item.category)}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "14px 0",
                              borderBottom: "1px solid rgba(0,0,0,0.12)",
                              textDecoration: "none",
                              fontSize: "14px",
                              width: "100%",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <span>{item.label}</span>
                            <ArrowCircle />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <button onClick={() => handleNewRelease("news")} className="hover:text-blue-600 transition cursor-pointer">
                  News
                </button>
              </li>
            </ul>
          </div>

          <div className="flex items-center px-4 sm:px-6 lg:px-8 min-w-[220px] justify-end">

            {user ? (
              <div ref={profileRef} className="relative flex items-center gap-3">
                <button
                  data-bell-button="true"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-full transition ${
                    showNotifications 
                      ? "bg-white shadow-md" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Bell size={18} className={`text-gray-600 ${showNotifications ? "text-blue-600" : ""}`} />
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
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

                {isProfileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50"
                    style={{ boxShadow: "0 8px 32px rgba(0,48,135,0.13)" }}
                  >
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
              <>

                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-black hover:text-blue-600 hover:cursor-pointer transition mr-6"
                >
                  Login
                </button>

                <button
                  onClick={() => setShowRegister(true)}
                  className="px-8 py-2 text-white font-semibold backdrop-blur-sm hover:bg-blue-800 transition rounded-[3px] cursor-pointer"
                  style={{ backgroundColor: "#1e3a8a" }}
                >
                  Register
                </button>

              </>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16" />

      {isBookmarksOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsBookmarksOpen(false)} />
      )}
      {isCollectionsOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsCollectionsOpen(false)} />
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
        <MyProfile
          onClose={() => {
            setShowMyProfile(false);
            setProfileInitialTab("profile");
          }}
          user={user}
          onUserUpdate={handleUserUpdate}
          initialTab={profileInitialTab}
        />
      )}

      {showNotifications && (
        <NotificationsModal
          announcements={announcements}
          loading={notificationsLoading}
          error={notificationsError}
          onClose={() => setShowNotifications(false)}
          onRefresh={fetchNotifications}
        />
      )}
    </>
  );
};

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
