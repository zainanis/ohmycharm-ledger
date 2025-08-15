import { useNavigate } from "react-router";
import Modal from "../utils/Modal";
import { useState } from "react";
import { IoPersonCircle } from "react-icons/io5";

const Customercard = ({ _id, name, phoneNumber, address, email }) => {
  const navigate = useNavigate();
  const [showModal, SetshowModal] = useState(false);

  return (
    <div className="bg-white max-w-70 min-w-70 min-h-80 max-h-80 px-6 py-8 flex flex-col justify-between rounded-xl border-solid border-1 border-stone-200 hover:shadow-2xl transition-shadow ">
      <div className="min-h-26 flex flex-col gap-4">
        <div className="flex gap-5 items-center justify-left">
          <IoPersonCircle className="text-pink-900" size={40} />

          <h1 className="text-pink-900 text-lg font-bold">{name} </h1>
        </div>

        <h1 className="text-pink-900 ">
          <span className="font-bold">Phone Number:</span> {phoneNumber}
        </h1>
        <h1 className="text-pink-900">
          {address ? (
            <>
              <span className="font-bold ">Address: </span>
              {address.split(" ").length > 14
                ? address.split(" ").slice(0, 14).join(" ") + " ..."
                : address}
            </>
          ) : (
            ""
          )}
        </h1>
        <h1 className="text-pink-900 ">
          <span className="font-bold">Email:</span> {email}{" "}
        </h1>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded-lg w-60 py-3 bg-pink-800 hover:bg-pink-900 hover:shadow-lg text-white"
          type="submit"
          onClick={() => {
            navigate(`/customers/${_id}`);
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
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Customercard;
