import { useState } from "react";
import { Activity, CheckCircle, AlertTriangle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";

const STRESS_API_URL = "http://localhost:9095/PredictStress";

function StressPrediction() {
  const [age, setAge] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [alcoholIntake, setAlcoholIntake] = useState("no");
  const [caffeineIntake, setCaffeineIntake] = useState("no");
  const [travelTime, setTravelTime] = useState("");
  const [workHours, setWorkHours] = useState("");

  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);

  const validateForm = () => {
    if (
      !age ||
      !bloodSugar ||
      !bloodPressure ||
      !cholesterol ||
      !bedTime ||
      !wakeTime ||
      !travelTime ||
      !workHours
    ) {
      toast.error("Please fill in all fields before predicting.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsPredicting(true);
    setResult(null);

    try {
      const payload = {
        Age: Number(age),
        Blood_Sugar_Level: Number(bloodSugar),
        Blood_Pressure: Number(bloodPressure),
        Cholesterol_Level: Number(cholesterol),
        Bed_Time: bedTime,
        Wake_Up_Time: wakeTime,
        Alcohol_Intake: alcoholIntake === "yes" ? 1 : 0,
        Caffeine_Intake: caffeineIntake === "yes" ? 1 : 0,
        Travel_Time: Number(travelTime),
        Work_Hours: Number(workHours),
      };

      const response = await fetch(STRESS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      const responseBody = data.Response || data.response || data;

      if (!responseBody || typeof responseBody.prediction === "undefined") {
        throw new Error("Unexpected response format from stress API.");
      }

      setResult({
        prediction: responseBody.prediction,
        probability: responseBody.probability ?? 0,
        concerningFactors: responseBody.concerning_factors || [],
        protectiveFactors: responseBody.protective_factors || [],
      });

      toast.success("Stress prediction completed.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Stress prediction error:", err);
      toast.error(
        err.message ||
          "Failed to predict stress. Please ensure the stress API is running on port 9095."
      );
    } finally {
      setIsPredicting(false);
    }
  };

  const getPredictionColor = (prediction) => {
    if (!prediction) return "var(--text-heading)";
    if (prediction.toLowerCase() === "stress") return "#f43f5e";
    return "#10b981";
  };

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ backgroundColor: "var(--bg-body)" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "var(--text-heading)",
            border: "1px solid var(--border-default)",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: 500,
            boxShadow: "var(--shadow-md)",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#f43f5e", secondary: "#fff" } },
          loading: { iconTheme: { primary: "#6366f1", secondary: "#fff" } },
        }}
      />

      <Header />

      <div className="flex-1">
        <section className="px-8 md:px-12 py-8">
          <div className="mb-5">
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--text-heading)" }}
            >
              Stress Risk Prediction
            </h1>
            <p className="text-sm" style={{ color: "var(--text-body)" }}>
              Enter your daily health and lifestyle details. The model will
              estimate whether your current pattern indicates{" "}
              <strong>normal</strong> or <strong>stress</strong> state.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card p-5">
              <h2
                className="text-base font-semibold mb-3"
                style={{ color: "var(--text-heading)" }}
              >
                Input Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Age (years)
                    </label>
                    <input
                      id="age"
                      type="number"
                      min="1"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="blood-sugar"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Blood Sugar (mg/dL)
                    </label>
                    <input
                      id="blood-sugar"
                      type="number"
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="blood-pressure"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Blood Pressure (systolic)
                    </label>
                    <input
                      id="blood-pressure"
                      type="number"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cholesterol"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Cholesterol (mg/dL)
                    </label>
                    <input
                      id="cholesterol"
                      type="number"
                      value={cholesterol}
                      onChange={(e) => setCholesterol(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bed-time"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Bed Time (24-hr)
                    </label>
                    <input
                      id="bed-time"
                      type="time"
                      value={bedTime}
                      onChange={(e) => setBedTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="wake-time"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Wake Up Time (24-hr)
                    </label>
                    <input
                      id="wake-time"
                      type="time"
                      value={wakeTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="alcohol-intake"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Alcohol Intake
                    </label>
                    <select
                      id="alcohol-intake"
                      value={alcoholIntake}
                      onChange={(e) => setAlcoholIntake(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="caffeine-intake"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Caffeine Intake
                    </label>
                    <select
                      id="caffeine-intake"
                      value={caffeineIntake}
                      onChange={(e) => setCaffeineIntake(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="travel-time"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Daily Travel Time (hours)
                    </label>
                    <input
                      id="travel-time"
                      type="number"
                      step="0.1"
                      value={travelTime}
                      onChange={(e) => setTravelTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="work-hours"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-body)" }}
                    >
                      Work Hours per Day
                    </label>
                    <input
                      id="work-hours"
                      type="number"
                      step="0.1"
                      value={workHours}
                      onChange={(e) => setWorkHours(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "var(--slate-300)",
                        backgroundColor: "var(--bg-muted)",
                        color: "var(--text-heading)",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPredicting}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none mt-1"
                >
                  {isPredicting ? (
                    <>
                      <Activity className="animate-spin" size={16} />
                      Predicting…
                    </>
                  ) : (
                    <>
                      <Activity size={16} />
                      Predict Stress
                    </>
                  )}
                </button>

                <p
                  className="text-[11px] mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Yes/No answers are internally converted to numeric values
                  (Yes = 1, No = 0) to match the model&apos;s boolean feature
                  encoding.
                </p>
              </form>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div
                className="card p-7 w-full max-w-sm"
                style={{ 
                  textAlign: "left",
                  background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-muted) 100%)",
                  border: "2px solid var(--border-default)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ 
                      backgroundColor: "var(--accent-hover)",
                      color: "var(--accent)"
                    }}
                  >
                    <Activity size={20} />
                  </div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "var(--text-heading)" }}
                  >
                    How It Works
                  </h3>
                </div>
                
                <p
                  className="text-sm mb-4 leading-relaxed"
                  style={{ color: "var(--text-body)" }}
                >
                  Powered by <strong>XGBoost ML</strong>, this tool analyzes your health and lifestyle data to predict stress risk in real-time.
                </p>

                <div 
                  className="rounded-lg p-4 mb-4"
                  style={{ 
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <h4 
                    className="text-xs font-semibold mb-3 uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Data Processing
                  </h4>
                  <ul className="space-y-2.5" style={{ color: "var(--text-body)" }}>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} style={{ color: "#10b981", marginTop: "2px", flexShrink: 0 }} />
                      <span>Health metrics sent as numerical values</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} style={{ color: "#10b981", marginTop: "2px", flexShrink: 0 }} />
                      <span>Sleep times converted to minutes from midnight</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} style={{ color: "#10b981", marginTop: "2px", flexShrink: 0 }} />
                      <span>Lifestyle choices encoded as binary (1/0)</span>
                    </li>
                  </ul>
                </div>

                <div 
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ 
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <AlertTriangle size={14} style={{ color: "#6366f1", flexShrink: 0 }} />
                  <p className="text-xs" style={{ color: "var(--text-body)" }}>
                    Predictions update only when you submit new data
                  </p>
                </div>
              </div>
            </div>
          </div>

          {result && (
            <div className="space-y-4">
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} style={{ color: "#10b981" }} />
                  <h2
                    className="text-base font-semibold"
                    style={{ color: "var(--text-heading)" }}
                  >
                    Prediction Result
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-3 items-center">
                  <div
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <p
                      className="text-[11px] font-medium mb-1 uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Status
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: getPredictionColor(result.prediction) }}
                    >
                      {result.prediction}
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <p
                      className="text-[11px] font-medium mb-1 uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Confidence
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--indigo-600)" }}
                    >
                      {((result.probability || 0) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="hidden md:flex justify-center">
                    <AlertTriangle
                      size={40}
                      style={{ color: "var(--amber-500)" }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="card p-4">
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-heading)" }}
                  >
                    Concerning Factors
                  </h3>
                  {result.concerningFactors && result.concerningFactors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.concerningFactors.map((factor) => (
                        <span
                          key={factor}
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: "rgba(248, 113, 113, 0.12)",
                            color: "#b91c1c",
                          }}
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No major risk-increasing factors identified.
                    </p>
                  )}
                </div>

                <div className="card p-4">
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text-heading)" }}
                  >
                    Protective Factors
                  </h3>
                  {result.protectiveFactors && result.protectiveFactors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.protectiveFactors.map((factor) => (
                        <span
                          key={factor}
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: "rgba(52, 211, 153, 0.12)",
                            color: "#047857",
                          }}
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No strong protective factors identified.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default StressPrediction;

