"use client";

import React from "react";
import { RefreshCw, Loader2, Check } from "lucide-react";
import { dicebearUrl } from "./utils/profileUtils";

export default function AvatarPicker({
  avatarSeed,
  suggestions,
  avatarChanged,
  avatarSaving,
  avatarSuccess,
  onPickSeed,
  onShuffle,
  onSave,
}) {
  return (
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
                onClick={() => onPickSeed(seed)}
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
              onClick={onShuffle}
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
            onClick={onSave}
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
  );
}