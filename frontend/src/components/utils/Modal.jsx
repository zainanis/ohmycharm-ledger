import React from "react";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteCustomer } from "../../state/customerSlice";
import { deleteExpense } from "../../state/expenseSlice";

const Modal = ({ onClose, name, id, handleDelete, who }) => {
  const dispatch = useDispatch();
  const doDelete = () => {
    axios
      .delete(`http://localhost:5001/api/${who}/${id}`)
      .then(() => {
        switch (who) {
          case "expenses":
            dispatch(deleteExpense({ _id: id }));
            break;

          case "customers":
            dispatch(deleteCustomer({ _id: id }));
            break;
          case "products":
            dispatch(deleteCustomer({ _id: id }));
            break;

          default:
            break;
        }

        onClose();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div
      className="fixed inset-0 z-10 flex justify-center items-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 mt-10 flex flex-col gap-5 text-white">
        <button className="place-self-end" onClick={onClose}>
          <MdCancel size={32} />
        </button>
        <div
          className="bg-stone-100 border-1 border-pink-900 rounded-xl px-20 py-10 flex flex-col gap-5 items-center mx-4"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h1 className="text-pink-900">
            Are you sure you want to delete{" "}
            <span className=" font-bold">{name}</span> ?
          </h1>
          <button
            className="rounded-lg w-60 py-3 bg-pink-800 hover:bg-pink-900 hover:shadow-lg text-white"
            type="submit"
            onClick={doDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
