import { useEffect, useState } from "react";
import api from "../utils/client";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router";

import Paginate from "../components/utils/Paginate";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../state/productsSlice";

const Products = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const allProducts = useSelector((state) => state.products.allProducts);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ loading: false, what: null });

  useEffect(() => {
    if (allProducts.length === 0) {
      setLoading({ loading: true, what: "Products" });

      api
        .get("/api/products")
        .then((res) => {
          console.log(res);

          dispatch(setProducts(res.data));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoading({ loading: false, what: null }));
    }
  }, []);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className=" bg-white rounded-lg shadow flex gap-2 p-2  flex-col justify-between max-w-7xl ">
      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">Products</h1>
          <input
            type="text"
            className="border-1 border-solid border-stone-200 rounded-lg pr-20 py-2 pl-5"
            placeholder="Search Products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex justify-end px-5 gap-5 ">
          <NavLink
            className=" flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
            to="add"
          >
            <FaPlus />
            Add Product
          </NavLink>

          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="border px-4 py-2 rounded border-stone-200 text-stone-500"
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Discontinued">Discontinued</option>
            <option value="Out of Stock">Currently Unavailable</option>
          </select>
        </div>
      </div>

      <Paginate
        who="Product"
        loading={loading}
        allProducts={allProducts}
        selectedStatus={selectedStatus}
        currentPage={currentPage}
        search={search}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Products;
