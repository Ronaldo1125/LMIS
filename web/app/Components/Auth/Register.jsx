"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
};

// ─── Small reusable icons ──────────────────────────────────────────────────
const BackArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0">
    <path fill="#666" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const Register = ({ onClose, onSwitchToLogin, onSuccess }) => {
  
  const [step, setStep] = useState("choose");

  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleProfile, setGoogleProfile]       = useState({ name: "", email: "", picture: "" });

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

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
    } else if (window.google?.accounts) {
      init();
    } else {
      const iv = setInterval(() => {
        if (window.google?.accounts) { init(); clearInterval(iv); }
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

    
    probeExistingAccount(response.credential, profile);
  };

  
  const probeExistingAccount = async (credential, profile) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/google/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ credential, full_name: profile.name || "probe", username: "__probe__" }),
      });
      const data = await res.json();

      if (res.ok && data.already_exists) {
        
        handleLoginSuccess(data, true);
      } else {
        
        setStep("complete");
      }
    } catch {
      
      setStep("complete");
    } finally {
      setLoading(false);
    }
  };

  
  const handleLoginSuccess = (data, isExisting = false) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    if (isExisting) {
      setStep("logging-in");
    } else {
      setSuccess("Account created successfully!");
    }
    setTimeout(() => { onSuccess?.(data); onClose?.(); }, isExisting ? 1200 : 900);
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

      if (res.ok && data.already_exists) {
       
        handleLoginSuccess(data, true);
      } else if (res.status === 409) {
        setError(data.message || "That username is already taken. Please choose another.");
      } else if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      } else {
        handleLoginSuccess(data, false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-[1000]"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <div className="relative w-full max-w-[420px] bg-white border border-black/8 rounded-[20px] p-8 pb-8 text-center font-inter shadow-[0_20px_60px_rgba(0,0,0,0.15),inset_0_0_0_1px_rgba(0,0,0,0.05)] backdrop-blur-[24px] max-h-[92vh] overflow-y-auto animate-fade-up">

         
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-100 border-none text-gray-600 text-xl cursor-pointer w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ease leading-none p-0 hover:bg-black/8 hover:text-blue-800"
          >
            ×
          </button>

          
          {step === "complete" && (
            <button
              onClick={goBack}
              className="absolute top-[18px] left-[18px] bg-none border-none text-gray-600 cursor-pointer text-xs font-medium flex items-center gap-[5px] transition-colors duration-200 ease font-inter px-2 py-1 hover:text-blue-800"
            >
              <BackArrowIcon />
            </button>
          )}

          <img
            src="/assets/other/depdevlogo.png"
            alt="DEPDev Logo"
            className="w-[120px] h-auto block mx-auto mb-7"
          />

         
          {step === "choose" && (
            <>
              <h2 className="text-[22px] font-semibold text-black mb-1 tracking-[-0.3px]">
                Welcome to DEPDev V Library
              </h2>
              <p className="text-[13px] text-gray-600 mb-5 leading-relaxed">
                Register with your Google account
              </p>

              {error && (
                <div className="bg-red-50/8 border border-red-500/20 rounded-[10px] p-3 mb-3 text-red-600 text-[12px] text-left">
                  ⚠ {error}
                </div>
              )}

             
              {GOOGLE_CLIENT_ID ? (
                <div className="relative mb-2">
                  <div
                    ref={googleBtnRef}
                    className="absolute inset-0 opacity-0 z-[2] cursor-pointer overflow-hidden rounded-[50px]"
                  />
                  <button
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gray-100 border-none rounded-lg text-gray-700 text-[14px] font-medium cursor-pointer flex items-center justify-center gap-3 transition-all duration-250 ease font-inter tracking-[0.1px] hover:bg-gray-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="inline-block w-[18px] h-[18px] border-[2px] border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    {loading ? "Checking account…" : "Continue with Google"}
                  </button>
                </div>
              ) : (
                <div className="mb-2">
                  <div ref={googleBtnRef} className="w-full min-h-[50px] flex justify-center" />
                </div>
              )}

              <p className="text-[12px] text-gray-600 mt-4 leading-relaxed">
                By continuing, you agree to our{" "}
                <Link href="/privacy-terms" className="text-blue-800 cursor-pointer underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy-terms" className="text-blue-800 cursor-pointer underline">Privacy Policy</Link>.
              </p>

              <p className="mt-5 text-[13px] text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-blue-800 bg-none border-none cursor-pointer font-semibold text-[12px] p-0 transition-colors duration-200 ease font-inter hover:text-blue-800"
                >
                  Login
                </button>
              </p>
            </>
          )}

         
          {step === "logging-in" && (
            <div className="py-6 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-1">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-[20px] font-semibold text-blue-800 tracking-[-0.3px]">
                Welcome back!
              </h2>
              <p className="text-[13px] text-gray-600 leading-relaxed max-w-[260px]">
                We found your existing account. Logging you in…
              </p>
              <span className="inline-block w-5 h-5 border-[2px] border-blue-200 border-t-blue-700 rounded-full animate-spin mt-2" />
            </div>
          )}

          
          {step === "complete" && (
            <>
              <h2 className="text-[22px] font-semibold text-blue-800 mb-1 tracking-[-0.3px]">
                Complete Your Profile
              </h2>
              <p className="text-[12px] text-gray-600 mb-5 leading-relaxed">
                Review and fill in the remaining details below
              </p>

              <div className="inline-flex items-center gap-[7px] bg-gray-50 border border-gray-200 rounded-[24px] py-1 px-[14px] text-[12px] text-gray-600 mb-[18px] font-medium">
                <GoogleIcon /> Connected with Google
              </div>

              {error && (
                <div className="bg-red-50/8 border border-red-500/20 rounded-[10px] p-3 mb-[18px] text-red-600 text-[13px] text-left">
                  ⚠ {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50/8 rounded-[10px] p-3 mb-[18px] text-green-700 text-[13px] flex items-center justify-center gap-2">
                  <div className="w-5 h-5 bg-[#f4f4f4] rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon />
                  </div>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="mb-3 text-left">
                  <label className="block text-[11px] font-semibold text-black mb-[7px] tracking-[0.4px] font-inter">
                    Full name
                  </label>
                  <input
                    className="reg-input w-full py-[13px] px-4 border border-gray-300 rounded-lg text-[15px] box-border text-gray-700 bg-gray-100 outline-none transition-all duration-250 ease font-inter placeholder-gray-500"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 text-left">
                  <label className="block text-[11px] font-semibold text-black mb-[7px] font-inter">
                    Email
                  </label>
                  <input
                    className="reg-input w-full py-[13px] px-4 border border-gray-300 rounded-lg text-[15px] box-border text-gray-700 bg-gray-100 outline-none transition-all duration-250 ease font-inter opacity-60 cursor-not-allowed"
                    type="email"
                    value={email}
                    readOnly
                    required
                  />
                </div>

                <div className="mb-4 text-left">
                  <label className="block text-[11px] font-semibold text-black mb-[7px] font-inter">
                    Username
                  </label>
                  <input
                    className="reg-input w-full py-[13px] px-4 border border-gray-300 rounded-lg text-[15px] box-border text-gray-700 bg-gray-100 outline-none transition-all duration-250 ease font-inter placeholder-gray-500"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-800 border-none rounded-lg text-white text-[14px] font-medium cursor-pointer flex items-center justify-center gap-2 transition-all duration-250 ease font-inter hover:bg-blue-900 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && (
                    <span className="inline-block w-[15px] h-[15px] border-[2px] border-blue-400/30 border-t-white rounded-full animate-spin" />
                  )}
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
              </form>

              <p className="mt-5 text-[13px] text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-blue-800 bg-none border-none cursor-pointer font-semibold text-[12px] p-0 transition-colors duration-200 ease font-inter hover:text-blue-800"
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        .animate-fade-up {
          animation: fadeUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .animate-spin {
          animation: spin 0.7s linear infinite;
        }

        .backdrop-blur-md {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .backdrop-blur-\\[24px\\] {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .reg-input:focus {
          outline: none;
          background: #f4f4f4;
        }
      `}</style>
    </>
  );
};

export default Register;