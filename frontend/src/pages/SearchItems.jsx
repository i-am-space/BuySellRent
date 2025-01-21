import { useEffect, useState } from "react";
import axios from "axios";

const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetchItems();
  }, [searchQuery, selectedCategories]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/login");
        return;
      }
  
      const res = await axios.get("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchQuery.trim() !== "" ? searchQuery : null,
          categories: selectedCategories.length > 0 ? selectedCategories.join(",") : null,
        },
      });
  
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error.response?.data?.message || error.message);
    }
  };  

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };
  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Item deleted successfully!");
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    }
  };
  
  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Search Items</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search for items..."
          className="w-2/3 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="space-x-2">
          {["Clothing", "Grocery", "Electronics", "Books"].map((category) => (
            <label key={category} className="inline-flex items-center">
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <span className="ml-2">{category}</span>
            </label>
          ))}
        </div>
      </div>

    <div className="grid grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item._id} className="border p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">{item.name}</h3>
          <p className="text-gray-600">Price: ${item.price}</p>
          <p className="text-gray-500">
            Seller: {item.sellerId ? `${item.sellerId.firstName}` : "Unknown"}
          </p>
          <a href={`/item/${item._id}`} className="text-blue-500 mt-2 block">View Item</a>
          {/* Conditional button rendering for item owner */}
          {/* {item.sellerId && item.sellerId._id === currentUser._id && (
            <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
              Remove
            </button>
          )} */}
        </div>
      ))}
    </div>

    </div>
  );
};

export default SearchItems;
