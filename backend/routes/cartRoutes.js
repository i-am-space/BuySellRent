const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader);
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied: No valid token" });
    }
  
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Denied: Invalid token format" });
    }
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      console.log("Token verified, user:", req.user);
      next();
    } catch (err) {
      console.error("Invalid Token:", err.message);
      res.status(400).json({ message: "Invalid Token" });
    }
  };

// Add item to cart
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.cart.includes(req.body.itemId)) {
      return res.status(400).json({ message: "Item already in cart" });
    }
    user.cart.push(req.body.itemId);
    await user.save();
    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart" });
  }
});

// Remove item from cart
router.delete("/remove/:itemId", authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { cart: req.params.itemId },
    });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart" });
  }
});

// Get cart items
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart");
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

module.exports = router;