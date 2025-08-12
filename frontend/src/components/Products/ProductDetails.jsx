import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, Setproduct] = useState({});
  const [loading, Setloading] = useState(false);

  useEffect(() => {
    Setloading(true);
    axios
      .get(`http://localhost:5001/api/products/${id}`)
      .then((res) => {
        console.log(res.data);
        Setproduct(res.data);
        Setloading(false);
      })
      .catch((err) => {
        console.log(err.message);
        Setloading(false);
      });
  }, []);

  return (
    <div className=" bg-white rounded-lg shadow flex gap-2 p-2  flex-col justify-between ">
      <div>
        <h2>Product Details</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>
              <strong>Name:</strong> {product.name}
            </p>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Status:</strong> {product.status}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(product.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
