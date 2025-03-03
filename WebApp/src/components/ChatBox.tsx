import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBox.css";
import API_BASE_URL from "../config";

interface ChatBoxProps {
  context: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ context }) => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // ✅ Add loading state
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");

  useEffect(() => {
    setWelcomeMessage("Hi, How can I help you today?");
  }, [context]);

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true); // ✅ Set loading to true when sending
    setResponse("");

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        question,
        context,
      });

      const answer = res.data.response;
      setChatHistory([...chatHistory, { question, answer }]);
      setResponse(answer);
      setQuestion("");
    } catch (error) {
      console.error("Error:", error);
      setResponse("❌ Error processing request.");
    } finally {
      setLoading(false); // ✅ Set loading to false when complete (success or error)
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {welcomeMessage && <p className="chat-welcome">{welcomeMessage}</p>}
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <p className="chat-question">
              <strong>You:</strong> {chat.question}
            </p>
            <div className="chat-answer">
              <strong>AI:</strong>
              <ReactMarkdown>{chat.answer}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <p className="chat-loading">Thinking...</p>} {/* ✅ Loading message */}
      </div>
      <div className="chat-input-container">
        <textarea
          placeholder="Ask a follow-up question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="chat-input"
          disabled={loading} // ✅ Disable input while loading
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`chat-send ${loading ? "loading" : ""}`}
        >
          {loading ? "" : ""}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
