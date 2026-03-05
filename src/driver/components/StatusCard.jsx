import React from "react";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";

const StatusCard = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "NORMAL":
        return {
          icon: <CheckCircle size={24} />,
          color: "var(--emerald-500)",
          bg: "rgba(16, 185, 129, 0.1)",
          text: "Normal",
          description: "All systems nominal"
        };
      case "TIRED":
        return {
          icon: <Activity size={24} />,
          color: "var(--amber-500)",
          bg: "rgba(245, 158, 11, 0.1)",
          text: "Tired",
          description: "Fatigue detected"
        };
      case "DROWSY":
        return {
          icon: <AlertTriangle size={24} />,
          color: "var(--rose-500)",
          bg: "rgba(244, 63, 94, 0.1)",
          text: "Drowsy",
          description: "Alert! Take a break"
        };
      case "NO_FACE":
        return {
          icon: <AlertTriangle size={24} />,
          color: "var(--slate-400)",
          bg: "rgba(148, 163, 184, 0.1)",
          text: "No Face",
          description: "Face not detected"
        };
      default:
        return {
          icon: <Activity size={24} />,
          color: "var(--slate-400)",
          bg: "rgba(148, 163, 184, 0.1)",
          text: "Unknown",
          description: "Initializing..."
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
        Driver Status
      </h3>
      <div 
        className="flex items-center justify-center w-16 h-16 rounded-full mb-2"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.icon}
      </div>
      <p className="text-xl font-bold" style={{ color: config.color }}>
        {config.text}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-body)' }}>
        {config.description}
      </p>
    </div>
  );
};

export default StatusCard;

