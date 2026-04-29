import React from "react";
import { User, Bookmark, LogOut } from "lucide-react";
import { dicebearUrl, getRoleClass } from "./utils/profileUtils";

const MENU = [
  { id: "profile",    label: "Profile",    icon: User },
  { id: "bookmarked", label: "Bookmarked", icon: Bookmark },
];

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
    <div className="w-64 border-r border-gray-100 bg-white flex flex-col px-4 py-8 shrink-0">

      {/* Avatar + identity */}
      <div className="flex flex-col items-center text-center px-2 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-100 mb-4">
          <img src={dicebearUrl(avatarSeed)} alt="avatar" className="w-full h-full object-cover" />
        </div>
        <p className="text-sm font-semibold text-gray-800 truncate w-full leading-tight">
          {displayName}
        </p>
        <p className="text-xs text-gray-400 truncate w-full mt-1">
          @{username}
        </p>
        {role && (
          <span className={`mt-2.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full ${getRoleClass(role)}`}>
            {role}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 w-full">
        {MENU.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm rounded-lg text-left transition-all ${
              activeTab === id
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Icon
              size={16}
              strokeWidth={activeTab === id ? 2.2 : 1.8}
              className={activeTab === id ? "text-gray-800" : "text-gray-400"}
            />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto w-full">
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </div>

    </div>
  );
}