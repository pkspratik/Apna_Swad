import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sweets.css";

export function Sweets() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px 20px",
        marginTop: "40px",
        animation: "fadeIn 0.6s ease",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          background: "#ff5c5c",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "30px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          transition: "0.3s",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      >
        ← Back to Home
      </button>

      {/* Main Heading */}
      <h2 style={{ color: "#ff5c5c", fontSize: "26px", marginBottom: "20px" }}>
        🍬 Sweets Category
      </h2>

      {/* Message */}
      <div
        style={{
          background: "#fff3f3",
          padding: "25px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
          margin: "0 auto",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ fontSize: "18px", marginBottom: "10px" }}>
          We are adding sweets soon…
        </p>

        <p style={{ color: "#777", fontSize: "15px" }}>
          This sweets option is currently not available.
        </p>
      </div>
    </div>
  );
}
