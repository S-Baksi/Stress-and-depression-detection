import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const SessionTimer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
        Session Time
      </h3>
      <div className="flex items-center gap-2">
        <Clock size={20} style={{ color: 'var(--indigo-600)' }} />
        <p className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
          {formatTime()}
        </p>
      </div>
      <p className="text-xs mt-2" style={{ color: 'var(--text-body)' }}>Active monitoring</p>
    </div>
  );
};

export default SessionTimer;

