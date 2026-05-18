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

const Login = ({ onClose, onSwitchToRegister, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessCircle, setShowSuccessCircle] = useState(false);

  const googleBtnRef = useRef(null);

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
        
        setTimeout(() => {
          const retryScript = document.createElement("script");
          retryScript.src = "https://accounts.google.com/gsi/client";
          retryScript.async = true;
          retryScript.defer = true;
          retryScript.onload = () => {
            console.log("Google script loaded successfully (retry)");
            init();
          };
          retryScript.onerror = () => {
            console.error("Failed to load Google script (retry)");
          };
          document.head.appendChild(retryScript);
        }, 2000);
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
      setTimeout(() => { onSuccess?.(data); onClose?.(); }, 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <>
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-[1000]"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <div className="bg-white p-6 pb-6 md:p-8 md:pb-8 rounded-[20px] border border-black/8 shadow-[0_20px_60px_rgba(0,0,0,0.15),inset_0_0_0_1px_rgba(0,0,0,0.05)] w-full max-w-[340px] md:max-w-[420px] text-center relative font-inter backdrop-blur-[24px] max-h-[92vh] overflow-y-auto animate-fade-up">
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-gray-100 border-none text-xl cursor-pointer text-gray-600 p-0 rounded-full flex items-center justify-center transition-all duration-200 ease leading-none w-8 h-8 hover:bg-black/8 hover:text-blue-800"
          >
            ×
          </button>

          <img src="/assets/other/depdevlogo.png" alt="Logo" className="w-[120px] h-auto block mx-auto mb-7" />

          <h2 className="text-[22px] font-semibold text-black mb-1 tracking-[-0.3px] leading-tight">
            Login to DEPDev V Library
          </h2>
          <p className="text-[13px] text-gray-600 mb-5 leading-relaxed">
            Sign in with your Google account
          </p>

          {error && (
            <div className="bg-red-50/8 border border-red-500/20 rounded-[10px] p-3 mb-1 text-red-600 text-[12px] text-left">
              ⚠ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50/8 rounded-[10px] p-3 mb-[18px] text-green-700 text-[13px] text-center flex items-center justify-center gap-2">
              <div className="w-5 h-5 bg-[#f4f4f4] rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {success}
            </div>
          )}

          {loading ? (
            <div className="text-gray-600 text-[14px] py-3">
              Signing you in…
            </div>
          ) : GOOGLE_CLIENT_ID ? (
            <div className="w-full flex justify-center min-h-[50px] items-center flex-col relative mb-2">
              <div
                ref={googleBtnRef}
                className="absolute inset-0 opacity-0 z-[2] cursor-pointer overflow-hidden rounded-[50px]"
              />
              <button
                className="login-google-custom w-full py-3 px-4 bg-gray-100 border-none rounded-lg text-gray-700 text-[14px] font-medium cursor-pointer flex items-center justify-center gap-3 transition-all duration-250 ease font-inter tracking-[0.1px] shadow-none hover:bg-gray-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>
          ) : (
            <div className="text-red-600 text-[13px] py-3">
              Google Sign-In is not configured. Please contact administrator.
            </div>
          )}

          <p className="text-[12px] text-gray-600 my-4 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/privacy-terms" className="text-blue-800 cursor-pointer underline">
              Terms
            </Link>
            {" "}and{" "}
            <Link href="/privacy-terms" className="text-blue-800 cursor-pointer underline">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="mt-5 text-[13px] text-gray-600">
            Don't have an account?{" "}
            <button 
              onClick={onSwitchToRegister} 
              className="text-blue-800 bg-none border-none cursor-pointer font-semibold text-[12px] p-0 transition-colors duration-200 ease font-inter hover:text-blue-800"
            >
              Register
            </button>
          </p>

        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        
        @keyframes checkmark {
          0% { stroke-dasharray: 0 100; }
          100% { stroke-dasharray: 100 100; }
        }
        
        .animate-checkmark {
          animation: checkmark 0.4s ease-out 0.2s both;
        }
        
        .animate-fade-up {
          animation: fadeUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        
        .backdrop-blur-md {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        
        .backdrop-blur-[24px] {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
      `}</style>
    </>
  );
};

export default Login;