import { useEffect, useState } from "react";
import api from "../utils/client.js";
import Mytable from "../components/utils/Mytable.jsx";
import { Download, X } from "lucide-react";

const LIMIT = 20;

const Ledger = () => {
  const [data,      setData]      = useState([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [filter,    setFilter]    = useState("All");
  const [filterBy,  setFilterBy]  = useState("type");
  const [loading,   setLoading]   = useState({ loading: false, what: null });
  const [from,      setFrom]      = useState("");
  const [to,        setTo]        = useState("");
  const [dateError, setDateError] = useState("");

  const buildParams = (overrides = {}) => ({
    page,
    limit: LIMIT,
    ...(filter !== "All" && { [filterBy]: filter }),
    ...(from && { from }),
    ...(to && { to }),
    ...overrides,
  });

  const fetchLedger = (overrides = {}) => {
    setLoading({ loading: true, what: "Ledger" });
    api.get("/api/ledger", { params: buildParams(overrides) })
      .then((res) => { setData(res.data.data); setTotal(res.data.total); })
      .catch(console.error)
      .finally(() => setLoading({ loading: false, what: null }));
  };

  useEffect(() => {
    setPage(1);
    fetchLedger({ page: 1 });
  }, [filter, filterBy, from, to]);

  useEffect(() => {
    fetchLedger();
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

  const handleExportCSV = async () => {
    // Fetch all filtered entries (no pagination) for export
    const res = await api.get("/api/ledger", { params: buildParams({ page: 1, limit: 999999 }) });
    const rows = res.data.data;

    const headers = ["Date", "Source", "Type", "Payment Mode", "Amount", "Running Total"];
    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [
          new Date(r.date).toLocaleDateString("en-GB"),
          `"${r.source ?? ""}"`,
          r.type,
          r.paymentMode ?? "",
          r.amount,
          r.runningTotal,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <h1 className="page-title">Ledger</h1>
        <button className="btn btn-success" onClick={handleExportCSV}>
          <Download size={15} /> Export CSV
        </button>
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
                    <option value="All">All</option>
                    <option value="Profit">Profits</option>
                    <option value="Advertisement,Goods Purchase">Expenses</option>
                  </>
                ) : (
                  <>
                    <option value="All">All</option>
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
          who="ledger"
          data={data}
          loading={loading}
          header={[
            { label: "Source",        path: ".source" },
            { label: "Payment Mode",  path: ".paymentMode" },
            { label: "Type",          path: ".type" },
            { label: "Amount",        path: ".amount" },
            { label: "Date",          path: ".date" },
            { label: "Running Total", path: ".runningTotal" },
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

export default Ledger;
