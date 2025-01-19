import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending request with:", formData);
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error("Registration error:", error.response);
      alert('Registration failed: ' + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Register</h2>

        <input type="text" name="firstName" placeholder="First Na   me" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required />
        <input type="email" name="email" placeholder="IIIT Email" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required />
        <input type="text" name="contactNumber" placeholder="Contact Number" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full p-3 mb-3 border rounded" onChange={handleChange} required />
        
        <button type="submit" className="bg-green-500 w-full text-white py-3 rounded hover:bg-green-700 transition">
          Register
        </button>
      </form>
    </div>
  );
};
export default Register;
