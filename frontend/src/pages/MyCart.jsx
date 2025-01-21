import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setCartItems(res.data);
      setTotalCost(res.data.reduce((acc, item) => acc + item.price, 0));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleFinalOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders/place",
        { cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      for (const item of cartItems) {
        await removeFromCart(item._id);
      }
      // alert("Order placed successfully!");
      navigate("/orders-history");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">My Cart</h1>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="border p-4 mb-2 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <button onClick={() => removeFromCart(item._id)} className="bg-red-500 text-white px-4 py-2 rounded">
                Remove
              </button>
            </div>
            
          ))
        ) : (
          <p className="text-lg text-gray-600 text-center">Your cart is empty.</p>
        )}
        {cartItems.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleFinalOrder}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Final Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCart;