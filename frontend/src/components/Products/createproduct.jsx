import { useState, useEffect } from "react";
import api from "../../utils/client.js";
import { NavLink, useNavigate } from "react-router";
import { FaChevronCircleLeft } from "react-icons/fa";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  updateProduct,
  setProducts,
} from "../../state/productsSlice";

export const Createproduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState({ loading: false, what: null });

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.allProducts);

  useEffect(() => {
    if (id) {
      if (allProducts.length === 0) {
        setLoading({ loading: true, what: "Loading Product..." });

        api
          .get("/api/products")
          .then((res) => {
            dispatch(setProducts(res.data));
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => setLoading({ loading: false, what: null }));
      }
      const product = allProducts.find((product) => product._id === id);

      if (product) {
        setName(product.name || "");
        setPrice(product.price || 0);
        setDescription(product.description || "");
        setStatus(product.status || "Available");
      }
    }
  }, [id, allProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = { name, price: parseFloat(price), description, status };
    console.log(newPost);
    const request = id
      ? api.put(`/api/products/${id}`, newPost)
      : api.post("/api/products", newPost);
    setLoading({ loading: true, what: "Submitting Products..." });
    request
      .then((res) => {
        if (id) {
          console.log("Product Updated Successfully.");
          dispatch(updateProduct(res.data));
        } else {
          console.log("Product Created Successfully.");
          dispatch(addProduct(res.data));
        }
        navigate("/products", { replace: true });
      })
      .catch((error) => {
        console.log(error.response);
      })
      .finally(() => {
        setLoading({ loading: false, what: null });
      });
  };

  return (
    <div className=" bg-white rounded-lg shadow flex  flex-col  gap-2 p-2 ">
      {loading.loading && (
        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="text-pink-800 font-bold text-xl animate-pulse">
            {loading.what}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">
            {id ? "Update Product" : "Add Product"}
          </h1>
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
              required
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Price">Price:</label>
            <input
              required
              min="1"
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
              required
              defaultValue="Available"
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
              {id ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
