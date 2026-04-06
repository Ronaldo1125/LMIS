"use client";

import React, { useState, useEffect, useRef } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

/* ── tiny jwt decoder (no library needed) ── */
const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
};

const Register = ({ onClose, onSwitchToLogin, onSuccess }) => {
  const [step, setStep] = useState("choose");

  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleProfile, setGoogleProfile]       = useState({ name: "", email: "", picture: "" });

  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [username, setUsername]   = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || step !== "choose") return;

    const init = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        width: googleBtnRef.current.offsetWidth || 340,
        text: "continue_with",
      });
    };

    const scriptId = "google-gsi-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.head.appendChild(script);
    } else if (window.google && window.google.accounts) {
      init();
    } else {
      const iv = setInterval(() => {
        if (window.google && window.google.accounts) { init(); clearInterval(iv); }
      }, 150);
      return () => clearInterval(iv);
    }
  }, [step]);

  const handleGoogleCallback = (response) => {
    setError("");
    const profile = decodeJwt(response.credential);
    setGoogleCredential(response.credential);
    setGoogleProfile({ name: profile.name || "", email: profile.email || "", picture: profile.picture || "" });
    setFullName(profile.name  || "");
    setEmail(profile.email    || "");
    setUsername((profile.email || "").split("@")[0].replace(/[^a-zA-Z0-9_]/g, ""));
    setStep("complete");
  };

  const goBack = () => {
    setStep("choose");
    setError(""); setSuccess("");
    setGoogleCredential(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!fullName.trim())  { setError("Please enter your full name."); return; }
    if (!username.trim())  { setError("Please choose a username."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/google/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: googleCredential,
          full_name: fullName,
          username: username.trim(),
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setError(data.message || "Account already exists. Please try logging in instead.");
      } else if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess("Account created successfully!");
        setTimeout(() => { onSuccess?.(data); onClose?.(); }, 900);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Back Arrow Icon ── */
  const BackArrowIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#666" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  );
  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        .reg-modal-card {
          animation: fadeUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .reg-close-btn:hover { background: rgba(0,0,0,0.08) !important; color: #1e3a8a !important; }
        .reg-back-btn:hover  { color: #1e3a8a !important; }

        .reg-google-custom:hover:not(:disabled) {
          background: #e8eaed !important;
          transform: translateY(-1px);
          box-shadow: none !important;
        }
        .reg-google-custom:active:not(:disabled) {
          transform: translateY(0);
        }
        .reg-google-custom:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .reg-input {
          width: 100%;
          padding: 13px 16px;
          border: 1px solid #dadce0;
          border-radius: 8px;
          font-size: 15px;
          box-sizing: border-box;
          color: "#3c4043";
          background: #f4f4f4;
          outline: none;
          transition: all 0.25s ease;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .reg-input::placeholder { color: #9aa0a6; }
        .reg-input:focus {
          outline: none;
          background: #f4f4f4;
        }
        .reg-input-locked {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f4f4f4 !important;
        }

        .reg-submit-btn:hover:not(:disabled) {
          background: #1e3a8a !important;
          transform: none;
          box-shadow: none !important;
        }
        .reg-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .reg-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .reg-link-btn:hover { color: #1e3a8a !important; }

        .reg-overlay-bg {
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
        }
      `}</style>

      <div className="reg-overlay-bg" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div
          className="reg-modal-card"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "420px",
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "20px",
            padding: "36px 32px 32px",
            textAlign: "center",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05) inset",
            backdropFilter: "blur(24px)",
            maxHeight: "92vh",
            overflowY: "auto",
          }}
        >
          {/* Close button */}
          <button
            className="reg-close-btn"
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "#f4f4f4",
              border: "none",
              color: "#666",
              fontSize: "20px",
              cursor: "pointer",
              width: "32px", height: "32px",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
              lineHeight: 1,
              padding: "0",
            }}
          >
            ×
          </button>

          {/* Back button (step 2) */}
          {step === "complete" && (
            <button
              className="reg-back-btn"
              onClick={goBack}
              style={{
                position: "absolute", top: "18px", left: "18px",
                background: "none", border: "none",
                color: "#666",
                cursor: "pointer",
                fontSize: "12px", fontWeight: "500",
                display: "flex", alignItems: "center", gap: "5px",
                transition: "color 0.2s ease",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                padding: "4px 8px",
              }}
            >
              <BackArrowIcon />
            </button>
          )}

          {/* ── Logo ── */}
          <img
            src="/assets/other/depdevlogo.png"
            alt="DEPDev Logo"
            style={{ width: "120px", height: "auto", display: "block", margin: "0 auto 28px" }}
          />

          {/* ══════ STEP 1: CHOOSE ══════ */}
          {step === "choose" && (
            <>
              <h2 style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#000000",
                margin: "0 0 4px",
                letterSpacing: "-0.3px",
              }}>
                Welcome to DEPDev V Library
              </h2>

              <p style={{
                fontSize: "13px",
                color: "#5f6368",
                margin: "0 0 20px",
                lineHeight: "1.5",
              }}>
                Register with your Google account
              </p>

              {error && (
                <div style={{
                  background: "rgba(234,67,53,0.08)",
                  border: "1px solid rgba(234,67,53,0.2)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "4px",
                  color: "#d93025",
                  fontSize: "12px",
                  textAlign: "left",
                }}>
                  ⚠ {error}
                </div>
              )}

              {/* Custom Google button (matches Kosmos style) */}
              {GOOGLE_CLIENT_ID ? (
                <div style={{ position: "relative", marginBottom: "8px" }}>
                  {/* Invisible real Google button on top */}
                  <div
                    ref={googleBtnRef}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      zIndex: 2,
                      cursor: "pointer",
                      overflow: "hidden",
                      borderRadius: "50px",
                    }}
                  />
                  {/* Visual button underneath */}
                  <button
                    className="reg-google-custom"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#f4f4f4",
                      border: "none",
                      borderRadius: "8px",
                      color: "#3c4043",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      transition: "all 0.25s ease",
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      letterSpacing: "0.1px",
                      boxShadow: "none",
                    }}
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>
                </div>
              ) : (
                <>
                  {/* Fallback: let the real Google button render */}
                  <div style={{ marginBottom: "8px" }}>
                    <div
                      ref={googleBtnRef}
                      style={{ width: "100%", minHeight: "50px", display: "flex", justifyContent: "center" }}
                    />
                  </div>
                </>
              )}

              <p style={{
                fontSize: "12px",
                color: "#5f6368",
                margin: "16px 0 0",
                lineHeight: "1.6",
              }}>
                By continuing, you agree to our{" "}
                <span style={{ color: "#1e3a8a", cursor: "pointer", textDecoration: "underline" }}>
                  Terms
                </span>
                {" "}and{" "}
                <span style={{ color: "#1e3a8a", cursor: "pointer", textDecoration: "underline" }}>
                  Privacy Policy
                </span>
                .
              </p>

              <p style={{ marginTop: "20px", fontSize: "13px", color: "#5f6368" }}>
                Already have an account?{" "}
                <button
                  className="reg-link-btn"
                  onClick={onSwitchToLogin}
                  style={{
                    color: "#1e3a8a",
                    background: "none", border: "none",
                    cursor: "pointer", fontWeight: "600",
                    fontSize: "12px", padding: 0,
                    transition: "color 0.2s ease",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                >
                  Login
                </button>
              </p>
            </>
          )}

          {/* ══════ STEP 2: COMPLETE PROFILE ══════ */}
          {step === "complete" && (
            <>
              <h2 style={{
                fontSize: "22px", fontWeight: "600", color: "#1e3a8a",
                margin: "0 0 4px", letterSpacing: "-0.3px",
              }}>
                Complete Your Profile
              </h2>

              <p style={{
                fontSize: "12px", color: "#5f6368",
                margin: "0 0 20px", lineHeight: "1.5",
              }}>
                Review and fill in the remaining details below
              </p>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                background: "#f8f9fa",
                border: "1px solid #e8eaed",
                borderRadius: "24px", padding: "5px 14px",
                fontSize: "12px", color: "#5f6368",
                marginBottom: "18px", fontWeight: "500",
              }}>
                <GoogleIcon /> Connected with Google
              </div>

              {error && (
                <div style={{
                  background: "rgba(234,67,53,0.08)", border: "1px solid rgba(234,67,53,0.2)",
                  borderRadius: "10px", padding: "12px 16px", marginBottom: "18px",
                  color: "#d93025", fontSize: "13px", textAlign: "left",
                }}>
                  ⚠ {error}
                </div>
              )}
              {success && (
                <div style={{
                  background: "rgba(52,168,83,0.08)", border: "1px solid rgba(52,168,83,0.2)",
                  borderRadius: "10px", padding: "12px 16px", marginBottom: "18px",
                  color: "#0d652d", fontSize: "13px", textAlign: "left",
                }}>
                  ✓ {success}
                </div>
              )}

              <form onSubmit={handleSubmit} autoComplete="off">
                {/* Full Name */}
                <div style={{ marginBottom: "12px", textAlign: "left" }}>
                  <label style={{
                    display: "block", fontSize: "11px", fontWeight: "600",
                    color: "#000000", marginBottom: "7px",
                    letterSpacing: "0.4px",
                    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}>
                    Full name
                  </label>
                  <input
                    className="reg-input"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Email — locked */}
                <div style={{ marginBottom: "12px", textAlign: "left" }}>
                  <label style={{
                    display: "block", fontSize: "11px", fontWeight: "600",
                    color: "#000000", marginBottom: "7px",
                    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}>
                    Email
                  </label>
                  <input
                    className="reg-input reg-input-locked"
                    type="email"
                    value={email}
                    readOnly
                    required
                  />
                </div>

                {/* Username */}
                <div style={{ marginBottom: "16px", textAlign: "left" }}>
                  <label style={{
                    display: "block", fontSize: "11px", fontWeight: "600",
                    color: "#000000", marginBottom: "7px",
                    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}>
                    Username
                  </label>
                  <input
                    className="reg-input"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="reg-submit-btn"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#1e3a8a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.25s ease",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    boxShadow: "none",
                  }}
                >
                  {loading && (
                    <span style={{
                      display: "inline-block", width: "15px", height: "15px",
                      border: "2px solid rgba(26,115,232,0.3)",
                      borderTop: "2px solid #fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }} />
                  )}
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
              </form>

              <p style={{ marginTop: "20px", fontSize: "13px", color: "#5f6368" }}>
                Already have an account?{" "}
                <button
                  className="reg-link-btn"
                  onClick={onSwitchToLogin}
                  style={{
                    color: "#1e3a8a",
                    background: "none", border: "none",
                    cursor: "pointer", fontWeight: "600",
                    fontSize: "12px", padding: 0,
                    transition: "color 0.2s ease",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;