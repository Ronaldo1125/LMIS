"use client";

import React, { useState } from "react";
import { X, User, Shield, Lock, Download, Bookmark, Edit2, LogOut } from "lucide-react";

export default function MyProfile({ onClose, user }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.full_name || "Anton",
    username: user?.username || "anton234",
    email: user?.email || "",
    birthday: "",
    country: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const menu = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Shield },
    { id: "password", label: "Password", icon: Lock },
    { id: "downloads", label: "Downloads", icon: Download },
    { id: "bookmarked", label: "Bookmarked", icon: Bookmark },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsEditing(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleClear = () => {
    setFormData({
      fullName: user?.full_name || "Anton",
      username: user?.username || "anton234",
      email: user?.email || "",
      birthday: "",
      country: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setAvatar(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saving data:", formData);
    if (avatar) {
      console.log("Avatar changed");
    }
    setIsEditing(false);
    // You could add a success message here
  };

  const Input = ({ label, ...props }) => (
    <div className="space-y-1">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition"
      />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="max-w-xl space-y-8">
            <h2 className="text-2xl font-semibold">Profile</h2>

            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        );

      case "account":
        return (
          <div className="max-w-xl space-y-8">
            <h2 className="text-2xl font-semibold">Account</h2>

            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Birthday"
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
            />

            <div className="space-y-1">
              <label className="text-sm text-gray-500">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black"
              >
                <option value="">Select country</option>
                <option value="PH">Philippines</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>

            <button className="text-red-600 text-sm hover:underline pt-2">
              Close Account
            </button>
          </div>
        );

      case "password":
        return (
          <div className="max-w-xl space-y-8">
            <h2 className="text-2xl font-semibold">Password</h2>

            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />

            <Input
              label="Confirm new password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        );

      case "downloads":
        return (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <Download size={40} className="mb-4" />
            <p>No downloads yet</p>
          </div>
        );

      case "bookmarked":
        return (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <Bookmark size={40} className="mb-4" />
            <p>No bookmarks yet</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[950px] max-w-[95vw] h-[640px] shadow-2xl flex">

        {/* Sidebar */}
        <div className="w-[240px] border-r bg-gray-50 flex flex-col items-center p-6">

          {/* Avatar */}
          <div className="relative mb-10">

            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-red-400 overflow-hidden flex items-center justify-center">
              {avatar && (
                <img
                  src={avatar}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <button
              onClick={() => document.getElementById("avatarUpload").click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center shadow hover:bg-pink-300 transition"
            >
              <Edit2 size={14} />
            </button>

            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

          </div>

          {/* Menu */}
          <nav className="w-full space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left transition ${
                    activeTab === item.id
                      ? "bg-gray-200 font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left transition hover:bg-gray-100 text-gray-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

        </div>

        {/* Content */}
        <div className="flex-1 relative p-10 overflow-y-auto">

          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>

          {renderContent()}

          {/* Clear and Save Buttons */}
          {isEditing && (
            <div className="absolute bottom-6 right-6 flex gap-2">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Clear
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Save
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}