import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router";
import { FaChevronCircleLeft } from "react-icons/fa";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setCustomers } from "../../state/customerSlice";
import { setProducts } from "../../state/productsSlice";
import { addOrder, setOrders, updateOrder } from "../../state/orderSlice";

const Createorders = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState({ loading: false, what: null });
  const [customerId, setCustomerid] = useState("");
  const [orderStatus, setOrderstatus] = useState("");
  const [orderDate, setOrderdate] = useState("");
  const [sentDate, setSentdate] = useState("");
  const [recieveDate, setRecievedate] = useState("");
  const [selectedProducts, setSelectedproducts] = useState([]);
  const [paymentMode, setPaymentmode] = useState("");
  const [discount, setDiscount] = useState(0);

  const allCustomers = useSelector((state) => state.customers.allCustomers);
  const allProducts = useSelector((state) => state.products.allProducts);
  const allOrders = useSelector((state) => state.orders.allOrders);

  useEffect(() => {
    if (allCustomers.length === 0) {
      setLoading({ loading: true, what: "Loading Customers..." });
      axios
        .get("http://localhost:5001/api/customers")
        .then((res) => dispatch(setCustomers(res.data)))
        .catch((err) => console.log(err))
        .finally(() => setLoading({ loading: false, what: null }));
    }

    if (allProducts.length === 0) {
      setLoading({ loading: true, what: "Loading Products..." });

      axios
        .get("http://localhost:5001/api/products")
        .then((res) => dispatch(setProducts(res.data)))
        .catch((err) => console.log(err))
        .finally(() => setLoading({ loading: false, what: null }));
    }

    if (allOrders.length === 0) {
      setLoading({ loading: true, what: "Loading Orders..." });

      axios
        .get("http://localhost:5001/api/orders")
        .then((res) => dispatch(setOrders(res.data)))
        .catch((err) => console.log(err))
        .finally(() => setLoading({ loading: false, what: null }));
    }

    if (id && allProducts.length !== 0) {
      setLoading({ loading: true, what: "Loading Orders..." });

      axios
        .get(`http://localhost:5001/api/orders/${id}`)
        .then((res) => {
          const order = res.data.order;
          const products = res.data.products;

          setCustomerid(order.customerId || "");
          setOrderstatus(order.status || "");
          setOrderdate(order.orderDate?.slice(0, 10) || "");
          setSentdate(order.sentDate?.slice(0, 10) || "");
          setRecievedate(order.recieveDate?.slice(0, 10) || "");
          setPaymentmode(order.paymentMode || "");
          setDiscount(order.discount || 0);

          const selected = products.map((orderedProduct) => {
            const fullProduct = allProducts.find(
              (p) => p._id === orderedProduct.productId._id
            );
            return {
              ...fullProduct,
              quantity: orderedProduct.quantity || 1,
            };
          });

          setSelectedproducts(selected);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading({ loading: false, what: null }));
    }
  }, [allProducts, allCustomers, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!orderDate) {
      alert("Order Date is required.");
      return;
    }

    if (
      (recieveDate || orderStatus === "Sent" || orderStatus === "Delivered") &&
      !sentDate
    ) {
      alert("Sent Date is required.");
      return;
    }

    if (orderStatus === "Delivered" && !recieveDate) {
      alert("Receive Date is required.");
      return;
    }

    const products = selectedProducts.map((product) => ({
      _id: product._id,
      quantity: Math.max(1, Number(product.quantity)),
    }));

    const order = {
      customerId,
      status: orderStatus,
      orderDate,
      sentDate: sentDate === "" ? undefined : sentDate,
      recieveDate: recieveDate === "" ? undefined : recieveDate,
      paymentMode,
      products,
      discount,
    };

    const selectedCustomer = allCustomers.find((c) => c._id === customerId);
    const request = id
      ? axios.put(`http://localhost:5001/api/orders/${id}`, order)
      : axios.post("http://localhost:5001/api/orders", order);

    setLoading({ loading: true, what: "submitting" });

    request
      .then((res) => {
        const orderRes = id ? res.data : res.data.order;
        orderRes.customerId = {
          _id: customerId,
          name: selectedCustomer?.name || "",
        };

        if (id) {
          dispatch(updateOrder(orderRes));
          console.log("Order Updated Successfully.");
        } else {
          dispatch(addOrder(orderRes));
          console.log("Order Created Successfully.");
        }

        navigate("/orders", { replace: true });
      })
      .catch((error) => console.log(error.response))
      .finally(() => {
        setLoading({ loading: false, what: null });
      });
  };

  return (
    <div className="relative bg-white rounded-lg shadow flex flex-col gap-2 p-2">
      {/* Overlay for loading */}
      {loading.loading && (
        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="text-pink-800 font-bold text-xl animate-pulse">
            {loading.what}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">
            {id ? "Edit Order" : "Add Order"}
          </h1>
        </div>
        <div className="pl-5">
          <NavLink to="/orders">
            <FaChevronCircleLeft size={25} className=" text-pink-900 " />
          </NavLink>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col gap-2 justify-between min-h-100 w-110"
        >
          {/* Customer Name */}
          <div className="flex flex-col text-pink-900">
            <label>Customer Name:</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerid(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              required
              disabled={loading.loading}
            >
              <option value="">Select a Customer</option>
              {allCustomers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Order Status */}
          <div className="flex flex-col text-pink-900">
            <label>Order Status:</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderstatus(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              required
              disabled={loading.loading}
            >
              <option value="">Select status</option>
              <option value="Placed">Placed</option>
              <option value="In Progress">In Progress</option>
              <option value="Sent">Sent</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* Order Date */}
          <div className="flex flex-col text-pink-900">
            <label>Order Date:</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderdate(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              required
              disabled={loading.loading}
            />
          </div>

          {/* Sent Date */}
          <div className="flex flex-col text-pink-900">
            <label>Sent Date:</label>
            <input
              type="date"
              value={sentDate}
              min={orderDate}
              onChange={(e) => setSentdate(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              required={!!recieveDate}
              disabled={loading.loading}
            />
          </div>

          {/* Receive Date */}
          <div className="flex flex-col text-pink-900">
            <label>Receive Date:</label>
            <input
              type="date"
              value={recieveDate}
              min={sentDate}
              onChange={(e) => setRecievedate(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              disabled={loading.loading}
            />
          </div>

          {/* Payment Mode */}
          <div className="flex flex-col text-pink-900">
            <label>Payment Mode:</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentmode(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              disabled={loading.loading}
            >
              <option value="All">Select a payment mode</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="Price">Discount:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="number"
              required
              min={0}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>

          {/* Products */}
          <div className="flex flex-col text-pink-900">
            <label>Products:</label>
            <select
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedProduct = allProducts.find(
                  (product) => product._id === selectedId
                );

                if (
                  selectedProduct &&
                  !selectedProducts.some((p) => p._id === selectedProduct._id)
                ) {
                  setSelectedproducts([
                    ...selectedProducts,
                    { ...selectedProduct, quantity: 1 },
                  ]);
                }

                e.target.value = "";
              }}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              disabled={loading.loading}
            >
              <option value="">Select a product</option>
              {allProducts
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((product) => (
                  <option
                    key={product._id}
                    value={product._id}
                    disabled={selectedProducts.some(
                      (p) => p._id === product._id
                    )}
                  >
                    {product.name + " " + product.price + ".Rs"}
                  </option>
                ))}
            </select>

            <div className="flex flex-wrap mt-3 gap-3">
              {selectedProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center bg-pink-100 text-pink-900 px-3 py-1 rounded-full text-sm gap-2"
                >
                  {product.name}
                  <input
                    type="number"
                    min={1}
                    value={product.quantity ?? 1}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setSelectedproducts((prev) =>
                        prev.map((p) =>
                          p._id === product._id
                            ? {
                                ...p,
                                quantity:
                                  inputValue === "" ? "" : parseInt(inputValue),
                              }
                            : p
                        )
                      );
                    }}
                    className="w-16 px-2 py-1 rounded text-center text-pink-900"
                    disabled={loading.loading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedproducts((prev) =>
                        prev.filter((p) => p._id !== product._id)
                      )
                    }
                    className="text-pink-600 hover:text-pink-900 font-bold text-lg"
                    disabled={loading.loading}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              className="rounded-lg w-60 py-3 bg-pink-800 hover:bg-pink-900 hover:shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading.loading}
            >
              {loading.loading
                ? "Submitting..."
                : id
                ? "Update Order"
                : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createorders;
