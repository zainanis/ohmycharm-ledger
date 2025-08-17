import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router"; // If using react-router
// import { deleteExpense } from "../state/expenseSlice"; // Adjust path as needed

const Mytable = ({ who = "items", data = [], header = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/expenses/edit/${id}`);
  };

  const handleDelete = (id) => {
    // dispatch(deleteExpense(id));
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-pink-200">
      <table className="min-w-full  bg-pink-200">
        <thead className="bg-pink-100">
          <tr>
            {header.map((head, index) => (
              <th
                key={index}
                className="text-left px-6 py-3 text-xs text-pink-900 font-bold uppercase  "
              >
                {head}
              </th>
            ))}

            <th className="px-2 py-3 text-xs text-pink-900 font-bold uppercase ">
              Options
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-pink-100">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item._id} className="text-pink-900 relative">
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${item.cost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.description || "-"}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center flex gap-2 justify-center">
                  <button className=" bg-pink-800 text-white px-6 py-2 rounded-lg hover:bg-pink-900">
                    Update
                  </button>
                  <button className=" bg-pink-800 text-white px-6 py-2 rounded-lg hover:bg-pink-900">
                    Delete
                  </button>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-center ">
                
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={header.length + 1}
                className="px-6 py-4 text-center text-gray-500"
              >
                No {who} found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Mytable;
