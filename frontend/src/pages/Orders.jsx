import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router";
import Mytable from "../components/utils/Mytable.jsx";

import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../state/orderSlice.js";

const Orders = () => {
  const dispatch = useDispatch();
  const allOrders = useSelector((state) => state.orders.allOrders);

  const [filter, setFilter] = useState("All");

  const [search, setSearch] = useState("");

  useEffect(() => {
    // if (allOrders.length === 0) {
    axios
      .get("http://localhost:5001/api/orders")
      .then((res) => {
        dispatch(setOrders(res.data));
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  }, []);

  // console.log(allOrders);

  return (
    <div className=" bg-white rounded-lg shadow flex gap-2 p-2  flex-col justify-between  ">
      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">Orders</h1>
          <input
            type="text"
            className="border-1 border-solid border-stone-200 rounded-lg pr-20 py-2 pl-5"
            placeholder="Search Orders"
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
            Add Orders
          </NavLink>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-4 py-2 rounded border-stone-200 text-stone-500"
          >
            <option value="All">All</option>
            {/* <option value="Goods Purchase">Goods Purchase</option>
            <option value="Advertisement">Advertisement</option> */}
          </select>
        </div>

        <Mytable
          who="orders"
          data={allOrders}
          header={[
            { label: "Customer Name", path: ".customerId.name" },
            { label: "Status", path: ".status" },
            { label: "Order Date", path: ".orderDate" },
            { label: "Sent Date", path: ".sentDate" },
            { label: "Recieve Date", path: ".recieveDate" },
            { label: "Payment Mode", path: ".paymentMode" },
            { label: "Total Amount", path: ".totalAmount" },
          ]}
          filter={filter}
        />
      </div>
    </div>
  );
};

export default Orders;
