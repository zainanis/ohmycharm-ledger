import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router";
import { FaChevronCircleLeft } from "react-icons/fa";

export const Createproduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = { name, price: parseFloat(price), description, status };
    console.log(newPost);
    axios
      .post("http://localhost:5001/api/products", newPost)
      .then((res) => {
        console.log("Product Created Successfully.");
        navigate("/products", { replace: true });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className=" bg-white rounded-lg shadow flex  flex-col  gap-2 p-2 ">
      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">Add Product</h1>
        </div>
        <div className="pl-5">
          <NavLink to="/products">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Price">Price:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Description">Description:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="Status">Status:</label>
            <select
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button
              className="rounded-lg w-60 py-3 bg-pink-800 hover:bg-pink-900 hover:shadow-lg text-white"
              type="submit"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
