import React, { useEffect, useState } from "react";
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
    <div className="bg-white rounded-lg py-4 shadow h-full">
      {allProducts.map((product) => {
        return <></>;
      })}
    </div>
  );
};

export default Products;
