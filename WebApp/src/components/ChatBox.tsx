import { useState } from "react";
import axios from "axios";

interface ChatBoxProps {
  context: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ context }) => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        question,
        context,
      });

      setResponse(res.data.response);
    } catch (error) {
      console.error("Error:", error);
      setResponse("❌ Error processing request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-box">
      <h3>Ask a Question About the Results</h3>
      <textarea
        placeholder="Ask a follow-up question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Processing..." : "Send"}
      </button>
      {response && (
        <div className="chat-response">
          <h4>Response:</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
