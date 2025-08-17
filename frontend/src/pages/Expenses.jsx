import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router";
import Mytable from "../components/utils/Mytable.jsx";

import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../state/expenseSlice.js";

const Expenses = () => {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.allExpenses);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (allExpenses.length === 0) {
      axios
        .get("http://localhost:5001/api/expenses")
        .then((res) => {
          dispatch(setExpenses(res.data));
          console.log(res.data);
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
        </div>
        <Mytable
          who="expenses"
          data={allExpenses}
          header={["name", "type", "cost", "date", "description"]}
        />
      </div>

      {/* {allExpenses.map((expense) => {
        return <h1>{expense.name}</h1>;
      })} */}
      {/* 
      <Paginate
        who="Customer"
        allProducts={allCustomers}
        currentPage={currentPage}
        search={search}
        setCurrentPage={setCurrentPage}
      /> */}
    </div>
  );
};

export default Expenses;
