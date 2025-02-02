const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require("../models/User");  // Ensure User model is imported

const router = express.Router();

// Registration Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, age, contactNumber, password } = req.body;

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const validDomains = ["@students.iiit.ac.in", "@research.iiit.ac.in"];
    const hasValidDomain = validDomains.some(domain => email.endsWith(domain));
    if (!hasValidDomain) {
      return res.status(400).json({ message: "Invalid email domain" });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      age,
      contactNumber,
      password: hashedPassword
    });

    await user.save();
    console.log("USER REGISTERED SUCCESSFULLY");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Google OAuth Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

// Test Route
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working fine" });
});

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid Token" });
    }
};

router.put("/profile", authenticateToken, async (req, res) => {
    try {
      const { firstName, lastName, age, contactNumber } = req.body;
      await User.findByIdAndUpdate(req.user.id, { firstName, lastName, age, contactNumber });
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });

// Profile route
router.get("/profile", authenticateToken, async (req, res) => {
try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
} catch (error) {
    res.status(500).json({ message: "Server error" });
}
});

module.exports = router;
