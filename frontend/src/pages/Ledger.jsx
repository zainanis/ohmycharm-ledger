import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router";
import Mytable from "../components/utils/Mytable.jsx";

import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../state/expenseSlice.js";

const Ledger = () => {
  const dispatch = useDispatch();
  const [ledger, setLedger] = useState([]);

  const [filter, setFilter] = useState("All");

  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/ledger")
      .then((res) => {
        setLedger(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className=" bg-white rounded-lg shadow flex gap-2 p-2  flex-col justify-between  ">
      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">Expenses</h1>
          <input
            type="text"
            className="border-1 border-solid border-stone-200 rounded-lg pr-20 py-2 pl-5"
            placeholder="Search Expenses"
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
            Add Expense
          </NavLink>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-4 py-2 rounded border-stone-200 text-stone-500"
          >
            <option value="All">All</option>
            <option value="Goods Purchase">Goods Purchase</option>
            <option value="Advertisement">Advertisement</option>
          </select>
        </div>
        <Mytable
          who="ledger"
          data={ledger}
          header={[
            { label: "Source", path: ".source" },
            { label: "Payment Mode", path: ".paymentMode" },
            { label: "type", path: ".type" },
            { label: "Amount", path: ".amount" },
            { label: "Date", path: ".date" },
            { label: "Total Amount", path: ".totalAmount" },
          ]}
          filter={filter}
          orderBy="date"
        />
      </div>
    </div>
  );
};

export default Ledger;
