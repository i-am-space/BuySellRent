import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 w-full p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-300">BuySellRent</Link>
        </div>
        <div className="space-x-6">
          <Link to="/profile" className="hover:text-gray-300">Profile</Link>
          <Link to="/search" className="hover:text-gray-300">Search Items</Link>
          <Link to="/orders" className="hover:text-gray-300">Orders History</Link>
          <Link to="/cart" className="hover:text-gray-300">My Cart</Link>
          <Link to="/deliveries" className="hover:text-gray-300">Deliver Items</Link>
          <Link to="/add-item" className="hover:text-gray-300">Add Item</Link>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
