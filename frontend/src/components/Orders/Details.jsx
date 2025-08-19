import React, { useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";

const Details = () => {
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/orders/${id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  return <div>Details</div>;
};

export default Details;
