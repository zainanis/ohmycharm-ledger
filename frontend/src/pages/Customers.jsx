import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { NavLink } from "react-router";
import Paginate from "../components/utils/Paginate.jsx";
import Customercard from "../components/Customers/Customercard.jsx";
import api from "../utils/client.js";

const LIMIT = 12;

const Customers = () => {
  const [data,        setData]        = useState([]);
  const [total,       setTotal]       = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search,      setSearch]      = useState("");
  const [loading,     setLoading]     = useState({ loading: false, what: null });

  const searchTimer = useRef(null);

  const fetchCustomers = (overrides = {}) => {
    const params = {
      page: currentPage,
      limit: LIMIT,
      ...(search.trim() && { search: search.trim() }),
      ...overrides,
    };
    setLoading({ loading: true, what: "Customers" });
    api.get("/api/customers", { params })
      .then((res) => { setData(res.data.data); setTotal(res.data.total); })
      .catch(console.error)
      .finally(() => setLoading({ loading: false, what: null }));
  };

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      fetchCustomers({ page: 1, search: search.trim() });
    }, 300);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  return (
    <div className="page-card">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search customers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="page-body">
        <div className="flex justify-end">
          <NavLink className="btn btn-success" to="add">
            <Plus size={16} /> Add Customer
          </NavLink>
        </div>

        <Paginate
          items={data}
          renderItem={(customer) => <Customercard key={customer._id} {...customer} />}
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={total}
          itemsPerPage={LIMIT}
        />
      </div>
    </div>
  );
};

export default Customers;
