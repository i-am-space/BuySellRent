const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Item = require("../models/Item");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
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

// Place an order
router.post("/place", authenticateToken, async (req, res) => {
  try {
    const { cartItems } = req.body;
    // If your Item model includes sellerId, each cart item must have sellerId
    // so you can group them by that sellerId.
    // Example grouping:
    const itemsBySeller = {};
    for (const item of cartItems) {
      if (!item.sellerId && !item.sellerID) {
        console.error("Item missing sellerId:", item);
        return res.status(400).json({ message: "Invalid cart item data, sellerId missing" });
      }
      const sellerId = item.sellerID ? item.sellerID.toString() : item.sellerId.toString();
      if (!itemsBySeller[sellerId]) {
        itemsBySeller[sellerId] = {
          items: [],
          totalPrice: 0,
        };
      }
      itemsBySeller[sellerId].items.push(item);
      itemsBySeller[sellerId].totalPrice += item.price;
    }

    // Now create an order per seller
    const orders = [];
    for (const sellerId in itemsBySeller) {
      const rawOtp = (Math.floor(100000 + Math.random() * 900000)).toString();
      const hashedOtp = crypto
        .createHash("sha256")
        .update(rawOtp)
        .digest("hex");

      const newOrder = new Order({
        buyerId: req.user.id,
        sellerId,
        transactionId: uuidv4(),
        status: "pending",
        totalAmount: itemsBySeller[sellerId].totalPrice,
        otp: hashedOtp, // hashed version stored in DB
        rawOtp,         // displayed to the seller for verification
        items: itemsBySeller[sellerId].items.map(i => i._id),
      });
      console.log(newOrder);
      await newOrder.save();
      orders.push(newOrder);
    }

    return res.status(200).json({ message: "Order(s) placed successfully", orders });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Error placing order" });
  }
});

// Get orders by user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id }).populate("items").select("+rawOtp");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Get pending orders for seller
router.get("/deliveries", authenticateToken, async (req, res) => {
  try {
    // Select rawOtp
    const orders = await Order.find({ sellerId: req.user.id, status: "pending" })
      .populate("items")
      .select("+rawOtp");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending deliveries" });
  }
});

// Verify and complete an order with OTP
router.post("/verify", authenticateToken, async (req, res) => {
  try {
    const { transactionId, otp } = req.body;
    const order = await Order.findOne({ transactionId });

    if (!order) return res.status(404).json({ message: "Order not found" });

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (order.otp !== hashedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    order.status = "completed";
    await order.save();
    res.status(200).json({ message: "Order completed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying order" });
  }
});

// Get completed purchased orders for the logged-in user (as buyer)
router.get("/purchased", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id, status: "completed" })
      .populate("items")
      .populate("sellerId", "firstName email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching purchased orders:", error);
    res.status(500).json({ message: "Error fetching purchased orders" });
  }
});

// Get completed sold orders for the logged-in user (as seller)
router.get("/sold", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id, status: "completed" })
      .populate("items")
      .populate("buyerId", "firstName email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching sold orders:", error);
    res.status(500).json({ message: "Error fetching sold orders" });
  }
});

module.exports = router;  
