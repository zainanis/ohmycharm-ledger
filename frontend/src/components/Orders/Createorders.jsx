import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router";
import { FaChevronCircleLeft } from "react-icons/fa";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setCustomers } from "../../state/customerSlice";
import { setProducts } from "../../state/productsSlice";
import { addOrder, updateOrder } from "../../state/orderSlice";

const Createorders = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [expense, setExpense] = useState({});
  const navigate = useNavigate();

  const [customerId, setCustomerid] = useState("");
  const [orderStatus, setOrderstatus] = useState("");
  const [orderDate, setOrderdate] = useState("");
  const [sentDate, setSentdate] = useState("");
  const [recieveDate, setRecievedate] = useState("");
  const [selectedProducts, setSelectedproducts] = useState([]);

  const [paymentMode, setPaymentmode] = useState("");
  const allCustomers = useSelector((state) => state.customers.allCustomers);
  const allProducts = useSelector((state) => state.products.allProducts);

  useEffect(() => {
    if (allCustomers.length === 0) {
      axios
        .get("http://localhost:5001/api/customers")
        .then((res) => {
          console.log(res);
          dispatch(setCustomers(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (allProducts.length === 0) {
      axios
        .get("http://localhost:5001/api/products")
        .then((res) => {
          console.log(res);
          dispatch(setProducts(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (id && allProducts.length !== 0) {
      axios
        .get(`http://localhost:5001/api/orders/${id}`)
        .then((res) => {
          const order = res.data.order;
          const products = res.data.products;
          console.log(products);
          setCustomerid(order.customerId || "");
          setOrderstatus(order.status || "");
          setOrderdate(order.orderDate?.slice(0, 10) || "");
          setSentdate(order.sentDate?.slice(0, 10) || "");
          setRecievedate(order.recieveDate?.slice(0, 10) || "");
          setPaymentmode(order.paymentMode || "");
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
          //   setPaymentmode(res.data.paymentMode);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [allProducts, id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const products = selectedProducts.map((product) => {
      return {
        _id: product._id,
        quantity: Math.max(1, Number(product.quantity)),
      };
    });
    const order = {
      customerId: customerId,
      status: orderStatus,
      orderDate: orderDate,
      sentDate: sentDate === "" ? undefined : sentDate,
      recieveDate: recieveDate === "" ? undefined : recieveDate,
      paymentMode: paymentMode,
      products: products,
    };

    const request = id
      ? axios.put(`http://localhost:5001/api/orders/${id}`, order)
      : axios.post("http://localhost:5001/api/orders", order);

    request
      .then((res) => {
        if (id) {
          console.log("Order Updated Successfully.");
          dispatch(updateOrder(res.data.order));
        } else {
          console.log("Order Created Successfully.");
          console.log(res.data);
          let order = res.data.order;
          order["customerId"] = { customerId: customerId };
          dispatch(addOrder(res.data.order));
        }

        navigate("/orders", { replace: true });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className=" bg-white rounded-lg shadow flex  flex-col  gap-2 p-2 ">
      <div className="flex flex-col gap-5">
        <div className="border-solid border-b-2 pt-15 px-5 border-stone-200 flex justify-between flex-wrap py-5">
          <h1 className="font-bold text-4xl text-pink-900">Add Order</h1>
        </div>
        <div className="pl-5">
          <NavLink to="/orders">
            <FaChevronCircleLeft size={25} className=" text-pink-900 " />
          </NavLink>
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center  min-h-[75vh]">
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col gap-2 justify-between min-h-100 w-110"
        >
          <div className="flex flex-col text-pink-900">
            <label htmlFor="Name">Customer Name:</label>

            <select
              value={customerId}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              onChange={(e) => {
                setCustomerid(e.target.value);
              }}
            >
              <option value="">Select an Customer </option>

              {allCustomers.map((customer) => {
                return (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="expensetype">Order Status :</label>

            <select
              required
              value={orderStatus}
              onChange={(e) => setOrderstatus(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
            >
              <option value="">Select status</option>
              <option value="Placed">Placed</option>
              <option value="In Progress">In Progress</option>
              <option value="Sent">Sent</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="Description">Order Date:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="date"
              value={orderDate}
              onChange={(e) => setOrderdate(e.target.value)}
            />
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="Description">Sent Date:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="date"
              value={sentDate}
              onChange={(e) => setSentdate(e.target.value)}
            />
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="Description">Recieve Date:</label>
            <input
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
              type="date"
              value={recieveDate}
              onChange={(e) => setRecievedate(e.target.value)}
            />
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="expensetype">Payment Mode :</label>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentmode(e.target.value)}
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
            >
              <option value="All">Select an payment mode</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div className="flex flex-col text-pink-900">
            <label htmlFor="products">Products:</label>

            <select
              className="border-1 border-stone-300 rounded-lg px-5 py-2"
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
            >
              <option value="">Select a product</option>
              {allProducts.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                  disabled={selectedProducts.some((p) => p._id === product._id)}
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
                    min={1}
                    type="number"
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
                  />

                  <button
                    type="button"
                    className="text-pink-600 hover:text-pink-900 font-bold text-lg"
                    onClick={() =>
                      setSelectedproducts((prev) =>
                        prev.filter((p) => p._id !== product._id)
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              className="rounded-lg w-60 py-3 bg-pink-800 hover:bg-pink-900 hover:shadow-lg text-white"
              type="submit"
            >
              {id ? "Update Order" : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createorders;
