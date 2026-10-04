import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const modes = ["Beginner", "Normal", "Exam Tomorrow"];
const languages = ["Hinglish", "English"];
const tasks = ["Explain", "Short Notes", "Quiz", "Viva"];

function App() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("Exam Tomorrow");
  const [language, setLanguage] = useState("Hinglish");
  const [task, setTask] = useState("Explain");
  const [answer, setAnswer] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askAI(e) {
    e.preventDefault();
    setError("");
    setAnswer("");

    if (!topic.trim()) {
      setError("Topic ya notes enter karo.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, mode, language, task })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setAnswer(data.answer);
      setModel(data.model || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">OPEN-MODEL STUDY BUDDY</div>
        <h1>Simplify <span>AI</span></h1>
        <p className="tagline">
          Your friendly open-model study companion for turning difficult topics into simple explanations.
        </p>
      </section>

      <section className="layout">
        <form className="card inputCard" onSubmit={askAI}>
          <label className="label">What are you studying?</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Paste a topic, question or notes... e.g. Explain binary search with an example."
          />

          <div className="group">
            <div>
              <span className="smallLabel">LEVEL</span>
              <div className="chips">
                {modes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={mode === item ? "chip active" : "chip"}
                    onClick={() => setMode(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="smallLabel">LANGUAGE</span>
              <div className="chips">
                {languages.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={language === item ? "chip active" : "chip"}
                    onClick={() => setLanguage(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="smallLabel">MODE</span>
              <div className="chips">
                {tasks.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={task === item ? "chip active" : "chip"}
                    onClick={() => setTask(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="primary" disabled={loading}>
            {loading ? "Samjha raha hoon..." : "Samjha De →"}
          </button>

          <p className="privacy">
            Your API key stays on the backend. The app is designed around a swappable open-weight model.
          </p>
        </form>

        <section className="card outputCard">
          <div className="outputHeader">
            <div>
              <span className="smallLabel">AI RESPONSE</span>
              <h2>{task}</h2>
            </div>
            {model && <span className="modelPill">{model}</span>}
          </div>

          {!answer && !error && !loading && (
            <div className="empty">
              <div className="emoji">🧠</div>
              <h3>Ready when you are.</h3>
              <p>Try: “Explain stack and queue difference for viva.”</p>
            </div>
          )}

          {loading && (
            <div className="empty">
              <div className="loader" />
              <h3>Breaking it down...</h3>
              <p>Simple explanation aa rahi hai.</p>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {answer && (
            <div className="answer">
  <ReactMarkdown>{answer}</ReactMarkdown>
</div>
          )}
        </section>
      </section>

      <footer>
        Built for a real friend • Powered by an open-weight model • Hacktoberfest 2026
      </footer>
    </main>
  );
}

export default App;
