// ── DiceBear avatar URL builder ────────────────────────────────────────────
export const dicebearUrl = (seed) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

// ── Generate a random short seed string ───────────────────────────────────
export const randomSeed = () => Math.random().toString(36).substring(2, 10);

// ── Extract seed from either a full DiceBear URL or a plain seed string ───
export const extractSeed = (avatarValue) => {
  if (!avatarValue) return "default";
  try {
    const url = new URL(avatarValue);
    return url.searchParams.get("seed") || avatarValue;
  } catch {
    return avatarValue; // already a plain seed string
  }
};

// ── Persist user changes to whichever storage holds the user object ────────
export const persistUserChanges = (changes) => {
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

// ── Clear auth data and redirect to home ──────────────────────────────────
export const clearAuthAndRedirect = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.location.href = "/";
};

// ── Tailwind class maps ────────────────────────────────────────────────────
export const categoryClass = {
  Fiction:    "bg-blue-50 text-blue-600 border border-blue-200",
  Science:    "bg-emerald-50 text-emerald-600 border border-emerald-200",
  History:    "bg-amber-50 text-amber-600 border border-amber-200",
  Technology: "bg-violet-50 text-violet-600 border border-violet-200",
  default:    "bg-zinc-100 text-zinc-500 border border-zinc-200",
};

export const roleColorClass = {
  Admin:     "bg-red-50 text-red-600 border border-red-200",
  Librarian: "bg-violet-50 text-violet-600 border border-violet-200",
  Staff:     "bg-amber-50 text-amber-600 border border-amber-200",
  Patron:    "bg-blue-50 text-blue-600 border border-blue-200",
};

export const getCategoryClass = (cat) =>
  categoryClass[cat] || categoryClass.default;

export const getRoleClass = (role) =>
  roleColorClass[role] || "bg-zinc-100 text-zinc-500 border border-zinc-200";
