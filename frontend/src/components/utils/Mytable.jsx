import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "./Modal";
import { primeProduct } from "../../state/productsSlice";
import { primeCustomer } from "../../state/customerSlice";
import { primeExpense } from "../../state/expenseSlice";
import { queryClient } from "../../main.jsx";
import api from "../../utils/client.js";

const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  let winStart = Math.max(1, current - 2);
  let winEnd   = winStart + 4;
  if (winEnd > total) { winEnd = total; winStart = Math.max(1, winEnd - 4); }
  const nums = [];
  if (winStart > 1) nums.push("...");
  for (let i = winStart; i <= winEnd; i++) nums.push(i);
  if (winEnd < total) nums.push("...");
  return nums;
};

const Mytable = ({
  loading,
  who = "items",
  data = [],
  header = [],
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);

  const prefetchForEdit = (item) => {
    if (who === "products")  dispatch(primeProduct(item));
    if (who === "customers") dispatch(primeCustomer(item));
    if (who === "expenses")  dispatch(primeExpense(item));
    if (who === "orders") {
      queryClient.prefetchQuery({
        queryKey: ["order-detail", item._id],
        queryFn: () => api.get(`/api/orders/${item._id}`).then((r) => r.data),
        staleTime: 30 * 1000,
      });
    }
  };

  const totalPages = Math.ceil(total / limit);
  const colSpan = header.length + (who === "ledger" ? 0 : 1);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="overflow-x-auto rounded-xl w-full"
        style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <table className="omc-table">
          <thead>
            <tr>
              {header.map((head, i) => (
                <th key={i}>{head.label}</th>
              ))}
              {who !== "ledger" && <th className="text-right pr-6">Actions</th>}
            </tr>
          </thead>

          <tbody className="bg-white divide-y" style={{ borderColor: "var(--border-light)" }}>
            {loading.loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: colSpan }).map((_, j) => (
                    <td key={j} className="px-5 py-3.5">
                      <div className="skeleton h-4 w-full" style={{ opacity: 1 - i * 0.15 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  onClick={who === "orders" ? () => navigate(`details/${item._id}`) : undefined}
                  onMouseEnter={who === "orders" ? () => queryClient.prefetchQuery({
                    queryKey: ["order-detail", item._id],
                    queryFn: () => api.get(`/api/orders/${item._id}`).then((r) => r.data),
                    staleTime: 30 * 1000,
                  }) : undefined}
                  style={{
                    cursor: who === "orders" ? "pointer" : "default",
                    background:
                      who === "ledger"
                        ? item.type === "Profit" ? "#f0fdf4" : "#fff5f5"
                        : undefined,
                  }}
                >
                  {header.map((head, idx) => (
                    <td key={idx} className="px-5 py-3.5 text-sm">
                      {who === "ledger" && head.path === ".runningTotal" ? (
                        <span
                          className="font-semibold"
                          style={{
                            color: item.type === "Profit" ? "#16a34a" : "#dc2626",
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1rem",
                          }}
                        >
                          {getValueFromPath(item, head.path)}
                        </span>
                      ) : head.path === ".status" ? (
                        <StatusBadge status={getValueFromPath(item, head.path)} />
                      ) : (
                        getValueFromPath(item, head.path)
                      )}
                    </td>
                  ))}
                  {who !== "ledger" && (
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2 justify-end">
                        <button
                          className="btn btn-outline"
                          style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                          onMouseEnter={() => prefetchForEdit(item)}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/${who}/${item._id}`);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem({
                              id: item._id,
                              name: item.name || item.customerId?.name || "this item",
                            });
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-6 py-12 text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">🌸</span>
                    <span className="text-sm">No {who} found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="btn btn-outline"
            style={{ padding: "6px 12px", opacity: page === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers(page, totalPages).map((n, i) =>
            n === "..." ? (
              <span key={`dots-${i}`} style={{ padding: "0 4px", color: "var(--text-muted)", fontSize: 13 }}>…</span>
            ) : (
              <button
                key={n}
                onClick={() => onPageChange(n)}
                className="btn"
                style={
                  page === n
                    ? { background: "var(--rose-deep)", color: "white", padding: "6px 13px" }
                    : { background: "var(--rose-light)", color: "var(--rose-deep)", padding: "6px 13px" }
                }
              >
                {n}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="btn btn-outline"
            style={{ padding: "6px 12px", opacity: page === totalPages ? 0.4 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {selectedItem && (
        <Modal
          onClose={() => setSelectedItem(null)}
          who={who}
          id={selectedItem.id}
          name={selectedItem.name}
        />
      )}
    </div>
  );
};

const getValueFromPath = (obj, path) => {
  if (!path) return "";
  const value = path
    .split(".")
    .filter(Boolean)
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : "-"), obj);

  const dateFields = ["date", "orderDate", "sentDate", "recieveDate"];
  if (
    dateFields.includes(path.replace(".", "")) &&
    typeof value === "string" &&
    value.match(/^\d{4}-\d{2}-\d{2}T/)
  ) {
    return new Date(value).toLocaleDateString("en-GB");
  }
  return value;
};

const STATUS_STYLES = {
  Available:      { bg: "#f0fdf4", color: "#16a34a" },
  Placed:         { bg: "#eff6ff", color: "#2563eb" },
  "In Progress":  { bg: "#fffbeb", color: "#d97706" },
  Sent:           { bg: "#f5f3ff", color: "#7c3aed" },
  Delivered:      { bg: "#f0fdf4", color: "#16a34a" },
  Discontinued:   { bg: "#fff5f5", color: "#dc2626" },
  "Out of Stock": { bg: "#fff7ed", color: "#ea580c" },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || { bg: "var(--rose-light)", color: "var(--rose-deep)" };
  return (
    <span
      className="inline-block px-3 py-0.5 rounded-full text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {status}
    </span>
  );
};

export default Mytable;
