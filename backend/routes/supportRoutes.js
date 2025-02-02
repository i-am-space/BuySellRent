const express = require("express");
const axios = require("axios");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Use your actual API key
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
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
    next();
  } catch (err) {
    console.error("Invalid Token:", err.message);
    res.status(400).json({ message: "Invalid Token" });
  }
};

router.post("/chat", authenticateToken, async (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ message: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ botReply: text });
  } catch (error) {
    console.error("Error in chatbot API:", error.message);
    return res.status(500).json({ message: "Error processing chatbot response" });
  }
});

module.exports = router;
