import { useNavigate } from "react-router";
import Modal from "../utils/Modal";
import { useState } from "react";

const ProductCard = ({
  _id,
  name,
  price,
  description,
  status,
  handleDelete,
}) => {
  const navigate = useNavigate();
  const [showModal, SetshowModal] = useState(false);

  return (
    <div className="bg-white max-w-70 min-w-70 min-h-80 max-h-80 px-6 py-8 flex flex-col justify-between rounded-xl border-solid border-1 border-stone-200 hover:shadow-2xl transition-shadow ">
      <div className="min-h-26">
        <div className="flex gap-15">
          <h1 className="text-pink-900 text-lg font-bold">{name} </h1>
          <p className="text-pink-900">{price}PKR </p>
        </div>
        <p className="text-pink-900">
          {description ? (
            <>
              <span className="font-bol ">Description: </span>
              {description.split(" ").length > 14
                ? description.split(" ").slice(0, 14).join(" ") + " ..."
                : description}
            </>
          ) : (
            ""
          )}
        </p>
      </div>
      <p
        className={`py-2  text-center rounded-2xl ${
          status == "Available"
            ? " bg-green-100 text-green-400"
            : status == "Discontinued"
            ? " bg-red-100  text-red-400"
            : "bg-yellow-100  text-yellow-400"
        } `}
      >
        {status}
      </p>
      <div className="flex gap-2">
        <button
          className="rounded-lg w-60 py-3 bg-pink-800 hover:bg-pink-900 hover:shadow-lg text-white"
          type="submit"
          onClick={() => {
            navigate(`/products/${_id}`);
          }}
        >
          Update
        </button>
        <button
          className="rounded-lg w-60 py-3 bg-pink-800 hover:bg-pink-900 hover:shadow-lg text-white"
          type="submit"
          onClick={() => {
            SetshowModal(true);
          }}
        >
          Delete
        </button>
      </div>

      {showModal ? (
        <Modal
          onClose={() => {
            SetshowModal(false);
          }}
          name={name}
          id={_id}
          handleDelete={handleDelete}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductCard;
