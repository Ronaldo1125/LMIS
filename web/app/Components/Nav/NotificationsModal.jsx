"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Paperclip, RefreshCw, Shield, BookOpen } from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

const formatFileSize = (bytes) => {
  if (bytes < 1024)    return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

// ── LocalStorage read-state helpers (exported so Nav can use them) ────────────
const STORAGE_KEY = "lmis_read_announcements";

export const getReadIds = () => {
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

export const markAllRead = (announcements) => {
  const ids = announcements.map((a) => String(a.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

// ── Role badge ────────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const isAdmin     = role === "admin";
  const label       = isAdmin ? "Admin" : "Librarian";
  const color       = isAdmin ? "#7c3aed" : "#0369a1";
  const bg          = isAdmin ? "rgba(124,58,237,0.08)" : "rgba(3,105,161,0.08)";
  const Icon        = isAdmin ? Shield : BookOpen;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.2rem",
      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em",
      textTransform: "uppercase", color, background: bg,
      borderRadius: "9999px", padding: "0.08rem 0.45rem",
    }}>
      <Icon size={9} />
      {label}
    </span>
  );
};

// ── Main modal ────────────────────────────────────────────────────────────────
const NotificationsModal = ({ announcements, loading, error, onClose, onRefresh }) => {
  const [expanded, setExpanded] = useState(null);
  const [readIds,  setReadIds]  = useState(getReadIds);

  // Mark all read on open
  useEffect(() => {
    if (announcements.length) {
      markAllRead(announcements);
      setReadIds(getReadIds());
    }
  }, [announcements]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
    markAsRead(id);
    setReadIds(getReadIds());
  };

  const unread = announcements.filter((a) => !readIds.has(String(a.id))).length;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(2px)",
          animation: "ntfFadeIn 0.18s ease",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 61,
        width: "min(400px, 100vw)",
        background: "#fafafa",
        display: "flex", flexDirection: "column",
        boxShadow: "-6px 0 36px rgba(25,18,101,0.12)",
        animation: "ntfSlideIn 0.22s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: "1.125rem 1.25rem 0.875rem",
          background: "#fff",
          borderBottom: "1px solid #ebebf0",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "9px",
                background: "rgba(25,18,101,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Bell size={16} color="rgb(25,18,101)" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.925rem", fontWeight: 700, color: "#0f0c2e", letterSpacing: "-0.015em" }}>
                  Notifications
                </p>
                <p style={{ margin: 0, fontSize: "0.68rem", color: "#9ca3af" }}>
                  {loading
                    ? "Loading…"
                    : `${announcements.length} total${unread > 0 ? ` · ${unread} unread` : ""}`}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.375rem" }}>
              <button
                onClick={onRefresh}
                title="Refresh"
                style={{
                  background: "none", border: "1px solid #e5e7eb",
                  cursor: "pointer", color: "#9ca3af",
                  padding: "0.3rem 0.45rem", borderRadius: "7px",
                  display: "flex", alignItems: "center",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgb(25,18,101)"; e.currentTarget.style.color = "rgb(25,18,101)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                <RefreshCw size={13} style={{ animation: loading ? "ntfSpin 1s linear infinite" : "none" }} />
              </button>
              <button
                onClick={onClose}
                style={{
                  background: "none", border: "1px solid #e5e7eb",
                  cursor: "pointer", color: "#6b7280",
                  padding: "0.3rem 0.45rem", borderRadius: "7px",
                  display: "flex", alignItems: "center",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#111"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}
              >
                <X size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.625rem" }}>
          {loading ? (
            <div style={{ padding: "3.5rem 0", textAlign: "center", color: "#9ca3af", fontSize: "0.85rem" }}>
              Loading notifications…
            </div>
          ) : error ? (
            <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
              <p style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{error}</p>
              <button
                onClick={onRefresh}
                style={{ fontSize: "0.75rem", color: "#ef4444", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "7px", padding: "0.35rem 0.875rem", cursor: "pointer" }}
              >
                Retry
              </button>
            </div>
          ) : announcements.length === 0 ? (
            <div style={{ padding: "4.5rem 0", textAlign: "center", color: "#c0c0cc" }}>
              <Bell size={30} style={{ margin: "0 auto 0.75rem", opacity: 0.2 }} />
              <p style={{ margin: 0, fontSize: "0.85rem" }}>You're all caught up.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {announcements.map((ann, i) => {
                const isOpen   = expanded === ann.id;
                const isUnread = !readIds.has(String(ann.id));
                const hasAtt   = ann.attachments?.length > 0;

                return (
                  <div
                    key={ann.id}
                    style={{
                      borderRadius: "10px",
                      border: `1px solid ${isOpen ? "rgba(25,18,101,0.15)" : "#e8e8f0"}`,
                      background: isUnread ? "#fff" : "#f9f9fb",
                      overflow: "hidden",
                      transition: "border-color 0.15s, background 0.15s",
                      animation: "ntfFadeUp 0.2s ease both",
                      animationDelay: `${i * 0.035}s`,
                    }}
                  >
                    {/* Row */}
                    <button
                      onClick={() => handleExpand(ann.id)}
                      style={{
                        width: "100%", background: "none", border: "none",
                        cursor: "pointer", padding: "0.75rem 0.875rem",
                        display: "flex", alignItems: "flex-start", gap: "0.6rem",
                        textAlign: "left",
                      }}
                    >
                      {/* Unread indicator */}
                      <div style={{ paddingTop: "5px", flexShrink: 0 }}>
                        <div style={{
                          width: "6px", height: "6px", borderRadius: "50%",
                          background: isUnread ? "rgb(25,18,101)" : "transparent",
                          border: isUnread ? "none" : "1.5px solid #d1d5db",
                          transition: "all 0.2s",
                        }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Subject */}
                        <p style={{
                          margin: 0,
                          fontSize: "0.845rem",
                          fontWeight: isUnread ? 700 : 500,
                          color: isUnread ? "#0f0c2e" : "#374151",
                          lineHeight: 1.35,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {ann.subject}
                        </p>

                        {/* Meta row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.3rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                            {formatDate(ann.sent_at || ann.created_at)}
                          </span>

                          {/* Role badge — who sent it */}
                          {ann.creator_role && <RoleBadge role={ann.creator_role} />}

                          {/* Attachment count */}
                          {hasAtt && (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.15rem", fontSize: "0.68rem", color: "#9ca3af" }}>
                              <Paperclip size={9} />
                              {ann.attachments.length}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Chevron */}
                      <svg
                        width="12" height="12" viewBox="0 0 24 24"
                        fill="none" stroke="#9ca3af" strokeWidth="2.5"
                        style={{
                          flexShrink: 0, marginTop: "4px",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.18s ease",
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div style={{
                        padding: "0 0.875rem 0.875rem 1.95rem",
                        borderTop: "1px solid #f0f0f5",
                        animation: "ntfFadeUp 0.15s ease",
                      }}>
                        <p style={{
                          margin: "0.625rem 0 0",
                          fontSize: "0.82rem", color: "#4b5563",
                          lineHeight: 1.72, whiteSpace: "pre-wrap",
                        }}>
                          {ann.description}
                        </p>

                        {/* Attachments */}
                        {hasAtt && (
                          <div style={{ marginTop: "0.75rem" }}>
                            <p style={{
                              margin: "0 0 0.35rem",
                              fontSize: "0.62rem", fontWeight: 700,
                              color: "#b0b0be", letterSpacing: "0.07em",
                              textTransform: "uppercase",
                            }}>
                              Attachments
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                              {ann.attachments.map((att) => (
                                <a
                                  key={att.id}
                                  href={`${API_BASE.replace("/api", "")}/${att.file_path.replace(/\\/g, "/")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  download={att.file_name}
                                  style={{
                                    display: "flex", alignItems: "center", gap: "0.4rem",
                                    fontSize: "0.75rem", color: "rgb(25,18,101)",
                                    background: "rgba(25,18,101,0.05)",
                                    border: "1px solid rgba(25,18,101,0.1)",
                                    borderRadius: "6px", padding: "0.3rem 0.6rem",
                                    textDecoration: "none", transition: "background 0.15s",
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = "rgba(25,18,101,0.1)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "rgba(25,18,101,0.05)"}
                                >
                                  <Paperclip size={11} style={{ flexShrink: 0 }} />
                                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {att.file_name}
                                  </span>
                                  <span style={{ color: "#9ca3af", flexShrink: 0 }}>
                                    {formatFileSize(att.file_size)}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && !error && announcements.length > 0 && (
          <div style={{
            padding: "0.625rem 1rem",
            borderTop: "1px solid #ebebf0",
            background: "#fff",
            flexShrink: 0,
          }}>
            <p style={{ margin: 0, fontSize: "0.67rem", color: "#c0c0cc", textAlign: "center" }}>
              Showing announcements addressed to you
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ntfFadeIn  { from { opacity: 0 }                          to { opacity: 1 } }
        @keyframes ntfSlideIn { from { transform: translateX(100%) }         to { transform: translateX(0) } }
        @keyframes ntfFadeUp  { from { opacity: 0; transform: translateY(5px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes ntfSpin    { to   { transform: rotate(360deg) } }
      `}</style>
    </>
  );
};

export default NotificationsModal;