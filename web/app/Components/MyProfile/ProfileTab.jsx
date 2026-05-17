"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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

export default function ProfileTab({ user, onUserUpdate }) {
  const [avatarSeed, setAvatarSeed]       = useState(() => extractSeed(user?.avatar || user?.username || "default"));
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [avatarSaving, setAvatarSaving]   = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [suggestions, setSuggestions]     = useState(() => Array.from({ length: 5 }, randomSeed));

  const [editingField, setEditingField] = useState(null);
  const [fieldValues, setFieldValues]   = useState({
    fullName: user?.full_name || "",
    username: user?.username  || "",
    email:    user?.email     || "",
  });
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting]               = useState(false);
  const [deleteError, setDeleteError]         = useState(null);

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
    setFieldValues({
      fullName: user?.full_name || "",
      username: user?.username  || "",
      email:    user?.email     || "",
    });
  }, [user?.full_name, user?.username, user?.email]);

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
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleFieldSave = async (field) => {
    setSaving(true); setSaveError(null);
    try {
      const payload =
        field === "fullName"
          ? { full_name: fieldValues.fullName }
          : { username: fieldValues.username };
      const res = await authFetch(`/api/auth/${user?.id}/profile`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || "Failed");
      }
      persistUserChanges(payload);
      onUserUpdate?.({ ...user, ...payload });
      setEditingField(null);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFieldCancel = () => {
    setFieldValues((p) => ({
      ...p,
      fullName: user?.full_name || p.fullName,
      username: user?.username  || p.username,
    }));
    setEditingField(null);
    setSaveError(null);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true); setDeleteError(null);
    try {
      const res = await authFetch(`/api/auth/${user?.id}`, { method: "DELETE" });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || "Failed");
      }
      clearAuthAndRedirect();
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <style>{`
        .profile-scroll::-webkit-scrollbar { width: 2px; }
        .profile-scroll::-webkit-scrollbar-track { background: transparent; }
        .profile-scroll::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 99px; }
        .profile-scroll::-webkit-scrollbar-thumb:hover { background: #d1d1d5; }
        * { scrollbar-width: thin; scrollbar-color: #e4e4e7 transparent; }
      `}</style>

      {showDeleteModal && (
        <DeleteAccountModal
          username={fieldValues.username}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          deleting={deleting}
        />
      )}

      <div className="profile-scroll w-full max-w-xl flex flex-col gap-3">

        <div className="mb-1">
          <h2 className="text-base font-semibold text-zinc-800 mb-0.5">Profile</h2>
          <p className="text-xs text-zinc-400">Manage your personal information</p>
        </div>

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

        {user?.role && (
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg">
            <span className="text-xs text-zinc-400">Account type</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getRoleClass(user.role)}`}>
              {user.role}
            </span>
            {user.source && (
              <span className="ml-auto text-[10px] text-zinc-300 font-mono">{user.source}</span>
            )}
          </div>
        )}

        {saveError && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {saveError}
          </p>
        )}

        <Section title="Email">
          <FieldRow
            icon={
              <svg width="18" height="18" fill="none" stroke="#1e3a8a" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            }
            value={fieldValues.email}
            readonly
          />
        </Section>

        <Section title="Name">
          <FieldRow
            icon={
              <svg width="18" height="18" fill="none" stroke="#1e3a8a" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            }
            value={fieldValues.fullName}
            isEditing={editingField === "fullName"}
            saving={saving}
            onEdit={() => setEditingField("fullName")}
            onCancel={handleFieldCancel}
            onSave={() => handleFieldSave("fullName")}
            onChange={(v) => setFieldValues((p) => ({ ...p, fullName: v }))}
          />
        </Section>

        <Section title="Username">
          <FieldRow
            icon={
              <svg width="18" height="18" fill="none" stroke="#1e3a8a" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4"/>
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>
              </svg>
            }
            value={fieldValues.username}
            isEditing={editingField === "username"}
            saving={saving}
            onEdit={() => setEditingField("username")}
            onCancel={handleFieldCancel}
            onSave={() => handleFieldSave("username")}
            onChange={(v) => setFieldValues((p) => ({ ...p, username: v }))}
          />
        </Section>

        <div className="pt-4 mt-1 border-t border-zinc-100">
          <p className="text-xs uppercase tracking-widest text-zinc-300 font-medium mb-2">
            Danger zone
          </p>
          <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
            <div>
              <p className="text-xs font-medium text-red-600">Delete account</p>
              <p className="text-[10px] text-red-400 mt-0.5">
                Permanently remove your account and all data
              </p>
              {deleteError && (
                <p className="text-[10px] text-red-500 mt-0.5">{deleteError}</p>
              )}
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 text-red-500 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 rounded-lg transition-all ml-4 shrink-0"
            >
              Delete
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">{title}</p>
      {children}
    </div>
  );
}

function FieldRow({ icon, value, readonly, isEditing, saving, onEdit, onCancel, onSave, onChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      {!isEditing ? (
        <div className="flex items-center gap-3">
          <span className="text-gray-400 shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 mb-0.5">Primary</p>
            <p className="text-sm text-gray-800 font-medium leading-tight">{value}</p>
          </div>
          {!readonly && (
            <button
              onClick={onEdit}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
            >
              Edit
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-gray-400 shrink-0">{icon}</span>
            <p className="text-[10px] font-semibold text-gray-400">Primary</p>
            <div className="ml-auto flex items-center gap-3">
              <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
              >
                {saving && <Loader2 size={11} className="animate-spin" />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-gray-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      )}
    </div>
  );
}