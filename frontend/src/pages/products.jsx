import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/Products/ProductCard.jsx";
import Paginate from "../components/Products/Paginate.jsx";

const Products = () => {
  const [allProducts, SetallProducts] = useState([
    {
      name: "Flower Bracelet",
      price: 750,
      description:
        "this is a test description for the bracelet there is an option for it to not be visible.",
      status: "Available",
    },
    {
      name: "Flower Bracelet",
      price: 750,
      status: "Discontinued",
    },
    {
      name: "Flower Bracelet Bracelet",
      price: 750,
      description:
        "this is a test description for the bracelet there is an option for it to not be visible.",
      status: "Currently Unavailable",
    },
    {
      name: "Flower Bracelet",
      price: 750,
      description:
        "this is a test description for the bracelet there is an option for it to not be visible.",
      status: "Available",
    },
    {
      name: "Flower Bracelet",
      price: 750,
      status: "Discontinued",
    },
    {
      name: "Flower Bracelet Bracelet",
      price: 750,
      description:
        "this is a test description for the bracelet there is an option for it to not be visible.",
      status: "Currently Unavailable",
    },
    {
      name: "Flower Bracelet",
      price: 750,
      description:
        "this is a test description for the bracelet there is an option for it to not be visible.",
      status: "Available",
    },
    {
      name: "Flower Bracelet",
      price: 750,
      status: "Discontinued",
    },
    {
      name: "Flower Bracelet Bracelet",
      price: 750,
      description:
        "this is a test description for the bracelet there is an option for it to not be visible.",
      status: "Currently Unavailable",
    },
    {
      name: "Flower Bracelet",
      price: 750,
      description:
        "this is a test description for the bracelet there is an option for it to not be visible.",
      status: "Available",
    },
    {
      name: "Flower Bracelet",
      price: 750,
      description:
        "this is a test description for the bracelet there is an option for it to not be visible.",
      status: "Available",
    },
  ]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/products")
      .then((res) => {
        console.log(res);
        SetallProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className=" bg-white rounded-lg shadow flex gap-2 p-2  flex-col justify-between ">
      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">Products</h1>
          <input
            type="text"
            className="border-2 border-solid border-stone-200 rounded-lg pr-20 py-2"
            placeholder="Search Products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex justify-end px-5 ">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="border px-4 py-2 rounded"
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Discontinued">Discontinued</option>
            <option value="Currently Unavailable">Currently Unavailable</option>
          </select>
        </div>
      </div>

      <Paginate
        allProducts={allProducts}
        selectedStatus={selectedStatus}
        currentPage={currentPage}
        search={search}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Products;
