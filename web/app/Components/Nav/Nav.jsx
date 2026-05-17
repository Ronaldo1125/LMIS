"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User, ChevronDown, Bell } from "lucide-react";
import MobileNav from "./MobileNav";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import MyProfile from "../MyProfile";
import NotificationsModal from "./NotificationsModal";
import { getReadIds } from "./NotificationsModal";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // FIX 1: Initialize isScrolled based on window.scrollY immediately,
  // but guard SSR with a mounted check to avoid hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [hasNotifications, setHasNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);
  const [isProfileClosing, setIsProfileClosing] = useState(false);

  // FIX 2: isCollectionsOpen was used in handleCollections but never declared — added here
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // FIX 3: Derive isTransparent only after mount to prevent SSR/client mismatch
  const isLandingPage = pathname === "/";
  const isTransparent = mounted && isLandingPage && !isScrolled;

  // FIX 4: Single mount effect — set mounted, read scroll position immediately,
  // and load user from localStorage. This ensures the nav renders correctly
  // on refresh without waiting for a scroll event.
  useEffect(() => {
    setMounted(true);
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 10);
    setLastScrollY(scrollY);

    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

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

      const res = await fetch(`${API_BASE}/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.reload();
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setAnnouncements(data || []);

      const readIds = getReadIds();
      const unreadCount =
        data?.filter((a) => !readIds.has(String(a.id))).length || 0;
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

  const handleHome = () => router.push("/");
  const handleBrowse = () => router.push("/search");

  const handleCollections = (category = null) => {
    setIsCollectionsOpen(false);
    if (category) {
      router.push(
        `/search?category=${encodeURIComponent(category.toLowerCase())}`
      );
    } else {
      router.push("/search");
    }
  };

  const handleNewRelease = (section = "recent") => {
    if (section === "recent") {
      if (window.location.pathname !== "/") {
        router.push("/#recent-additions");
      } else {
        document
          .getElementById("recent-additions")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (section === "news") {
      if (window.location.pathname !== "/") {
        router.push("/#news");
      } else {
        document
          .getElementById("news")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (section === "categories") {
      if (window.location.pathname !== "/") {
        router.push("/#categories");
      } else {
        document
          .getElementById("categories")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        if (isProfileOpen) {
          setIsProfileClosing(true);
          setTimeout(() => {
            setIsProfileOpen(false);
            setIsProfileClosing(false);
          }, 150);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isProfileOpen, isProfileClosing]);

  useEffect(() => {
    const handleOpenProfileBookmarked = () => setShowProfileModal(true);
    window.addEventListener("openProfileBookmarked", handleOpenProfileBookmarked);
    return () =>
      window.removeEventListener(
        "openProfileBookmarked",
        handleOpenProfileBookmarked
      );
  }, []);

  useEffect(() => {
    const handleShowLoginWithMessage = (event) => {
      setShowLogin(true);
      window.loginMessage = event.detail;
    };
    window.addEventListener("showLoginWithMessage", handleShowLoginWithMessage);
    return () =>
      window.removeEventListener(
        "showLoginWithMessage",
        handleShowLoginWithMessage
      );
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

  const displayName = user?.full_name?.split(" ")[0] || user?.username || "";

  const Avatar = () => {
    const seed = extractSeed(user?.avatar || user?.username || "default");
    return (
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          border: isTransparent
            ? "2px solid rgba(255,255,255,0.5)"
            : "2px solid rgba(30,58,138,0.2)",
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
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
        }
      `}</style>
      <MobileNav />

      <nav
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          isVisible ? "transform translate-y-0" : "transform -translate-y-full"
        }`}
        style={{
          background: isTransparent ? "transparent" : "#fff",
          borderBottom: "none",
          backdropFilter: isTransparent ? "none" : undefined,
          WebkitBackdropFilter: isTransparent ? "none" : undefined,
          boxShadow: "none",
        }}
      >
        <div className="w-full h-20 flex items-center">

          {/* Logo */}
          <div className="flex items-center px-2 sm:px-4 lg:px-6 min-w-[220px]">
            <Link href="/" className="flex items-center gap-1">
              <img
                src="/assets/other/depdevlogo.png"
                alt="Logo"
                className="h-5 w-auto sm:h-7 lg:h-8"
                style={{
                  filter: isTransparent ? "brightness(0) invert(1)" : "none",
                  transition: "filter 0.3s ease",
                }}
              />
              <span
                className="text-xs sm:text-sm lg:text-sm font-semibold tracking-wide"
                style={{
                  color: isTransparent ? "#fff" : "#1e3a8a",
                  transition: "color 0.3s ease",
                }}
              >
                5 LIBRARY
              </span>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex-1 flex justify-center items-center">
            <ul className="flex items-center gap-6 lg:gap-10 text-sm lg:text-[15px] font-medium">
              <li>
                <button
                  onClick={handleHome}
                  className="hover:opacity-70 transition cursor-pointer"
                  style={{ color: isTransparent ? "#fff" : "#111" }}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={handleBrowse}
                  className="hover:opacity-70 transition cursor-pointer"
                  style={{ color: isTransparent ? "#fff" : "#111" }}
                >
                  Browse
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNewRelease("recent")}
                  className="hover:opacity-70 transition cursor-pointer"
                  style={{ color: isTransparent ? "#fff" : "#111" }}
                >
                  New release
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNewRelease("categories")}
                  className="hover:opacity-70 transition cursor-pointer"
                  style={{ color: isTransparent ? "#fff" : "#111" }}
                >
                  Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNewRelease("news")}
                  className="hover:opacity-70 transition cursor-pointer"
                  style={{ color: isTransparent ? "#fff" : "#111" }}
                >
                  News
                </button>
              </li>
            </ul>
          </div>

          {/* Right side — auth */}
          <div className="flex items-center px-4 sm:px-6 lg:px-8 min-w-[220px] justify-end">
            {user ? (
              <div ref={profileRef} className="relative flex items-center gap-2">

                {/* Bell */}
                <button
                  data-bell-button="true"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full transition cursor-pointer"
                  style={{
                    background: "#fff",
                    border: showNotifications
                      ? "1.5px solid #1e3a8a"
                      : "1.5px solid #e2e8f0",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "border-color 0.2s ease, background 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#bfcfeb";
                    e.currentTarget.style.background = "#f0f4ff";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = showNotifications
                      ? "#1e3a8a"
                      : "#e2e8f0";
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Bell
                    size={20}
                    style={{
                      color: showNotifications ? "#2563eb" : "#1e3a8a",
                      transition: "color 0.3s ease",
                    }}
                  />
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {/* Profile button */}
                <button
                  onClick={() => {
                    if (isProfileOpen) {
                      setIsProfileClosing(true);
                      setTimeout(() => {
                        setIsProfileOpen(false);
                        setIsProfileClosing(false);
                      }, 150);
                    } else {
                      setIsProfileOpen(true);
                    }
                  }}
                  className="flex items-center gap-2 rounded-full pr-3 pl-1 py-1 transition cursor-pointer"
                  style={{
                    background: "#fff",
                    border: isProfileOpen
                      ? "1.5px solid #1e3a8a"
                      : "1.5px solid #e2e8f0",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "border-color 0.2s ease, background 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f0f4ff";
                    e.currentTarget.style.borderColor = "#bfcfeb";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = isProfileOpen
                      ? "#1e3a8a"
                      : "#e2e8f0";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Avatar />
                  <span
                    className="text-sm font-semibold max-w-[110px] truncate"
                    style={{ color: "#1e3a8a", transition: "color 0.3s ease" }}
                  >
                    {displayName}
                  </span>
                  <ChevronDown
                    size={15}
                    style={{
                      color: "#1e3a8a",
                      transition: "color 0.3s ease, transform 0.2s ease",
                      transform: isProfileOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {(isProfileOpen || isProfileClosing) && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50"
                    style={{
                      boxShadow: "0 8px 32px rgba(0,48,135,0.13)",
                      animation: isProfileClosing
                        ? "modalSlideOut 0.15s ease-out"
                        : "modalSlideIn 0.15s ease-out",
                      transformOrigin: "top right",
                    }}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => {
                        setIsProfileClosing(true);
                        setTimeout(() => {
                          setIsProfileOpen(false);
                          setIsProfileClosing(false);
                          setShowProfileModal(true);
                        }, 150);
                      }}
                    >
                      <User size={15} className="text-gray-400" />
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition"
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
                  className="text-sm font-medium hover:opacity-70 hover:cursor-pointer transition mr-6"
                  style={{
                    color: isTransparent ? "#fff" : "#111",
                    transition: "color 0.3s ease, opacity 0.2s ease",
                  }}
                >
                  Login
                </button>

                <button
                  onClick={() => setShowRegister(true)}
                  className="px-8 py-2.5 font-semibold transition rounded-[3px] cursor-pointer text-sm tracking-wide"
                  style={
                    isTransparent
                      ? {
                          backgroundColor: "#fff",
                          color: "#1e3a8a",
                          border: "none",
                        }
                      : {
                          backgroundColor: "#1e3a8a",
                          color: "#fff",
                          border: "1px solid #d1d5db",
                        }
                  }
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* FIX 5: Only render the spacer when nav is NOT transparent.
          On the landing page with transparent nav, the hero section
          should start at the very top (behind the nav), so no spacer needed. */}
      {!isLandingPage && <div className="h-20" />}

      {isBookmarksOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsBookmarksOpen(false)}
        />
      )}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
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
      {showProfileModal && (
        <MyProfile user={user} onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
};

const ArrowCircle = () => (
  <span
    style={{
      width: "24px",
      height: "24px",
      backgroundColor: "rgb(25,18,101)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginLeft: "12px",
    }}
  >
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.5"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </span>
);

export default Nav;