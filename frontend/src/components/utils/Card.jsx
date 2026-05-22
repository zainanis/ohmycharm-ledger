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
      }}
    >
      {Icon && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18`, color: accent }}
        >
          <Icon size={18} />
        </div>
      )}
      <div className="flex flex-col gap-1 mt-auto">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          {title}
        </p>
        <p className="card-value">{data}</p>
      </div>
    </div>
  );
};

export default Card;
