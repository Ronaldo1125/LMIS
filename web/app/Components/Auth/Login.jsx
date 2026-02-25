"use client";

import React, { useState } from "react";

const Login = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", { email, password });
  };

  return (
    <div style={{
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
      position: "relative"
    }}>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          fontSize: "20px",
          cursor: "pointer"
        }}
      >
        ×
      </button>
      <img
        src="/assets/other/depdevlogo.png"
        alt="Logo"
        style={{
          width: "100px",
          height: "auto",
          marginBottom: "20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      />
      <h2 style={{
        fontSize: "24px",
        fontWeight: "600",
        color: "#003087",
        marginBottom: "20px"
      }}>
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #e6ecf7",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #e6ecf7",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#003087",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#002366"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#003087"}
        >
          Login
        </button>
      </form>
      <p style={{
        marginTop: "20px",
        fontSize: "14px",
        color: "#6b7280"
      }}>
        Don't have an account? <button onClick={onSwitchToRegister} style={{ color: "#003087", background: "none", border: "none", cursor: "pointer" }}>Register</button>
      </p>
    </div>
  );
};

export default Login;
