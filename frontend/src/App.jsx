import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SearchItems from "./pages/SearchItems";
import Navbar from "./components/Navbar";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import MyCart from "./pages/MyCart";
import OrdersHistory from "./pages/OrdersHistory";
import DeliverItems from "./pages/DeliverItems";
import Support from "./pages/Support";

const PrivateRoute = ({ element }) => {
  return localStorage.getItem("token") ? element : <Navigate to="/login" />;
};  

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Welcome to BuySellRent</h1>
      <div className="space-x-4">
        <a href="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">Login</a>
        <a href="/register" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300">Register</a>
      </div>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      {location.pathname === "/" && <Home />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/search" element={<PrivateRoute element={<SearchItems />} />} />
        <Route path="/item/:itemId" element={<PrivateRoute element={<ItemDetails />} />} />
        <Route path="/add-item" element={<PrivateRoute element={<AddItem />} />} />
        <Route path="/cart" element={<PrivateRoute element={<MyCart />} />} />
        <Route path="/orders-history" element={<PrivateRoute element={<OrdersHistory />} />} />
        <Route path="/deliveries" element={<PrivateRoute element={<DeliverItems />} />} />
        <Route path="/support" element={<PrivateRoute element={<Support />} />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
