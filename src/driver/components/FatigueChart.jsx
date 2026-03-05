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
        className="flex items-center justify-center"
        style={{
          height: "280px",
          color: 'var(--text-muted)'
        }}
      >
        <p className="text-sm">Waiting for fatigue data...</p>
      </div>
    );
  }

  const data = history.map((value, index) => ({
    time: index + 1,
    score: value
  }));

  return (
    <div style={{ width: "100%", height: "280px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-200)" />

          <XAxis
            dataKey="time"
            tick={{ fill: "var(--slate-400)", fontSize: 11 }}
            label={{ value: "Time Points", position: "insideBottom", offset: -5, style: { fill: "var(--text-muted)", fontSize: 11 } }}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fill: "var(--slate-400)", fontSize: 11 }}
            label={{ value: "Score", angle: -90, position: "insideLeft", style: { fill: "var(--text-muted)", fontSize: 11 } }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid var(--border-default)",
              borderRadius: "8px",
              padding: "8px 12px",
              boxShadow: "var(--shadow-md)"
            }}
            labelStyle={{ color: "var(--text-heading)", fontWeight: 600, fontSize: 12 }}
            itemStyle={{ color: "var(--text-body)", fontSize: 11 }}
          />

          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--indigo-600)"
            strokeWidth={2.5}
            dot={{ fill: "var(--indigo-600)", r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FatigueChart;

