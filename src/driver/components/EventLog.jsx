import React from "react";
import { AlertTriangle } from "lucide-react";

const EventLog = ({ events = [] }) => {
  if (!events.length) {
    return (
      <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
        No detection events recorded
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {events.map((event, index) => (
        <div
          key={`event-${event.time}-${index}`}
          className="flex items-start gap-3 p-3 rounded-lg"
          style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}
        >
          <div className="mt-0.5">
            <AlertTriangle size={16} style={{ color: 'var(--rose-500)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>
              {event.message}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {event.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventLog;

