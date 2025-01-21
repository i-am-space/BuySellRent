import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const OrdersHistory = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [purchasedOrders, setPurchasedOrders] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch pending orders
      const pendingRes = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingOrders(pendingRes.data);

      // Fetch purchased orders
      const purchasedRes = await axios.get("http://localhost:5000/api/orders/purchased", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchasedOrders(purchasedRes.data);

      // Fetch sold orders
      const soldRes = await axios.get("http://localhost:5000/api/orders/sold", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSoldOrders(soldRes.data);

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Order History</h1>

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Pending Orders
          </button>
          <button
            onClick={() => setActiveTab("purchased")}
            className={`px-4 py-2 ${activeTab === "purchased" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Purchased Items
          </button>
          <button
            onClick={() => setActiveTab("sold")}
            className={`px-4 py-2 ${activeTab === "sold" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Sold Items
          </button>
        </div>

        {/* Pending Orders */}
        {activeTab === "pending" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
            {pendingOrders.filter((order) => order.status === "pending").map((order) => (
              <div key={order.transactionId} className="border p-4 mb-2 rounded-lg shadow">
                <p>Transaction ID: {order.transactionId}</p>
                <p>Amount: ₹{order.totalAmount}</p>
                <p>Status: {order.status}</p>
                <p>Time: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Buyer OTP: {order.rawOtp}</p>
              </div>
            ))}
          </div>
        )}

        {/* Purchased Items */}
        {activeTab === "purchased" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Purchased Items</h2>
            {purchasedOrders.map((order) => (
              <div key={order.transactionId} className="border p-4 mb-2 rounded-lg shadow">
                <p>Transaction ID: {order.transactionId}</p>
                <p>Amount: ₹{order.totalAmount}</p>
                <p>Seller: {order.sellerId.firstName} ({order.sellerId.email})</p>
                <p>Time: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* Sold Items */}
        {activeTab === "sold" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Sold Items</h2>
            {soldOrders.map((order) => (
              <div key={order.transactionId} className="border p-4 mb-2 rounded-lg shadow">
                <p>Transaction ID: {order.transactionId}</p>
                <p>Amount: ₹{order.totalAmount}</p>
                <p>Buyer: {order.buyerId.firstName} ({order.buyerId.email})</p>
                <p>Time: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/cart")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersHistory;
