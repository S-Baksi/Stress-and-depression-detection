import React, { useEffect, useState } from "react";
import Header from "../Header";
import "./styles.css";
import FatigueChart from "./components/FatigueChart";
import EventLog from "./components/EventLog";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [events, setEvents] = useState([]);

  /* ===============================
     LOAD DATA FROM LOCAL STORAGE
  =============================== */
  useEffect(() => {
    try {
      const storedHistory =
        JSON.parse(localStorage.getItem("fatigueHistory")) || [];

      const storedEvents =
        JSON.parse(localStorage.getItem("fatigueEvents")) || [];

      setHistory(storedHistory);
      setEvents(storedEvents);
    } catch (err) {
      console.error("Storage read error:", err);
    }
  }, []);

  /* ===============================
     CALCULATED METRICS
  =============================== */
  const averageScore =
    history.length > 0
      ? (
          history.reduce((a, b) => a + b, 0) / history.length
        ).toFixed(1)
      : 0;

  const maxScore =
    history.length > 0 ? Math.max(...history) : 0;

  const drowsyCount = events.length;

  /* ===============================
     CLEAR DATA FUNCTION
  =============================== */
  const clearAnalytics = () => {
    localStorage.removeItem("fatigueHistory");
    localStorage.removeItem("fatigueEvents");
    setHistory([]);
    setEvents([]);
  };

  return (
    <div className="driver-app">
      <Header />
      <div className="analytics-container">
        {/* HEADER */}
        <div className="analytics-header">
          <h2>Fatigue Analytics</h2>

          <div className="analytics-actions">
            <button
              className="secondary-btn"
              onClick={() => navigate("/driver-monitoring")}
            >
              ← Back to Monitoring
            </button>

            <button
              className="danger-btn"
              onClick={clearAnalytics}
            >
              Clear Data
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="analytics-summary">
          <div className="summary-card">
            <h4>Average Score</h4>
            <p>{averageScore}</p>
          </div>

          <div className="summary-card">
            <h4>Highest Score</h4>
            <p>{maxScore}</p>
          </div>

          <div className="summary-card">
            <h4>Drowsy Events</h4>
            <p>{drowsyCount}</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="analytics-grid">
          <div className="analytics-card large-card">
            <h3>Fatigue Trend</h3>

            {history.length === 0 ? (
              <div className="empty-state">
                No fatigue data recorded yet.
              </div>
            ) : (
              <FatigueChart history={history} />
            )}
          </div>

          <div className="analytics-card">
            <h3>Detection Log</h3>

            {events.length === 0 ? (
              <div className="empty-state">
                No detection events recorded.
              </div>
            ) : (
              <EventLog events={events} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

