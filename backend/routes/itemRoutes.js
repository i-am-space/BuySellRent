const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
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
  

// Add sample items (for testing)
router.post("/add", authenticateToken, async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);
    const { name, price, description, category } = req.body;
    if (!name || !price || !description || !category) {
        return res.status(400).json({ message: "All fields are required" });
      }
    const newItem = new Item({
      name,
      price,
      description,
      category,
      sellerId: req.user.id
    });
    console.log("Details of added item:", name, price, description, category);
    await newItem.save();
    res.status(201).json({ message: "New item added succesfully" });
    console.log("New item added successfully");
  } catch (error) {
    res.status(500).json({ message: "Error adding new item" });
    console.log("Error adding new item");
  }
});

// Add sample items (for testing)
router.post("/addSample", authenticateToken, async (req, res) => {
    try {
      const items = [
        {
          name: "Laptop",
          price: 50000,
          description: "A powerful gaming laptop.",
          category: "Electronics",
          sellerId: req.user.id,
        },
        {
          name: "T-Shirt",
          price: 500,
          description: "Comfortable cotton t-shirt.",
          category: "Clothing",
          sellerId: req.user.id,
        },
      ];
  
      for (let item of items) {
        const newItem = new Item(item);
        await newItem.save();
      }
      res.status(201).json({ message: "Sample items added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error adding sample items" });
    }
  });

// Fetch specific item by ID
router.get("/:id", authenticateToken, async (req, res) => {
    try {
      const item = await Item.findById(req.params.id).populate("sellerId", "firstName email");
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Error fetching item" });
    }
  });


router.get("/", authenticateToken, async (req, res) => {
    try {
      const { search, categories } = req.query;
      let query = {};
  
      if (search) {
        query.name = { $regex: search, $options: "i" }; // Case insensitive search
      }
  
      if (categories) {
        query.category = { $in: categories.split(",") };
      }
  
      console.log("Query:", query); // Log the query for debugging
  
      const items = await Item.find(query).populate("sellerId", "firstName email");
      console.log("Items found:", items); // Log the result
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error); // Log the error
      res.status(500).json({ message: "Error fetching items" });
    }
  });

router.delete("/:id", authenticateToken, async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      if (item.sellerId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this item" });
      }
      await Item.findByIdAndDelete(req.params.id);
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting item" });
    }
  });
  
module.exports = router;
