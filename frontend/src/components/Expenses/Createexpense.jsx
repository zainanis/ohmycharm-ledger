import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, FileText, DollarSign, Calendar, AlignLeft, Tag, CreditCard, Loader2 } from "lucide-react";
import { addExpense, setExpenses, updateExpense } from "../../state/expenseSlice";
import api from "../../utils/client.js";
import { queryClient } from "../../main.jsx";

const Createexpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.allExpenses);

  const [submitting,   setSubmitting]   = useState(false);
  const [loadingItem,  setLoadingItem]  = useState(!!id);
  const [name,         setName]         = useState("");
  const [date,         setDate]         = useState("");
  const [cost,         setCost]         = useState("");
  const [description,  setDescription]  = useState("");
  const [expenseType,  setExpenseType]  = useState("");
  const [paymentMode,  setPaymentMode]  = useState("");

  useEffect(() => {
    if (!id) return;
    const populate = (expenses) => {
      const expense = expenses.find((e) => e._id === id);
      if (expense) {
        setName(expense.name || "");
        setDate(expense.date?.slice(0, 10) || "");
        setCost(expense.cost || "");
        setDescription(expense.description || "");
        setExpenseType(expense.type || "");
        setPaymentMode(expense.paymentMode || "");
      }
      setLoadingItem(false);
    };
    if (allExpenses.length === 0) {
      api.get("/api/expenses")
        .then((res) => { dispatch(setExpenses(res.data.data)); populate(res.data.data); })
        .catch(() => setLoadingItem(false));
    } else {
      populate(allExpenses);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, cost: parseFloat(cost), date, description, type: expenseType, paymentMode };
    const request = id ? api.put(`/api/expenses/${id}`, payload) : api.post("/api/expenses", payload);
    setSubmitting(true);
    request
      .then((res) => {
        dispatch(id ? updateExpense(res.data) : addExpense(res.data));
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        queryClient.invalidateQueries({ queryKey: ["ledger"] });
        navigate("/expenses", { replace: true });
      })
      .catch(console.error)
      .finally(() => setSubmitting(false));
  };

  const EXPENSE_TYPES = [
    { value: "Advertisement",  label: "Advertisement",  color: "#7c3aed" },
    { value: "Goods Purchase", label: "Goods Purchase", color: "#0369a1" },
  ];

  const PAYMENT_MODES = [
    { value: "Cash",   label: "Cash",   color: "#16a34a" },
    { value: "Online", label: "Online", color: "#0369a1" },
  ];

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
          <h1 className="page-title">{id ? "Edit" : "Add"} Expense</h1>
        </div>
      </div>

      <div className="page-body">
        <div className="max-w-2xl w-full mx-auto form-card">
          {loadingItem ? <FormSkeleton rows={4} /> : <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name + Cost */}
            <div className="form-grid-2">
              <Field label="Expense Name" icon={<FileText size={15} />} required>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g. Facebook Ads"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field label="Cost (PKR)" icon={<DollarSign size={15} />} required>
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  placeholder="e.g. 5000"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                />
              </Field>
            </div>

            {/* Date + Description */}
            <div className="form-grid-2">
              <Field label="Date" icon={<Calendar size={15} />} required>
                <input
                  className="form-control"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Field>

              <Field label="Description" icon={<AlignLeft size={15} />}>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Optional notes…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
            </div>

            {/* Expense Type */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
                <span style={{ color: "var(--text-muted)" }}><Tag size={15} /></span>
                Expense Type <span style={{ color: "var(--rose-deep)" }}>*</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {EXPENSE_TYPES.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    opt={opt}
                    selected={expenseType === opt.value}
                    onSelect={() => setExpenseType(opt.value)}
                    name="expenseType"
                  />
                ))}
              </div>
            </div>

            {/* Payment Mode */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
                <span style={{ color: "var(--text-muted)" }}><CreditCard size={15} /></span>
                Payment Mode <span style={{ color: "var(--rose-deep)" }}>*</span>
              </label>
              <div className="flex gap-3 flex-wrap">
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
            </div>

            <div className="flex gap-3 pt-2">
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
                {submitting ? "Saving…" : id ? "Update Expense" : "Create Expense"}
              </button>
            </div>
          </form>}
        </div>
      </div>
    </div>
  );
};

const FormSkeleton = ({ rows }) => (
  <div className="flex flex-col gap-5">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <div className={`skeleton skeleton-d${(i % 5) + 1}`} style={{ height: 14, width: 90, borderRadius: 4 }} />
        <div className={`skeleton skeleton-d${(i % 5) + 1}`} style={{ height: 42, borderRadius: 12 }} />
      </div>
    ))}
    <div className="flex gap-3 pt-2">
      <div className="skeleton" style={{ height: 42, flex: 1, borderRadius: 12 }} />
      <div className="skeleton" style={{ height: 42, flex: 1, borderRadius: 12 }} />
    </div>
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
    className="flex items-center gap-2 flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition-all"
    style={{
      border: `1.5px solid ${selected ? opt.color : "var(--border)"}`,
      background: selected ? `${opt.color}12` : "white",
      color: selected ? opt.color : "var(--text-muted)",
    }}
  >
    <input type="radio" name={name} value={opt.value} checked={selected} onChange={onSelect} className="sr-only" />
    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: opt.color }} />
    {opt.label}
  </label>
);

export default Createexpense;
