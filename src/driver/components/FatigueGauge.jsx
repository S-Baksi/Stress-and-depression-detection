import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const FatigueGauge = ({ score }) => {
  const getColor = () => {
    if (score < 30) return "#22c55e";
    if (score < 60) return "#facc15";
    return "#ef4444";
  };

  return (
    <div style={{ width: 200, margin: "0 auto" }}>
      <CircularProgressbar
        value={score}
        text={`${Math.round(score)}`}
        styles={buildStyles({
          pathColor: getColor(),
          textColor: "#ffffff",
          trailColor: "#1e293b",
        })}
      />
      <h3 style={{ textAlign: "center", marginTop: 10 }}>Fatigue Score</h3>
    </div>
  );
};

export default FatigueGauge;

