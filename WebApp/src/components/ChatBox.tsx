import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBox.css";
import API_BASE_URL from "../config";

// Interface for component props
interface ChatBoxProps {
  context: string; // Contextual information for the chat
}

// Chat interface component with history tracking
const ChatBox: React.FC<ChatBoxProps> = ({ context }) => {
  // State management for chat interactions
  const [question, setQuestion] = useState<string>(""); // Current user input
  const [, setResponse] = useState<string>(""); // AI response
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string }[]
  >([]); // Conversation history
  const [welcomeMessage, setWelcomeMessage] = useState<string>(""); // Initial greeting

  // Set welcome message based on context
  useEffect(() => {
    setWelcomeMessage("Hi, How can I help you today?");
  }, [context]); // Re-run when context changes

  // Handle sending questions to AI
  const handleSend = async () => {
    if (!question.trim()) return; // Skip empty messages

    setLoading(true);
    setResponse("");

    try {
      // API call to get AI response
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
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat history display */}
      <div className="chat-history">
        {/* Welcome message */}
        {welcomeMessage && <p className="chat-welcome">{welcomeMessage}</p>}

        {/* Previous messages */}
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <p className="chat-question">
              <strong>You:</strong> {chat.question}
            </p>
            <div className="chat-answer">
              <strong>AI:</strong>
              {/* Render markdown-formatted response */}
              <ReactMarkdown>{chat.answer}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && <p className="chat-loading">Thinking...</p>}
      </div>

      {/* Input area */}
      <div className="chat-input-container">
        <textarea
          placeholder="Ask a follow-up question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="chat-input"
          disabled={loading}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className={`chat-send ${loading ? "loading" : ""}`}
        />
      </div>
    </div>
  );
};

export default ChatBox;
