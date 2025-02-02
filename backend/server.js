const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const CAS = require("cas-authentication");  
const User = require("./models/User"); // Ensure User model is imported
const { generateToken } = require("./utils/token"); // Ensure generateToken function is imported

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
const itemRoutes = require("./routes/itemRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const supportRoutes = require("./routes/supportRoutes");
// const cors = require("cors");

// Allow both localhost and 127.0.0.1
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

  
// Middleware
app.use("/api/items", itemRoutes);
app.use("/api/support", supportRoutes);
app.use(session({ 
  secret: process.env.JWT_SECRET, 
  resave: false, 
  saveUninitialized: false 
}));
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

// Initialize Passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Root route to confirm server is running
app.get("/", (req, res) => {
  res.status(200).send("API is running...");
});

// Routes
const authRoutes = require("./routes/authRoutes");

// CAS configuration
const cas = new CAS({
  cas_url: process.env.CAS_URL || 'https://login.iiit.ac.in/cas', // CAS server URL
  service_url: process.env.SERVICE_URL || 'http://localhost:5000', // Your app's backend URL
  cas_version: '3.0', // CAS protocol version
});

app.use("/api/auth", authRoutes);
app.use((req, res, next) => {
  req.cas = cas;
  next();
});

// CAS Login Route
app.get('/api/auth/cas/login', cas.bounce, async (req, res) => {
  const username = req.session.cas_user;
  const email = `${username}`; // Optionally append @students.iiit.ac.in or your domain

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = generateToken(existingUser._id);
      // Pass token in the hash so frontend can read it using window.location.hash
      res.redirect(`${process.env.FRONTEND_URL}/profile`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/register?email=${email}`);
    }
  } catch (error) {
    console.error('CAS login error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
  }
});

// CAS Logout Route
app.get('/api/auth/cas/logout', cas.logout);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
