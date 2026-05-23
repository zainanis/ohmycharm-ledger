import { useRef, useState, useEffect } from "react";
import api from "../utils/client";
import { Plus } from "lucide-react";
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../main.jsx";
import Paginate from "../components/utils/Paginate";
import ProductCard from "../components/Products/ProductCard";

const LIMIT = 12;

const fetchProducts = ({ page, status, search }) =>
  api.get("/api/products", {
    params: {
      page, limit: LIMIT,
      ...(status !== "All" && { status }),
      ...(search.trim() && { search: search.trim() }),
    },
  }).then((r) => r.data);

const Products = () => {
  const [currentPage,    setCurrentPage]    = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search,         setSearch]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimer = useRef(null);

  const { data, isFetching } = useQuery({
    queryKey: ["products", currentPage, selectedStatus, debouncedSearch],
    queryFn:  () => fetchProducts({ page: currentPage, status: selectedStatus, search: debouncedSearch }),
    placeholderData: (prev) => prev, // keep showing old data while fetching new page
  });

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(val);
    }, 300);
  };

  const handleStatus = (val) => {
    setSelectedStatus(val);
    setCurrentPage(1);
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
          queryKey: ["products", p, selectedStatus, debouncedSearch],
          queryFn:  () => fetchProducts({ page: p, status: selectedStatus, search: debouncedSearch }),
        })
      );
  }, [data, currentPage, totalPages, selectedStatus, debouncedSearch]);

  return (
    <div className="page-card">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search products…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="page-body">
        <div className="flex justify-end gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => handleStatus(e.target.value)}
            className="form-control"
            style={{ width: "auto" }}
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
          items={data?.data ?? []}
          renderItem={(product) => <ProductCard key={product._id} {...product} />}
          pageKey="products"
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

export default Products;
