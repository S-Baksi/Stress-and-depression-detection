import React from "react";

const StatusCard = ({ title, value, color }) => {
  return (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      margin: "10px",
      width: "220px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      <h2 style={{ color: color }}>{value}</h2>
    </div>
  );
};

export default StatusCard;

