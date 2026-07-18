import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API = "http://localhost:8080/api";

function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("collegeUser") || "null"),
  );
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [colleges, setColleges] = useState([]);
  const [query, setQuery] = useState("");
  const [details, setDetails] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chat, setChat] = useState([]);

  const search = async (value = "") => {
    const response = await fetch(
      `${API}/colleges?query=${encodeURIComponent(value)}`,
    );
    setColleges(await response.json());
  };
  useEffect(() => {
    if (user) search();
  }, [user]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const endpoint = mode === "login" ? "login" : "register";
    try {
      const response = await fetch(`${API}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Please check your details.");
      localStorage.setItem("collegeUser", JSON.stringify(data));
      setUser(data);
    } catch (problem) {
      setError(problem.message);
    }
  };

  const selectCollege = (college) => {
    setSelectedCollege(college);
    setDetails(null);
    setChat([]);
  };
  const chatAboutCollege = (college) => {
    selectCollege(college);
    setChatOpen(true);
  };
  const ask = () => {
    if (!selectedCollege) {
      setChat([
        {
          text: "Please select a college first using the Select this college button.",
          me: false,
        },
      ]);
      return;
    }
    const c = selectedCollege;
    setChat([
      { text: `Tell me about ${c.name}`, me: true },
      {
        text: `${c.name} offers ${c.courses.map((x) => x.name).join(", ")}. Hostel: ${c.hostel} Placements: ${c.placements}`,
        me: false,
      },
    ]);
  };

  if (!user)
    return (
      <main className="auth">
        <section className="welcome">
          <span className="logo">CampusCompass</span>
          <h1>Choose your college with confidence.</h1>
          <p>
            Explore courses, fees, hostels and placement information in one
            simple place.
          </p>
        </section>
        <section className="card auth-card">
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <form onSubmit={submit}>
            {mode === "register" && (
              <input
                required
                placeholder="Your full name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            )}
            <input
              required
              type="email"
              placeholder="Email address"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              required
              minLength="6"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <small className="error">{error}</small>}
            <button>{mode === "login" ? "Log in" : "Create account"}</button>
          </form>
          <button
            className="link"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "New here? Create an account"
              : "Already registered? Log in"}
          </button>
        </section>
      </main>
    );

  return (
    <main>
      <header>
        <span className="logo">CampusCompass</span>
        <nav>
          <button className="plain" onClick={() => setChatOpen(!chatOpen)}>
            Chatbot
          </button>
          <span>Hi, {user.name.split(" ")[0]}</span>
          <button
            className="plain"
            onClick={() => {
              localStorage.removeItem("collegeUser");
              setUser(null);
            }}
          >
            Log out
          </button>
        </nav>
      </header>
      <section className="hero">
        <p className="eyebrow">COLLEGE ENQUIRY MADE SIMPLE</p>
        <h1>Find a college that feels right for you.</h1>
        <div className="search">
          <input
            value={query}
            placeholder="Search college, city or course"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search(query)}
          />
          <button onClick={() => search(query)}>Search colleges</button>
        </div>
      </section>
      <section className="content">
        <h2>Colleges</h2>
        <div className="grid">
          {colleges.map((college) => (
            <article className="card college" key={college.id}>
              <span className="tag">{college.city}</span>
              <h3>{college.name}</h3>
              <p>{college.description}</p>
              <button onClick={() => setDetails(college)}>View details</button>
            </article>
          ))}
        </div>
        {!colleges.length && <p>No colleges found. Try another search.</p>}
      </section>
      {details && (
        <div className="overlay">
          <section className="details">
            <button className="close" onClick={() => setDetails(null)}>
              ×
            </button>
            <span className="tag">
              {details.city}, {details.state}
            </span>
            <h2>{details.name}</h2>
            <p>{details.description}</p>
            <h3>Courses and yearly fees</h3>
            <div className="courses">
              {details.courses.map((course) => (
                <div key={course.name}>
                  <strong>{course.name}</strong>
                  <span>{course.duration}</span>
                  <b>{course.annualFee}</b>
                </div>
              ))}
            </div>
            <div className="info">
              <div>
                <h3>Hostel</h3>
                <p>{details.hostel}</p>
              </div>
              <div>
                <h3>Placements</h3>
                <p>{details.placements}</p>
              </div>
            </div>
            <button onClick={() => selectCollege(details)}>
              Select this college
            </button>
            <button onClick={() => chatAboutCollege(details)}>
              Chat about this college
            </button>
          </section>
        </div>
      )}
      {chatOpen && (
        <aside className="chat">
          <b>CampusCompass assistant</b>
          <button className="close" onClick={() => setChatOpen(false)}>
            ×
          </button>
          <p>
            {selectedCollege
              ? `Selected: ${selectedCollege.name}`
              : "Select a college to get college-specific answers."}
          </p>
          {chat.map((message, index) => (
            <div key={index} className={message.me ? "mine" : "reply"}>
              {message.text}
            </div>
          ))}
          <button onClick={ask}>Ask about selected college</button>
        </aside>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
