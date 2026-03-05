import React from "react";
import FatigueGauge from "./FatigueGauge";
import FatigueChart from "./FatigueChart";
import SessionTimer from "./SessionTimer";

const Dashboard = ({ status, score, history }) => {
  return (
    <div className="metrics-card">
      <div className="top-metrics">
        <div className="metric-box">
          <FatigueGauge score={score} />
        </div>

        <div className="metric-box">
          <h3>Status</h3>
          <div className={`status-text ${status}`}>
            {status}
          </div>
        </div>

        <div className="metric-box">
          <h3>Session</h3>
          <SessionTimer />
        </div>
      </div>

      <div className="chart-box">
        <h3>Live Fatigue Trend</h3>
        <FatigueChart history={history} />
      </div>
    </div>
  );
};

export default Dashboard;

