import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add an item");
        navigate('/login');
        return;
      }
  
      console.log("Submitting form:", formData); // Debugging step
  
      const res = await axios.post("http://localhost:5000/api/items/add", JSON.stringify(formData), {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      alert("Item added successfully!");
      navigate("/search");
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
      alert("Failed to add item: " + (error.response?.data?.message || "Unknown error"));
    }
  };  

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-1/3">
          <h2 className="text-3xl font-bold mb-6 text-center">Add New Item</h2>
          <input type="text" name="name" placeholder="Item Name" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required />
          <select name="category" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Clothing">Clothing</option>
            <option value="Grocery">Grocery</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
          </select>
          <button type="submit" className="bg-blue-500 w-full text-white py-3 rounded hover:bg-blue-700 transition">Add Item</button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
