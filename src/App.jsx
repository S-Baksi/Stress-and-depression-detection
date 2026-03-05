import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AnalysisPage from "./AnalysisPage";
import Monitoring from "./driver/Monitoring";
import DriverAnalytics from "./driver/Analytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/driver-monitoring" element={<Monitoring />} />
      <Route path="/driver-analytics" element={<DriverAnalytics />} />
    </Routes>
  );
}

export default App;
