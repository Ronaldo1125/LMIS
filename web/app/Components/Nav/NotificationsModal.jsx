"use client";

import React, { useState, useEffect } from "react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const formatDate = (iso) => {
  const date = new Date(iso);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${dayName} ${monthName} ${day} - ${hours}:${minutes}`;
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



const resolveType = (ann) => {
  const text = `${ann.subject || ""} ${ann.description || ""}`.toLowerCase();

  if (/blender|3d|animation|modeling/.test(text))
    return {
      type: "blender", color: "#2563eb", bg: "#eff6ff",
      tagColor: "#2563eb", tagBg: "#dbeafe",
      icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/></svg>),
    };

  if (/python|coding|programming|code/.test(text))
    return {
      type: "python", color: "#059669", bg: "#ecfdf5",
      tagColor: "#059669", tagBg: "#d1fae5",
      icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>),
    };

  if (/photoshop|design|graphic|editing/.test(text))
    return {
      type: "photoshop", color: "#7c3aed", bg: "#f5f3ff",
      tagColor: "#7c3aed", tagBg: "#ede9fe",
      icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>),
    };

  if (/support|help|assist|question/.test(text))
    return {
      type: "support", color: "#ea580c", bg: "#fff7ed",
      tagColor: "#ea580c", tagBg: "#fed7aa",
      icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
    };

  if (/new book|added|acquisition|arrival/.test(text))
    return {
      type: "book", color: "#2563eb", bg: "#eff6ff",
      tagColor: "#2563eb", tagBg: "#dbeafe",
      icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>),
    };

  if (/event|seminar|workshop|webinar|session|forum/.test(text))
    return {
      type: "event", color: "#7c3aed", bg: "#f5f3ff",
      tagColor: "#7c3aed", tagBg: "#ede9fe",
      icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
    };

  if (/deadline|due|overdue|return|renew/.test(text))
    return {
      type: "deadline", color: "#dc2626", bg: "#fef2f2",
      tagColor: "#dc2626", tagBg: "#fecaca",
      icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
    };

  if (/system|update|maintenance|server|upgrade/.test(text))
    return {
      type: "system", color: "#d97706", bg: "#fffbeb",
      tagColor: "#d97706", tagBg: "#fed7aa",
      icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M21 12h-2M5 12H3M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 21v-2M12 5V3"/></svg>),
    };

  if (/alert|warning|urgent|important|notice/.test(text))
    return {
      type: "alert", color: "#ea580c", bg: "#fff7ed",
      tagColor: "#ea580c", tagBg: "#fed7aa",
      icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
    };

  return {
    type: "announcement", color: "#2563eb", bg: "#eff6ff",
    tagColor: "#2563eb", tagBg: "#dbeafe",
    icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>),
  };
};

const typeLabel = (type) => {
  const map = {
    blender: "Blender Course", python: "Python Course",
    photoshop: "Photoshop Course", support: "Support",
    book: "New Book", event: "Event", deadline: "Deadline",
    system: "System", alert: "Alert", announcement: "Announcement",
  };
  return map[type] || "Announcement";
};

const avatarLetter = (type) => {
  const map = { book: "N", system: "S", announcement: "D" };
  return map[type] || "T";
};



const NotifRow = ({ ann, isUnread, onRead, onSelect, isMobile }) => {
  const date = ann.sent_at || ann.created_at;
  const notifType = resolveType(ann);

  const handleClick = () => { onRead(ann.id); onSelect(ann); };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex", alignItems: "flex-start", gap: isMobile ? "8px" : "12px",
        padding: isMobile ? "10px 12px" : "14px 16px", cursor: "pointer",
        background: isUnread ? "#f4f4f4" : "#fff",
        borderBottom: "1px solid #f1f1f5",
        transition: "background 0.15s", position: "relative",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = isUnread ? "#e8e8e8" : "#f8f8f8")}
      onMouseLeave={(e) => (e.currentTarget.style.background = isUnread ? "#f4f4f4" : "#fff")}
    >
     
      <div style={{
        width: isMobile ? 30 : 40, height: isMobile ? 30 : 40, borderRadius: "50%",
        background: notifType.color, display: "flex",
        alignItems: "center", justifyContent: "center",
        flexShrink: 0, color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: 700,
      }}>
        {avatarLetter(notifType.type)}
      </div>

     
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: isMobile ? "12px" : "14px",
          fontWeight: isUnread ? 700 : 600,
          color: isUnread ? "#111" : "#9ca3af",
          lineHeight: 1.35,
        }}>
          {ann.subject}
        </p>

        {ann.description && (
          <p style={{
            margin: "3px 0 0", fontSize: isMobile ? "11px" : "12px", color: "#6b7280",
            lineHeight: 1.4, display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {ann.description}
          </p>
        )}

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          marginTop: isMobile ? "4px" : "6px",
          padding: isMobile ? "1px 6px" : "2px 8px",
          background: "#fff", color: "#000", borderRadius: "12px",
          fontSize: "10px", fontWeight: 600, textTransform: "capitalize",
          border: "1px solid #e2e8f0",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: notifType.tagColor }} />
          {typeLabel(notifType.type)}
        </div>
      </div>

     
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: isUnread ? "#2563eb" : "#9ca3af",
        flexShrink: 0, marginTop: 5,
        ...(isUnread ? { boxShadow: "0 0 0 2px #dbeafe" } : {}),
      }} />
    </div>
  );
};



const NotificationDetail = ({ ann, onClose }) => {
  const notifType = resolveType(ann);
  const date = ann.sent_at || ann.created_at;
  const formattedDate = formatDate(date);

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000, animation: "ntfFadeIn 0.2s ease" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", zIndex: 10001,
        width: "90%", maxWidth: "500px", maxHeight: "80vh",
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden",
        display: "flex", flexDirection: "column",
        animation: "ntfPopIn 0.3s cubic-bezier(0.34,1.4,0.64,1)",
      }}>
      
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: `linear-gradient(135deg, ${notifType.bg} 0%, #fff 100%)`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: notifType.color, display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "20px", fontWeight: 700,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              {avatarLetter(notifType.type)}
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {notifType.type}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", color: "#6b7280", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#6b7280"; }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

      
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: 700, color: "#111", lineHeight: 1.3 }}>{ann.subject}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6b7280" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {formattedDate}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: notifType.tagBg, color: notifType.tagColor, borderRadius: "12px", fontSize: "11px", fontWeight: 600, textTransform: "capitalize" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: notifType.tagColor }} />
              {typeLabel(notifType.type)}
            </div>
          </div>

          <div style={{ height: "1px", background: "#e2e8f0", margin: "20px 0" }} />

          {ann.creator_role && ann.creator_name && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#f8fafc", borderRadius: "8px", marginBottom: "20px" }}>
              {ann.creator_avatar ? (
                <img src={ann.creator_avatar} alt={ann.creator_name} style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: notifType.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, flexShrink: 0, fontSize: "14px" }}>
                  {ann.creator_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#111", fontWeight: 600 }}>{ann.creator_name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#6b7280", textTransform: "capitalize" }}>{ann.creator_role}</p>
              </div>
            </div>
          )}

          <div style={{ height: "1px", background: "#e2e8f0", margin: "20px 0" }} />

          {ann.description && (
            <>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Details</h3>
              <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#4b5563", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{ann.description}</p>
            </>
          )}

          {ann.attachments && ann.attachments.length > 0 && (
            <>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Attachments ({ann.attachments.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {ann.attachments.map((file, idx) => (
                  <a key={idx} href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${file.file_path}`} download={file.file_name}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", textDecoration: "none", color: "#2563eb", transition: "all 0.15s", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: "0 0 3px 0", fontSize: "13px", fontWeight: 500, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.file_name}</p>
                      <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>{formatFileSize(file.file_size)}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-7"/></svg>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

      
        <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", gap: "12px" }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "10px 16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#64748b", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};



const NotificationsModal = ({
  announcements = [],
  loading,
  error,
  onClose,
  anchorRef,
}) => {
  const [tab, setTab]           = useState("all");
  const [readIds, setReadIds]   = useState(getReadIds);
  const [pos, setPos]           = useState(null);
  const [closing, setClosing]   = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

 
  useEffect(() => {
    const isMobile = window.innerWidth < 480;

    if (isMobile) {
      // Centered horizontally, just below the nav bar
      setPos({ top: 64, isMobile: true });
    } else if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right + 16, isMobile: false });
    } else {
      setPos({ top: 64, right: 32, isMobile: false });
    }
  }, [anchorRef]);

 
  useEffect(() => {
    if (announcements.length) {
      markAllRead(announcements);
      setReadIds(getReadIds());
    }
  }, [announcements]);

  
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onClickOutside = (e) => {
      const panel = document.querySelector("[data-ntf]");
      const bell  = anchorRef?.current;
      if (panel && !panel.contains(e.target) && bell && !bell.contains(e.target)) onClose();
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

  const handleClose = () => { setClosing(true); setTimeout(() => onClose(), 200); };
  const handleRead  = (id) => { markAsRead(id); setReadIds(getReadIds()); };

  const unreadCount = announcements.filter((a) => !readIds.has(String(a.id))).length;
  const filtered    = tab === "unread"
    ? announcements.filter((a) => !readIds.has(String(a.id)))
    : announcements;

  if (!pos) return null;

 
  const panelPositionStyle = pos.isMobile
    ? {
        top: pos.top,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100vw - 24px)",
        maxWidth: "360px",
      }
    : {
        top: pos.top,
        right: pos.right,
        width: "360px",
        maxWidth: "calc(100vw - 32px)",
      };

  return (
    <>
   
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          animation: closing ? "ntfFadeOut 0.2s ease forwards" : "ntfFadeIn 0.15s ease",
        }}
      />

     
      <div
        data-ntf
        style={{
          position: "fixed",
          zIndex: 9999,
          ...panelPositionStyle,
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 12px 40px rgba(37,99,235,0.10), 0 2px 8px rgba(0,0,0,0.07)",
          overflow: "hidden",
          transformOrigin: pos.isMobile ? "top center" : "top right",
          animation: closing
            ? (pos.isMobile ? "ntfPopOutMobile 0.2s cubic-bezier(0.4,0,0.6,1) forwards" : "ntfPopOut 0.2s cubic-bezier(0.4,0,0.6,1) forwards")
            : (pos.isMobile ? "ntfPopInMobile 0.22s cubic-bezier(0.34,1.4,0.64,1)" : "ntfPopIn 0.22s cubic-bezier(0.34,1.4,0.64,1)"),
        }}
      >
        
        <div style={{
          padding: "12px 14px 10px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", letterSpacing: "-0.01em" }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span style={{ fontSize: "10px", fontWeight: 700, background: "#2563eb", color: "#fff", borderRadius: "99px", padding: "1px 7px", lineHeight: 1.6, letterSpacing: "0.02em" }}>
                {unreadCount} new
              </span>
            )}
          </div>

         
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "9px", padding: "3px", gap: "2px" }}>
            {["all", "unread"].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "4px 12px", fontSize: "11.5px", fontWeight: 600,
                borderRadius: "7px", border: "none", cursor: "pointer",
                background: tab === t ? "#2563eb" : "transparent",
                color: tab === t ? "#fff" : "#64748b",
                boxShadow: tab === t ? "0 1px 4px rgba(37,99,235,0.25)" : "none",
                transition: "all 0.15s", textTransform: "capitalize",
                display: "flex", alignItems: "center", gap: "5px", lineHeight: 1,
              }}>
                {t}
                {t === "unread" && unreadCount > 0 && (
                  <span style={{ fontSize: "10px", fontWeight: 700, background: tab === t ? "rgba(255,255,255,0.25)" : "#cbd5e1", color: tab === t ? "#fff" : "#475569", borderRadius: "99px", padding: "1px 5px", lineHeight: 1.4 }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxHeight: pos.isMobile ? "220px" : "360px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
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
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#dc2626" }}>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f8fafc", border: "1.5px dashed #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                {tab === "unread" ? "No unread notifications." : "You're all caught up."}
              </p>
            </div>
          ) : (
            filtered.map((ann) => (
              <NotifRow
                key={ann.id} ann={ann}
                isUnread={!readIds.has(String(ann.id))}
                onRead={handleRead}
                onSelect={setSelectedNotification}
                isMobile={pos.isMobile}
              />
            ))
          )}
        </div>

       
        {!loading && !error && announcements.length > 0 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", background: "#fff", display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={() => { markAllRead(announcements); setReadIds(getReadIds()); }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", fontSize: "12px", color: "#6b7280", fontWeight: 500, justifyContent: "flex-start", borderRadius: "6px", transition: "background 0.15s", flex: 1 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Mark all as read
            </button>

            <button
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px 16px", background: "#2563eb", border: "none", cursor: "pointer", fontSize: "12px", color: "#fff", fontWeight: 600, borderRadius: "8px", transition: "opacity 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View all notifications
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ntfFadeIn     { from{opacity:0} to{opacity:1} }
        @keyframes ntfFadeOut    { from{opacity:1} to{opacity:0} }
        @keyframes ntfPopIn      { from{opacity:0;transform:scale(0.91) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes ntfPopOut     { from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(0.91) translateY(-8px)} }
        @keyframes ntfPopInMobile  { from{opacity:0;transform:translateX(-50%) scale(0.91) translateY(-8px)} to{opacity:1;transform:translateX(-50%) scale(1) translateY(0)} }
        @keyframes ntfPopOutMobile { from{opacity:1;transform:translateX(-50%) scale(1) translateY(0)} to{opacity:0;transform:translateX(-50%) scale(0.91) translateY(-8px)} }
      `}</style>

      {selectedNotification && (
        <NotificationDetail ann={selectedNotification} onClose={() => setSelectedNotification(null)} />
      )}
    </>
  );
};

export { getReadIds };
export default NotificationsModal;