import React, { useMemo, useState } from "react";
import ProductCard from "../Products/ProductCard";
import Customercard from "../Customers/Customercard";

const Paginate = ({
  who,
  allProducts,
  selectedStatus,
  currentPage,
  setCurrentPage,
  search,
}) => {
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    if (selectedStatus === "All" || selectedStatus == undefined)
      return allProducts;
    return allProducts.filter((product) => product.status === selectedStatus);
  }, [selectedStatus, allProducts]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap  justify-center gap-5 min-h-190">
        {who == "Customer"
          ? currentItems.map((customer) => <Customercard {...customer} />)
          : who == "Product"
          ? currentItems.map((product) => <ProductCard {...product} />)
          : ""}
      </div>

      {filteredProducts.length > 10 ? (
        <div className="flex justify-center items-center gap-3  flex-wrap">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Number Buttons */}
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-4 py-2 rounded ${
                currentPage === number
                  ? "bg-pink-900 text-white"
                  : "bg-gray-100"
              }`}
            >
              {number}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Paginate;
