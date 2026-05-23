import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, User, Phone, MapPin, Mail, Loader2 } from "lucide-react";
import { addCustomer, updateCustomer, setCustomers } from "../../state/customerSlice";
import api from "../../utils/client.js";
import { queryClient } from "../../main.jsx";

export const Createcustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allCustomers = useSelector((state) => state.customers.allCustomers);

  const [submitting,  setSubmitting]  = useState(false);
  const [loadingItem, setLoadingItem] = useState(!!id);
  const [name,        setName]        = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address,     setAddress]     = useState("");
  const [email,       setEmail]       = useState("");

  useEffect(() => {
    if (!id) return;
    const populate = (customers) => {
      const customer = customers.find((c) => c._id === id);
      if (customer) {
        setName(customer.name || "");
        setAddress(customer.address || "");
        setPhonenumber(customer.phoneNumber || "");
        setEmail(customer.email || "");
      }
      setLoadingItem(false);
    };
    const cached = allCustomers.find((c) => c._id === id);
    if (cached) {
      populate([cached]);
    } else {
      api.get(`/api/customers/${id}`)
        .then((res) => populate([res.data]))
        .catch(() => setLoadingItem(false));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, phoneNumber: parseFloat(phonenumber), address, email };
    const request = id ? api.put(`/api/customers/${id}`, payload) : api.post("/api/customers", payload);
    setSubmitting(true);
    request
      .then((res) => {
        dispatch(id ? updateCustomer(res.data) : addCustomer(res.data));
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        navigate("/customers", { replace: true });
      })
      .catch(console.error)
      .finally(() => setSubmitting(false));
  };

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
          <h1 className="page-title">{id ? "Edit" : "Add"} Customer</h1>
        </div>
      </div>

      <div className="page-body">
        <div className="max-w-lg w-full mx-auto form-card">
          {loadingItem ? <FormSkeleton rows={4} /> : <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <Field label="Full Name" icon={<User size={15} />} required>
              <input
                className="form-control"
                type="text"
                placeholder="e.g. Aisha Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            {/* Phone */}
            <Field label="Phone Number" icon={<Phone size={15} />} required>
              <input
                className="form-control"
                type="number"
                placeholder="e.g. 03001234567"
                value={phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
                required
              />
            </Field>

            {/* Address */}
            <Field label="Address" icon={<MapPin size={15} />} required>
              <input
                className="form-control"
                type="text"
                placeholder="e.g. House 5, Street 3, Lahore"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Field>

            {/* Email */}
            <Field label="Email" icon={<Mail size={15} />}>
              <input
                className="form-control"
                type="email"
                placeholder="e.g. aisha@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

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
                {submitting ? "Saving…" : id ? "Update Customer" : "Create Customer"}
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

export default Createcustomer;
