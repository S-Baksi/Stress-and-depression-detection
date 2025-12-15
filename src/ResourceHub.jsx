import React from "react";
import { Link } from "react-router-dom";
import { resources } from "./resourcesData";
import { BookOpen, Video, Headphones, FileText } from "lucide-react";
import Sidebar from "./Sidebar";

export default function ResourceHub({ sidebarOpen, onToggleSidebar }) {
  const getTypeIcon = (type) => {
    const base = "w-5 h-5";
    switch (type) {
      case "video":
        return <Video className={`${base} text-red-500`} />;
      case "audio":
        return <Headphones className={`${base} text-blue-500`} />;
      case "article":
        return <FileText className={`${base} text-green-600`} />;
      case "essay":
        return <BookOpen className={`${base} text-indigo-600`} />;
      default:
        return <FileText className={`${base} text-gray-500`} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F8FC] text-gray-800">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={onToggleSidebar} />

      {/* Main */}
      <main className="flex-1 px-6 lg:px-10 py-10">
        {/* Page Header */}
        <header className="mb-12 max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-tight">
            Resource Hub
          </h1>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Access curated mental health resources created to support stress
            management, anxiety relief, emotional balance, and overall
            well-being.
          </p>
        </header>

        {/* Resource Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Link
              key={resource.id}
              to={`/resources/${resource.id}`}
              className="group focus:outline-none"
            >
              <article className="h-full rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      {getTypeIcon(resource.type)}
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {resource.type}
                    </span>
                  </div>

                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600 capitalize">
                    {resource.category}
                  </span>
                </div>

                {/* Content */}
                <div className="px-5 py-4 flex-1">
                  <h3 className="text-base font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {resource.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span>{resource.duration}</span>
                  <span className="text-blue-600 font-medium group-hover:underline">
                    View →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </section>

        {/* Overview */}
        <section className="mt-20 max-w-5xl">
          <h2 className="text-xl font-semibold mb-6">
            Resource Overview
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {["stress", "anxiety", "depression", "nervousness"].map(
              (category) => {
                const count = resources.filter(
                  (r) => r.category === category
                ).length;

                return (
                  <div
                    key={category}
                    className="rounded-xl bg-white border border-gray-200 px-6 py-5 text-center shadow-sm"
                  >
                    <div className="text-3xl font-semibold text-blue-600">
                      {count}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 capitalize">
                      {category} Resources
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
