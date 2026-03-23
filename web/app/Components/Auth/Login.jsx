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
      backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1000,
      backdropFilter: "blur(4px)",
    },
    card: {
      backgroundColor: "#fff",
      padding: "40px 36px",
      borderRadius: "16px",
      boxShadow: "0 24px 64px rgba(0,48,135,0.18)",
      width: "100%", maxWidth: "430px",
      textAlign: "center", position: "relative",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    closeBtn: {
      position: "absolute", top: "14px", right: "16px",
      background: "none", border: "none", fontSize: "22px",
      cursor: "pointer", color: "#9ca3af",
      padding: "4px 8px", borderRadius: "6px",
    },
    logo: { width: "85px", height: "auto", display: "block", margin: "0 auto 16px" },
    heading: { fontSize: "24px", fontWeight: "700", color: "#003087", marginBottom: "4px" },
    subtext: { fontSize: "13px", color: "#6b7280", marginBottom: "24px" },
    googleWrapper: {
      width: "100%", display: "flex",
      justifyContent: "center", minHeight: "44px", alignItems: "center",
      flexDirection: "column",
    },
    errorBox: {
      backgroundColor: "#fef2f2", border: "1px solid #fecaca",
      borderRadius: "8px", padding: "10px 14px",
      marginBottom: "14px", color: "#dc2626",
      fontSize: "13.5px", textAlign: "left",
    },
    successBox: {
      backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
      borderRadius: "8px", padding: "10px 14px",
      marginBottom: "14px", color: "#16a34a",
      fontSize: "13.5px", textAlign: "left",
    },
    footer: { marginTop: "20px", fontSize: "14px", color: "#6b7280" },
    linkBtn: {
      color: "#003087", background: "none", border: "none",
      cursor: "pointer", fontWeight: "600", fontSize: "14px", padding: 0,
    },
    divider: {
      display: "flex", alignItems: "center", gap: "12px",
      margin: "0 0 20px", color: "#d1d5db", fontSize: "12px",
    },
    dividerLine: { flex: 1, height: "1px", backgroundColor: "#e5e7eb" },
  };

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .login-card { animation: slideUp 0.28s ease; }
        .login-close:hover { color:#374151!important; background:#f3f4f6; }
      `}</style>

      <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div style={S.card} className="login-card">

          <button className="login-close" onClick={onClose} style={S.closeBtn}>×</button>

          <img src="/assets/other/depdevlogo.png" alt="Logo" style={S.logo} />

          <h2 style={S.heading}>Welcome Back</h2>
          <p style={S.subtext}>Sign in with your Google account to continue</p>

          {error   && <div style={S.errorBox}>⚠ {error}</div>}
          {success && <div style={S.successBox}>✓ {success}</div>}

          {loading ? (
            <div style={{ color: "#6b7280", fontSize: "14px", padding: "12px 0" }}>
              Signing you in…
            </div>
          ) : GOOGLE_CLIENT_ID ? (
            <div style={S.googleWrapper}>
              <div ref={googleBtnRef} style={{ width: "100%", minHeight: "44px" }} />
            </div>
          ) : (
            <div style={{ color: "#dc2626", fontSize: "13px", padding: "12px 0" }}>
              Google Sign-In is not configured. Please contact administrator.
            </div>
          )}

          <p style={S.footer}>
            Do not have an account?{" "}
            <button onClick={onSwitchToRegister} style={S.linkBtn}>Register</button>
          </p>

        </div>
      </div>
    </>
  );
};

export default Login;