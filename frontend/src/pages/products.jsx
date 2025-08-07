import React, { useEffect, useState } from "react";
import { Createproduct } from "../components/createproduct";
import axios from "axios";
import { ProdcutBlock } from "../components/productBlock";

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
    <div className="flex gap-5 border-solid border-1  ">
      {allProducts.map((product) => {
        return (
          <>
            <ProdcutBlock
              key={product._id}
              name={product.name}
              price={product.price}
              description={product.description}
              status={product.status}
            />
          </>
        );
      })}
    </div>
  );
};

export default Products;
