import { useState, useRef } from "react";
import { useParams, NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/client.js";
import jsPDF from "jspdf";
import { FaChevronCircleLeft } from "react-icons/fa";

const STATUS_CONFIG = {
  Placed: { bg: "#fef3c7", color: "#92400e", dot: "#d97706" },
  "In Progress": { bg: "#dbeafe", color: "#1e40af", dot: "#2563eb" },
  Sent: { bg: "#ede9fe", color: "#5b21b6", dot: "#7c3aed" },
  Delivered: { bg: "#dcfce7", color: "#166534", dot: "#16a34a" },
};

const Details = () => {
  const { id } = useParams();
  const saveTimer = useRef(null);
  const [delivery, setDelivery] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["order-detail", id],
    queryFn: () => api.get(`/api/orders/${id}`).then((r) => r.data),
    staleTime: 30 * 1000,
  });

  const order    = data?.order    ?? {};
  const products = data?.products ?? [];
  const customer = order.customerId ?? {};

  // initialise delivery from fetched data only once
  const deliveryValue = delivery !== null ? delivery : (order.delivery > 0 ? String(order.delivery) : "");

  const subtotal    = products.reduce((acc, p) => acc + (p.totalPrice || 0), 0);
  const discountAmt = order.discount ?? 0;
  const deliveryAmt = parseFloat(deliveryValue) || 0;
  const grandTotal  = subtotal - discountAmt + deliveryAmt;

  const handleDeliveryChange = (val) => {
    const num = parseFloat(val);
    const clamped = isNaN(num) || num < 0 ? 0 : num;
    setDelivery(val === "" ? "" : String(clamped));
    setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api.patch(`/api/orders/${id}/delivery`, { delivery: clamped })
        .then(() => setSaveStatus("saved"))
        .catch(() => setSaveStatus("error"))
        .finally(() => setTimeout(() => setSaveStatus(""), 2000));
    }, 700);
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const colW = pageW - margin * 2;
    let y = 18;

    const rule = (opacity = 200) => {
      pdf.setDrawColor(opacity, opacity - 30, opacity - 50);
      pdf.line(margin, y, pageW - margin, y);
      y += 5;
    };

    const thinRule = (x1, x2) => {
      pdf.setDrawColor(220, 200, 210);
      pdf.line(x1, y, x2, y);
    };

    // Header block
    pdf.setFillColor(139, 34, 82);
    pdf.rect(0, 0, pageW, 28, "F");
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(20);
    pdf.setTextColor(255, 240, 248);
    pdf.text("OhMyCharm", pageW / 2, 13, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(240, 200, 220);
    pdf.text("ORDER INVOICE", pageW / 2, 20, { align: "center" });
    y = 36;

    // Meta grid
    pdf.setFontSize(9);
    const meta = [
      ["CUSTOMER", customer.name || "-"],
      ["ORDER ID", (order._id || "-").slice(-8).toUpperCase()],
      ["STATUS", order.status || "-"],
      ["PAYMENT", order.paymentMode || "-"],
      [
        "ORDER DATE",
        order.orderDate
          ? new Date(order.orderDate).toLocaleDateString("en-GB")
          : "-",
      ],
      [
        "SENT DATE",
        order.sentDate
          ? new Date(order.sentDate).toLocaleDateString("en-GB")
          : "-",
      ],
    ];

    const half = colW / 2;
    meta.forEach(([label, value], i) => {
      const col = i % 2;
      const x = margin + col * (half + 4);
      if (col === 0 && i > 0) y += 11;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(160, 100, 130);
      pdf.setFontSize(7);
      pdf.text(label, x, y);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 10, 20);
      pdf.setFontSize(10);
      pdf.text(value, x, y + 5);
    });
    y += 16;

    pdf.setDrawColor(139, 34, 82);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageW - margin, y);
    pdf.setLineWidth(0.2);
    y += 8;

    // Table header
    const cols = {
      name: margin,
      price: margin + 72,
      qty: margin + 110,
      total: margin + 135,
    };
    pdf.setFillColor(249, 238, 243);
    pdf.rect(margin, y - 4, colW, 9, "F");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(139, 34, 82);
    pdf.text("PRODUCT", cols.name, y);
    pdf.text("UNIT PRICE", cols.price, y);
    pdf.text("QTY", cols.qty, y);
    pdf.text("TOTAL", cols.total, y);
    y += 6;

    pdf.setDrawColor(180, 120, 150);
    pdf.line(margin, y, pageW - margin, y);
    y += 5;

    // Product rows
    products?.forEach((p, idx) => {
      if (idx % 2 === 1) {
        pdf.setFillColor(253, 248, 251);
        pdf.rect(margin, y - 4, colW, 8, "F");
      }
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);
      pdf.setTextColor(30, 10, 20);
      pdf.text(p.productId?.name || "-", cols.name, y);
      pdf.text(
        typeof p.productId?.price === "number"
          ? p.productId.price.toFixed(2) + " PKR"
          : "-",
        cols.price,
        y,
      );
      pdf.text(p.quantity != null ? String(p.quantity) : "-", cols.qty, y);
      pdf.text(
        typeof p.totalPrice === "number"
          ? p.totalPrice.toFixed(2) + " PKR"
          : "-",
        cols.total,
        y,
      );
      y += 8;
    });

    y += 3;
    pdf.setDrawColor(180, 120, 150);
    pdf.line(margin, y, pageW - margin, y);
    y += 8;

    // Totals block (right-aligned)
    const totalsX = margin + 95;
    const totalsItems = [
      ["Subtotal", subtotal.toFixed(2) + " PKR", false],
      ["Discount", "- " + discountAmt.toFixed(2) + " PKR", true],
      ["Delivery", deliveryAmt.toFixed(2) + " PKR", false],
    ];

    totalsItems.forEach(([label, value, isDiscount]) => {
      y += 4;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(
        isDiscount ? 180 : 80,
        isDiscount ? 60 : 60,
        isDiscount ? 80 : 70,
      );
      pdf.text(label, totalsX, y);
      pdf.text(value, pageW - margin, y, { align: "right" });
      y += 4;
      thinRule(totalsX, pageW - margin);
    });

    y += 8;
    pdf.setFillColor(139, 34, 82);
    pdf.rect(0, y - 5, pageW, 10, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(255, 240, 248);
    pdf.text("Grand Total", totalsX, y);
    pdf.text(grandTotal.toFixed(2) + " PKR", pageW - margin, y, {
      align: "right",
    });

    // Footer
    y = pdf.internal.pageSize.getHeight() - 12;
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    pdf.setTextColor(180, 140, 160);
    pdf.text("Thank you for your order — OhMyCharm", pageW / 2, y, {
      align: "center",
    });

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ohmycharm-order-${(order._id || "invoice").slice(-8)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const statusCfg = STATUS_CONFIG[order.status] || {
    bg: "#f3f4f6",
    color: "#374151",
    dot: "#6b7280",
  };

  return (
    <div style={styles.page}>
      {/* ── Masthead ── */}
      <div style={styles.masthead}>
        <NavLink to="/orders" style={styles.backBtn}>
          <FaChevronCircleLeft size={18} />
          <span>Orders</span>
        </NavLink>
        <div style={styles.mastheadCenter}>
          <p style={styles.mastheadEyebrow}>Order Details</p>
          <h1 style={styles.mastheadTitle}>OhMyCharm</h1>
        </div>
        <button style={styles.downloadBtn} onClick={handleDownloadPDF}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </button>
      </div>

      {!isLoading && (
        <div style={styles.body}>
          {/* ── Order Meta ── */}
          <div style={styles.metaGrid}>
            <MetaCell label="Customer" value={customer.name || "—"} large />
            <MetaCell
              label="Status"
              value={
                <span
                  style={{
                    ...styles.statusBadge,
                    background: statusCfg.bg,
                    color: statusCfg.color,
                  }}
                >
                  <span
                    style={{ ...styles.statusDot, background: statusCfg.dot }}
                  />
                  {order.status || "—"}
                </span>
              }
            />
            <MetaCell label="Payment Mode" value={order.paymentMode || "—"} />
            <MetaCell
              label="Order Date"
              value={
                order.orderDate
                  ? new Date(order.orderDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"
              }
            />
            {order.sentDate && (
              <MetaCell
                label="Sent Date"
                value={new Date(order.sentDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              />
            )}
            {order.recieveDate && (
              <MetaCell
                label="Receive Date"
                value={new Date(order.recieveDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              />
            )}
          </div>

          <Divider />

          {/* ── Products Table ── */}
          <div>
            <p style={styles.sectionLabel}>Ordered Items</p>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Product", "Unit Price", "Qty", "Total"].map((h) => (
                    <th key={h} style={styles.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products?.map((p, idx) => (
                  <tr key={p._id} style={idx % 2 === 1 ? styles.trAlt : {}}>
                    <td style={styles.tdName}>{p.productId?.name || "—"}</td>
                    <td style={styles.td}>
                      {typeof p.productId?.price === "number"
                        ? p.productId.price.toLocaleString() + " PKR"
                        : "—"}
                    </td>
                    <td style={styles.td}>{p.quantity ?? "—"}</td>
                    <td style={{ ...styles.td, ...styles.tdMono }}>
                      {typeof p.totalPrice === "number"
                        ? p.totalPrice.toLocaleString() + " PKR"
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Totals ── */}
          <div style={styles.totalsWrap}>
            <TotalRow
              label="Subtotal"
              value={subtotal.toLocaleString() + " PKR"}
            />
            <TotalRow
              label="Discount"
              value={"− " + discountAmt.toLocaleString() + " PKR"}
              muted
            />
            <TotalRow
              label={
                <span
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  Delivery
                  {saveStatus && (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        color: saveStatus === "error" ? "#dc2626" : "#16a34a",
                      }}
                    >
                      {saveStatus === "saving"
                        ? "saving…"
                        : saveStatus === "saved"
                          ? "✓ saved"
                          : "error"}
                    </span>
                  )}
                </span>
              }
              value={
                <div style={styles.deliveryInputWrap}>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={deliveryValue}
                    onChange={(e) => handleDeliveryChange(e.target.value)}
                    style={styles.deliveryInput}
                  />
                  <span style={styles.deliveryUnit}>PKR</span>
                </div>
              }
            />
            <div style={styles.grandTotalRow}>
              <span style={styles.grandTotalLabel}>Grand Total</span>
              <span style={styles.grandTotalValue}>
                {grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}{" "}
                PKR
              </span>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div style={{ padding: "36px 40px", display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "20px 32px", background: "white", borderRadius: 12, padding: "24px 28px", border: "1px solid var(--border-light)" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className={`skeleton skeleton-d${(i % 5) + 1}`} style={{ height: 10, width: 70, borderRadius: 4 }} />
                <div className={`skeleton skeleton-d${(i % 5) + 1}`} style={{ height: 20, width: "80%", borderRadius: 4 }} />
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-light)" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "13px 16px", borderBottom: "1px solid var(--border-light)" }}>
                <div className="skeleton" style={{ height: 14, flex: 3, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 14, flex: 1, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 14, flex: 1, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 14, flex: 1, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Sub-components ── */

const MetaCell = ({ label, value, large }) => (
  <div style={styles.metaCell}>
    <p style={styles.metaLabel}>{label}</p>
    {large ? (
      <p style={styles.metaValueLarge}>{value}</p>
    ) : (
      <div style={styles.metaValue}>{value}</div>
    )}
  </div>
);

const TotalRow = ({ label, value, muted }) => (
  <div style={styles.totalRow}>
    <span
      style={{
        ...styles.totalLabel,
        ...(muted ? { color: "var(--text-muted)" } : {}),
      }}
    >
      {label}
    </span>
    <span
      style={{ ...styles.totalValue, ...(muted ? { color: "#b45379" } : {}) }}
    >
      {value}
    </span>
  </div>
);

const Divider = () => (
  <div style={styles.dividerWrap}>
    <div style={styles.dividerLine} />
    <svg width="10" height="10" viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
      <rect
        x="3"
        y="0"
        width="4"
        height="4"
        transform="rotate(45 5 5)"
        fill="var(--rose-deep)"
        opacity="0.5"
      />
    </svg>
    <div style={styles.dividerLine} />
  </div>
);

/* ── Styles ── */
const styles = {
  page: {
    background: "white",
    borderRadius: 16,
    boxShadow: "var(--shadow-md)",
    overflow: "hidden",
    width: "100%",
    minHeight: "calc(100vh - 3rem)",
    display: "flex",
    flexDirection: "column",
  },
  masthead: {
    background: "var(--rose-deep)",
    padding: "20px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: "rgba(255,240,248,0.85)",
    textDecoration: "none",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    letterSpacing: "0.02em",
    transition: "color 0.15s",
  },
  mastheadCenter: {
    textAlign: "center",
    flex: 1,
  },
  mastheadEyebrow: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10,
    letterSpacing: "0.18em",
    color: "rgba(255,220,240,0.7)",
    textTransform: "uppercase",
    margin: 0,
    marginBottom: 3,
  },
  mastheadTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 30,
    fontWeight: 600,
    color: "#fff8fc",
    margin: 0,
    letterSpacing: "0.04em",
    lineHeight: 1,
  },
  downloadBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "rgba(255,255,255,0.12)",
    border: "1.5px solid rgba(255,255,255,0.25)",
    color: "#fff8fc",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 12.5,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "0.02em",
    backdropFilter: "blur(4px)",
    transition: "background 0.15s, border-color 0.15s",
  },
  body: {
    padding: "36px 40px",
    display: "flex",
    flexDirection: "column",
    gap: 32,
    flex: 1,
    background: "var(--cream)",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "20px 32px",
    background: "white",
    borderRadius: 12,
    padding: "24px 28px",
    border: "1px solid var(--border-light)",
    boxShadow: "var(--shadow-sm)",
  },
  metaCell: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  metaLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10.5,
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    margin: 0,
  },
  metaValue: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "var(--text-primary)",
    fontWeight: 500,
  },
  metaValueLarge: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontWeight: 600,
    color: "var(--rose-deep)",
    margin: 0,
    lineHeight: 1.2,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    padding: "3px 10px",
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    flexShrink: 0,
  },
  dividerWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "var(--border)",
  },
  sectionLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10.5,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    margin: "0 0 14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid var(--border-light)",
    boxShadow: "var(--shadow-sm)",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--rose-deep)",
    background: "var(--rose-light)",
    borderBottom: "1px solid var(--border)",
  },
  td: {
    padding: "13px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13.5,
    color: "var(--text-primary)",
    borderBottom: "1px solid var(--border-light)",
  },
  tdName: {
    padding: "13px 16px",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 16,
    fontWeight: 500,
    color: "var(--text-primary)",
    borderBottom: "1px solid var(--border-light)",
  },
  tdMono: {
    fontVariantNumeric: "tabular-nums",
    fontWeight: 500,
  },
  trAlt: {
    background: "#fdf8fb",
  },
  totalsWrap: {
    marginLeft: "auto",
    width: "100%",
    maxWidth: 380,
    background: "white",
    borderRadius: 12,
    border: "1px solid var(--border-light)",
    boxShadow: "var(--shadow-sm)",
    overflow: "hidden",
  },
  totalRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 20px",
    borderBottom: "1px solid var(--border-light)",
  },
  totalLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13.5,
    color: "var(--text-primary)",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  totalValue: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13.5,
    color: "var(--text-primary)",
    fontVariantNumeric: "tabular-nums",
  },
  grandTotalRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    background: "var(--rose-deep)",
  },
  grandTotalLabel: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 19,
    fontWeight: 600,
    color: "#fff8fc",
    letterSpacing: "0.02em",
  },
  grandTotalValue: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontWeight: 700,
    color: "#fff8fc",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.01em",
  },
  deliveryInputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  deliveryInput: {
    width: 80,
    border: "1.5px solid var(--border)",
    borderRadius: 6,
    padding: "4px 8px",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    color: "var(--text-primary)",
    outline: "none",
    background: "var(--cream)",
  },
  deliveryUnit: {
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    color: "var(--text-muted)",
  },
};

export default Details;
