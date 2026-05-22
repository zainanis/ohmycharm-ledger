import { useEffect, useRef, useState } from "react";
import api from "../utils/client";
import { Plus } from "lucide-react";
import { NavLink } from "react-router";
import Paginate from "../components/utils/Paginate";
import ProductCard from "../components/Products/ProductCard";

const LIMIT = 12;

const Products = () => {
  const [data,           setData]           = useState([]);
  const [total,          setTotal]          = useState(0);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search,         setSearch]         = useState("");
  const [loading,        setLoading]        = useState({ loading: false, what: null });

  const searchTimer = useRef(null);

  const fetchProducts = (overrides = {}) => {
    const params = {
      page: currentPage,
      limit: LIMIT,
      ...(selectedStatus !== "All" && { status: selectedStatus }),
      ...(search.trim() && { search: search.trim() }),
      ...overrides,
    };
    setLoading({ loading: true, what: "Products" });
    api.get("/api/products", { params })
      .then((res) => { setData(res.data.data); setTotal(res.data.total); })
      .catch(console.error)
      .finally(() => setLoading({ loading: false, what: null }));
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts({ page: 1 });
  }, [selectedStatus]);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts({ page: 1, search: search.trim() });
    }, 300);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  return (
    <div className="page-card">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="page-body">
        <div className="flex justify-end gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-control"
          >
            <option value="All">All statuses</option>
            <option value="Available">Available</option>
            <option value="Discontinued">Discontinued</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <NavLink className="btn btn-success" to="add">
            <Plus size={16} /> Add Product
          </NavLink>
        </div>

        <Paginate
          items={data}
          renderItem={(product) => <ProductCard key={product._id} {...product} />}
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

export default Products;
