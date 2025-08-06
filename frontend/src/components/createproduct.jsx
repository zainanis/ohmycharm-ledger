import { useState } from "react";
import axios from "axios";

export const Createproduct = () => {
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
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Name">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="Price">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="Description">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="Status">Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select</option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </select>
        </div>

        <button type="submit">Create Product</button>
      </form>
    </>
  );
};
