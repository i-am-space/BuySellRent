const express = require("express");
const axios = require("axios");
const router = express.Router();

// Route to handle chatbot queries
router.post("/chat", async (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Send the user's message to an AI API (e.g., OpenAI or any other third-party chatbot)
    const apiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions", // Replace with the actual API endpoint you're using
      {
        model: "gpt-3.5-turbo", // Replace with the model you're using (adjust as necessary)
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure this API key is stored in your environment variables
        },
      }
    );

    const botReply = apiResponse.data.choices[0].message.content;

    res.status(200).json({ botReply });
  } catch (error) {
    console.error("Error in chatbot API:", error.message);
    res.status(500).json({ message: "Error processing chatbot response" });
  }
});

module.exports = router;
