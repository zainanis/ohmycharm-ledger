import React from "react";
import logo from "../../assets/log.png";

const Logo = () => {
  return (
    <div style={{ padding: "18px 10px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <img
          src={logo}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            flexShrink: 0,
            objectFit: "cover",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.14)",
          }}
        />
        <div style={{ lineHeight: 1 }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#fff8fc",
              letterSpacing: "0.04em",
              lineHeight: 1.25,
            }}
          >
            OhMyCharm
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.68rem",
              color: "rgba(255, 210, 228, 0.62)",
              letterSpacing: "0.07em",
              marginTop: 3,
            }}
          >
            Sukaina Ali
          </div>
        </div>
      </div>

      {/* Ornamental separator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: "18px 0 14px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.14))",
          }}
        />
        <svg width="8" height="8" viewBox="0 0 8 8" style={{ flexShrink: 0 }}>
          <rect
            x="1.5"
            y="1.5"
            width="5"
            height="5"
            transform="rotate(45 4 4)"
            fill="none"
            stroke="rgba(201,151,107,0.7)"
            strokeWidth="1.2"
          />
        </svg>
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(to left, transparent, rgba(255,255,255,0.14))",
          }}
        />
      </div>
    </div>
  );
};

export default Logo;
