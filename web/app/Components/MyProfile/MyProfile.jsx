"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileTab from "./ProfileTab";
import BookmarkedTab from "./BookmarkedTab";
import { extractSeed, clearAuthAndRedirect } from "./utils/profileUtils";

/**
 * Top-level profile modal. Owns only tab selection and the close / logout
 * actions; all per-tab logic lives in the dedicated tab components.
 *
 * @param {object}   props
 * @param {Function} props.onClose      - Called when the modal should close
 * @param {object}   props.user         - Current user from auth state
 * @param {Function} props.onUserUpdate - Called with the updated user object
 */
export default function MyProfile({ onClose, user, onUserUpdate }) {
  const [activeTab, setActiveTab] = useState("profile");

  // Keep sidebar avatar in sync with the latest user object (updated by ProfileTab)
  const [localUser, setLocalUser] = useState(user);

  const handleUserUpdate = (updated) => {
    setLocalUser(updated);
    onUserUpdate?.(updated);
  };

  const handleLogout = () => clearAuthAndRedirect();

  const avatarSeed    = extractSeed(localUser?.avatar || localUser?.username || "default");
  const displayName   = localUser?.full_name || localUser?.username || "";
  const username      = localUser?.username || "";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-w-[95vw] h-[620px] flex border border-zinc-200 shadow-2xl rounded-xl overflow-hidden">

        {/* Sidebar */}
        <ProfileSidebar
          avatarSeed={avatarSeed}
          displayName={displayName}
          username={username}
          role={localUser?.role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Main content area */}
        <div className="flex-1 relative p-10 overflow-y-auto bg-white">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-300 hover:text-zinc-600 transition-colors"
          >
            <X size={18} />
          </button>

          {activeTab === "profile" && (
            <ProfileTab user={localUser} onUserUpdate={handleUserUpdate} />
          )}

          {activeTab === "bookmarked" && <BookmarkedTab onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}