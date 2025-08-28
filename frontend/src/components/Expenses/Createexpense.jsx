import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router";
import { FaChevronCircleLeft } from "react-icons/fa";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, updateExpense } from "../../state/expenseSlice";

const Createexpense = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState({});

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [expenseType, setExpensetype] = useState("");
  const [paymentMode, setPaymentmode] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.allExpenses);

  useEffect(() => {
    if (id) {
      const expense = allExpenses.find((expense) => expense._id === id);

      if (expense) {
        setName(expense.name);
        setDate(expense.date.slice(0, 10));
        setCost(expense.cost);
        setDescription(expense.description);
        setExpensetype(expense.type);
        setPaymentmode(expense.paymentMode);
      }
    }
  }, [id, allExpenses]);
  const handleSubmit = (e) => {
    e.preventDefault();

    const expense = {
      name,
      cost: parseFloat(cost),
      date,
      description,
      type: expenseType,
      paymentMode,
    };
    console.log(expense);

    const request = id
      ? axios.put(`http://localhost:5001/api/expenses/${id}`, expense)
      : axios.post("http://localhost:5001/api/expenses", expense);

    request
      .then((res) => {
        if (id) {
          console.log("Expense Updated Successfully.");
          dispatch(updateExpense(res.data));
        } else {
          console.log("Expense Created Successfully.");
          dispatch(addExpense(res.data));
        }

        navigate("/expenses", { replace: true });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className=" bg-white rounded-lg shadow flex  flex-col  gap-2 p-2 ">
      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">Add Expense</h1>
        </div>
        <div className="pl-5">
          <NavLink to="/expenses">
            <FaChevronCircleLeft size={25} className=" text-pink-900 " />
          </NavLink>
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center  min-h-[75vh]">
        <form
          className=" flex flex-col gap-2 justify-between min-h-100 w-100"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Name">Name:</label>
            <input
              required
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Price">Cost:</label>
            <input
              required
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Description">Expense Date:</label>
            <input
              required
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="Description">Description :</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-pink-900">
            <label htmlFor="expensetype">Expense Type :</label>

            <select
              required
              value={expenseType}
              onChange={(e) => setExpensetype(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
            >
              <option value="All">Select an expense type</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Goods Purchase">Goods Purchase</option>
            </select>
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="expensetype">Payment Mode :</label>

            <select
              required
              value={paymentMode}
              onChange={(e) => setPaymentmode(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
            >
              <option value="All">Select an payment mode</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div className="flex justify-center">
            <button
              className="rounded-lg w-60 py-3 bg-pink-800 hover:bg-pink-900 hover:shadow-lg text-white"
              type="submit"
            >
              {id ? "Update Expense" : "Create Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createexpense;
