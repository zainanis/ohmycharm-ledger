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
  const [filterBy, setFilterby] = useState("status");
  const [orderBy, setOrderby] = useState("orderDate");
  const [loading, setLoading] = useState({ loading: false, what: null });

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (allOrders.length === 0) {
      setLoading({ loading: true, what: "Orders" });
      axios
        .get("http://localhost:5001/api/orders")
        .then((res) => {
          dispatch(setOrders(res.data));
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading({ loading: false, what: null });
        });
    }
  }, []);

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

        <div className="flex justify-between px-5 gap-5 h-15 ">
          <div className="flex gap-5 items-end">
            <div className="flex gap-5 items-end">
              <div>
                <h2 className="font-medium">Order By :</h2>
                <select
                  value={orderBy}
                  onChange={(e) => setOrderby(e.target.value)}
                  className="border px-4 py-2 h-10 w-45  rounded border-stone-200 text-stone-500"
                >
                  <option value="orderDate">Order Date</option>
                  <option value="sentDate">Sent Date</option>
                  <option value="recieveDate">Recieve Date</option>
                </select>
              </div>
            </div>
            <div className="flex gap-5 items-end">
              <div>
                <h2 className="font-medium">From :</h2>
                <input
                  value={from}
                  onChange={(e) => {
                    const newFromDate = e.target.value;
                    if (to && new Date(newFromDate) > new Date(to)) {
                      alert("'From' date cannot be later than the 'To' date.");
                      return;
                    }
                    setFrom(newFromDate);
                  }}
                  type="date"
                  className="border rounded h-10 px-4 py-2 border-stone-200 text-stone-500"
                />
              </div>
            </div>
            <div className="flex gap-5 items-end">
              <div>
                <h2 className="font-medium">To :</h2>
                <input
                  value={to}
                  onChange={(e) => {
                    const newToDate = e.target.value;
                    if (from && new Date(newToDate) < new Date(from)) {
                      alert(
                        "The 'To' date cannot be earlier than the 'From' date."
                      );
                      return;
                    }
                    setTo(newToDate);
                  }}
                  min={from}
                  type="date"
                  className="border rounded h-10 px-4 py-2 border-stone-200 text-stone-500"
                />
              </div>
            </div>

            <button
              className=" flex items-center h-10 w-30 justify-center gap-2 px-4 py-2 rounded-2xl bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
              onClick={() => {
                setTo("");
                setFrom("");
              }}
            >
              Clear Dates
            </button>
          </div>

          <div className="flex justify-end items-end px-5 gap-5 h-15 ">
            <div className="flex gap-5 items-end">
              <div>
                <h2 className="font-medium">Filter By:</h2>
                <select
                  value={filterBy}
                  onChange={(e) => {
                    setFilterby(e.target.value);
                    setFilter("All");
                  }}
                  className="border rounded h-10 px-4 py-2 border-stone-200 text-stone-500"
                >
                  <option value="status">Status</option>
                  <option value="paymentMode">Payment Mode</option>
                </select>
              </div>

              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border px-4 py-2 h-10 w-45  rounded border-stone-200 text-stone-500"
                >
                  {filterBy === "status" ? (
                    <>
                      <option value="All">All</option>
                      <option value="Placed">Placed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Sent">Sent</option>
                      <option value="Delivered">Delivered</option>
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
            <NavLink
              className=" flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
              to="add"
            >
              <FaPlus />
              Add Orders
            </NavLink>
          </div>
        </div>
        <Mytable
          who="orders"
          data={allOrders}
          loading={loading}
          header={[
            { label: "Customer Name", path: ".customerId.name" },
            { label: "Status", path: ".status" },
            { label: "Order Date", path: ".orderDate" },
            { label: "Sent Date", path: ".sentDate" },
            { label: "Recieve Date", path: ".recieveDate" },
            { label: "Payment Mode", path: ".paymentMode" },
            { label: "Total Amount", path: ".totalAmount" },
          ]}
          filterBy={filterBy}
          filter={filter}
          orderBy={orderBy}
          from={from}
          to={to}
        />
      </div>
    </div>
  );
};

export default Orders;
