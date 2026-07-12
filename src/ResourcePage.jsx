import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResourceHub } from "./ResourceHub";
import Header from "./Header";
import Footer from "./Footer";

export default function ResourcePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const granted = sessionStorage.getItem("resource_access") === "true";

  useEffect(() => {
    if (!granted) navigate("/", { replace: true });
  }, [granted, navigate]);

  if (!granted) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-body)" }}>
      <Header />
      <div className="flex-1" style={{ padding: "2rem 2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "2rem", textAlign: "center" }}>
          Resource Hub
        </h1>
        <ResourceHub initialId={id} />
      </div>
      <Footer />
    </div>
  );
}
