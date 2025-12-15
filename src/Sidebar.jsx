import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  MessageSquare,
  Library,
  Clock,
  Plus,
} from "lucide-react";

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const navItem = (to, label, Icon) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        onClick={() => isOpen && onToggle()}
        className="block"
      >
        <div
          className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200
            ${
              active
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
            }`}
        >
          <Icon size={18} />
          <span className="text-sm font-medium truncate">
            {label}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="relative">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Health AI
          </p>
          <p className="text-xs text-gray-400">
            Mental wellness assistant
          </p>
        </div>

        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-800"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72
        bg-gradient-to-b from-gray-950 via-gray-900 to-black
        border-r border-gray-800
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Bot Header */}
        <div className="px-6 py-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            {/* Bot Avatar */}
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                AI
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">
                Health Assistant
              </h2>
              <p className="text-xs text-gray-400">
                Online • Ready to help
              </p>
            </div>
          </div>

          {/* New Chat Button */}
          <button className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-2.5 text-sm font-medium text-white hover:opacity-90 transition">
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-6 overflow-y-auto h-[calc(100%-220px)]">
          {/* Main */}
          <div>
            <p className="px-2 mb-2 text-xs uppercase tracking-wider text-gray-500">
              Main
            </p>
            <div className="space-y-2">
              {navItem("/", "Chat Assistant", MessageSquare)}
              {navItem("/resources", "Resource Hub", Library)}
            </div>
          </div>

          {/* Chat History */}
          <div>
            <p className="px-2 mb-2 text-xs uppercase tracking-wider text-gray-500">
              Recent Chats
            </p>

            <div className="space-y-1">
              {["Stress Analysis", "Sleep Improvement", "Anxiety Help"].map(
                (chat, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800/60 hover:text-white transition truncate"
                  >
                    <Clock size={14} />
                    <span className="truncate">{chat}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-800 bg-black">
          <p className="text-xs text-gray-500 text-center">
            © 2025 Health AI Platform
          </p>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onToggle}
        />
      )}
    </div>
  );
}
