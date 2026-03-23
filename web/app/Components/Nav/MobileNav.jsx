"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// ── Premium SVG Icon Set ────────────────────────────────────────────────────

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconChevronRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconChevronDown = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const IconBookmark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 3h14a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

const IconLogout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCollection = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

const IconNewspaper = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <line x1="7" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="7" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="7" y1="17" x2="11" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const IconStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 6.3 6.9.9-5 4.9 1.2 6.9L12 17.8l-6 3.2 1.2-6.9-5-4.9 6.9-.9z"/>
  </svg>
);

const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l8 4v6c0 5-3.5 9.7-8 11C7.5 21.7 4 17 4 12V6l8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Main Component ──────────────────────────────────────────────────────────

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState("felix");
  const [avatarPage, setAvatarPage] = useState(0);
  const [formData, setFormData] = useState({ fullName: "", username: "", email: "" });

  const dicebearUrl = (seed) =>
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        setFormData({ fullName: u.full_name || u.fullName || "", username: u.username || "", email: u.email || "" });
      } catch {}
    }
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      const changes = { full_name: formData.fullName, fullName: formData.fullName, username: formData.username, avatar: dicebearUrl(avatarSeed) };
      for (const s of [localStorage, sessionStorage]) {
        const raw = s.getItem("user");
        if (raw) { try { s.setItem("user", JSON.stringify({ ...JSON.parse(raw), ...changes })); } catch {} }
      }
      setUser(prev => ({ ...prev, ...changes }));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    closeMenu();
  };

  const toggleMenu = () => {
    const next = !isOpen;
    setIsOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
    document.body.style.overflow = "";
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    closeMenu();
    if (window.location.pathname !== "/") {
      window.location.href = `/${targetId}`;
      return;
    }
    const el = document.querySelector(targetId);
    if (el) {
      const offsetPosition = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const displayName = user?.full_name?.split(" ")[0] || user?.username || "";
  const initials = (user?.full_name || user?.username || "?")
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

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

  const avatarSeeds = ["felix", "leo", "luna", "max", "mia", "nova", "ace", "zoe", "kai", "sam", "ivy", "rex"];

  // ─── Profile Sub-panel ───────────────────────────────────────────────────
  const ProfileSubPanel = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Hero card — avatar picker lives here */}
      <div style={{ margin: "16px 16px 16px", background: "#f4f4f4", borderRadius: "16px", padding: "18px 20px", position: "relative", overflow: "hidden" }}>

        {/* Name + email row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
          <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: "#e0e0e0", border: "2.5px solid #d0d0d0", overflow: "hidden", flexShrink: 0 }}>
            <img src={dicebearUrl(avatarSeed)} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#111", letterSpacing: "-0.3px" }}>{formData.fullName || displayName}</p>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
          </div>
        </div>

        {/* Avatar picker row inside hero — 4 visible + sync */}
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: "700", color: "#aaa", letterSpacing: "0.8px", textTransform: "uppercase" }}>Choose avatar</p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {avatarSeeds.slice(avatarPage * 4, avatarPage * 4 + 4).map((seed) => (
              <button
                key={seed}
                onClick={() => setAvatarSeed(seed)}
                style={{
                  width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                  border: avatarSeed === seed ? "2.5px solid rgb(25,18,101)" : "2px solid #ddd",
                  overflow: "hidden", cursor: "pointer", padding: 0, background: "#e8e8e8",
                  transition: "border 0.18s, transform 0.18s",
                  transform: avatarSeed === seed ? "scale(1.12)" : "scale(1)",
                }}
              >
                <img src={dicebearUrl(seed)} alt={seed} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
            {/* Sync / next page button */}
            <button
              onClick={() => setAvatarPage(p => (p + 1) % Math.ceil(avatarSeeds.length / 4))}
              style={{
                width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                border: "2px dashed #ccc", background: "#e8e8e8",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.18s",
              }}
              title="More avatars"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 12a8 8 0 018-8 8 8 0 016.93 4" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 12a8 8 0 01-8 8 8 8 0 01-6.93-4" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="17 8 20 8 20 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7 16 4 16 4 19" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tab pills */}
      <div style={{ display: "flex", gap: "8px", margin: "0 16px 16px", background: "#f4f4f6", borderRadius: "12px", padding: "4px" }}>
        {[
          { id: "profile", label: "Profile", Icon: IconUser },
          { id: "saved", label: "Saved", Icon: IconBookmark },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveProfileTab(id)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              padding: "9px 12px", borderRadius: "9px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: "600", transition: "all 0.2s",
              background: activeProfileTab === id ? "#fff" : "transparent",
              color: activeProfileTab === id ? "rgb(25,18,101)" : "#999",
              boxShadow: activeProfileTab === id ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        {activeProfileTab === "profile" ? (
          <div>
            <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: "700", color: "#bbb", letterSpacing: "0.8px", textTransform: "uppercase" }}>Account Info</p>

            {/* Always-editable fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Full Name */}
              <div style={{ background: "#f4f4f4", borderRadius: "12px", padding: "12px 14px" }}>
                <p style={{ margin: "0 0 5px", fontSize: "11px", color: "#888", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>Full Name</p>
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  style={{ width: "100%", background: "transparent", border: "none", fontSize: "14px", color: "#111", fontWeight: "500", outline: "none", padding: 0, margin: 0, fontFamily: "inherit" }}
                />
              </div>

              {/* Email — read only */}
              <div style={{ background: "#f4f4f4", borderRadius: "12px", padding: "12px 14px" }}>
                <p style={{ margin: "0 0 5px", fontSize: "11px", color: "#888", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>Email</p>
                <p style={{ margin: 0, fontSize: "14px", color: "#999", fontWeight: "500" }}>{user?.email}</p>
              </div>

              {/* Username */}
              <div style={{ background: "#f4f4f4", borderRadius: "12px", padding: "12px 14px" }}>
                <p style={{ margin: "0 0 5px", fontSize: "11px", color: "#888", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>Username</p>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  style={{ width: "100%", background: "transparent", border: "none", fontSize: "14px", color: "#111", fontWeight: "500", outline: "none", padding: 0, margin: 0, fontFamily: "inherit" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", marginBottom: "16px" }}>
            </div>

            {/* Filters row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", borderBottom: "1px solid #f0f0f0", paddingBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16M7 12h10M10 18h4" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>Filters</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="9" y1="6" x2="20" y2="6" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="9" y1="12" x2="20" y2="12" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="9" y1="18" x2="20" y2="18" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="4" cy="6" r="1.5" fill="#333"/>
                  <circle cx="4" cy="12" r="1.5" fill="#333"/>
                  <circle cx="4" cy="18" r="1.5" fill="#333"/>
                </svg>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>All Lists</span>
              </div>
            </div>

            {/* Empty state — Scribd-style folder illustration */}
            <div style={{ textAlign: "center", padding: "0 12px 24px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "22px" }}>
                <svg width="120" height="98" viewBox="0 0 120 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Folder body */}
                  <rect x="6" y="32" width="88" height="58" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="2.4"/>
                  {/* Folder tab */}
                  <path d="M6 32 Q6 22 15 22 L40 22 Q48 22 50 32" fill="none" stroke="#1a1a1a" strokeWidth="2.4" strokeLinejoin="round"/>
                  {/* Lines inside */}
                  <line x1="22" y1="52" x2="70" y2="52" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round"/>
                  <line x1="22" y1="63" x2="56" y2="63" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round"/>
                  {/* Dashed arc from top-right of folder */}
                  <path d="M78 20 Q90 10 100 20" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3.5 4.5" fill="none"/>
                  {/* Pin/circle at end of arc */}
                  <circle cx="100" cy="25" r="5.5" fill="none" stroke="#1a1a1a" strokeWidth="2.2"/>
                  <circle cx="100" cy="25" r="2" fill="#1a1a1a"/>
                </svg>
              </div>

              <p style={{ margin: "0 0 10px", fontSize: "17px", fontWeight: "800", color: "#111", letterSpacing: "-0.3px" }}>
                Explore all you want to read
              </p>
              <p style={{ margin: "0 0 22px", fontSize: "13.5px", color: "#666", lineHeight: 1.55 }}>
                Save your favorite titles, and access them easily.
              </p>
              <Link
                href="/search"
                onClick={closeMenu}
                style={{ fontSize: "14px", fontWeight: "800", color: "#111", textDecoration: "none" }}
              >
                Explore Library
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Very bottom actions */}
      <div style={{ padding: "24px 16px 28px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {activeProfileTab === "profile" && (
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%", padding: "13px",
              background: saving ? "#c5c5d0" : "rgb(25,18,101)",
              border: "none", borderRadius: "12px", cursor: saving ? "not-allowed" : "pointer",
              fontSize: "14px", fontWeight: "700", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "background 0.2s",
            }}
          >
            {saving && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ animation: "mnavSpin 0.9s linear infinite" }}>
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
                <path d="M12 3a9 9 0 019 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                <style>{`@keyframes mnavSpin { to { transform: rotate(360deg); } }`}</style>
              </svg>
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );

  // ─── Nav Links ────────────────────────────────────────────────────────────
  const navItems = [
    { label: "Home", href: "/", Icon: IconHome },
    { label: "Browse", href: "/search", Icon: IconSearch },
  ];

  const showNav = !user || !isProfileOpen;

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="lg:hidden" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px" }}>
          <Link href="/" onClick={closeMenu}>
            <img src="/assets/other/depdevlogo.png" alt="Logo" style={{ height: "30px", width: "auto" }} />
          </Link>
          <button onClick={toggleMenu} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", padding: "6px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          className="lg:hidden"
          onClick={closeMenu}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", transition: "opacity 0.3s" }}
        />
      )}

      {/* ── Drawer ── */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
          width: "100%",
          background: "#fff",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isOpen ? "-16px 0 60px rgba(0,0,0,0.14)" : "none",
          display: "flex", flexDirection: "column", overflowY: "auto", minHeight: 0,
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "16px 20px 14px", borderBottom: "1px solid #f2f2f2" }}>
          {/* Left — Back (only in account view) */}
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            {isProfileOpen && (
              <button
                onClick={() => setIsProfileOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "13px", fontWeight: "600", padding: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back
              </button>
            )}
          </div>
          {/* Center — title */}
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#888", letterSpacing: "0.8px", textTransform: "uppercase", textAlign: "center" }}>
            {isProfileOpen ? "Account" : "Navigation"}
          </span>
          {/* Right — plain X */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={closeMenu} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconClose />
            </button>
          </div>
        </div>

        {/* Profile Sub-panel */}
        {user && isProfileOpen && <ProfileSubPanel />}

        {/* Main content (when not in profile sub-panel) */}
        {showNav && (
          <div style={{ padding: "16px 16px 28px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>

            {/* ── User Card (logged in) ── */}
            {user && (
              <button
                onClick={() => setIsProfileOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  width: "100%", border: "none", borderRadius: "16px", padding: "16px", cursor: "pointer",
                  marginBottom: "8px", textAlign: "left", position: "relative", overflow: "hidden",
                  background: "#f4f4f4",
                }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgb(25,18,101)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                  <img src={user?.avatar || dicebearUrl(avatarSeed)} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#111" }}>Hi, {displayName}!</p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                </div>
                <span style={{ color: "#ccc", flexShrink: 0 }}><IconChevronRight size={18} /></span>
              </button>
            )}

            {/* ── Login Card (guest) ── */}
            {!user && (
              <div style={{ background: "#f4f4f4", borderRadius: "16px", padding: "18px", marginBottom: "8px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700", color: "#111" }}>Welcome to the Library</p>
                <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#888" }}>Sign in to access your full collection.</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link href="/login" onClick={closeMenu} style={{ flex: 1, textAlign: "center", padding: "11px", fontSize: "13px", fontWeight: "600", color: "#333", border: "1px solid #ddd", borderRadius: "10px", textDecoration: "none", background: "#fff" }}>
                    Log in
                  </Link>
                  <Link href="/register" onClick={closeMenu} style={{ flex: 1, textAlign: "center", padding: "11px", fontSize: "13px", fontWeight: "700", color: "#fff", background: "rgb(25,18,101)", borderRadius: "10px", textDecoration: "none" }}>
                    Register
                  </Link>
                </div>
              </div>
            )}

            {/* ── Section Label ── */}
            <p style={{ margin: "8px 4px 4px", fontSize: "11px", fontWeight: "700", color: "#bbb", letterSpacing: "0.8px", textTransform: "uppercase" }}>Menu</p>

            {/* ── Nav Items ── */}
            {navItems.map(({ label, href, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 14px", textDecoration: "none", borderRadius: "12px", background: "transparent", color: "#111" }}
              >
                <span style={{ color: "rgb(25,18,101)", display: "flex" }}><Icon /></span>
                <span style={{ flex: 1, fontSize: "14px", fontWeight: "600" }}>{label}</span>
                <span style={{ color: "#ccc" }}><IconChevronRight /></span>
              </Link>
            ))}

            {/* Recent Additions */}
            <button
              onClick={(e) => handleSmoothScroll(e, "#recent-additions")}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 14px", borderRadius: "12px", background: "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              <span style={{ color: "rgb(25,18,101)", display: "flex" }}><IconClock /></span>
              <span style={{ flex: 1, fontSize: "14px", fontWeight: "600", color: "#111" }}>Recent Additions</span>
              <span style={{ color: "#ccc" }}><IconChevronRight /></span>
            </button>

            {/* Collections accordion */}
            <div style={{ borderRadius: "12px", overflow: "hidden", background: "transparent" }}>
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 14px", border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                <span style={{ color: "rgb(25,18,101)", display: "flex" }}><IconCollection /></span>
                <span style={{ flex: 1, fontSize: "14px", fontWeight: "600", color: "#111" }}>Collection</span>
                <span style={{ color: "#aaa" }}><IconChevronDown open={isCollectionsOpen} /></span>
              </button>

              <div style={{ maxHeight: isCollectionsOpen ? "700px" : "0", overflow: "hidden", transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)" }}>
                {collectionItems.map((item, i) => (
                  <Link
                    key={item.cat}
                    href={`/search?category=${encodeURIComponent(item.cat)}`}
                    onClick={closeMenu}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "11px 14px", textDecoration: "none",
                      borderBottom: i < collectionItems.length - 1 ? "1px solid #efefef" : "none",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#444", fontWeight: "500" }}>{item.label}</span>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgb(25,18,101)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* News */}
            <button
              onClick={(e) => handleSmoothScroll(e, "#news")}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 14px", borderRadius: "12px", background: "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              <span style={{ color: "rgb(25,18,101)", display: "flex" }}><IconNewspaper /></span>
              <span style={{ flex: 1, fontSize: "14px", fontWeight: "600", color: "#111" }}>News</span>
              <span style={{ color: "#ccc" }}><IconChevronRight /></span>
            </button>

            {/* Log out — solid dark button at very bottom */}
            {user && (
              <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%", padding: "13px",
                    background: "#f4f4f4", border: "none", borderRadius: "12px",
                    cursor: "pointer", fontSize: "14px", fontWeight: "700", color: "#111",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "background 0.2s",
                  }}
                >
                  <IconLogout />
                  Log out
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
};

export default MobileNav;