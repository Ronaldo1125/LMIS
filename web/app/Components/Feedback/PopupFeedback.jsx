// Components/Feedback/PopupFeedback.jsx
"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const POPUP_DELAY_MS = 3 * 60 * 1000;

export default function PopupFeedback() {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("pfb_seen")) return;

    let timer = null;

    const handleFirstScroll = () => {
      timer = setTimeout(() => setVisible(true), POPUP_DELAY_MS);
      window.removeEventListener("scroll", handleFirstScroll);
    };

    window.addEventListener("scroll", handleFirstScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleFirstScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("pfb_seen", "true");
    setVisible(false);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    setError("");
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (response.ok) {
        sessionStorage.setItem("pfb_seen", "true");
        setSubmitted(true);
        setTimeout(() => setVisible(false), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to submit feedback");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        .pfb-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 9998;
          animation: pfb-fade-in 0.2s ease;
        }
        .pfb-card {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 9999;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          padding: 24px;
          width: 310px;
          animation: pfb-pop-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .pfb-close {
          position: absolute;
          top: 12px;
          right: 14px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #999;
          line-height: 1;
        }
        .pfb-close:hover { color: #333; }
        .pfb-label {
          font-size: 12px;
          color: #999;
          margin: 0 0 4px;
        }
        .pfb-title {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 18px;
        }
        .pfb-emojis {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 6px;
        }
        .pfb-emoji-btn {
          background: none;
          border: 2px solid transparent;
          font-size: 26px;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        }
        .pfb-emoji-btn:hover { transform: scale(1.15); background: #f0f0f0; }
        .pfb-emoji-btn.selected { border-color: #87CEEB; background: #e8f5fb; }
        .pfb-scale-labels {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #aaa;
          margin-bottom: 14px;
        }
        .pfb-textarea {
          width: 100%;
          min-height: 68px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 13px;
          font-family: inherit;
          resize: none;
          box-sizing: border-box;
          color: #333;
        }
        .pfb-textarea:focus { outline: none; border-color: #87CEEB; }
        .pfb-submit {
          width: 100%;
          margin-top: 12px;
          background: #87CEEB;
          color: #1a4a6b;
          border: none;
          border-radius: 8px;
          padding: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pfb-submit:hover { background: #6BB6D6; }
        .pfb-submit:disabled { opacity: 0.6; cursor: default; }
        .pfb-error { font-size: 11px; color: #dc2626; margin: 6px 0 0; }
        .pfb-thanks {
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          color: #1565c0;
          padding: 12px 0;
        }
        @keyframes pfb-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pfb-pop-in {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 480px) {
          .pfb-card {
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            border-radius: 14px 14px 0 0;
          }
        }
      `}</style>

      <div className="pfb-overlay" onClick={handleDismiss} />

      <div className="pfb-card">
        <button className="pfb-close" onClick={handleDismiss}>&#x2715;</button>

        {submitted ? (
          <p className="pfb-thanks">Thanks for your feedback! 🎉</p>
        ) : (
          <>
            <p className="pfb-label">Quick question</p>
            <p className="pfb-title">How's your experience so far?</p>

            <div className="pfb-emojis">
              {["😞", "😕", "😐", "😊", "😍"].map((emoji, i) => (
                <button
                  key={i}
                  className={`pfb-emoji-btn${rating === i + 1 ? " selected" : ""}`}
                  onClick={() => setRating(i + 1)}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="pfb-scale-labels">
              <span>Dissatisfied</span>
              <span>Satisfied</span>
            </div>

            <textarea
              className="pfb-textarea"
              placeholder="Any comments? (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {error && <p className="pfb-error">{error}</p>}

            <button
              className="pfb-submit"
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit feedback"}
            </button>
          </>
        )}
      </div>
    </>
  );
}