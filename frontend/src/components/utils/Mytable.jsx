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

  const getValueFromPath = (obj, path) => {
    if (!path) return "";

    const value = path
      .split(".")
      .filter(Boolean)
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : "-"),
        obj
      );

    const dateFields = ["date", "orderDate"];
    const isTargetDateField = dateFields.includes(path.replace(".", ""));

    if (
      isTargetDateField &&
      typeof value === "string" &&
      value.match(/^\d{4}-\d{2}-\d{2}T/)
    ) {
      return new Date(value).toLocaleDateString("en-GB");
    }

    return value;
  };

  const handleEdit = (id) => {
    navigate(`/${who}/${id}`);
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
                {head.label}
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
              <tr
                key={item._id}
                className={
                  who === "orders"
                    ? "hover:bg-stone-100 text-pink-900"
                    : " text-pink-900"
                }
                onClick={
                  who === "orders"
                    ? () => {
                        navigate(`details/${item._id}`);
                      }
                    : undefined
                }
              >
                {header.map((head, idx) => (
                  <td key={idx} className="px-6 py-4">
                    {getValueFromPath(item, head.path)}
                  </td>
                ))}
                <td className="px-2 py-4   text-center flex gap-2 justify-center">
                  <button
                    className=" bg-pink-800 text-white px-6 py-2 rounded-lg hover:bg-pink-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item._id);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className=" bg-pink-800 text-white px-6 py-2 rounded-lg hover:bg-pink-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelecteditem({
                        id: item._id,
                        name: item.name || item.customerId.name,
                      });
                    }}
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
          who={who}
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
