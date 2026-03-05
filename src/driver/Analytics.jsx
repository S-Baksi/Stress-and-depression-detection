import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import FatigueChart from "./components/FatigueChart";
import EventLog from "./components/EventLog";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

const Analytics = () => {
  const navigate = useNavigate();

  // Initialize state with lazy initialization from localStorage
  const [history, setHistory] = useState(() => {
    try {
      const storedHistory = localStorage.getItem("fatigueHistory");
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (err) {
      console.error("Storage read error:", err);
      return [];
    }
  });

  const [events, setEvents] = useState(() => {
    try {
      const storedEvents = localStorage.getItem("fatigueEvents");
      return storedEvents ? JSON.parse(storedEvents) : [];
    } catch (err) {
      console.error("Storage read error:", err);
      return [];
    }
  });

  /* ===============================
     CALCULATED METRICS
  =============================== */
  const averageScore =
    history.length > 0
      ? (
          history.reduce((sum, item) => sum + (typeof item === 'number' ? item : item.score), 0) / history.length
        ).toFixed(1)
      : 0;

  const maxScore =
    history.length > 0 
      ? Math.max(...history.map(item => typeof item === 'number' ? item : item.score)).toFixed(1)
      : 0;

  const drowsyCount = events.length;

  /* ===============================
     CLEAR DATA FUNCTION
  =============================== */
  const clearAnalytics = () => {
    if (globalThis.confirm('Are you sure you want to clear all analytics data?')) {
      localStorage.removeItem("fatigueHistory");
      localStorage.removeItem("fatigueEvents");
      setHistory([]);
      setEvents([]);
      toast.success('Analytics data cleared successfully');
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: 'var(--text-heading)',
            border: '1px solid var(--border-default)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: 'var(--shadow-md)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
        }}
      />

      <Header />
      
      <div className="flex-1">
        <section className="px-8 md:px-12 py-8">
          {/* Header with actions */}
          <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: 'var(--indigo-50)' }}>
                <BarChart3 size={20} style={{ color: 'var(--indigo-600)' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
                  Fatigue Analytics
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  View historical fatigue detection data and trends
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate("/driver-monitoring")}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Monitoring
              </button>

              <button
                onClick={clearAnalytics}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all"
                style={{ 
                  color: 'var(--rose-500)', 
                  border: '1.5px solid var(--rose-500)',
                  backgroundColor: 'transparent'
                }}
              >
                <Trash2 size={16} />
                Clear Data
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--indigo-50)' }}>
                  <TrendingUp size={16} style={{ color: 'var(--indigo-600)' }} />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Average Score
                </h3>
              </div>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
                {averageScore}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-body)' }}>
                Mean fatigue score
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--amber-500)', opacity: 0.1 }}>
                  <AlertTriangle size={16} style={{ color: 'var(--amber-500)' }} />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Highest Score
                </h3>
              </div>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
                {maxScore}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-body)' }}>
                Peak fatigue detected
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)' }}>
                  <AlertTriangle size={16} style={{ color: 'var(--rose-500)' }} />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Drowsy Events
                </h3>
              </div>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
                {drowsyCount}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-body)' }}>
                Critical alerts triggered
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Fatigue Trend Chart */}
            <div className="card p-5">
              <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
                Fatigue Trend Over Time
              </h3>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--text-muted)' }}>
                  <BarChart3 size={48} className="mb-3" style={{ opacity: 0.3 }} />
                  <p className="text-sm">No fatigue data recorded yet</p>
                  <p className="text-xs mt-1">Start monitoring to see trends</p>
                </div>
              ) : (
                <FatigueChart history={history} />
              )}
            </div>

            {/* Event Log */}
            <div className="card p-5">
              <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
                Detection Event Log
              </h3>

              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--text-muted)' }}>
                  <AlertTriangle size={48} className="mb-3" style={{ opacity: 0.3 }} />
                  <p className="text-sm">No detection events recorded</p>
                  <p className="text-xs mt-1">Events will appear here when drowsiness is detected</p>
                </div>
              ) : (
                <EventLog events={events} />
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;

