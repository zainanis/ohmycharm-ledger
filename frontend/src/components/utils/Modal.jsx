import React from "react";
import { X } from "lucide-react";
import api from "../../utils/client";
import { useDispatch } from "react-redux";
import { deleteCustomer } from "../../state/customerSlice";
import { deleteExpense } from "../../state/expenseSlice";
import { deleteOrder } from "../../state/orderSlice";
import { deleteProduct } from "../../state/productsSlice";

const Modal = ({ onClose, name, id, who }) => {
  const dispatch = useDispatch();

  const doDelete = () => {
    api.delete(`/api/${who}/${id}`).then(() => {
      const actions = {
        expenses:  () => dispatch(deleteExpense({ _id: id })),
        customers: () => dispatch(deleteCustomer({ _id: id })),
        orders:    () => dispatch(deleteOrder({ _id: id })),
        products:  () => dispatch(deleteProduct({ _id: id })),
      };
      actions[who]?.();
      onClose();
    }).catch((err) => console.error(err.message));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center backdrop-enter"
      onClick={onClose}
      style={{ background: "rgba(22, 12, 17, 0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative modal-enter bg-white rounded-2xl px-10 py-8 flex flex-col gap-6 items-center mx-4 w-full max-w-sm"
        style={{ boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 rounded-lg p-1.5 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--rose-light)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
        >
          <X size={18} />
        </button>

        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "#fff5f5" }}
        >
          <span style={{ fontSize: "1.6rem" }}>🗑️</span>
        </div>

        <div className="text-center">
          <h2
            className="text-2xl font-semibold mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Delete {who.slice(0, -1)}?
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>{name}</span>{" "}
            will be permanently removed. This cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            className="btn btn-outline flex-1 justify-center"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger flex-1 justify-center"
            onClick={doDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
