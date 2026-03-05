import React from "react";
import Header from "../Header";
import "./styles.css";
import CameraFeed from "./components/CameraFeed";

const Monitoring = () => {
  return (
    <div className="driver-app">
      <Header />
      <div className="monitoring-page">
        <header className="top-bar">
          <h2>Driver Fatigue Monitoring</h2>
        </header>

        <div className="monitoring-container">
          <CameraFeed />
        </div>
      </div>
    </div>
  );
};

export default Monitoring;

