import { useEffect, useState } from "react";
import api from "../utils/client.js";
import { Plus, X } from "lucide-react";
import { NavLink } from "react-router";
import Mytable from "../components/utils/Mytable.jsx";

const LIMIT = 20;

const Expenses = () => {
  const [data,      setData]      = useState([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [filter,    setFilter]    = useState("All");
  const [filterBy,  setFilterBy]  = useState("type");
  const [loading,   setLoading]   = useState({ loading: false, what: null });
  const [from,      setFrom]      = useState("");
  const [to,        setTo]        = useState("");
  const [dateError, setDateError] = useState("");

  const fetchExpenses = (overrides = {}) => {
    const params = {
      page,
      limit: LIMIT,
      ...(filter !== "All" && { [filterBy]: filter }),
      ...(from && { from }),
      ...(to && { to }),
      ...overrides,
    };
    setLoading({ loading: true, what: "Expenses" });
    api.get("/api/expenses", { params })
      .then((res) => { setData(res.data.data); setTotal(res.data.total); })
      .catch(console.error)
      .finally(() => setLoading({ loading: false, what: null }));
  };

  useEffect(() => {
    setPage(1);
    fetchExpenses({ page: 1 });
  }, [filter, filterBy, from, to]);

  useEffect(() => {
    fetchExpenses();
  }, [page]);

  const handleFrom = (val) => {
    if (to && new Date(val) > new Date(to)) { setDateError("'From' date cannot be later than 'To' date."); return; }
    setDateError(""); setFrom(val);
  };
  const handleTo = (val) => {
    if (from && new Date(val) < new Date(from)) { setDateError("'To' date cannot be earlier than 'From' date."); return; }
    setDateError(""); setTo(val);
  };
  const clearDates = () => { setFrom(""); setTo(""); setDateError(""); };

  return (
    <div className="page-card">
      <div className="page-header">
        <h1 className="page-title">Expenses</h1>
        <NavLink className="btn btn-success" to="add">
          <Plus size={16} /> New Expense
        </NavLink>
      </div>

      <div className="page-body">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>From</label>
              <input type="date" value={from} onChange={(e) => handleFrom(e.target.value)} className="form-control" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>To</label>
              <input type="date" value={to} min={from} onChange={(e) => handleTo(e.target.value)} className="form-control" />
            </div>
            {(from || to) && (
              <button className="btn" style={{ padding: "8px 14px", background: "var(--rose-light)", color: "var(--rose-deep)" }} onClick={clearDates}>
                <X size={14} /> Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Filter By</label>
              <select value={filterBy} onChange={(e) => { setFilterBy(e.target.value); setFilter("All"); }} className="form-control">
                <option value="type">Type</option>
                <option value="paymentMode">Payment Mode</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>&nbsp;</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-control">
                {filterBy === "type" ? (
                  <>
                    <option value="All">All types</option>
                    <option value="Goods Purchase">Goods Purchase</option>
                    <option value="Advertisement">Advertisement</option>
                  </>
                ) : (
                  <>
                    <option value="All">All modes</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {dateError && <p className="text-sm" style={{ color: "#dc2626" }}>{dateError}</p>}

        <Mytable
          who="expenses"
          data={data}
          loading={loading}
          header={[
            { label: "Name",         path: ".name" },
            { label: "Type",         path: ".type" },
            { label: "Cost",         path: ".cost" },
            { label: "Payment Mode", path: ".paymentMode" },
            { label: "Date",         path: ".date" },
            { label: "Description",  path: ".description" },
          ]}
          total={total}
          page={page}
          limit={LIMIT}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Expenses;
