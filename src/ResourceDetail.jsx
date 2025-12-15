import { useParams, useNavigate, Link } from "react-router-dom";
import { getResourceById, getResourcesByCategory } from "./resourcesData";
import {
  ArrowLeft,
  BookOpen,
  Video,
  Headphones,
  FileText,
} from "lucide-react";

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const resource = getResourceById(id);

  if (!resource) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-3">
            Resource Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The resource you’re looking for doesn’t exist or may have been
            removed.
          </p>
          <button
            onClick={() => navigate("/resources")}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  const relatedResources = getResourcesByCategory(resource.category).filter(
    (r) => r.id !== resource.id
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Video size={18} className="text-red-500" />;
      case "audio":
        return <Headphones size={18} className="text-blue-500" />;
      case "article":
        return <FileText size={18} className="text-green-600" />;
      case "essay":
        return <BookOpen size={18} className="text-indigo-600" />;
      default:
        return <FileText size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back / Breadcrumb */}
        <div className="mb-8 flex items-center gap-3 text-sm text-gray-500">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg p-2 hover:bg-gray-200 transition"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <span>
            Resources /{" "}
            <span className="text-gray-800 capitalize">
              {resource.category}
            </span>
          </span>
        </div>

        {/* Header */}
        <section className="mb-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 capitalize">
              {getTypeIcon(resource.type)}
              {resource.type}
            </span>

            <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-600 capitalize">
              {resource.category}
            </span>
          </div>

          <h1 className="text-3xl font-semibold leading-tight mb-5">
            {resource.title}
          </h1>

          <div className="flex flex-wrap gap-10 text-sm text-gray-600">
            <div>
              <span className="block text-xs uppercase tracking-wide mb-1">
                Author
              </span>
              <span className="font-medium text-gray-800">
                {resource.author}
              </span>
            </div>

            <div>
              <span className="block text-xs uppercase tracking-wide mb-1">
                Duration
              </span>
              <span className="font-medium text-gray-800">
                {resource.duration}
              </span>
            </div>
          </div>
        </section>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          {/* Main Content */}
          <article className="space-y-10">
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
              {resource.description}
            </p>

            <div className="rounded-xl bg-white border border-gray-200 px-6 py-6 leading-relaxed whitespace-pre-wrap shadow-sm">
              {resource.content}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition">
                {resource.type === "video"
                  ? "Watch Video"
                  : resource.type === "audio"
                  ? "Listen Now"
                  : "Read Full Content"}
              </button>

              <button className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                Save for Later
              </button>
            </div>
          </article>

          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <aside className="space-y-6">
              <h3 className="text-lg font-semibold">
                Related Resources
              </h3>

              <div className="space-y-4">
                {relatedResources.map((item) => (
                  <Link
                    key={item.id}
                    to={`/resources/${item.id}`}
                    className="block group"
                  >
                    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm hover:border-blue-500 transition">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-md bg-gray-100 p-2">
                          {getTypeIcon(item.type)}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">
                          {item.type}
                        </span>
                      </div>

                      <h4 className="font-medium leading-snug group-hover:text-blue-600 transition mb-1">
                        {item.title}
                      </h4>

                      <p className="text-xs text-gray-600 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
