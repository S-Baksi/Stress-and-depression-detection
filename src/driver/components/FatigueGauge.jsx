import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const FatigueGauge = ({ score }) => {
  const getColor = () => {
    if (score < 30) return "#10b981"; // emerald-500
    if (score < 60) return "#f59e0b"; // amber-500
    return "#f43f5e"; // rose-500
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
        Fatigue Score
      </h3>
      <div style={{ width: 120, height: 120 }}>
        <CircularProgressbar
          value={score}
          text={`${Math.round(score)}`}
          styles={buildStyles({
            pathColor: getColor(),
            textColor: getComputedStyle(document.documentElement).getPropertyValue('--text-heading'),
            trailColor: getComputedStyle(document.documentElement).getPropertyValue('--slate-200'),
            textSize: '24px',
          })}
        />
      </div>
      <p className="text-xs mt-2" style={{ color: 'var(--text-body)' }}>Out of 100</p>
    </div>
  );
};

export default FatigueGauge;

