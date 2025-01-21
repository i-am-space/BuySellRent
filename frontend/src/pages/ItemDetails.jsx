import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const ItemDetails = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching item:", error);
        navigate("/search");
      }
    };

    fetchItem();
  }, [itemId, navigate]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Item added to cart!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <Navbar />
      <div className="container mx-auto p-8">
        {item ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
            <p className="text-lg text-gray-600">{item.description}</p>
            <p className="text-lg font-bold mt-4">Price: ₹{item.price}</p>
            <p className="text-lg mt-2">Category: {item.category}</p>
            <p className="text-lg mt-2">Seller: {item.sellerId?.firstName ? `${item.sellerId.firstName} (${item.sellerId.email})` : "Unknown Seller"}</p>

            <button
              onClick={handleAddToCart}
              className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <p className="text-lg text-gray-600">Loading item details...</p>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
