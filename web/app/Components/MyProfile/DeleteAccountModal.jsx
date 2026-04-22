"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

/**
 * Modal that asks the user to type their username before confirming deletion.
 *
 * @param {object}   props
 * @param {string}   props.username  - Username the user must type to confirm
 * @param {Function} props.onConfirm - Called when the user confirms deletion
 * @param {Function} props.onCancel  - Called when the user cancels
 * @param {boolean}  props.deleting  - Shows a loading spinner while true
 */
export default function DeleteAccountModal({ username, onConfirm, onCancel, deleting }) {
  const [confirmText, setConfirmText] = useState("");
  const isMatch = confirmText === username;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-white w-[420px] max-w-[92vw] rounded-xl border border-zinc-200 shadow-2xl overflow-hidden">
        {/* Header */}
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

        {/* Body */}
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

        {/* Footer */}
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