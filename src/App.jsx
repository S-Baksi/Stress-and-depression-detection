import "./App.css";
import { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import HealthAssessment from "./HealthAssessment";
import ChatPage from "./ChatPage";
import ResourceHub from "./ResourceHub";
import ResourceDetail from "./ResourceDetail";
import DepressionForm from "./DepressionForm";
import AnxietyForm from "./AnxietyForm";

/* -------------------------------------------------------
   Global Page Container
   - Warm medical AI theme
   - Smooth premium transitions
-------------------------------------------------------- */
function PageContainer({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#FBF7EE] text-gray-800 antialiased">
      <div className="min-h-screen animate-fadeInSlow">
        {children}
      </div>
    </div>
  );
}

function App() {
  const makeId = () => `${Date.now()}-${Math.random()}`;
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* -------------------------------------------------------
     Chat State (UNCHANGED LOGIC)
  -------------------------------------------------------- */
  const [messages, setMessages] = useState([
    {
      id: makeId(),
      text:
        "I am your caring assistant. You can talk to me freely about stress, anxiety, sleep, or health concerns. I’m here to help calmly and privately.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [chatContext, setChatContext] = useState(null);

  const messagesEndRef = useRef(null);

  /* -------------------------------------------------------
     Auto-scroll chat
  -------------------------------------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------------------------------------------
     Assessment detection (UNCHANGED)
  -------------------------------------------------------- */
  const detectAssessmentType = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("depression")) return "depression";
    if (lowerText.includes("anxiety")) return "anxiety";
    if (lowerText.includes("stress")) return "stress";
    return null;
  };

  /* -------------------------------------------------------
     Send message handler (UNCHANGED)
  -------------------------------------------------------- */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        text: userInput,
        sender: "user",
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await fetch("http://localhost:9092/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
      });

      if (!response.ok) throw new Error("Chat API error");

      const data = await response.json();
      const botResponse =
        data.answer || data.response || "I’m here to help you.";

      const assessmentType = detectAssessmentType(
        botResponse + " " + userInput
      );

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);

      if (assessmentType) {
        setChatContext(assessmentType);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: makeId(),
              text: `Please complete the ${assessmentType} assessment form`,
              sender: "bot",
              timestamp: new Date(),
              type: "assessment-link",
              targetForm: assessmentType,
            },
          ]);
        }, 500);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          text:
            "I’m here to support your health and well-being. Please try again in a moment.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     New chat reset (UNCHANGED)
  -------------------------------------------------------- */
  const handleNewChat = () => {
    setMessages([
      {
        id: makeId(),
        text:
          "I am your caring assistant. What would you like to talk about today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setChatContext(null);
  };

  /* -------------------------------------------------------
     Resource extraction & assessment completion
     (UNCHANGED)
  -------------------------------------------------------- */
  const extractResourceLinks = (text) => {
    if (!text) return [];
    const linkRegex = /[-•]\s*([^:]+):\s*localhost:\d+\/resources\/(\d+)/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      links.push({ title: match[1].trim(), id: match[2] });
    }

    return links;
  };

  const handleAssessmentComplete = (assessment, type = "health") => {
    const prediction =
      assessment?.ml_output?.prediction || assessment?.prediction;
    const explanation =
      assessment?.llm_explanation || assessment?.explanation;

    const typeLabel =
      type !== "health"
        ? `${type.charAt(0).toUpperCase() + type.slice(1)} Assessment Result:`
        : "Assessment Result:";

    const resourceLinks = extractResourceLinks(explanation);

    const cleanExplanation = explanation
      ? explanation.replace(
          /[-•]\s*[^:]+:\s*localhost:\d+\/resources\/\d+\s*/g,
          ""
        )
      : "";

    const analysisText = [
      typeLabel,
      prediction ? `Result: ${prediction}` : "",
      cleanExplanation ? `\n\n${cleanExplanation}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        text: analysisText,
        sender: "bot",
        timestamp: new Date(),
        type: "analysis",
      },
    ]);

    if (resourceLinks.length > 0) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            text: "Recommended resources for you:",
            sender: "bot",
            timestamp: new Date(),
            type: "resource-links",
            links: resourceLinks,
          },
        ]);
      }, 500);
    }
  };

  /* -------------------------------------------------------
     Routes (STRUCTURE UNCHANGED)
  -------------------------------------------------------- */
  return (
    <PageContainer key={location.pathname}>
      <Routes>
        <Route
          path="/"
          element={
            <ChatPage
              messages={messages}
              input={input}
              setInput={setInput}
              handleSendMessage={handleSendMessage}
              handleNewChat={handleNewChat}
              messagesEndRef={messagesEndRef}
              navigate={navigate}
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen((p) => !p)}
              loading={loading}
            />
          }
        />

        <Route
          path="/health-form"
          element={
            <HealthAssessment
              onBack={() => navigate("/")}
              onComplete={handleAssessmentComplete}
            />
          }
        />

        <Route
          path="/depression-form"
          element={
            <DepressionForm
              onBack={() => navigate("/")}
              onComplete={handleAssessmentComplete}
            />
          }
        />

        <Route
          path="/anxiety-form"
          element={
            <AnxietyForm
              onBack={() => navigate("/")}
              onComplete={handleAssessmentComplete}
            />
          }
        />

        <Route
          path="/stress-form"
          element={
            <HealthAssessment
              onBack={() => navigate("/")}
              onComplete={handleAssessmentComplete}
            />
          }
        />

        <Route
          path="/resources"
          element={
            <ResourceHub
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen((p) => !p)}
            />
          }
        />

        <Route path="/resources/:id" element={<ResourceDetail />} />
      </Routes>
    </PageContainer>
  );
}

export default App;
