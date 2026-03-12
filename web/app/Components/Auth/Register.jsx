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
  /* step: "choose" | "complete" */
  const [step, setStep] = useState("choose");

  /* google data carried into step 2 */
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleProfile, setGoogleProfile]       = useState({ name: "", email: "", picture: "" });

  /* form fields */
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [username, setUsername]   = useState("");

  /* ui state */
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const googleBtnRef = useRef(null);

  /* ── Load Google Identity Services ── */
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || step !== "choose") {
      if (!GOOGLE_CLIENT_ID) {
        console.log("Google Client ID not found");
      }
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
        text: "continue_with",
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
  }, [step]);

  /* ── Step 1 → Step 2 via Google ── */
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

  /* ── Final submit ── */
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
      if (!res.ok) throw new Error(data.message || "Registration failed.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess("Account created successfully!");
      setTimeout(() => {
        onSuccess?.(data);
        onClose?.();          // ← close the modal after success
      }, 900);
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
      maxHeight: "92vh", overflowY: "auto",
    },
    closeBtn: {
      position: "absolute", top: "14px", right: "16px",
      background: "none", border: "none", fontSize: "22px",
      cursor: "pointer", color: "#9ca3af",
      padding: "4px 8px", borderRadius: "6px",
    },
    backBtn: {
      position: "absolute", top: "16px", left: "16px",
      background: "none", border: "none",
      cursor: "pointer", color: "#6b7280",
      padding: "4px 8px", borderRadius: "6px",
      display: "flex", alignItems: "center", gap: "4px",
      fontSize: "13px", fontWeight: "500",
    },
    logo: { width: "85px", height: "auto", display: "block", margin: "0 auto 16px" },
    avatar: {
      width: "60px", height: "60px", borderRadius: "50%",
      border: "2px solid #e6ecf7", display: "block", margin: "0 auto 10px",
    },
    googleBadge: {
      display: "inline-flex", alignItems: "center", gap: "6px",
      backgroundColor: "#f0f4ff", border: "1px solid #dbe4ff",
      borderRadius: "20px", padding: "4px 12px",
      fontSize: "12.5px", color: "#3b5bdb", marginBottom: "14px",
    },
    heading: { fontSize: "24px", fontWeight: "700", color: "#003087", marginBottom: "4px" },
    subtext: { fontSize: "13px", color: "#6b7280", marginBottom: "22px" },
    field: { marginBottom: "14px", position: "relative", textAlign: "left" },
    label: {
      display: "block", fontSize: "12px", fontWeight: "600",
      color: "#374151", marginBottom: "5px",
    },
    input: {
      width: "100%", padding: "11px 14px",
      border: "1.5px solid #e6ecf7", borderRadius: "8px",
      fontSize: "15px", boxSizing: "border-box",
      color: "#111827", backgroundColor: "#fafbff",
      outline: "none", transition: "border-color 0.2s",
    },
    inputLocked: {
      backgroundColor: "#f3f4f6", color: "#6b7280",
      cursor: "not-allowed", border: "1.5px solid #e5e7eb",
    },
    primaryBtn: {
      width: "100%", padding: "13px",
      backgroundColor: "#003087", color: "#fff",
      border: "none", borderRadius: "8px",
      fontSize: "16px", fontWeight: "600",
      cursor: "pointer", marginTop: "6px",
      transition: "background-color 0.2s, transform 0.1s",
    },
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
    spinner: {
      display: "inline-block", width: "16px", height: "16px",
      border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff",
      borderRadius: "50%", animation: "spin 0.7s linear infinite",
      marginRight: "8px", verticalAlign: "middle",
    },
  };

  const GoogleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .reg-card  { animation: slideUp 0.28s ease; }
        .reg-input:focus { border-color:#003087!important; box-shadow:0 0 0 3px rgba(0,48,135,0.1); }
        .reg-primary:hover:not(:disabled) { background-color:#002366!important; }
        .reg-primary:active:not(:disabled){ transform:scale(0.98); }
        .reg-primary:disabled { opacity:0.65; cursor:not-allowed; }
        .reg-close:hover,.reg-back:hover { color:#374151!important; background:#f3f4f6; }
      `}</style>

      <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div style={S.card} className="reg-card">

          <button className="reg-close" onClick={onClose} style={S.closeBtn}>×</button>

          {step === "complete" && (
            <button className="reg-back" onClick={goBack} style={S.backBtn}>← Back</button>
          )}

          <img src="/assets/other/depdevlogo.png" alt="Logo" style={S.logo} />

          {/* ══════ STEP 1: CHOOSE ══════ */}
          {step === "choose" && (
            <>
              <h2 style={S.heading}>Create Account</h2>
              <p style={S.subtext}>Sign up with your Google account to get started</p>

              {error && <div style={S.errorBox}>⚠ {error}</div>}

              {GOOGLE_CLIENT_ID ? (
                <div style={S.googleWrapper}>
                  <div ref={googleBtnRef} style={{ width: "100%", minHeight: "44px" }} />
                </div>
              ) : (
                <div style={{ color: "#dc2626", fontSize: "13px", padding: "12px 0" }}>
                  Google Sign-In is not configured. Please contact administrator.
                </div>
              )}

              <p style={S.footer}>
                Already have an account?{" "}
                <button onClick={onSwitchToLogin} style={S.linkBtn}>Login</button>
              </p>
            </>
          )}

          {/* ══════ STEP 2: COMPLETE PROFILE ══════ */}
          {step === "complete" && (
            <>
              {googleProfile.picture && (
                <img src={googleProfile.picture} alt="avatar" style={S.avatar} referrerPolicy="no-referrer" />
              )}

              <div style={S.googleBadge}>
                <GoogleIcon /> Connected with Google
              </div>

              <h2 style={S.heading}>Complete Your Profile</h2>
              <p style={S.subtext}>Review and fill in the remaining details below</p>

              {error   && <div style={S.errorBox}>⚠ {error}</div>}
              {success && <div style={S.successBox}>✓ {success}</div>}

              <form onSubmit={handleSubmit} autoComplete="off">

                {/* Full Name */}
                <div style={S.field}>
                  <label style={S.label}>Full Name</label>
                  <input
                    className="reg-input"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={S.input}
                  />
                </div>

                {/* Email — always locked, sourced from Google */}
                <div style={S.field}>
                  <label style={S.label}>
                    Email Address
                    <span style={{ marginLeft: "6px", fontWeight: "400", color: "#9ca3af", fontSize: "11px" }}>
                      (from Google — cannot be changed)
                    </span>
                  </label>
                  <input
                    className="reg-input"
                    type="email"
                    value={email}
                    readOnly
                    required
                    style={{ ...S.input, ...S.inputLocked }}
                  />
                </div>

                {/* Username */}
                <div style={S.field}>
                  <label style={S.label}>Username</label>
                  <input
                    className="reg-input"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                    required
                    style={S.input}
                  />
                </div>

                <div style={{ marginBottom: "8px" }} />

                <button
                  type="submit"
                  className="reg-primary"
                  disabled={loading}
                  style={S.primaryBtn}
                >
                  {loading && <span style={S.spinner} />}
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
              </form>

              <p style={S.footer}>
                Already have an account?{" "}
                <button onClick={onSwitchToLogin} style={S.linkBtn}>Login</button>
              </p>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Register;