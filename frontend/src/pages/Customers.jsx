import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router";
import Paginate from "../components/utils/Paginate.jsx";
import { setCustomers } from "../state/customerSlice.js";

import { useDispatch, useSelector } from "react-redux";

const Customers = () => {
  const dispatch = useDispatch();
  const allCustomers = useSelector((state) => state.customers.allCustomers);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (allCustomers.length === 0) {
      axios
        .get("http://localhost:5001/api/customers")
        .then((res) => {
          console.log(res);
          dispatch(setCustomers(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className=" bg-white rounded-lg shadow flex gap-2 p-2  flex-col justify-between ">
      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">Customers</h1>
          <input
            type="text"
            className="border-1 border-solid border-stone-200 rounded-lg pr-20 py-2 pl-5"
            placeholder="Search Customers"
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
            Add Customer
          </NavLink>
        </div>
      </div>

      <Paginate
        who="Customer"
        allProducts={allCustomers}
        currentPage={currentPage}
        search={search}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Customers;
