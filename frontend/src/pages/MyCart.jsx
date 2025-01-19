import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">My Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id} className="flex justify-between border p-4 mb-2">
            <div>
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p>Price: ${item.price}</p>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-bold mt-4">Total: ${totalCost}</h3>
      <button
        className="bg-green-500 text-white py-3 rounded mt-4"
      >
        Final Order
      </button>
    </div>
  );
};

export default MyCart;