"use client";

import React, { useState, useEffect } from "react";
import { X, User, Bookmark, LogOut, BookOpen, Loader2, RefreshCw, Check, Trash2, AlertTriangle } from "lucide-react";

const dicebearUrl = (seed) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const authFetch = (path, options = {}) =>
  fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

const randomSeed = () => Math.random().toString(36).substring(2, 10);

const persistUserChanges = (changes) => {
  for (const storage of [localStorage, sessionStorage]) {
    const raw = storage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        storage.setItem("user", JSON.stringify({ ...parsed, ...changes }));
      } catch {}
    }
  }
};

// ── Extract seed from either a full DiceBear URL or a plain seed string ────
const extractSeed = (avatarValue) => {
  if (!avatarValue) return "default";
  try {
    const url = new URL(avatarValue);
    return url.searchParams.get("seed") || avatarValue;
  } catch {
    return avatarValue; // already a plain seed string
  }
};

// ── Delete Confirmation Modal ──────────────────────────────────────────────
function DeleteAccountModal({ username, onConfirm, onCancel, deleting }) {
  const [confirmText, setConfirmText] = useState("");
  const isMatch = confirmText === username;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-white w-[420px] max-w-[92vw] rounded-xl border border-zinc-200 shadow-2xl overflow-hidden">
        <div className="bg-red-50 border-b border-red-100 px-6 py-5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-700">Delete account</h3>
            <p className="text-xs text-red-500 mt-0.5 leading-relaxed">
              This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-xs text-zinc-500 leading-relaxed mb-4">
            Deleting your account will permanently remove all your data, bookmarks, and activity
            history. To confirm, type your username below:
          </p>
          <div className="mb-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium block mb-1.5">
              Type <span className="font-semibold text-zinc-600">{username}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={username}
              autoFocus
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 text-sm px-3 py-2.5 rounded-md outline-none focus:border-red-300 focus:bg-white transition-colors placeholder:text-zinc-300"
            />
          </div>
          {confirmText.length > 0 && !isMatch && (
            <p className="text-[10px] text-red-400 mt-1.5">Username doesn&apos;t match</p>
          )}
        </div>

        <div className="px-6 pb-5 flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 text-sm border border-zinc-200 text-zinc-500 rounded-lg hover:border-zinc-300 hover:text-zinc-700 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isMatch || deleting}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-30 flex items-center gap-2"
          >
            {deleting && <Loader2 size={13} className="animate-spin" />}
            {deleting ? "Deleting…" : "Delete my account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function MyProfile({ onClose, user, onUserUpdate }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [avatarSeed, setAvatarSeed] = useState(
    () => extractSeed(user?.avatar || user?.username || "default")
  );
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);

  const [suggestions, setSuggestions] = useState(() =>
    Array.from({ length: 5 }, randomSeed)
  );

  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    username: user?.username || "",
    email:    user?.email    || "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting]               = useState(false);
  const [deleteError, setDeleteError]         = useState(null);

  const [bookmarks, setBookmarks]               = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [bookmarksError, setBookmarksError]     = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const menu = [
    { id: "profile",    label: "Profile",    icon: User },
    { id: "bookmarked", label: "Bookmarked", icon: Bookmark },
  ];

  // ── FIX: Sync avatarSeed whenever user.avatar changes (e.g. after re-login) ──
  useEffect(() => {
    if (user?.avatar) {
      setAvatarSeed(extractSeed(user.avatar));
      setAvatarChanged(false);
    } else if (user?.username) {
      setAvatarSeed(user.username);
      setAvatarChanged(false);
    }
  }, [user?.avatar, user?.username]);

  // ── FIX: Sync formData whenever user prop changes (e.g. after re-login) ──
  useEffect(() => {
    setFormData({
      fullName: user?.full_name || "",
      username: user?.username  || "",
      email:    user?.email     || "",
    });
  }, [user?.full_name, user?.username, user?.email]);

  // ── Bookmarks ────────────────────────────────────────────────────────────
  const fetchBookmarks = async (page = 1) => {
    setBookmarksLoading(true);
    setBookmarksError(null);
    try {
      const res = await authFetch(`/api/bookmarks?page=${page}&limit=8`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookmarks(data.bookmarks);
      setPagination(data.pagination);
    } catch {
      setBookmarksError("Could not load bookmarks.");
    } finally {
      setBookmarksLoading(false);
    }
  };

  const removeBookmark = async (bookId) => {
    try {
      await authFetch(`/api/bookmarks/${bookId}`, { method: "DELETE" });
      setBookmarks((prev) => prev.filter((b) => b.id !== bookId));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch {}
  };

  useEffect(() => {
    if (activeTab === "bookmarked") fetchBookmarks(1);
  }, [activeTab]);

  // ── Avatar ───────────────────────────────────────────────────────────────
  const savedAvatarSeed = extractSeed(user?.avatar || user?.username || "default");

  const handlePickSeed = (seed) => {
    setAvatarSeed(seed);
    setAvatarChanged(seed !== savedAvatarSeed);
    setAvatarSuccess(false);
  };

  const handleShuffleSuggestions = () => {
    setSuggestions(Array.from({ length: 5 }, randomSeed));
  };

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
      // add a toast here if you want visible error feedback
    } finally {
      setAvatarSaving(false);
    }
  };

  // ── Profile form ─────────────────────────────────────────────────────────
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
        body: JSON.stringify({
          full_name: formData.fullName,
          username:  formData.username,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save.");
      }

      const updatedFields = {
        full_name: formData.fullName,
        username:  formData.username,
      };

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

  // ── Delete account ───────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await authFetch(`/api/auth/${user?.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete account.");
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const categoryClass = {
    Fiction:    "bg-blue-50 text-blue-600 border border-blue-200",
    Science:    "bg-emerald-50 text-emerald-600 border border-emerald-200",
    History:    "bg-amber-50 text-amber-600 border border-amber-200",
    Technology: "bg-violet-50 text-violet-600 border border-violet-200",
    default:    "bg-zinc-100 text-zinc-500 border border-zinc-200",
  };
  const getCat       = (cat)  => categoryClass[cat] || categoryClass.default;
  const roleColor    = {
    Admin:     "bg-red-50 text-red-600 border border-red-200",
    Librarian: "bg-violet-50 text-violet-600 border border-violet-200",
    Staff:     "bg-amber-50 text-amber-600 border border-amber-200",
    Patron:    "bg-blue-50 text-blue-600 border border-blue-200",
  };
  const getRoleClass = (role) => roleColor[role] || "bg-zinc-100 text-zinc-500 border border-zinc-200";

  // ── Render ────────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {

      case "profile":
        return (
          <div className="max-w-md">
            <h2 className="text-base font-semibold text-zinc-800 mb-1">Profile</h2>
            <p className="text-xs text-zinc-400 mb-6">Manage your personal information</p>

            {/* Avatar picker */}
            <div className="mb-7 p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-3">Avatar</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-zinc-200 overflow-hidden shrink-0 ring-2 ring-offset-2 ring-zinc-300">
                  <img src={dicebearUrl(avatarSeed)} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    {suggestions.map((seed) => (
                      <button
                        key={seed}
                        onClick={() => handlePickSeed(seed)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                          avatarSeed === seed
                            ? "border-zinc-700 scale-110"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        <img src={dicebearUrl(seed)} alt="option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    <button
                      onClick={handleShuffleSuggestions}
                      className="w-9 h-9 rounded-full border-2 border-dashed border-zinc-200 hover:border-zinc-400 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400">Pick one or shuffle for more options</p>
                </div>
              </div>

              {avatarChanged && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleSaveAvatar}
                    disabled={avatarSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-40"
                  >
                    {avatarSaving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                    {avatarSaving ? "Saving…" : "Apply avatar"}
                  </button>
                </div>
              )}
              {avatarSuccess && (
                <p className="mt-2 text-xs text-emerald-600 text-right">Avatar updated!</p>
              )}
            </div>

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
                  <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium">{label}</label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 text-zinc-800 text-sm px-4 py-2.5 rounded-md outline-none focus:border-zinc-400 transition-colors"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Email</label>
                <div className="w-full bg-zinc-50 border border-zinc-200 text-zinc-400 text-sm px-4 py-2.5 rounded-md cursor-not-allowed select-none">
                  {formData.email}
                </div>
                <p className="text-[10px] text-zinc-300">Email address cannot be changed</p>
              </div>
            </div>

            {saveError && (
              <p className="mt-4 text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">{saveError}</p>
            )}
            {saveSuccess && (
              <p className="mt-4 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">Profile updated successfully.</p>
            )}
            {deleteError && (
              <p className="mt-4 text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">{deleteError}</p>
            )}

            {/* Danger zone */}
            <div className="mt-10 pt-6 border-t border-zinc-100">
              <p className="text-xs uppercase tracking-widest text-zinc-300 font-medium mb-3">Danger zone</p>
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-red-600">Delete account</p>
                  <p className="text-[10px] text-red-400 mt-0.5">Permanently remove your account and all data</p>
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
          </div>
        );

      case "bookmarked":
        return (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-zinc-800">Bookmarked</h2>
              {pagination.total > 0 && (
                <span className="text-xs text-zinc-500 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full">
                  {pagination.total} saved
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mb-6">Your saved books</p>

            {bookmarksLoading && (
              <div className="flex flex-col gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-zinc-100 rounded-lg animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
                ))}
              </div>
            )}

            {bookmarksError && (
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">{bookmarksError}</div>
            )}

            {!bookmarksLoading && !bookmarksError && bookmarks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-56 gap-3">
                <BookOpen size={34} strokeWidth={1.4} className="text-zinc-200" />
                <p className="text-sm text-zinc-400">No bookmarks yet</p>
                <p className="text-xs text-zinc-300">Books you save will appear here</p>
              </div>
            )}

            {!bookmarksLoading && bookmarks.length > 0 && (
              <>
                <div className="flex flex-col gap-2">
                  {bookmarks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-start gap-3 px-4 py-3 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1.5">
                          <p className="text-sm font-medium text-zinc-700 leading-snug flex-1">{book.title}</p>
                          {book.has_digital_copy && (
                            <span className="shrink-0 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">Digital</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-zinc-400">{book.author}</span>
                          {book.category && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${getCat(book.category)}`}>{book.category}</span>
                          )}
                          {book.call_number && (
                            <span className="text-[10px] text-zinc-400 font-mono">{book.call_number}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeBookmark(book.id)}
                        className="shrink-0 mt-0.5 p-1 rounded text-zinc-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-5">
                    <button
                      onClick={() => fetchBookmarks(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 text-zinc-500 rounded-md text-sm disabled:opacity-30 hover:border-zinc-400 transition-colors"
                    >←</button>
                    <span className="text-xs text-zinc-400">{pagination.page} / {pagination.totalPages}</span>
                    <button
                      onClick={() => fetchBookmarks(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 text-zinc-500 rounded-md text-sm disabled:opacity-30 hover:border-zinc-400 transition-colors"
                    >→</button>
                  </div>
                )}
              </>
            )}
          </div>
        );
    }
  };

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

      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-[900px] max-w-[95vw] h-[620px] flex border border-zinc-200 shadow-2xl rounded-xl overflow-hidden">

          {/* Sidebar */}
          <div className="w-56 border-r border-zinc-100 bg-zinc-50 flex flex-col items-center px-4 py-7 shrink-0">
            <div className="w-20 h-20 rounded-full bg-zinc-100 border-2 border-zinc-200 overflow-hidden mb-4">
              <img src={dicebearUrl(avatarSeed)} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-semibold text-zinc-700 truncate max-w-[152px] text-center leading-tight">
              {formData.fullName || formData.username}
            </p>
            <p className="text-xs text-zinc-400 mb-1 text-center truncate max-w-[152px]">@{formData.username}</p>
            {user?.role && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full mb-6 ${getRoleClass(user.role)}`}>
                {user.role}
              </span>
            )}

            <nav className="w-full flex flex-col gap-0.5">
              {menu.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
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

            <div className="mt-auto pt-4 border-t border-zinc-100 w-full">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
              >
                <LogOut size={15} strokeWidth={1.8} />
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative p-10 overflow-y-auto bg-white">
            <button onClick={onClose} className="absolute top-5 right-5 text-zinc-300 hover:text-zinc-600 transition-colors">
              <X size={18} />
            </button>

            {renderContent()}

            {isEditing && activeTab === "profile" && (
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
        </div>
      </div>
    </>
  );
}