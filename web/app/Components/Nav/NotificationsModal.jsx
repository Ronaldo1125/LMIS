"use client";

import React, { useState, useEffect } from "react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

/* ───────────────────────────────────────────── */
/* HELPERS */
/* ───────────────────────────────────────────── */

const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const STORAGE_KEY = "lmis_read_announcements";

const getReadIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const markAsRead = (id) => {
  const ids = getReadIds();
  ids.add(String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

const markAllRead = (announcements) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(announcements.map((a) => String(a.id)))
  );
};

/* ───────────────────────────────────────────── */
/* NOTIFICATION TYPE RESOLVER */
/* ───────────────────────────────────────────── */

/**
 * Infers notification type from subject/description keywords.
 * Returns { icon: SVGPath, color: string, bg: string }
 */
const resolveType = (ann) => {
  const text = `${ann.subject || ""} ${ann.description || ""}`.toLowerCase();

  if (/new book|added|acquisition|arrival/.test(text))
    return {
      type: "book",
      color: "#2563eb",
      bg: "#eff6ff",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
    };

  if (/event|seminar|workshop|webinar|session|forum/.test(text))
    return {
      type: "event",
      color: "#7c3aed",
      bg: "#f5f3ff",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    };

  if (/deadline|due|overdue|return|renew/.test(text))
    return {
      type: "deadline",
      color: "#dc2626",
      bg: "#fef2f2",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    };

  if (/system|update|maintenance|server|upgrade/.test(text))
    return {
      type: "system",
      color: "#d97706",
      bg: "#fffbeb",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M21 12h-2M5 12H3M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 21v-2M12 5V3"/>
        </svg>
      ),
    };

  if (/alert|warning|urgent|important|notice/.test(text))
    return {
      type: "alert",
      color: "#ea580c",
      bg: "#fff7ed",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    };

  // default: announcement / general
  return {
    type: "announcement",
    color: "#2563eb",
    bg: "#eff6ff",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  };
};

/* ───────────────────────────────────────────── */
/* ROW */
/* ───────────────────────────────────────────── */

const NotifRow = ({ ann, isUnread, onRead }) => {
  const date = ann.sent_at || ann.created_at;
  const notifType = resolveType(ann);

  return (
    <div
      onClick={() => onRead(ann.id)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "11px 14px",
        cursor: "pointer",
        background: isUnread ? "#f8faff" : "transparent",
        borderBottom: "1px solid #f1f1f5",
        transition: "background 0.15s",
        position: "relative",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#eef3ff")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = isUnread ? "#f8faff" : "transparent")
      }
    >
      {/* RIGHT: Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", alignItems: "flex-start" }}>
          <p style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: isUnread ? 700 : 600,
            color: "#111",
            flex: 1,
            lineHeight: 1.35,
          }}>
            {ann.subject}
          </p>
          <span style={{
            fontSize: "10.5px",
            color: "#b0b8c9",
            whiteSpace: "nowrap",
            marginTop: "1px",
            fontWeight: 500,
          }}>
            {timeAgo(date)}
          </span>
        </div>

        {ann.description && (
          <p style={{
            margin: "3px 0 0",
            fontSize: "12px",
            color: "#6b7280",
            lineHeight: 1.45,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {ann.description}
          </p>
        )}
      </div>

      {/* Unread dot */}
      {isUnread && (
        <div style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#2563eb",
          flexShrink: 0,
          marginTop: 6,
          boxShadow: "0 0 0 2px #dbeafe",
        }} />
      )}
    </div>
  );
};

/* ───────────────────────────────────────────── */
/* MAIN */
/* ───────────────────────────────────────────── */

const NotificationsModal = ({
  announcements = [],
  loading,
  error,
  onClose,
  anchorRef,
}) => {
  const [tab, setTab]         = useState("all");
  const [readIds, setReadIds] = useState(getReadIds);
  const [pos, setPos]         = useState(null);
  const [closing, setClosing] = useState(false);

  /* ── POSITION ── */
  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right + 16 });
    } else {
      setPos({ top: 64, right: 32 });
    }
  }, [anchorRef]);

  /* ── MARK READ ── */
  useEffect(() => {
    if (announcements.length) {
      markAllRead(announcements);
      setReadIds(getReadIds());
    }
  }, [announcements]);

  /* ── CLOSE EVENTS ── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onClickOutside = (e) => {
      const panel = document.querySelector("[data-ntf]");
      const bell  = anchorRef?.current;
      if (panel && !panel.contains(e.target) && bell && !bell.contains(e.target))
        onClose();
    };
    const onScroll = () => {
      const panel = document.querySelector("[data-ntf]");
      if (panel) {
        panel.style.animation = "ntfFadeOut 0.15s ease forwards";
        setTimeout(() => onClose(), 150);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("scroll", onScroll);
    };
  }, [onClose, anchorRef]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 200);
  };

  const handleRead = (id) => { markAsRead(id); setReadIds(getReadIds()); };

  const unreadCount = announcements.filter((a) => !readIds.has(String(a.id))).length;
  const filtered    = tab === "unread"
    ? announcements.filter((a) => !readIds.has(String(a.id)))
    : announcements;

  if (!pos) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          animation: closing ? "ntfFadeOut 0.2s ease forwards" : "ntfFadeIn 0.15s ease",
        }}
      />

      {/* PANEL */}
      <div
        data-ntf
        style={{
          position: "fixed",
          top: pos.top,
          right: pos.right,
          zIndex: 9999,
          width: "360px",
          maxWidth: "calc(100vw - 32px)",
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 12px 40px rgba(37,99,235,0.10), 0 2px 8px rgba(0,0,0,0.07)",
          overflow: "hidden",
          transformOrigin: "top right",
          animation: closing
            ? "ntfPopOut 0.2s cubic-bezier(0.4,0,0.6,1) forwards"
            : "ntfPopIn  0.22s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        {/* HEADER */}
        <div style={{
          padding: "12px 14px 10px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            {/* Bell icon */}
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#eff6ff",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "50%"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", letterSpacing: "-0.01em" }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span style={{
                fontSize: "10px", fontWeight: 700,
                background: "#2563eb", color: "#fff",
                borderRadius: "99px", padding: "1px 7px",
                lineHeight: 1.6, letterSpacing: "0.02em",
              }}>
                {unreadCount} new
              </span>
            )}
          </div>

          {/* ── PILL TABS ── */}
          <div style={{
            display: "flex",
            background: "#f1f5f9",
            borderRadius: "9px",
            padding: "3px",
            gap: "2px",
          }}>
            {["all", "unread"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "4px 12px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  background: tab === t ? "#2563eb" : "transparent",
                  color: tab === t ? "#fff" : "#64748b",
                  boxShadow: tab === t ? "0 1px 4px rgba(37,99,235,0.25)" : "none",
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  lineHeight: 1,
                }}
              >
                {t}
                {t === "unread" && unreadCount > 0 && (
                  <span style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    background: tab === t ? "rgba(255,255,255,0.25)" : "#cbd5e1",
                    color: tab === t ? "#fff" : "#475569",
                    borderRadius: "99px",
                    padding: "1px 5px",
                    lineHeight: 1.4,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div style={{ maxHeight: "360px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              {/* Skeleton rows */}
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 12, background: "#f1f5f9", borderRadius: 6, marginBottom: 6, width: "70%" }} />
                    <div style={{ height: 10, background: "#f8fafc", borderRadius: 6, width: "90%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{ padding: "24px 20px", textAlign: "center" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#fef2f2", display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#dc2626" }}>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#f8fafc", border: "1.5px dashed #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                {tab === "unread" ? "No unread notifications." : "You're all caught up."}
              </p>
            </div>
          ) : (
            filtered.map((ann) => (
              <NotifRow
                key={ann.id}
                ann={ann}
                isUnread={!readIds.has(String(ann.id))}
                onRead={handleRead}
              />
            ))
          )}
        </div>

        {/* FOOTER */}
        {!loading && !error && announcements.length > 0 && (
          <div style={{
            padding: "8px 14px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fafcff",
          }}>
            <p style={{ margin: 0, fontSize: "10.5px", color: "#c7d2e0", fontWeight: 500 }}>
              Showing announcements addressed to you
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ntfFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes ntfFadeOut { from{opacity:1} to{opacity:0} }
        @keyframes ntfPopIn   { from{opacity:0;transform:scale(0.91) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes ntfPopOut  { from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(0.91) translateY(-8px)} }
      `}</style>
    </>
  );
};

export { getReadIds };
export default NotificationsModal;