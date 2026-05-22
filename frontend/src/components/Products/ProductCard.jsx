import { useNavigate } from "react-router";
import Modal from "../utils/Modal";
import { useState } from "react";
import { Package } from "lucide-react";

const STATUS_CONFIG = {
  Available: { bg: "#f0fdf4", color: "#16a34a", label: "Available" },
  Discontinued: { bg: "#fff5f5", color: "#dc2626", label: "Discontinued" },
  "Out of Stock": { bg: "#fff7ed", color: "#ea580c", label: "Out of Stock" },
};

const ProductCard = ({ _id, name, price, description, status }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const sc = STATUS_CONFIG[status] || {
    bg: "var(--rose-light)",
    color: "var(--rose-deep)",
    label: status,
  };

  return (
    <div
      className="bg-white flex flex-col justify-between rounded-2xl transition-all duration-200 w-full"
      style={{
        minHeight: 260,
        border: "1px solid var(--border-light)",
        borderTop: `3px solid ${sc.color}`,
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-md)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-sm)")
      }
    >
      {/* Card body */}
      <div className="flex flex-col gap-3 flex-1 p-5">
        {/* Icon + Name + Price */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: sc.bg }}
          >
            <Package size={18} style={{ color: sc.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="font-semibold leading-tight truncate"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.2rem",
                color: "var(--text-primary)",
              }}
            >
              {name}
            </h2>
            <p
              className="text-sm font-semibold mt-0.5"
              style={{
                color: sc.color,
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1rem",
              }}
            >
              {Number(price).toLocaleString()} PKR
            </p>
          </div>
        </div>

        {/* Description */}
        {description ? (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {description.split(" ").length > 16
              ? description.split(" ").slice(0, 16).join(" ") + "…"
              : description}
          </p>
        ) : (
          <p className="text-sm italic" style={{ color: "var(--border)" }}>
            No description
          </p>
        )}

        {/* Status badge */}
        <div className="mt-auto pt-2">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: sc.bg, color: sc.color }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: sc.color }}
            />
            {sc.label}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div
        className="flex gap-2 px-5 py-4"
        style={{ borderTop: "1px solid var(--border-light)" }}
      >
        <button
          className="btn btn-outline flex-1 justify-center"
          style={{ padding: "7px 12px" }}
          onClick={() => navigate(`/products/${_id}`)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger flex-1 justify-center"
          style={{ padding: "7px 12px" }}
          onClick={() => setShowModal(true)}
        >
          Delete
        </button>
      </div>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          name={name}
          id={_id}
          who="products"
        />
      )}
    </div>
  );
};

export default ProductCard;
