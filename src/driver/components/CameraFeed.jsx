import React, { useRef, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import "../styles.css";

const CameraFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const alarmRef = useRef(null);
  const alertCooldownRef = useRef(0);

  const [status, setStatus] = useState("NORMAL");
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("fatigueHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("fatigueEvents");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    let isMounted = true;
    const videoElement = videoRef.current;

    /* ==========================
       PREPARE ALARM
    ========================== */
    alarmRef.current = new Audio("/alarm.wav");
    alarmRef.current.preload = "auto";
    alarmRef.current.volume = 1.0;

    // Unlock audio on first click
    const unlockAudio = () => {
      alarmRef.current
        .play()
        .then(() => {
          alarmRef.current.pause();
          alarmRef.current.currentTime = 0;
        })
        .catch(() => {});
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    /* ==========================
       START CAMERA
    ========================== */
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" }
        });

        if (videoElement) {
          videoElement.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    /* ==========================
       CONNECT WEBSOCKET
    ========================== */
    const socket = new WebSocket("ws://localhost:8000/ws");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Connected");

      intervalRef.current = setInterval(() => {
        if (
          videoRef.current &&
          canvasRef.current &&
          socket.readyState === WebSocket.OPEN
        ) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          canvas.width = 640;
          canvas.height = 480;

          ctx.drawImage(videoRef.current, 0, 0, 640, 480);
          const frame = canvas.toDataURL("image/jpeg", 0.6);
          socket.send(frame);
        }
      }, 150);
    };

    socket.onmessage = (event) => {
      if (!isMounted) return;

      const data = JSON.parse(event.data);

      const newScore = data.fatigue_score || 0;
      const newStatus = data.status || "NORMAL";

      setStatus(newStatus);
      setScore(newScore);

      // Save score history
      setHistory((prev) => {
        const updated = [...prev, newScore].slice(-50);
        localStorage.setItem("fatigueHistory", JSON.stringify(updated));
        return updated;
      });

      /* ==========================
         DROWSY DETECTION LOGIC
      ========================== */
      if (newStatus === "DROWSY") {
        const now = Date.now();

        // Cooldown 8 seconds
        if (now - alertCooldownRef.current > 8000) {
          alertCooldownRef.current = now;

          // Play alarm
          if (alarmRef.current) {
            alarmRef.current.currentTime = 0;
            alarmRef.current.play().catch(() => {});
          }

          // Save detection event
          const newEvent = {
            time: new Date().toLocaleTimeString(),
            message: "Drowsy Detected"
          };

          setEvents((prev) => {
            const updatedEvents = [newEvent, ...prev].slice(0, 50);
            localStorage.setItem(
              "fatigueEvents",
              JSON.stringify(updatedEvents)
            );
            return updatedEvents;
          });
        }
      }
    };

    socket.onerror = (err) => {
      console.warn("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket Closed");
    };

    /* ==========================
       CLEANUP
    ========================== */
    return () => {
      isMounted = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (socketRef.current) {
        if (
          socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING
        ) {
          socketRef.current.close();
        }
      }

      if (videoElement && videoElement.srcObject) {
        videoElement.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h2>Driver Fatigue Monitoring</h2>

        <button
          className="analytics-btn"
          onClick={() => (window.location.href = "/driver-analytics")}
        >
          View Analytics →
        </button>
      </header>

      <div className="layout-grid">
        <div className="camera-card">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-feed"
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <Dashboard
          status={status}
          score={score}
          history={history}
          events={events}
        />
      </div>
    </div>
  );
};

export default CameraFeed;

