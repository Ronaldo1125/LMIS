"use client";

import React from "react";
import { User, Bookmark, LogOut } from "lucide-react";
import { dicebearUrl, getRoleClass } from "./utils/profileUtils";

const MENU = [
  { id: "profile",    label: "Profile",    icon: User },
  { id: "bookmarked", label: "Bookmarked", icon: Bookmark },
];

/**
 * Left sidebar with avatar, display name, role badge, nav links, and logout.
 *
 * @param {object}   props
 * @param {string}   props.avatarSeed  - Seed used to render the avatar
 * @param {string}   props.displayName - Full name or username to show
 * @param {string}   props.username    - @ handle
 * @param {string}   props.role        - User role (Admin / Librarian / Patron / …)
 * @param {string}   props.activeTab   - Currently active tab id
 * @param {Function} props.onTabChange - Called with the new tab id
 * @param {Function} props.onLogout    - Called when Logout is clicked
 */
export default function ProfileSidebar({
  avatarSeed,
  displayName,
  username,
  role,
  activeTab,
  onTabChange,
  onLogout,
}) {
  return (
    <div className="w-56 border-r border-zinc-100 bg-zinc-50 flex flex-col items-center px-4 py-7 shrink-0">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-zinc-100 border-2 border-zinc-200 overflow-hidden mb-4">
        <img src={dicebearUrl(avatarSeed)} alt="avatar" className="w-full h-full object-cover" />
      </div>

      {/* Name / username */}
      <p className="text-sm font-semibold text-zinc-700 truncate max-w-[152px] text-center leading-tight">
        {displayName}
      </p>
      <p className="text-xs text-zinc-400 mb-1 text-center truncate max-w-[152px]">
        @{username}
      </p>

      {/* Role badge */}
      {role && (
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full mb-6 ${getRoleClass(role)}`}>
          {role}
        </span>
      )}

      {/* Nav */}
      <nav className="w-full flex flex-col gap-0.5">
        {MENU.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg text-left transition-colors ${
              activeTab === id
                ? "bg-white text-zinc-800 font-medium shadow-sm border border-zinc-200"
                : "text-zinc-400 hover:text-zinc-600 hover:bg-white/60"
            }`}
          >
            <Icon size={15} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-zinc-100 w-full">
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </div>
  );
}