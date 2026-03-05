import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import CameraFeed from "./components/CameraFeed";
import { Eye } from "lucide-react";

const Monitoring = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Header />
      
      <div className="flex-1">
        <section className="px-8 md:px-12 py-8">
          {/* Page title */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: 'var(--indigo-50)' }}>
              <Eye size={20} style={{ color: 'var(--indigo-600)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
                Driver Fatigue Monitoring
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                Real-time drowsiness detection using computer vision
              </p>
            </div>
          </div>

          {/* Main monitoring area */}
          <CameraFeed />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Monitoring;

