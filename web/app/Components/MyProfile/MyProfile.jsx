"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileTab from "./ProfileTab";
import BookmarkedTab from "./BookmarkedTab";
import { extractSeed, clearAuthAndRedirect } from "./utils/profileUtils";

export default function MyProfile({ onClose, user, onUserUpdate, initialTab = "profile" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

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

        <ProfileSidebar
          avatarSeed={avatarSeed}
          displayName={displayName}
          username={username}
          role={localUser?.role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        <div className="flex-1 relative p-10 overflow-y-auto bg-white">
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