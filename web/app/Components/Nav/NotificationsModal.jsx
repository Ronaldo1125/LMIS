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
/* ROW */
/* ───────────────────────────────────────────── */

const NotifRow = ({ ann, isUnread, onRead }) => {
  const date = ann.sent_at || ann.created_at;

  return (
    <div
      onClick={() => onRead(ann.id)}
      style={{
        display: "flex",
        gap: "10px",
        padding: "10px 14px",
        cursor: "pointer",
        background: isUnread ? "#faf9ff" : "transparent",
        borderBottom: "1px solid #f1f1f5",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5ff")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = isUnread ? "#faf9ff" : "transparent")
      }
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
          <p style={{
            margin: 0, fontSize: "13px",
            fontWeight: isUnread ? 700 : 600,
            color: "#111", flex: 1,
          }}>
            {ann.subject}
          </p>
          <span style={{ fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap" }}>
            {timeAgo(date)}
          </span>
        </div>

        {ann.description && (
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>
            {ann.description}
          </p>
        )}
      </div>

      {isUnread && (
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#191265", marginTop: 6, flexShrink: 0,
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
  const [tab, setTab]       = useState("all");
  const [readIds, setReadIds] = useState(getReadIds);
  const [pos, setPos]       = useState(null);
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
      onClose();
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
          animation: closing ? "ntfFadeOut 0.2s ease forwards" : "ntfFadeIn 0.15s ease" 
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
          width: "340px",
          maxWidth: "calc(100vw - 32px)",
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
          overflow: "hidden",
          transformOrigin: "top right",
          animation: closing
            ? "ntfPopOut 0.2s cubic-bezier(0.4,0,0.6,1) forwards"
            : "ntfPopIn  0.22s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        {/* HEADER */}
        <div style={{
          padding: "10px 14px",
          borderBottom: "1px solid #f1f1f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>
            Notifications
          </span>

          {/* ── PILL TABS ── */}
          <div style={{
            display: "flex",
            background: "#f3f4f6",
            borderRadius: "8px",
            padding: "3px",
            gap: "2px",
          }}>
            {["all", "unread"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? "#111" : "#9ca3af",
                  boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
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
                    background: tab === t ? "rgb(25,18,101)" : "#d1d5db",
                    color: tab === t ? "#fff" : "#6b7280",
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
            <p style={{ padding: 20, textAlign: "center", color: "#aaa", fontSize: "13px" }}>
              Loading...
            </p>
          ) : error ? (
            <p style={{ padding: 20, color: "red", fontSize: "13px" }}>{error}</p>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="#d1d5db" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                style={{ margin: "0 auto 8px", display: "block" }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>
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
            padding: "7px 14px",
            borderTop: "1px solid #f1f1f5",
            textAlign: "center",
          }}>
            <p style={{ margin: 0, fontSize: "10px", color: "#d1d5db" }}>
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