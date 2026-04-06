/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
};

const Login = ({ onClose, onSwitchToRegister, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const googleBtnRef = useRef(null);

  /* ── Load Google Identity Services ── */
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.log("Google Client ID not found");
      return;
    }

    console.log("Initializing Google Sign-In with Client ID:", GOOGLE_CLIENT_ID);

    const init = () => {
      console.log("Google script loaded, initializing...");
      if (!window.google || !googleBtnRef.current) {
        console.log("Google not available or ref not ready");
        return;
      }
      
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
      
      console.log("Rendering Google button");
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        width: googleBtnRef.current.offsetWidth || 340,
        text: "signin_with",
      });
    };

    const scriptId = "google-gsi-script";
    const existingScript = document.getElementById(scriptId);
    
    if (!existingScript) {
      console.log("Loading Google script...");
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google script loaded successfully");
        init();
      };
      script.onerror = () => {
        console.error("Failed to load Google script");
      };
      document.head.appendChild(script);
    } else if (window.google && window.google.accounts) {
      console.log("Google script already loaded");
      init();
    } else {
      console.log("Waiting for Google to load...");
      const iv = setInterval(() => { 
        if (window.google && window.google.accounts) { 
          console.log("Google now available");
          init(); 
          clearInterval(iv); 
        } 
      }, 150);
      return () => clearInterval(iv);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleCallback = async (response) => {
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess("Login successful!");
      setTimeout(() => {
        onSuccess?.(data);
        onClose?.();
      }, 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Styles ── */
  const S = {
    overlay: {
      position: "fixed", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1000,
      backdropFilter: "blur(8px)",
      webkitBackdropFilter: "blur(8px)",
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "36px 32px 32px",
      borderRadius: "20px",
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05) inset",
      width: "100%", maxWidth: "420px",
      textAlign: "center", position: "relative",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backdropFilter: "blur(24px)",
      maxHeight: "92vh",
      overflowY: "auto",
    },
    closeBtn: {
      position: "absolute", top: "16px", right: "16px",
      background: "#f4f4f4", border: "none", fontSize: "20px",
      cursor: "pointer", color: "#666",
      padding: "0", borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.2s ease", lineHeight: 1,
      width: "32px", height: "32px",
    },
    logo: { width: "120px", height: "auto", display: "block", margin: "0 auto 28px" },
    heading: { fontSize: "22px", fontWeight: "600", color: "#000000", marginBottom: "4px", letterSpacing: "-0.3px", lineHeight: "1.2" },
    subtext: { fontSize: "13px", color: "#5f6368", marginBottom: "20px", lineHeight: "1.5" },
    googleWrapper: {
      width: "100%", display: "flex",
      justifyContent: "center", minHeight: "50px", alignItems: "center",
      flexDirection: "column", position: "relative", marginBottom: "8px",
    },
    errorBox: {
      backgroundColor: "rgba(234,67,53,0.08)", border: "1px solid rgba(234,67,53,0.2)",
      borderRadius: "10px", padding: "12px 16px",
      marginBottom: "4px", color: "#d93025",
      fontSize: "12px", textAlign: "left",
    },
    successBox: {
      backgroundColor: "rgba(52,168,83,0.08)", border: "1px solid rgba(52,168,83,0.2)",
      borderRadius: "10px", padding: "12px 16px",
      marginBottom: "18px", color: "#0d652d",
      fontSize: "13px", textAlign: "left",
    },
    footer: { marginTop: "20px", fontSize: "13px", color: "#5f6368" },
    linkBtn: {
      color: "#1e3a8a", background: "none", border: "none",
      cursor: "pointer", fontWeight: "600", fontSize: "12px", padding: 0,
      transition: "color 0.2s ease",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
  };

  /* ── Google Icon ── */
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

        @keyframes fadeUp  {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        .login-modal-card {
          animation: fadeUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-close-btn:hover { background: rgba(0,0,0,0.08) !important; color: #1e3a8a !important; }

        .login-google-custom:hover:not(:disabled) {
          background: #e8eaed !important;
          transform: translateY(-1px);
          box-shadow: none !important;
        }
        .login-google-custom:active:not(:disabled) {
          transform: translateY(0);
        }
        .login-google-custom:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-link-btn:hover { color: #1e3a8a !important; }

        .login-overlay-bg {
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
        }
      `}</style>

      <div className="login-overlay-bg" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div style={S.card} className="login-modal-card">

          <button className="login-close-btn" onClick={onClose} style={S.closeBtn}>×</button>

          <img src="/assets/other/depdevlogo.png" alt="Logo" style={S.logo} />

          <h2 style={S.heading}>Login to DEPDev V Library</h2>
          <p style={S.subtext}>Sign in with your Google account</p>

          {error   && <div style={S.errorBox}>⚠ {error}</div>}
          {success && <div style={S.successBox}>✓ {success}</div>}

          {loading ? (
            <div style={{ color: "#5f6368", fontSize: "14px", padding: "12px 0" }}>
              Signing you in…
            </div>
          ) : GOOGLE_CLIENT_ID ? (
            <div style={S.googleWrapper}>
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
                className="login-google-custom"
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
            <div style={{ color: "#d93025", fontSize: "13px", padding: "12px 0" }}>
              Google Sign-In is not configured. Please contact administrator.
            </div>
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

          <p style={S.footer}>
            Don't have an account?{" "}
            <button onClick={onSwitchToRegister} className="login-link-btn" style={S.linkBtn}>Register</button>
          </p>

        </div>
      </div>
    </>
  );
};

export default Login;