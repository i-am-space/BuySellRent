import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/support/chat",
        { userMessage: input },
        {
          headers: { 
            Authorization: "Bearer " + localStorage.getItem("token") 
          },
        }
      );

      setMessages([...newMessages, { sender: "bot", text: response.data.botReply }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages([...newMessages, { sender: "bot", text: "Error fetching response" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Support Chat</h1>
        <div className="border rounded-lg p-4 bg-white shadow-md max-w-2xl mx-auto">
          <div className="h-96 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg mb-2 ${msg.sender === "user" ? "bg-blue-100" : "bg-gray-200"}`}>
                <strong>{msg.sender === "user" ? "You" : "Support"}:</strong> {msg.text}
              </div>
            ))}
            {loading && <p className="text-gray-500">Support is typing...</p>}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l-lg"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="bg-blue-500 text-white p-2 rounded-r-lg" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
