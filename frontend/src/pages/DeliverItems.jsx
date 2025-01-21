import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const DeliverItems = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  // Replace single OTP state with an object that maps each transactionId to an OTP
  const [otpMap, setOtpMap] = useState({});

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/login");
        return;
      }
      const res = await axios.get("http://localhost:5000/api/orders/deliveries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingOrders(res.data);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  // Update otpMap when user types into the OTP field of a single order
  const handleOtpChange = (transactionId, newOtp) => {
    setOtpMap((prevMap) => ({
      ...prevMap,
      [transactionId]: newOtp,
    }));
  };

  // Now pass the correct transactionId and OTP from our otpMap to verify each order individually
  const handleVerifyOrder = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders/verify",
        { transactionId, otp: otpMap[transactionId] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order successfully completed!");
      fetchPendingOrders();
    } catch (error) {
      console.error("Error verifying order:", error);
      alert("Failed to verify order");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Deliver Items</h1>
        {pendingOrders.length > 0 ? (
            pendingOrders.map((order) => (
            <div key={order.transactionId} className="border p-4 mb-2">
                <p>Transaction ID: {order.transactionId}</p>
                <p>Amount: ₹{order.totalAmount}</p>
                {/* Display rawOtp so the seller (even if same user) can share it with the buyer */}
                <p>OTP for Buyer: {order.rawOtp}</p>
                <input
                type="text"
                placeholder="Enter OTP"
                value={otpMap[order.transactionId] || ""}
                onChange={(e) => handleOtpChange(order.transactionId, e.target.value)}
                className="border p-2 w-full mt-2"
                />
                <button
                onClick={() => handleVerifyOrder(order.transactionId)}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                >
                Complete Order
                </button>
            </div>
            ))
        ) : (
            <p>No pending deliveries</p>
        )}
      </div>
    </div>
  );
};

export default DeliverItems;