import React from "react";

const Card = ({ title, data }) => {
  return (
    <span className="flex flex-col p-6 items-center justify-between border-stone-200 border-2 rounded-xl  text-stone-700 max-h-30">
      <h1>{title}</h1>
      <p> {data}</p>
    </span>
  );
};

export default Card;
