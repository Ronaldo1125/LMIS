"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, RefreshCw } from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

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

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState(getReadIds());

  const ref = useRef(null);

  // ── FETCH ─────────────────────────────
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/announcements`);
      const data = await res.json();
      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ── OUTSIDE CLICK ─────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unread = announcements.filter(a => !readIds.has(String(a.id))).length;

  const handleClickNotif = (id) => {
    markAsRead(id);
    setReadIds(getReadIds());
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <Bell size={20} />

        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "red",
              color: "#fff",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "999px",
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {/* 🔻 DROPDOWN */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "120%",
            right: 0,
            width: "320px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            overflow: "hidden",
            zIndex: 100,
            animation: "fadeUp 0.2s ease",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>Notifications</p>

            <button
              onClick={fetchNotifications}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* BODY */}
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {loading ? (
              <p style={{ padding: "20px", textAlign: "center" }}>
                Loading...
              </p>
            ) : announcements.length === 0 ? (
              <p style={{ padding: "20px", textAlign: "center" }}>
                No notifications
              </p>
            ) : (
              announcements.map((a) => {
                const isUnread = !readIds.has(String(a.id));

                return (
                  <div
                    key={a.id}
                    onClick={() => handleClickNotif(a.id)}
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid #f1f1f1",
                      cursor: "pointer",
                      background: isUnread ? "#f9fafb" : "#fff",
                      transition: "0.15s",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: isUnread ? 600 : 400,
                        fontSize: "14px",
                      }}
                    >
                      {a.subject}
                    </p>

                    <span
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}