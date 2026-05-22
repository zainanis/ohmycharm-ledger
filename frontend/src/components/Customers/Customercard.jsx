import { useNavigate } from "react-router";
import Modal from "../utils/Modal";
import { useState } from "react";
import { User, Phone, MapPin, Mail } from "lucide-react";

const Customercard = ({ _id, name, phoneNumber, address, email }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div
      className="bg-white flex flex-col justify-between rounded-2xl transition-all duration-200 w-full"
      style={{
        minHeight: 260,
        border: "1px solid var(--border-light)",
        borderTop: "3px solid var(--rose-deep)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
    >
      {/* Card body */}
      <div className="flex flex-col gap-4 flex-1 p-5">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm"
            style={{
              background: "var(--rose-deep)",
              color: "white",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
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
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Customer</p>
          </div>
        </div>

        {/* Contact details */}
        <div
          className="flex flex-col gap-2.5 rounded-xl p-3"
          style={{ background: "var(--cream)" }}
        >
          {phoneNumber && (
            <Row icon={<Phone size={13} />} value={String(phoneNumber)} />
          )}
          {email && (
            <Row icon={<Mail size={13} />} value={email} truncate />
          )}
          {address && (
            <Row
              icon={<MapPin size={13} />}
              value={
                address.split(" ").length > 8
                  ? address.split(" ").slice(0, 8).join(" ") + "…"
                  : address
              }
            />
          )}
          {!phoneNumber && !email && !address && (
            <p className="text-xs italic" style={{ color: "var(--border)" }}>No contact details</p>
          )}
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
          onClick={() => navigate(`/customers/${_id}`)}
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
        <Modal onClose={() => setShowModal(false)} who="customers" name={name} id={_id} />
      )}
    </div>
  );
};

const Row = ({ icon, value, truncate }) => (
  <div className="flex items-center gap-2">
    <span style={{ color: "var(--rose-deep)", flexShrink: 0 }}>{icon}</span>
    <span
      className={`text-sm ${truncate ? "truncate" : ""}`}
      style={{ color: "var(--text-primary)" }}
    >
      {value}
    </span>
  </div>
);

export default Customercard;
