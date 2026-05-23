import { useRef, useState, useEffect } from "react";
import api from "../utils/client.js";
import { Plus, X } from "lucide-react";
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../main.jsx";
import Mytable from "../components/utils/Mytable.jsx";

const LIMIT = 20;

const fetchOrders = (params) =>
  api.get("/api/orders", { params }).then((r) => r.data);

const Orders = () => {
  const [page,      setPage]      = useState(1);
  const [filter,    setFilter]    = useState("All");
  const [filterBy,  setFilterBy]  = useState("status");
  const [orderBy,   setOrderBy]   = useState("orderDate");
  const [from,      setFrom]      = useState("");
  const [to,        setTo]        = useState("");
  const [search,    setSearch]    = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateError, setDateError] = useState("");
  const searchTimer = useRef(null);

  const buildParams = (overrides = {}) => ({
    sortBy: orderBy,
    page,
    limit: LIMIT,
    ...(filter !== "All" && { [filterBy]: filter }),
    ...(from && { from }),
    ...(to && { to }),
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
    ...overrides,
  });

  const queryKey = ["orders", page, filter, filterBy, orderBy, from, to, debouncedSearch];

  const { data, isFetching } = useQuery({
    queryKey,
    queryFn: () => fetchOrders(buildParams()),
    placeholderData: (prev) => prev,
  });

  const loading    = { loading: isFetching && !data, what: null };
  const totalPages = Math.ceil((data?.total ?? 0) / LIMIT);

  useEffect(() => {
    if (!data) return;
    [-2, -1, 1, 2]
      .map((d) => page + d)
      .filter((p) => p >= 1 && p <= totalPages)
      .forEach((p) =>
        queryClient.prefetchQuery({
          queryKey: ["orders", p, filter, filterBy, orderBy, from, to, debouncedSearch],
          queryFn:  () => fetchOrders(buildParams({ page: p })),
        })
      );
  }, [data, page, totalPages, filter, filterBy, orderBy, from, to, debouncedSearch]);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(val);
    }, 300);
  };

  const handleFilterChange   = (val) => { setFilter(val);  setPage(1); };
  const handleFilterByChange = (val) => { setFilterBy(val); setFilter("All"); setPage(1); };
  const handleOrderByChange  = (val) => { setOrderBy(val); setPage(1); };

  const handleFrom = (val) => {
    if (to && new Date(val) > new Date(to)) { setDateError("'From' date cannot be later than 'To' date."); return; }
    setDateError(""); setFrom(val); setPage(1);
  };
  const handleTo = (val) => {
    if (from && new Date(val) < new Date(from)) { setDateError("'To' date cannot be earlier than 'From' date."); return; }
    setDateError(""); setTo(val); setPage(1);
  };
  const clearDates = () => { setFrom(""); setTo(""); setDateError(""); setPage(1); };

  return (
    <div className="page-card">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <input
          className="form-control search-input"
          type="text"
          placeholder="Search by customer name"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="page-body">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Order By</label>
              <select value={orderBy} onChange={(e) => handleOrderByChange(e.target.value)} className="form-control">
                <option value="orderDate">Order Date</option>
                <option value="sentDate">Sent Date</option>
                <option value="recieveDate">Receive Date</option>
              </select>
            </div>
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
              <select value={filterBy} onChange={(e) => handleFilterByChange(e.target.value)} className="form-control">
                <option value="status">Status</option>
                <option value="paymentMode">Payment Mode</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>&nbsp;</label>
              <select value={filter} onChange={(e) => handleFilterChange(e.target.value)} className="form-control">
                {filterBy === "status" ? (
                  <>
                    <option value="All">All statuses</option>
                    <option value="Placed">Placed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Sent">Sent</option>
                    <option value="Delivered">Delivered</option>
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
            <NavLink className="btn btn-success" to="add">
              <Plus size={16} /> New Order
            </NavLink>
          </div>
        </div>

        {dateError && <p className="text-sm" style={{ color: "#dc2626" }}>{dateError}</p>}

        <Mytable
          who="orders"
          data={data?.data ?? []}
          loading={loading}
          header={[
            { label: "Customer",     path: ".customerId.name" },
            { label: "Status",       path: ".status" },
            { label: "Order Date",   path: ".orderDate" },
            { label: "Sent Date",    path: ".sentDate" },
            { label: "Receive Date", path: ".recieveDate" },
            { label: "Payment Mode", path: ".paymentMode" },
            { label: "Total",        path: ".totalAmount" },
          ]}
          total={data?.total ?? 0}
          page={page}
          limit={LIMIT}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Orders;
