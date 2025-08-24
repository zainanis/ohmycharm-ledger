import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router";
import axios from "axios";
import { FaChevronCircleLeft } from "react-icons/fa";

const Details = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderRes = await axios.get(
          `http://localhost:5001/api/orders/${id}`
        );
        const order = orderRes.data.order;
        setOrder(order);
        setProducts(orderRes.data.products);

        const customerId = order.customerId;
        console.log("Order Data:", orderRes.data);

        const temp = await axios
          .get(`http://localhost:5001/api/customers/${customerId}`)
          .then((res) => {
            return res.data;
          });
        setCustomer(temp);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col gap-5 rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex flex-col gap-5">
        <div className="border-b-2 border-stone-200 px-5 py-5 flex items-center">
          <NavLink to="/orders">
            <FaChevronCircleLeft size={25} className="text-pink-900" />
          </NavLink>
          <h1 className="font-bold text-4xl text-pink-900 text-center flex-1">
            Order Details
          </h1>
        </div>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-gray-700">
        <p>
          <strong>Order ID: </strong> {order._id}
        </p>
        <p>
          <strong>Customer Name: </strong> {customer.name}
        </p>
        <p>
          <strong>Status: </strong> {order.status}
        </p>
        <p>
          <strong>Total Amount: </strong>
          {order.totalAmount ? order.totalAmount.toFixed(2) + " PKR" : "N/A"}
        </p>
        <p>
          <strong>Payment Mode:</strong> {order.paymentMode}
        </p>
        {/* <p>
          <strong>Order Date:</strong> {formatDate(order.orderDate)}
        </p>
        <p>
          <strong>Sent Date:</strong> {formatDate(order.sentDate)}
        </p>
        <p>
          <strong>Receive Date:</strong> {formatDate(order.recieveDate)}
        </p> */}
      </div>

      {/* Products Table */}
      <div>
        <h2 className="text-2xl font-semibold text-pink-900 mb-4">
          Ordered Products
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-pink-100">
              <tr>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Unit Price</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, index) => (
                <tr key={product._id} className="border-t">
                  <td className="p-3">{product.productId?.name}</td>
                  <td className="p-3">
                    {typeof product.productId?.price === "number"
                      ? product.productId.price.toFixed(2) + " PKR"
                      : "N/A"}
                  </td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3">
                    {typeof product.totalPrice === "number"
                      ? product.totalPrice.toFixed(2) + " PKR"
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Details;
