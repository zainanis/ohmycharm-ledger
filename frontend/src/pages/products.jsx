import React, { useEffect, useState } from "react";
import { Createproduct } from "../components/createproduct";
import axios from "axios";

const Products = () => {
  const [allProducts, SetallProducts] = useState([]);
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
    <>
      <ul>
        {allProducts.map((product) => {
          return (
            <>
              <li key={product._id}>
                {product.name},{product.price},{product.description},
                {product.status}
              </li>
            </>
          );
        })}
      </ul>

      <Createproduct />
    </>
  );
};

export default Products;
