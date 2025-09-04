import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router";
import { FaChevronCircleLeft } from "react-icons/fa";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, updateCustomer } from "../../state/customerSlice";

export const Createcustomer = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState({ loading: false, what: null });
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhonenumber] = useState();
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allcustomers = useSelector((state) => state.customers.allCustomers);

  useEffect(() => {
    if (allcustomers.length === 0) {
      setLoading({ loading: true, what: "Customers" });
      axios
        .get("http://localhost:5001/api/customers")
        .then((res) => {
          console.log(res);
          dispatch(setCustomers(res.data));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoading({ loading: false, what: null }));
    }
    if (id) {
      setLoading({ loading: true, what: "Customer" });
      const customer = allcustomers.find((customer) => customer._id === id);

      if (customer) {
        setName(customer.name);
        setAddress(customer.address);
        setPhonenumber(customer.phoneNumber);
        setEmail(customer.email);
      }
      setLoading({ loading: false, what: "Customer" });
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (id == undefined) {
      setLoading({ loading: true, what: "Submitting Customer" });

      const newCustomer = {
        name,
        phoneNumber: parseFloat(phonenumber),
        address,
        email,
      };
      const request = axios.post(
        "http://localhost:5001/api/customers",
        newCustomer
      );
      request
        .then((res) => {
          console.log("Customer Created Successfully.");
          dispatch(addCustomer(res.data));
          navigate("/customers", { replace: true });
        })
        .catch((error) => {
          console.log(error.response);
        })
        .finally(() => {
          setLoading({ loading: false, what: null });
        });
    } else {
      setLoading({ loading: true, what: "Submitting Customer" });

      const updatedCustomer = {
        name,
        phoneNumber: parseFloat(phonenumber),
        address,
        email,
      };
      const request = axios.put(
        `http://localhost:5001/api/customers/${id}`,
        updatedCustomer
      );
      request
        .then((res) => {
          console.log("Customer Created Successfully.");
          dispatch(updateCustomer(res.data));
          navigate("/customers", { replace: true });
        })
        .catch((error) => {
          console.log(error.response);
        })
        .finally(() => {
          setLoading({ loading: false, what: null });
        });
    }
  };

  return (
    <div className=" bg-white rounded-lg shadow flex  flex-col  gap-2 p-2 ">
      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">Add Customer</h1>
        </div>
        <div className="pl-5">
          <NavLink to="/customers">
            <FaChevronCircleLeft size={25} className=" text-pink-900 " />
          </NavLink>
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center  min-h-[75vh]">
        <form
          className=" flex flex-col justify-between min-h-100 w-100"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Name">Name:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Price">Phone Number:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="number"
              required
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Description">Address:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="Description">Email:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button
              className="rounded-lg w-60 py-3 bg-pink-800 hover:bg-pink-900 hover:shadow-lg text-white"
              type="submit"
            >
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createcustomer;
