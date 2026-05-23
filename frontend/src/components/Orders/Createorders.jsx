import { useState, useEffect } from "react";
import api from "../../utils/client.js";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, User, Tag, Calendar, CreditCard, Percent,
  Package, Plus, X, Loader2, ShoppingBag,
} from "lucide-react";
import { setCustomers } from "../../state/customerSlice";
import { setProducts } from "../../state/productsSlice";
import { addOrder, updateOrder } from "../../state/orderSlice";
import { queryClient } from "../../main.jsx";

const ORDER_STATUSES = [
  { value: "Placed",      color: "#2563eb" },
  { value: "In Progress", color: "#d97706" },
  { value: "Sent",        color: "#7c3aed" },
  { value: "Delivered",   color: "#16a34a" },
];

const PAYMENT_MODES = [
  { value: "Cash",   color: "#16a34a" },
  { value: "Online", color: "#0369a1" },
];

const Createorders = () => {
  const { id } = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const allCustomers = useSelector((state) => state.customers.allCustomers);
  const allProducts  = useSelector((state) => state.products.allProducts);

  const [submitting,        setSubmitting]        = useState(false);
  const [initialLoading,    setInitialLoading]    = useState(true);
  const [customerId,        setCustomerId]        = useState("");
  const [orderStatus,       setOrderStatus]       = useState("");
  const [orderDate,         setOrderDate]         = useState("");
  const [sentDate,          setSentDate]          = useState("");
  const [recieveDate,       setRecieveDate]       = useState("");
  const [selectedProducts,  setSelectedProducts]  = useState([]);
  const [paymentMode,       setPaymentMode]       = useState("");
  const [discount,          setDiscount]          = useState(0);
  const [productSearch,     setProductSearch]     = useState("");
  const [validationError,   setValidationError]   = useState("");

  useEffect(() => {
    // only fetch what the form actually needs: customers for dropdown, products for search
    const dropdownFetches = [];
    if (allCustomers.length === 0) dropdownFetches.push(api.get("/api/customers").then((r) => dispatch(setCustomers(r.data.data))));
    if (allProducts.length === 0)  dropdownFetches.push(api.get("/api/products").then((r) => dispatch(setProducts(r.data.data))));

    if (!id) {
      Promise.all(dropdownFetches).catch(console.error).finally(() => setInitialLoading(false));
    } else {
      const cached = queryClient.getQueryData(["order-detail", id]);
      const orderDetailPromise = cached
        ? Promise.resolve(cached)
        : api.get(`/api/orders/${id}`).then((r) => r.data);

      // dropdowns and order detail run fully in parallel
      Promise.all([Promise.all(dropdownFetches).catch(console.error), orderDetailPromise])
        .then(([, orderData]) => {
          const order    = orderData.order;
          const products = orderData.products;
          // customerId may be a populated object or a plain ID string
          setCustomerId(order.customerId?._id || order.customerId || "");
          setOrderStatus(order.status || "");
          setOrderDate(order.orderDate?.slice(0, 10) || "");
          setSentDate(order.sentDate?.slice(0, 10) || "");
          setRecieveDate(order.recieveDate?.slice(0, 10) || "");
          setPaymentMode(order.paymentMode || "");
          setDiscount(order.discount || 0);
          // use product data from the response directly — avoids stale Redux closure
          setSelectedProducts(
            products.map((op) => ({
              _id:      op.productId._id,
              name:     op.productId.name,
              price:    op.productId.price,
              quantity: op.quantity || 1,
            }))
          );
        })
        .catch(console.error)
        .finally(() => setInitialLoading(false));
    }
  }, []);

  const subtotal = selectedProducts.reduce(
    (sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0
  );
  const total = Math.max(0, subtotal - Number(discount));

  const addProduct = (productId) => {
    const product = allProducts.find((p) => p._id === productId);
    if (!product || selectedProducts.some((p) => p._id === product._id)) return;
    setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
    setProductSearch("");
  };

  const removeProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const updateQty = (productId, qty) => {
    setSelectedProducts((prev) =>
      prev.map((p) => p._id === productId ? { ...p, quantity: qty === "" ? "" : parseInt(qty) } : p)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!orderDate) return setValidationError("Order Date is required.");
    if ((recieveDate || orderStatus === "Sent" || orderStatus === "Delivered") && !sentDate)
      return setValidationError("Sent Date is required when order is Sent or Delivered.");
    if (orderStatus === "Delivered" && !recieveDate)
      return setValidationError("Receive Date is required for Delivered orders.");

    const products = selectedProducts.map((p) => ({
      _id: p._id,
      quantity: Math.max(1, Number(p.quantity)),
    }));
    const order = { customerId, status: orderStatus, orderDate, sentDate: sentDate || undefined, recieveDate: recieveDate || undefined, paymentMode, products, discount };
    const selectedCustomer = allCustomers.find((c) => c._id === customerId);
    const request = id ? api.put(`/api/orders/${id}`, order) : api.post("/api/orders", order);
    setSubmitting(true);
    request
      .then((res) => {
        const orderRes = id ? res.data : res.data.order;
        orderRes.customerId = { _id: customerId, name: selectedCustomer?.name || "" };
        dispatch(id ? updateOrder(orderRes) : addOrder(orderRes));
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["ledger"] });
        navigate("/orders", { replace: true });
      })
      .catch(console.error)
      .finally(() => setSubmitting(false));
  };

  const filteredProducts = allProducts
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((p) =>
      !selectedProducts.some((s) => s._id === p._id) &&
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );

  return (
    <div className="page-card">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "8px 10px" }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="page-title">{id ? "Edit" : "New"} Order</h1>
        </div>
        {!initialLoading && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Total:{" "}
            <span className="font-semibold" style={{ color: "var(--rose-deep)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
              {total.toLocaleString()} PKR
            </span>
          </p>
        )}
      </div>

      <div className="page-body">
        {initialLoading ? (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton rounded-xl" style={{ height: 52 }} />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="orders-layout w-full">
              {/* LEFT: Order details */}
              <div className="flex flex-col gap-5">
                {/* Section: Customer & Status */}
                <Section title="Order Details" icon={<ShoppingBag size={15} />}>
                  <div className="form-grid-2">
                    <Field label="Customer" icon={<User size={14} />} required>
                      <select
                        className="form-control"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        required
                      >
                        <option value="">Select a customer…</option>
                        {allCustomers.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Payment Mode" icon={<CreditCard size={14} />}>
                      <div className="flex gap-2">
                        {PAYMENT_MODES.map((opt) => (
                          <RadioCard
                            key={opt.value}
                            opt={opt}
                            selected={paymentMode === opt.value}
                            onSelect={() => setPaymentMode(opt.value)}
                            name="paymentMode"
                          />
                        ))}
                      </div>
                    </Field>
                  </div>

                  {/* Status radio pills */}
                  <Field label="Order Status" icon={<Tag size={14} />} required>
                    <div className="flex gap-2 flex-wrap">
                      {ORDER_STATUSES.map((opt) => (
                        <RadioCard
                          key={opt.value}
                          opt={opt}
                          selected={orderStatus === opt.value}
                          onSelect={() => setOrderStatus(opt.value)}
                          name="orderStatus"
                        />
                      ))}
                    </div>
                  </Field>

                  <Field label="Discount (PKR)" icon={<Percent size={14} />}>
                    <input
                      className="form-control"
                      type="number"
                      min={0}
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </Field>
                </Section>

                {/* Section: Dates */}
                <Section title="Dates" icon={<Calendar size={15} />}>
                  <div className="form-grid-2 dates-grid">
                    <Field label="Order Date" required>
                      <input
                        className="form-control"
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        required
                      />
                    </Field>
                    <Field label="Sent Date">
                      <input
                        className="form-control"
                        type="date"
                        value={sentDate}
                        min={orderDate}
                        onChange={(e) => setSentDate(e.target.value)}
                      />
                    </Field>
                    <Field label="Receive Date">
                      <input
                        className="form-control"
                        type="date"
                        value={recieveDate}
                        min={sentDate}
                        onChange={(e) => setRecieveDate(e.target.value)}
                      />
                    </Field>
                  </div>
                </Section>

                {validationError && (
                  <p className="text-sm px-1" style={{ color: "#dc2626" }}>
                    {validationError}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="btn btn-outline flex-1 justify-center"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 justify-center"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                    {submitting ? "Saving…" : id ? "Update Order" : "Create Order"}
                  </button>
                </div>
              </div>

              {/* RIGHT: Products panel */}
              <div
                className="flex flex-col gap-4 rounded-2xl p-5"
                style={{ border: "1px solid var(--border-light)", background: "white", boxShadow: "var(--shadow-sm)" }}
              >
                <div className="flex items-center gap-2">
                  <Package size={15} style={{ color: "var(--rose-deep)" }} />
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    Products
                  </h3>
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "var(--rose-light)", color: "var(--rose-deep)" }}
                  >
                    {selectedProducts.length} selected
                  </span>
                </div>

                {/* Search to add */}
                <div className="relative">
                  <input
                    className="form-control w-full"
                    placeholder="Search products to add…"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  {productSearch && filteredProducts.length > 0 && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl overflow-hidden z-20"
                      style={{ boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}
                    >
                      {filteredProducts.slice(0, 6).map((p) => (
                        <button
                          key={p._id}
                          type="button"
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors"
                          style={{ color: "var(--text-primary)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--rose-light)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                          onClick={() => addProduct(p._id)}
                        >
                          <span>{p.name}</span>
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {p.price?.toLocaleString()} PKR
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected products list */}
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto" style={{ maxHeight: 320 }}>
                  {selectedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2" style={{ color: "var(--text-muted)" }}>
                      <Package size={28} strokeWidth={1.2} />
                      <span className="text-xs">No products added yet</span>
                    </div>
                  ) : (
                    selectedProducts.map((p) => (
                      <div
                        key={p._id}
                        className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{p.name}</p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {(p.price * (p.quantity || 1)).toLocaleString()} PKR
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
                            style={{ background: "var(--rose-light)", color: "var(--rose-deep)" }}
                            onClick={() => updateQty(p._id, Math.max(1, (p.quantity || 1) - 1))}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={p.quantity ?? 1}
                            onChange={(e) => updateQty(p._id, e.target.value)}
                            className="w-12 text-center text-sm font-medium rounded-lg border"
                            style={{ border: "1px solid var(--border)", padding: "4px 0", color: "var(--text-primary)" }}
                          />
                          <button
                            type="button"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
                            style={{ background: "var(--rose-light)", color: "var(--rose-deep)" }}
                            onClick={() => updateQty(p._id, (p.quantity || 1) + 1)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: "#fff5f5", color: "#dc2626" }}
                            onClick={() => removeProduct(p._id)}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal summary */}
                {selectedProducts.length > 0 && (
                  <div
                    className="rounded-xl px-4 py-3 flex flex-col gap-1"
                    style={{ background: "var(--cream)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex justify-between text-sm" style={{ color: "var(--text-muted)" }}>
                      <span>Subtotal</span>
                      <span>{subtotal.toLocaleString()} PKR</span>
                    </div>
                    {Number(discount) > 0 && (
                      <div className="flex justify-between text-sm" style={{ color: "#dc2626" }}>
                        <span>Discount</span>
                        <span>− {Number(discount).toLocaleString()} PKR</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-1" style={{ borderTop: "1px solid var(--border)", color: "var(--rose-deep)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
                      <span>Total</span>
                      <span>{total.toLocaleString()} PKR</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div
    className="flex flex-col gap-4 rounded-2xl p-5"
    style={{ border: "1px solid var(--border-light)", background: "white" }}
  >
    <div className="flex items-center gap-2 pb-1" style={{ borderBottom: "1px solid var(--border-light)" }}>
      <span style={{ color: "var(--rose-deep)" }}>{icon}</span>
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Field = ({ label, icon, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
      {icon && <span style={{ color: "var(--text-muted)" }}>{icon}</span>}
      {label}
      {required && <span style={{ color: "var(--rose-deep)" }}>*</span>}
    </label>
    {children}
  </div>
);

const RadioCard = ({ opt, selected, onSelect, name }) => (
  <label
    className="flex items-center gap-2 flex-1 cursor-pointer rounded-xl px-3 py-2 text-xs font-medium transition-all"
    style={{
      border: `1.5px solid ${selected ? opt.color : "var(--border)"}`,
      background: selected ? `${opt.color}12` : "white",
      color: selected ? opt.color : "var(--text-muted)",
      whiteSpace: "nowrap",
    }}
  >
    <input type="radio" name={name} value={opt.value} checked={selected} onChange={onSelect} className="sr-only" />
    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.color }} />
    {opt.value}
  </label>
);

export default Createorders;
