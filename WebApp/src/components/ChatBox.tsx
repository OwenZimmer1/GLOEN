import { useState } from "react";
import axios from "axios";
import "./ChatBox.css"; // ✅ Import styles

interface ChatBoxProps {
  context: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ context }) => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);

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
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <p className="chat-question"><strong>You:</strong> {chat.question}</p>
            <p className="chat-answer"><strong>AI:</strong> {chat.answer}</p>
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
        ></button>
      </div>
    </div>
  );
};

export default ChatBox;
