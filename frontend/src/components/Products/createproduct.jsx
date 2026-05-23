import { useState, useEffect } from "react";
import api from "../../utils/client.js";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Tag, DollarSign, FileText, ToggleRight, Loader2 } from "lucide-react";
import { addProduct, updateProduct, setProducts } from "../../state/productsSlice";
import { queryClient } from "../../main.jsx";

export const Createproduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.allProducts);

  const [submitting,   setSubmitting]   = useState(false);
  const [loadingItem,  setLoadingItem]  = useState(!!id);
  const [name,         setName]         = useState("");
  const [price,        setPrice]        = useState("");
  const [description,  setDescription]  = useState("");
  const [status,       setStatus]       = useState("Available");

  useEffect(() => {
    if (!id) return;
    const populate = (products) => {
      const product = products.find((p) => p._id === id);
      if (product) {
        setName(product.name || "");
        setPrice(product.price || "");
        setDescription(product.description || "");
        setStatus(product.status || "Available");
      }
      setLoadingItem(false);
    };
    if (allProducts.length === 0) {
      api.get("/api/products")
        .then((res) => { dispatch(setProducts(res.data.data)); populate(res.data.data); })
        .catch(() => setLoadingItem(false));
    } else {
      populate(allProducts);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, price: parseFloat(price), description, status };
    const request = id ? api.put(`/api/products/${id}`, payload) : api.post("/api/products", payload);
    setSubmitting(true);
    request
      .then((res) => {
        dispatch(id ? updateProduct(res.data) : addProduct(res.data));
        queryClient.invalidateQueries({ queryKey: ["products"] });
        navigate("/products", { replace: true });
      })
      .catch(console.error)
      .finally(() => setSubmitting(false));
  };

  const STATUS_OPTIONS = [
    { value: "Available",   label: "Available",    color: "#16a34a" },
    { value: "Out of Stock",label: "Out of Stock",  color: "#ea580c" },
    { value: "Discontinued",label: "Discontinued",  color: "#dc2626" },
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
          <h1 className="page-title">{id ? "Edit" : "Add"} Product</h1>
        </div>
      </div>

      <div className="page-body">
        <div className="max-w-xl w-full mx-auto form-card">
          {loadingItem ? <FormSkeleton rows={3} /> : <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name + Price side by side */}
            <div className="form-grid-2">
              <Field label="Product Name" icon={<Tag size={15} />} required>
                <input
                  className="form-control"
                  type="text"
                  placeholder="e.g. Gold Bracelet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field label="Price (PKR)" icon={<DollarSign size={15} />} required>
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  placeholder="e.g. 2500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Description" icon={<FileText size={15} />}>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Optional — describe this product…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </Field>

            {/* Status as visual radio cards */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium flex items-center gap-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                <span style={{ color: "var(--text-muted)" }}><ToggleRight size={15} /></span>
                Status <span style={{ color: "var(--rose-deep)" }}>*</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {STATUS_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 flex-1 cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition-all"
                    style={{
                      border: `1.5px solid ${status === opt.value ? opt.color : "var(--border)"}`,
                      background: status === opt.value ? `${opt.color}12` : "white",
                      color: status === opt.value ? opt.color : "var(--text-muted)",
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={opt.value}
                      checked={status === opt.value}
                      onChange={() => setStatus(opt.value)}
                      className="sr-only"
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: opt.color }}
                    />
                    {opt.label}
                  </label>
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
                {submitting ? "Saving…" : id ? "Update Product" : "Create Product"}
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
    <label
      className="text-sm font-medium flex items-center gap-1.5"
      style={{ color: "var(--text-primary)" }}
    >
      {icon && <span style={{ color: "var(--text-muted)" }}>{icon}</span>}
      {label}
      {required && <span style={{ color: "var(--rose-deep)" }}>*</span>}
    </label>
    {children}
  </div>
);

export default Createproduct;
