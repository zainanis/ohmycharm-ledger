const ProductCard = ({ name, price, description, status }) => {
  return (
    <div className="bg-white w-70 min-h-70 max-h-70 px-6 py-8 flex flex-col justify-between rounded-xl border-solid border-1 border-stone-200 hover:shadow-2xl transition-shadow ">
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
      <p
        className={`py-2  text-center rounded-2xl ${
          status == "Available"
            ? " bg-green-200 text-green-500"
            : status == "Discontinued"
            ? " bg-red-200  text-red-500"
            : "bg-yellow-200  text-yellow-500"
        } `}
      >
        {status}
      </p>
    </div>
  );
};

export default ProductCard;
