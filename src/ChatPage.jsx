import { Send, Trash, BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getResourceById } from "./resourcesData";

export default function ChatPage({
  messages,
  input,
  setInput,
  handleSendMessage,
  handleNewChat,
  messagesEndRef,
  navigate,
  sidebarOpen,
  onToggleSidebar,
  loading,
}) {
  const handleFormLinkClick = (formType) => {
    navigate(`/${formType}-form`);
  };

  return (
    <div className="flex h-screen bg-[#FBF7EE] text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={onToggleSidebar} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#FFF9E8]/90 backdrop-blur border-b border-yellow-200 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Bot Avatar */}
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold shadow">
              AI
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Caring Health Assistant
              </h1>
              <p className="text-sm text-gray-600">
                Calm • Private • AI-guided conversations
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full ${
              loading
                ? "bg-yellow-100 text-yellow-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            {loading ? "Thinking…" : "Online"}
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-8 py-10 space-y-8 scroll-smooth">
          {/* Initial Greeting */}
          {messages.length === 0 && (
            <div className="max-w-2xl bg-white rounded-2xl p-6 shadow border border-yellow-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                👋 <strong>I am your caring assistant.</strong>
                <br />
                You can talk to me freely about stress, anxiety, sleep,
                emotional wellbeing, or health-related concerns.  
                I’m here to listen, guide, and support you calmly.
              </p>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.sender === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[85%] lg:max-w-[60%]">
                  <div
                    className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-md"
                        : message.type === "assessment-link"
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                        : message.type === "resource-links"
                        ? "bg-transparent"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {/* Assessment Link */}
                    {message.type === "assessment-link" ? (
                      <button
                        onClick={() =>
                          handleFormLinkClick(message.targetForm)
                        }
                        className="font-semibold underline underline-offset-4 hover:opacity-80"
                      >
                        {message.text}
                      </button>
                    ) : message.type === "resource-links" &&
                      message.links ? (
                      <div className="space-y-4">
                        <p className="font-semibold text-gray-900">
                          {message.text}
                        </p>

                        {message.links.map((link, idx) => (
                          <Link
                            key={idx}
                            to={`/resources/${link.id}`}
                            className="block"
                          >
                            <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 hover:bg-yellow-100 transition">
                              <div className="flex gap-3">
                                <BookOpen
                                  size={16}
                                  className="text-yellow-600 mt-1"
                                />
                                <div>
                                  <p className="font-medium">
                                    {link.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Open guided resource
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : message.type === "resources" &&
                      message.resourceIds ? (
                      <div className="space-y-4">
                        {message.resourceIds.map((id) => {
                          const resource = getResourceById(id);
                          return resource ? (
                            <Link
                              key={id}
                              to={`/resources/${id}`}
                              className="block"
                            >
                              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 hover:border-blue-400 transition">
                                <div className="flex gap-3">
                                  <BookOpen size={16} />
                                  <div>
                                    <p className="font-medium">
                                      {resource.title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {resource.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <p
                    className={`mt-2 text-xs text-gray-400 ${
                      isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </main>

        {/* Input Area */}
        <footer className="bg-[#FFF9E8] border-t border-yellow-200 px-8 py-6">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what’s on your mind…"
              disabled={loading}
              className="flex-1 rounded-2xl bg-white border border-gray-300 px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-yellow-500 hover:bg-yellow-600 px-5 py-4 text-white transition shadow"
            >
              <Send size={18} />
            </button>

            <button
              type="button"
              onClick={handleNewChat}
              disabled={loading}
              className="rounded-2xl bg-red-500 hover:bg-red-600 px-5 py-4 text-white transition"
            >
              <Trash size={18} />
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Your conversations are private • Designed for calm care
          </p>
        </footer>
      </div>
    </div>
  );
}
