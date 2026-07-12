import { useState } from "react";
import { BookOpen, Play, Search, Clock, Users, Star, Video, Download, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import resources from "./resources.json";

const categories = ["All", "Stress", "Anxiety", "Depression", "Nervousness"];
const tabs = ["All", "Articles", "Audio", "Videos"];

const typeStyle = {
  article: { dot: "#f97316", badge: "rgba(249,115,22,0.12)", text: "#c2410c", btn: "#f97316", btnHover: "#ea580c", label: "📄 Read Article" },
  audio:   { dot: "#10b981", badge: "rgba(16,185,129,0.12)",  text: "#047857", btn: "#10b981", btnHover: "#059669", label: "🎵 Listen" },
  video:   { dot: "#8b5cf6", badge: "rgba(139,92,246,0.12)",  text: "#6d28d9", btn: "#8b5cf6", btnHover: "#7c3aed", label: "▶️ Watch" },
  guide:   { dot: "#3b82f6", badge: "rgba(59,130,246,0.12)",  text: "#1d4ed8", btn: "#3b82f6", btnHover: "#2563eb", label: "📖 Read" },
};

function TypeIcon({ type }) {
  if (type === "audio") return <Play size={13} />;
  if (type === "video") return <Video size={13} />;
  return <BookOpen size={13} />;
}

function ResourceCard({ resource, onSelect }) {
  const s = typeStyle[resource.type] || typeStyle.article;
  return (
    <div
      onClick={() => onSelect(resource)}
      className="card cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
      style={{ padding: "1.5rem" }}
    >
      {/* type dot */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem", width: "10px", height: "10px", borderRadius: "50%", background: s.dot }} />

      {/* badges */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.625rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600, background: s.badge, color: s.text }}>
          <TypeIcon type={resource.type} />
          <span style={{ textTransform: "capitalize" }}>{resource.type}</span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.625rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 500, background: "var(--bg-muted)", color: "var(--text-muted)", border: "1px solid var(--border-default)" }}>
          {resource.category}
        </span>
      </div>

      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.5rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {resource.title}
      </h3>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-body)", lineHeight: 1.6, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {resource.description}
      </p>

      {/* stats */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", background: "var(--bg-muted)", border: "1px solid var(--border-default)", marginBottom: "1rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Clock size={12} />{resource.duration}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Star size={12} style={{ color: "#f59e0b" }} />{resource.rating}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Users size={12} />{resource.downloads}</span>
      </div>

      {/* tags */}
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {resource.tags.slice(0, 2).map((tag) => (
          <span key={tag} style={{ padding: "0.2rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", background: "var(--bg-muted)", color: "var(--text-muted)", border: "1px solid var(--border-default)" }}>
            {tag}
          </span>
        ))}
        {resource.tags.length > 2 && (
          <span style={{ padding: "0.2rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", background: "var(--bg-muted)", color: "var(--text-muted)" }}>
            +{resource.tags.length - 2}
          </span>
        )}
      </div>

      <button
        style={{ width: "100%", padding: "0.625rem", borderRadius: "0.625rem", border: "none", background: s.btn, color: "white", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = s.btnHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = s.btn)}
      >
        {s.label}
      </button>
    </div>
  );
}

export function ResourceHub({ initialId }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedResource, setSelectedResource] = useState(
    () => initialId ? (resources.find((r) => r.id === String(initialId)) ?? null) : null
  );

  const handleBack = () => {
    setSelectedResource(null);
    navigate("/resources", { replace: true });
  };

  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Articles" && r.type === "article") ||
      (activeTab === "Audio" && r.type === "audio") ||
      (activeTab === "Videos" && r.type === "video");
    return matchesSearch && matchesCategory && matchesTab;
  });

  if (selectedResource) {
    const s = typeStyle[selectedResource.type] || typeStyle.article;
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <button
          onClick={handleBack}
          className="btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}
        >
          <ChevronLeft size={16} /> Back to Resources
        </button>

        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.5rem" }}>
                {selectedResource.title}
              </h2>
              <p style={{ color: "var(--text-body)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                {selectedResource.description}
              </p>
              <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Clock size={14} />{selectedResource.duration}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Star size={14} style={{ color: "#f59e0b" }} />{selectedResource.rating}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Download size={14} />{selectedResource.downloads} downloads</span>
              </div>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.375rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, background: s.badge, color: s.text, flexShrink: 0 }}>
              <TypeIcon type={selectedResource.type} />
              <span style={{ textTransform: "capitalize", marginLeft: "0.25rem" }}>{selectedResource.type}</span>
            </span>
          </div>

          {selectedResource.type === "audio" && selectedResource.audioUrl && (
            <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "var(--bg-muted)", border: "1px solid var(--border-default)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", fontSize: "0.8125rem" }}>
                  <Play size={14} /> Play Audio
                </button>
                <div style={{ flex: 1, height: "6px", borderRadius: "999px", background: "var(--border-default)" }} />
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>0:00 / {selectedResource.duration}</span>
              </div>
            </div>
          )}

          {selectedResource.type === "video" && selectedResource.videoUrl && (
            <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "var(--bg-muted)", border: "1px solid var(--border-default)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", fontSize: "0.8125rem" }}>
                  <Video size={14} /> Watch Video
                </button>
                <div style={{ flex: 1, height: "6px", borderRadius: "999px", background: "var(--border-default)" }} />
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>0:00 / {selectedResource.duration}</span>
              </div>
            </div>
          )}

          {selectedResource.content && (
            <div style={{ fontSize: "0.9rem", color: "var(--text-body)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              <p>{selectedResource.content}</p>
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "0.75rem" }}>
                [Full content would be displayed here in a real implementation.]
              </p>
            </div>
          )}

          <div style={{ paddingTop: "1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {selectedResource.tags.map((tag) => (
              <span key={tag} style={{ padding: "0.25rem 0.625rem", borderRadius: "999px", fontSize: "0.75rem", background: "var(--bg-muted)", color: "var(--text-muted)", border: "1px solid var(--border-default)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Search + Filter */}
      <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", paddingLeft: "2.25rem", paddingRight: "0.75rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "0.625rem", border: "1.5px solid var(--border-default)", background: "var(--bg-body)", color: "var(--text-heading)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: "0.5rem 0.75rem", borderRadius: "0.625rem", border: "1.5px solid var(--border-default)", background: "var(--bg-body)", color: "var(--text-heading)", fontSize: "0.875rem", outline: "none" }}
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-default)", paddingBottom: "0" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "none",
              background: "none",
              cursor: "pointer",
              borderBottom: activeTab === tab ? "2px solid var(--indigo-600)" : "2px solid transparent",
              color: activeTab === tab ? "var(--indigo-600)" : "var(--text-muted)",
              marginBottom: "-1px",
              transition: "color 150ms",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onSelect={setSelectedResource} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <BookOpen size={40} style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }} />
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: "0.5rem" }}>No resources found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
