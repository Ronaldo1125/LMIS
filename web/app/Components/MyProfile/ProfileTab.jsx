"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";
import AvatarPicker from "./AvatarPicker";
import DeleteAccountModal from "./DeleteAccountModal";
import { authFetch } from "./utils/authFetch";
import {
  dicebearUrl,
  randomSeed,
  extractSeed,
  persistUserChanges,
  clearAuthAndRedirect,
  getRoleClass,
} from "./utils/profileUtils";

/**
 * Full profile editing panel: avatar picker, name/username fields,
 * role badge, and danger-zone delete.
 *
 * @param {object}   props
 * @param {object}   props.user         - Current user object from auth state
 * @param {Function} props.onUserUpdate - Called with the merged updated user object
 */
export default function ProfileTab({ user, onUserUpdate }) {
  // ── Avatar state ──────────────────────────────────────────────────────────
  const [avatarSeed, setAvatarSeed]       = useState(() => extractSeed(user?.avatar || user?.username || "default"));
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [avatarSaving, setAvatarSaving]   = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [suggestions, setSuggestions]     = useState(() => Array.from({ length: 5 }, randomSeed));

  // ── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    username: user?.username  || "",
    email:    user?.email     || "",
  });
  const [isEditing, setIsEditing]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Delete state ──────────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting]               = useState(false);
  const [deleteError, setDeleteError]         = useState(null);

  // ── Sync with prop changes (e.g. after re-login) ──────────────────────────
  useEffect(() => {
    if (user?.avatar) {
      setAvatarSeed(extractSeed(user.avatar));
      setAvatarChanged(false);
    } else if (user?.username) {
      setAvatarSeed(user.username);
      setAvatarChanged(false);
    }
  }, [user?.avatar, user?.username]);

  useEffect(() => {
    setFormData({
      fullName: user?.full_name || "",
      username: user?.username  || "",
      email:    user?.email     || "",
    });
  }, [user?.full_name, user?.username, user?.email]);

  // ── Avatar handlers ───────────────────────────────────────────────────────
  const savedAvatarSeed = extractSeed(user?.avatar || user?.username || "default");

  const handlePickSeed = (seed) => {
    setAvatarSeed(seed);
    setAvatarChanged(seed !== savedAvatarSeed);
    setAvatarSuccess(false);
  };

  const handleShuffleSuggestions = () =>
    setSuggestions(Array.from({ length: 5 }, randomSeed));

  const handleSaveAvatar = async () => {
    setAvatarSaving(true);
    try {
      const fullAvatarUrl = dicebearUrl(avatarSeed);
      const res = await authFetch(`/api/auth/${user?.id}/profile`, {
        method: "PATCH",
        body: JSON.stringify({ avatar: fullAvatarUrl }),
      });
      if (!res.ok) throw new Error();
      persistUserChanges({ avatar: fullAvatarUrl });
      onUserUpdate?.({ ...user, avatar: fullAvatarUrl });
      setAvatarChanged(false);
      setAvatarSuccess(true);
      setTimeout(() => setAvatarSuccess(false), 3000);
    } catch {
      // surface error toast here if desired
    } finally {
      setAvatarSaving(false);
    }
  };

  // ── Profile form handlers ─────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsEditing(true);
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleClear = () => {
    setFormData({
      fullName: user?.full_name || "",
      username: user?.username  || "",
      email:    user?.email     || "",
    });
    setIsEditing(false);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await authFetch(`/api/auth/${user?.id}/profile`, {
        method: "PATCH",
        body: JSON.stringify({ full_name: formData.fullName, username: formData.username }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save.");
      }
      const updatedFields = { full_name: formData.fullName, username: formData.username };
      persistUserChanges(updatedFields);
      onUserUpdate?.({ ...user, ...updatedFields });
      setSaveSuccess(true);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete handlers ───────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await authFetch(`/api/auth/${user?.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete account.");
      }
      clearAuthAndRedirect();
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {showDeleteModal && (
        <DeleteAccountModal
          username={formData.username}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          deleting={deleting}
        />
      )}

      <div className="max-w-md">
        <h2 className="text-base font-semibold text-zinc-800 mb-1">Profile</h2>
        <p className="text-xs text-zinc-400 mb-6">Manage your personal information</p>

        <AvatarPicker
          avatarSeed={avatarSeed}
          suggestions={suggestions}
          avatarChanged={avatarChanged}
          avatarSaving={avatarSaving}
          avatarSuccess={avatarSuccess}
          onPickSeed={handlePickSeed}
          onShuffle={handleShuffleSuggestions}
          onSave={handleSaveAvatar}
        />

        {/* Role badge */}
        {user?.role && (
          <div className="flex items-center gap-2 mb-6 p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
            <span className="text-xs text-zinc-400">Account type</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getRoleClass(user.role)}`}>
              {user.role}
            </span>
            {user.source && (
              <span className="ml-auto text-[10px] text-zinc-300 font-mono">{user.source}</span>
            )}
          </div>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-5">
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Username",  name: "username",  type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                {label}
              </label>
              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                className="w-full bg-white border border-zinc-200 text-zinc-800 text-sm px-4 py-2.5 rounded-md outline-none focus:border-zinc-400 transition-colors"
              />
            </div>
          ))}

          {/* Email — read-only */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Email
            </label>
            <div className="w-full bg-zinc-50 border border-zinc-200 text-zinc-400 text-sm px-4 py-2.5 rounded-md cursor-not-allowed select-none">
              {formData.email}
            </div>
            <p className="text-[10px] text-zinc-300">Email address cannot be changed</p>
          </div>
        </div>

        {/* Feedback messages */}
        {saveError && (
          <p className="mt-4 text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {saveError}
          </p>
        )}
        {saveSuccess && (
          <p className="mt-4 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
            Profile updated successfully.
          </p>
        )}
        {deleteError && (
          <p className="mt-4 text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {deleteError}
          </p>
        )}

        {/* Danger zone */}
        <div className="mt-10 pt-6 border-t border-zinc-100">
          <p className="text-xs uppercase tracking-widest text-zinc-300 font-medium mb-3">
            Danger zone
          </p>
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
            <div>
              <p className="text-xs font-medium text-red-600">Delete account</p>
              <p className="text-[10px] text-red-400 mt-0.5">
                Permanently remove your account and all data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 text-red-500 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 rounded-lg transition-all"
            >
              <Trash2 size={11} />
              Delete
            </button>
          </div>
        </div>

        {/* Sticky save / clear bar */}
        {isEditing && (
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button
              onClick={handleClear}
              disabled={saving}
              className="px-4 py-2 text-sm border border-zinc-200 text-zinc-500 rounded-lg hover:border-zinc-300 transition-colors disabled:opacity-40"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {saving && <Loader2 size={13} className="animate-spin" />}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
