import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageCircle } from "lucide-react";

export default function EmployeeChatbot() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const employeeId = user?.employeeId || "EMP001";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your occupational health assistant. Ask me anything about your stress, fatigue, or wellbeing.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const sendMessage = async () => {
    const query = input.trim();
    if (!query || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:9091/EmployeeChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Employee_Id: employeeId, Query: query } ),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.Response || "Sorry, I couldn't get a response." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Unable to reach the health assistant. Please ensure the server is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open health chat"
        style={{
          position: "fixed",
          bottom: "1.75rem",
          left: "1.75rem",
          zIndex: 1000,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--indigo-600)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(79,70,229,0.45)",
          transition: "transform 200ms var(--ease-out), background 200ms",
          transform: open ? "scale(0.92)" : "scale(1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--indigo-500)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--indigo-600)")}
      >
        {open ? (
          <X size={22} color="white" />
        ) : (
          <MessageCircle size={22} color="white" />
        )}
      </button>

      {/* Chat Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "5.5rem",
            left: "1.75rem",
            zIndex: 999,
            width: "480px",
            maxWidth: "calc(100vw - 2rem)",
            height: "620px",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
            overflow: "hidden",
            animation: "chatSlideUp 0.25s var(--ease-out) both",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.875rem 1rem",
              background: "var(--indigo-600)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={17} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "white" }}>
                Health Assistant
              </p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "rgba(255,255,255,0.7)" }}>
                AI-powered · Always available
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "6px",
                padding: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} color="white" />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    flexShrink: 0,
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: msg.role === "bot" ? "var(--indigo-50)" : "var(--indigo-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {msg.role === "bot" ? (
                    <Bot size={14} style={{ color: "var(--indigo-600)" }} />
                  ) : (
                    <User size={14} color="white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.8125rem",
                    lineHeight: 1.6,
                    borderRadius: msg.role === "bot"
                      ? "4px 12px 12px 12px"
                      : "12px 4px 12px 12px",
                    background: msg.role === "bot" ? "var(--bg-muted)" : "var(--indigo-600)",
                    color: msg.role === "bot" ? "var(--text-body)" : "white",
                    border: msg.role === "bot" ? "1px solid var(--border-default)" : "none",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--indigo-50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={14} style={{ color: "var(--indigo-600)" }} />
                </div>
                <div
                  style={{
                    padding: "0.5rem 0.875rem",
                    borderRadius: "4px 12px 12px 12px",
                    background: "var(--bg-muted)",
                    border: "1px solid var(--border-default)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--slate-400)",
                        display: "inline-block",
                        animation: `dotBounce 1s infinite ${delay}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "0.75rem",
              borderTop: "1px solid var(--border-default)",
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-end",
              flexShrink: 0,
              background: "var(--bg-card)",
            }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your health…"
              style={{
                flex: 1,
                resize: "none",
                fontSize: "0.8125rem",
                padding: "0.625rem 0.75rem",
                outline: "none",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border-default)",
                background: "var(--bg-body)",
                color: "var(--text-heading)",
                maxHeight: "80px",
                fontFamily: "inherit",
                transition: "border-color var(--duration-fast)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--indigo-400)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                flexShrink: 0,
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: !input.trim() || loading ? "var(--slate-200)" : "var(--indigo-600)",
                border: "none",
                cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 200ms",
              }}
            >
              <Send size={15} color={!input.trim() || loading ? "var(--slate-400)" : "white"} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
