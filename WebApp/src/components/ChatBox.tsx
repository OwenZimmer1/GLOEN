import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown"; // ✅ Import Markdown renderer
import "./ChatBox.css"; // ✅ Import styles

interface ChatBoxProps {
  context: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ context }) => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");

  useEffect(() => {
    setWelcomeMessage(
      "Hi, How can I help you today?"
    );
  }, [context]);

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/chat", {
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
      <div className="chat-history">
        {welcomeMessage && <p className="chat-welcome">{welcomeMessage}</p>}
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <p className="chat-question"><strong>You:</strong> {chat.question}</p>
            <div className="chat-answer">
              <strong>AI:</strong> 
              <ReactMarkdown>{chat.answer}</ReactMarkdown> {/* ✅ Format AI response properly */}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <textarea
          placeholder="Ask a follow-up question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="chat-input"
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
