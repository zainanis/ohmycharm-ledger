import { useRef, useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../main.jsx";
import Paginate from "../components/utils/Paginate.jsx";
import Customercard from "../components/Customers/Customercard.jsx";
import api from "../utils/client.js";

const LIMIT = 12;

const fetchCustomers = ({ page, search }) =>
  api.get("/api/customers", {
    params: { page, limit: LIMIT, ...(search.trim() && { search: search.trim() }) },
  }).then((r) => r.data);

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search,      setSearch]      = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimer = useRef(null);

  const { data, isFetching } = useQuery({
    queryKey: ["customers", currentPage, debouncedSearch],
    queryFn:  () => fetchCustomers({ page: currentPage, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(val);
    }, 300);
  };

  const loading      = { loading: isFetching && !data, what: null };
  const isRefetching = isFetching && !!data;
  const totalPages   = Math.ceil((data?.total ?? 0) / LIMIT);

  useEffect(() => {
    if (!data) return;
    [-2, -1, 1, 2]
      .map((d) => currentPage + d)
      .filter((p) => p >= 1 && p <= totalPages)
      .forEach((p) =>
        queryClient.prefetchQuery({
          queryKey: ["customers", p, debouncedSearch],
          queryFn:  () => fetchCustomers({ page: p, search: debouncedSearch }),
        })
      );
  }, [data, currentPage, totalPages, debouncedSearch]);

  return (
    <div className="page-card">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search customers…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="page-body">
        <div className="flex justify-end">
          <NavLink className="btn btn-success" to="add">
            <Plus size={16} /> Add Customer
          </NavLink>
        </div>

        <Paginate
          items={data?.data ?? []}
          renderItem={(customer) => <Customercard key={customer._id} {...customer} />}
          pageKey="customers"
          loading={loading}
          isRefetching={isRefetching}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={data?.total ?? 0}
          itemsPerPage={LIMIT}
        />
      </div>
    </div>
  );
};

export default Customers;
