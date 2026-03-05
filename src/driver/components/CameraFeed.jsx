import React, { useRef, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { Link } from "react-router-dom";
import { Video, VideoOff, BarChart3 } from "lucide-react";

const WEBSOCKET_URL = "ws://localhost:8000/ws";

const CameraFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const alarmRef = useRef(null);
  const audioContextRef = useRef(null);
  const alertCooldownRef = useRef(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const [status, setStatus] = useState("NORMAL");
  const [score, setScore] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
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
       PREPARE ALARM - Using Web Audio API for reliability
    ========================== */
    const initAudio = () => {
      try {
        // Create Audio Context
        audioContextRef.current = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
        
        // Try to create a simple audio element as fallback
        alarmRef.current = new Audio();
        alarmRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGM0fPTgjMGHm7A7+OZRQ0PVKrk6q5WFAhCmN7yu2EbBi6Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNUEwxEmN7zumEcBi+Gxu/ajywGKHe/7+WXPwsQVqzm7LNU=";
        alarmRef.current.preload = "auto";
        alarmRef.current.volume = 1;
        
        setAudioEnabled(true);
      } catch (err) {
        console.error("Audio initialization failed:", err);
      }
    };

    // Initialize audio on first user interaction
    const enableAudio = () => {
      if (!audioEnabled) {
        initAudio();
        // Try to resume AudioContext
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
        document.removeEventListener("click", enableAudio);
        document.removeEventListener("touchstart", enableAudio);
      }
    };

    document.addEventListener("click", enableAudio);
    document.addEventListener("touchstart", enableAudio);

    // Play alarm using Web Audio API - extracted to reduce nesting
    const playAlarmSound = () => {
      try {
        // Method 1: Use Web Audio API beep
        if (audioContextRef.current?.state !== 'closed') {
          const ctx = audioContextRef.current;
          
          // Create oscillator for beep sound
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          // Configure sound (urgent beep)
          oscillator.frequency.value = 800; // Hz
          oscillator.type = 'sine';
          
          // Volume envelope
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.5);
          
          // Play second beep
          setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.value = 1000;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0, ctx.currentTime);
            gain2.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc2.start(ctx.currentTime);
            osc2.stop(ctx.currentTime + 0.5);
          }, 200);
        }
        
        // Method 2: Fallback to Audio element
        if (alarmRef.current) {
          alarmRef.current.currentTime = 0;
          alarmRef.current.play().catch((err) => {
            console.warn("Audio playback failed:", err);
          });
        }
      } catch (err) {
        console.error("Alarm playback error:", err);
      }
    };

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
          setCameraActive(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setCameraActive(false);
      }
    };

    startCamera();

    /* ==========================
       CONNECT WEBSOCKET
    ========================== */
    const socket = new WebSocket(WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);

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
        const updated = [
          ...prev,
          { time: new Date().toLocaleTimeString(), score: newScore }
        ].slice(-50);

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
          playAlarmSound();

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
      setIsConnected(false);
    };

    socket.onclose = () => {
      console.log("WebSocket Closed");
      setIsConnected(false);
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

      if (videoElement?.srcObject) {
        videoElement.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
      
      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      
      // Remove event listeners
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };
  }, [audioEnabled]);

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {cameraActive ? (
              <Video size={18} style={{ color: 'var(--emerald-500)' }} />
            ) : (
              <VideoOff size={18} style={{ color: 'var(--rose-500)' }} />
            )}
            <span className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>
              Camera: {cameraActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="w-px h-5" style={{ backgroundColor: 'var(--border-default)' }} />

          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: isConnected ? 'var(--emerald-500)' : 'var(--rose-500)',
                boxShadow: isConnected ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none'
              }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>
              Server: {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="w-px h-5" style={{ backgroundColor: 'var(--border-default)' }} />

          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: audioEnabled ? 'var(--emerald-500)' : 'var(--amber-500)',
                boxShadow: audioEnabled ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none'
              }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>
              Audio: {audioEnabled ? "Ready" : "Click to enable"}
            </span>
          </div>
        </div>

        <Link 
          to="/driver-analytics" 
          className="btn-secondary inline-flex items-center gap-2"
        >
          <BarChart3 size={16} />
          View Analytics
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Camera Feed Card */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>
            Live Camera Feed
          </h3>
          <div 
            className="relative rounded-lg overflow-hidden"
            style={{ 
              backgroundColor: 'var(--slate-900)',
              aspectRatio: '4 / 3'
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--slate-900)' }}>
                <VideoOff size={48} style={{ color: 'var(--slate-400)', marginBottom: '12px' }} />
                <p className="text-sm" style={{ color: 'var(--slate-400)' }}>Camera not available</p>
                <p className="text-xs mt-1" style={{ color: 'var(--slate-500)' }}>Please allow camera access</p>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {/* Dashboard */}
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

