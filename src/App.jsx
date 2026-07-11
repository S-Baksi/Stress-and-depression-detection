import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import AnalysisPage from "./AnalysisPage";
import Monitoring from "./driver/Monitoring";
import DriverAnalytics from "./driver/Analytics";
import StressPrediction from "./StressPrediction";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import EmployeeChatbot from "./EmployeeChatbot";
import { useLocation } from "react-router-dom";

function ChatbotWidget() {
  const location = useLocation();
  if (location.pathname === "/login") return null;
  return <EmployeeChatbot />;
}

function App() {
  return (
    <>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <AnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stress-prediction"
        element={
          <ProtectedRoute>
            <StressPrediction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver-monitoring"
        element={
          <ProtectedRoute>
            <Monitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver-analytics"
        element={
          <ProtectedRoute>
            <DriverAnalytics />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      <ChatbotWidget />
    </>
  );
}

export default App;
