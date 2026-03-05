import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const FatigueChart = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return (
      <div
        style={{
          height: "320px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.6
        }}
      >
        Waiting for fatigue data...
      </div>
    );
  }

  const data = history.map((value, index) => ({
    time: index + 1,
    score: value
  }));

  return (
    <div style={{ width: "100%", height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#2f3b52" strokeDasharray="3 3" />

          <XAxis
            dataKey="time"
            tick={{ fill: "#9aa4b2", fontSize: 12 }}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#9aa4b2", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1e2a3a",
              border: "none",
              borderRadius: "8px",
              color: "#fff"
            }}
          />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#FFD700"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FatigueChart;

