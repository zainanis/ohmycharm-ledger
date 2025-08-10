import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/Products/ProductCard.jsx";
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
  ]);
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

  return (
    <div className=" bg-white rounded-lg shadow flex gap-2 p-2  flex-col justify-around ">
      <h1> Welcome to the products page</h1>
      <div className="flex flex-wrap  justify-around gap-5  ">
        {allProducts.map((product) => {
          return (
            <ProductCard
              name={product.name}
              price={product.price}
              description={product.description}
              status={product.status}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Products;
