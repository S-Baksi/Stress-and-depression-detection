import React from "react";

const EventLog = ({ events = [] }) => {
  if (!events.length) {
    return <p>No detection events recorded.</p>;
  }

  return (
    <ul className="event-list">
      {events.map((event, index) => (
        <li key={index}>
          <strong>{event.time}</strong> — {event.message}
        </li>
      ))}
    </ul>
  );
};

export default EventLog;

