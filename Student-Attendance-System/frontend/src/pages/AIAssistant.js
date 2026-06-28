import React, { useState } from "react";
import "../styles/AIAssistant.css";

function AIAssistant() {

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);


  const askAI = async () => {

    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      text: question
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    const currentQuestion = question;

    setQuestion("");

    setLoading(true);

    try {

      const res = await fetch(
        "http://127.0.0.1:5000/ai-assistant",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            question: currentQuestion
          })
        }
      );

      const data = await res.json();

      setMessages((prev) => [

        ...prev,

        {
          role: "ai",
          text: data.response
        }

      ]);

    }

    catch {

      setMessages((prev) => [

        ...prev,

        {
          role: "ai",
          text: "Something went wrong."
        }

      ]);

    }

    setLoading(false);

  };


  return (

    <div className="ai-page">

      <div className="chat-container">

        {messages.length === 0 && (

          <div className="welcome-screen">

            <div className="welcome-icon">
              🤖
            </div>

            <h1>
              AI Attendance Assistant
            </h1>

            <p>
              Ask anything about attendance,
              reports, students, or classes.
            </p>

          </div>

        )}


        {messages.map((msg, index) => (

          <div
            key={index}
            className={`message ${msg.role}`}
          >

            <div className="message-box">

              {msg.text}

            </div>

          </div>

        ))}


        {loading && (

          <div className="message ai">

            <div className="message-box typing">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        )}

      </div>


      <div className="input-area">

        <input
          type="text"
          placeholder="Ask AI anything..."
          value={question}
          onChange={(e)=>
            setQuestion(e.target.value)
          }
          onKeyDown={(e)=>
            e.key==="Enter" && askAI()
          }
        />

        <button onClick={askAI}>
          ➤
        </button>

      </div>

    </div>

  );

}

export default AIAssistant;