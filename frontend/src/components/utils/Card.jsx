import React from "react";

const Card = ({ title, data, icon: Icon, accent = "var(--rose-deep)" }) => {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl bg-white w-full"
      style={{
        padding: "20px 24px",
        border: "1px solid var(--border-light)",
        borderTop: `3px solid ${accent}`,
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow 0.18s cubic-bezier(0.22,1,0.36,1), transform 0.18s cubic-bezier(0.22,1,0.36,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "";
      }}
    >
      {Icon && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18`, color: accent }}
        >
          <Icon size={17} />
        </div>
      )}
      <div className="flex flex-col gap-1 mt-auto">
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.68rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
          }}
        >
          {title}
        </p>
        <p className="card-value">{data}</p>
      </div>
    </div>
  );
};

export default Card;
