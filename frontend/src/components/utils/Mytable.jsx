import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router"; // If using react-router

import Modal from "./Modal";

const Mytable = ({ who = "items", data = [], header = [], filter = "All" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedItem, setSelecteditem] = useState(null);

  let filteredData =
    filter === "All"
      ? data
      : data.filter((item) => {
          return item.type === filter;
        });
  useEffect(() => {
    console.log("Data updated:", data);
    console.log("Current filter:", filter);
  }, [data, filter]);

  const handleEdit = (id) => {
    navigate(`/expenses/${id}`);
  };

  return (
    <div className=" overflow-x-auto rounded-lg shadow border border-pink-200 w-full">
      <table className=" bg-pink-200 w-full">
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
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item._id} className="text-pink-900 ">
                <td className="px-6 py-4 ">{item.name}</td>
                <td className="px-6 py-4  ">{item.type}</td>
                <td className="px-6 py-4  ">${item.cost.toFixed(2)}</td>
                <td className="px-6 py-4  ">{item.paymentMode || "-"}</td>
                <td className="px-6 py-4  ">
                  {new Date(item.date).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4  ">{item.description || "-"}</td>
                <td className="px-2 py-4   text-center flex gap-2 justify-center">
                  <button
                    className=" bg-pink-800 text-white px-6 py-2 rounded-lg hover:bg-pink-900"
                    onClick={() => handleEdit(item._id)}
                  >
                    Update
                  </button>
                  <button
                    className=" bg-pink-800 text-white px-6 py-2 rounded-lg hover:bg-pink-900"
                    onClick={() =>
                      setSelecteditem({ id: item._id, name: item.name })
                    }
                  >
                    Delete
                  </button>
                </td>
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
      {selectedItem ? (
        <Modal
          onClose={() => {
            setSelecteditem(null);
          }}
          who="expenses"
          id={selectedItem.id}
          name={selectedItem.name}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Mytable;
