import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(formData);
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        {user ? (
          <div className="bg-white p-12 rounded-lg shadow-lg w-2/3 max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6 text-blue-600">Welcome, {user.firstName}</h2>
            
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded" 
                  required
                  placeholder="First Name"
                />
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded" 
                  required
                  placeholder="Last Name"
                />
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded" 
                  required
                  placeholder="Age"
                />
                <input 
                  type="text" 
                  name="contactNumber" 
                  value={formData.contactNumber} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded" 
                  required
                  placeholder="Contact Number"
                />
                
                <div className="flex justify-center space-x-4">
                  <button 
                    type="submit" 
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-xl"><strong>Email:</strong> {user.email}</p>
                <p className="text-xl"><strong>Age:</strong> {user.age}</p>
                <p className="text-xl"><strong>Contact:</strong> {user.contactNumber}</p>
                <div className="mt-6">
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-xl font-bold text-gray-600">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
