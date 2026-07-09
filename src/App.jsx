import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AnalysisPage from "./AnalysisPage";
import Monitoring from "./driver/Monitoring";
import DriverAnalytics from "./driver/Analytics";
import StressPrediction from "./StressPrediction";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
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
    </Routes>
  );
}

export default App;
