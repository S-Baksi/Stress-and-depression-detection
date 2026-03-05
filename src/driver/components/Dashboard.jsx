import React from "react";
import PropTypes from "prop-types";
import FatigueGauge from "./FatigueGauge";
import FatigueChart from "./FatigueChart";
import SessionTimer from "./SessionTimer";
import StatusCard from "./StatusCard";

const Dashboard = ({ status, score, history }) => {
  return (
    <div className="space-y-4">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <FatigueGauge score={score} />
        </div>

        <div className="card p-4">
          <StatusCard status={status} />
        </div>

        <div className="card p-4">
          <SessionTimer />
        </div>
      </div>

      {/* Live Trend Chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
          Live Fatigue Trend
        </h3>
        <FatigueChart history={history} />
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  status: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  history: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string,
      score: PropTypes.number
    })
  ).isRequired
};

export default Dashboard;

