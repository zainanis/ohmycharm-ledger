import React from "react";

const Card = ({ title, data }) => {
  return (
    <span className="flex flex-col p-6 items-center justify-between border-gray-400 border-2 rounded-xl bg-gray-200 text-gray-700">
      <h1>{title}</h1>
      <p> {data}</p>
    </span>
  );
};

export default Card;
