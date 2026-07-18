import { useState } from "react";
import { Activity, CheckCircle, AlertTriangle, Lock, Info, ChevronRight, ChevronLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import employeeHealthData from "../src/json/employeeHealth.json";

const STRESS_API_URL = "http://localhost:5005/getstressprediction";

const FEATURE_LABELS = {
  "num__Age": "Age",
  "num__Blood_Sugar_Level": "Blood Sugar Level",
  "num__Cholesterol_Level": "Cholesterol Level",
  "num__Blood_Pressure": "Blood Pressure",
  "num__Caffeine_Intake": "Caffeine Intake",
  "num__Work_Hours": "Work Hours",
  "num__Travel_Time": "Travel Time",
  "num__Screen_Time": "Screen Time",
  "num__Sleep_Duration": "Sleep Duration",
  "num__Alcohol_Intake": "Alcohol Intake",
  "num__Physical_Activity": "Physical Activity",
  "num__Social_Interactions": "Social Interactions",
  "num__Sleep_Quality": "Sleep Quality",
};

function getFeatureLabel(raw) {
  if (FEATURE_LABELS[raw]) return FEATURE_LABELS[raw];
  // cat__Bed_Time_* → "Bed Time"
  if (raw.startsWith("cat__Bed_Time")) return "Bed Time";
  return raw.replace(/^(num__|cat__)/, "").replace(/_/g, " ");
}

const STRESS_LEVEL_MAP = {
  0: { label: "Low", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)" },
  1: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" },
  2: { label: "High", color: "#f43f5e", bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.25)" },
};

const FIELDS = {
  sleepDuration: { min: 3, max: 10, step: 0.5, unit: "hrs", label: "Sleep Duration (hours/day)", tip: "Total hours of sleep last night. Healthy adults need 7–9 hrs." },
  sleepQuality: { min: 1, max: 5, step: 1, unit: "/5", label: "Sleep Quality (Scale 1–5)", tip: "How restful was your sleep? 1 = very poor, 5 = excellent." },
  physicalActivity: { min: 0, max: 6, step: 0.5, unit: "hrs", label: "Physical Activity (hours/day)", tip: "Hours of exercise or movement today (0–6 hrs)." },
  screenTime: { min: 0, max: 8, step: 0.5, unit: "hrs", label: "Screen Time (hours/day)", tip: "Total hours on screens (phone, PC, TV) today (0–8 hrs)." },
  caffeineIntake: { min: 0, max: 5, step: 1, unit: "cups/day", label: "Caffeine Intake (cups/day)", tip: "Caffeinated drinks consumed today — coffee, tea, energy drinks (0–5)." },
  alcoholIntake: { min: 0, max: 3, step: 1, unit: "cups/day", label: "Alcohol Intake (cups/day)", tip: "Alcoholic drinks consumed today (0–3 units)." },
  workHours: { min: 4, max: 12, step: 0.5, unit: "hrs", label: "Work Hours (hours/day)", tip: "Total hours worked today including overtime (4–12 hrs)." },
  travelTime: { min: 0, max: 6, step: 0.5, unit: "hrs", label: "Travel Time (hours/day)", tip: "Total commute or travel time today (0–6 hrs)." },
  socialInteractions: { min: 0, max: 7, step: 1, unit: "hour", label: "Social Interactions (hour/day)", tip: "Meaningful social interactions today (0–7)." },
};

// Step 1 keys, Step 2 keys
const STEPS = [
  ["sleepDuration", "sleepQuality", "physicalActivity", "screenTime", "caffeineIntake"],
  ["alcoholIntake", "workHours", "travelTime", "socialInteractions"],
];

const STATIC_TIPS = {
  age: "Your age. Used to calibrate stress risk thresholds.",
  bloodPressure: "Systolic blood pressure (mmHg). Elevated BP >130 is linked to higher stress.",
  cholesterol: "Total cholesterol (mg/dL). Chronic stress can raise cholesterol.",
  bloodSugar: "Fasting blood sugar (mg/dL). Stress hormones can elevate blood sugar.",
};

function getEmployeeHealth(empId) {
  return employeeHealthData.find((e) => e.empId === empId) || employeeHealthData[0];
}

function Tooltip({ text }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: "0.25rem" }} className="group">
      <Info size={11} style={{ color: "var(--text-muted)", cursor: "help" }} />
      <span style={{
        position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
        background: "#1e293b", color: "#f1f5f9", fontSize: "0.68rem", lineHeight: 1.5,
        padding: "0.375rem 0.5rem", borderRadius: "6px", width: "180px", zIndex: 50,
        pointerEvents: "none", whiteSpace: "normal", boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }} className="hidden group-hover:block">
        {text}
        <span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", borderWidth: "4px", borderStyle: "solid", borderColor: "#1e293b transparent transparent transparent" }} />
      </span>
    </span>
  );
}

function SliderField({ fieldKey, value, onChange }) {
  const { min, max, step, unit, label, tip } = FIELDS[fieldKey];
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-body)", display: "flex", alignItems: "center" }}>
          {label}<Tooltip text={tip} />
        </span>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--indigo-600)", minWidth: "3rem", textAlign: "right" }}>
          {value}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%", height: "4px", borderRadius: "999px", cursor: "pointer", outline: "none",
          accentColor: "var(--indigo-600)",
          background: `linear-gradient(to right, var(--indigo-600) ${pct}%, var(--slate-200) ${pct}%)`,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

export default function StressPrediction() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const empHealth = getEmployeeHealth(user?.employeeId || "EMP001");

  const [step, setStep] = useState(0); // 0 = vitals review, 1 = lifestyle pt1, 2 = lifestyle pt2
  const [fields, setFields] = useState(
    Object.fromEntries(Object.entries(FIELDS).map(([k, v]) => [k, v.min]))
  );
  const [bedTime, setBedTime] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);   // PredictedClassCode
  const [apiData, setApiData] = useState(null);  // full response

  const setField = (key) => (val) => setFields((p) => ({ ...p, [key]: val }));

  const formatBedTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  const handleSubmit = async () => {
    if (!bedTime) { toast.error("Please set your bed time."); return; }
    setIsPredicting(true);
    setResult(null);

    const payload = {
      data: {
        Features: {
          Age: empHealth.age,
          Sleep_Duration: fields.sleepDuration,
          Sleep_Quality: fields.sleepQuality,
          Physical_Activity: fields.physicalActivity,
          Screen_Time: fields.screenTime,
          Caffeine_Intake: fields.caffeineIntake,
          Alcohol_Intake: fields.alcoholIntake,
          Work_Hours: fields.workHours,
          Travel_Time: fields.travelTime,
          Social_Interactions: fields.socialInteractions,
          Blood_Pressure: empHealth.bloodPressure,
          Cholesterol_Level: empHealth.cholesterol,
          Blood_Sugar_Level: empHealth.bloodSugar,
          Bed_Time: formatBedTime(bedTime),
        },
      },
    };

    try {
      const res = await fetch(STRESS_API_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Error ${res.status}`);
      const data = await res.json();
      if (data.PredictedClassCode === undefined) throw new Error("Unexpected response format.");
      setResult(data.PredictedClassCode);
      setApiData(data);
      setStep(3);
      toast.success("Prediction complete.");
    } catch (err) {
      toast.error(err.message || "Could not reach the stress API on port 5005.");
    } finally {
      setIsPredicting(false);
    }
  };

  const stressInfo = result !== null ? (STRESS_LEVEL_MAP[result] ?? STRESS_LEVEL_MAP[0]) : null;

  // ── Step indicators ──
  const STEP_LABELS = ["Your Profile", "Sleep & Activity", "Work & Social", "Result"];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-body)" }}>
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: { background: "#fff", color: "var(--text-heading)", border: "1px solid var(--border-default)", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", fontWeight: 500 },
        success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
        error: { iconTheme: { primary: "#f43f5e", secondary: "#fff" } },
      }} />

      <Header />

      <div className="flex-1 flex items-start justify-center" style={{ padding: "2.5rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>

          {/* Page title */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.25rem" }}>
              Stress Risk Prediction
            </h1>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              Takes about 30 seconds · 3 quick steps
            </p>
          </div>

          {/* Step progress bar */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1.75rem", gap: "0" }}>
            {STEP_LABELS.map((label, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                {/* connector line */}
                {i < STEP_LABELS.length - 1 && (
                  <div style={{
                    position: "absolute", top: "12px", left: "50%", width: "100%", height: "2px",
                    background: i < step ? "var(--indigo-600)" : "var(--slate-200)", zIndex: 0,
                  }} />
                )}
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700,
                  background: i < step ? "var(--indigo-600)" : i === step ? "var(--indigo-600)" : "var(--slate-200)",
                  color: i <= step ? "white" : "var(--text-muted)",
                  border: i === step ? "2px solid var(--indigo-400)" : "none",
                  boxShadow: i === step ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "0.62rem", color: i === step ? "var(--indigo-600)" : "var(--text-muted)", marginTop: "0.25rem", fontWeight: i === step ? 600 : 400, textAlign: "center" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ── STEP 0: Profile review ── */}
          {step === 0 && (
            <div className="card" style={{ padding: "1.5rem" }}>
              {/* Employee chip */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", padding: "0.75rem", borderRadius: "0.75rem", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--indigo-600)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                  {empHealth.empName.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>{empHealth.empName}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>{empHealth.empId}</p>
                </div>
              </div>

              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                These vitals are from your profile and will be used in the prediction.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                {[
                  { label: "Age", value: `${empHealth.age} yrs`, tip: STATIC_TIPS.age },
                  { label: "Blood Pressure", value: `${empHealth.bloodPressure} mmHg`, tip: STATIC_TIPS.bloodPressure },
                  { label: "Cholesterol", value: `${empHealth.cholesterol} mg/dL`, tip: STATIC_TIPS.cholesterol },
                  { label: "Blood Sugar", value: `${empHealth.bloodSugar} mg/dL`, tip: STATIC_TIPS.bloodSugar },
                ].map(({ label, value, tip }) => (
                  <div key={label} style={{ padding: "0.625rem 0.75rem", borderRadius: "0.625rem", background: "var(--bg-muted)", border: "1px solid var(--border-default)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", marginBottom: "0.2rem" }}>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
                      <Tooltip text={tip} />
                      <Lock size={9} style={{ color: "var(--text-muted)", marginLeft: "auto" }} />
                    </div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>

              <button onClick={() => setStep(1)} className="btn-primary" style={{ width: "100%", marginTop: "1.25rem", padding: "0.625rem" }}>
                Continue <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* ── STEP 1: Sleep & Activity ── */}
          {step === 1 && (
            <div className="card" style={{ padding: "1.5rem" }}>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                How did your sleep and activity look today?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {STEPS[0].map((key) => (
                  <SliderField key={key} fieldKey={key} value={fields[key]} onChange={setField(key)} />
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.5rem" }}>
                <button onClick={() => setStep(0)} className="btn-secondary" style={{ flex: 1, padding: "0.625rem", fontSize: "0.875rem" }}>
                  <ChevronLeft size={15} /> Back
                </button>
                <button onClick={() => setStep(2)} className="btn-primary" style={{ flex: 2, padding: "0.625rem", fontSize: "0.875rem" }}>
                  Next <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Work & Social + Bed Time ── */}
          {step === 2 && (
            <div className="card" style={{ padding: "1.5rem" }}>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                Almost done — just your work habits and bed time.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {STEPS[1].map((key) => (
                  <SliderField key={key} fieldKey={key} value={fields[key]} onChange={setField(key)} />
                ))}

                {/* Bed time */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.375rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-body)" }}>Bed Time</span>
                    <Tooltip text="The time you went to bed. Late bed times (after midnight) are linked to higher stress." />
                  </div>
                  <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.625rem", border: "1.5px solid var(--border-default)", background: "var(--bg-muted)", color: "var(--text-heading)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.5rem" }}>
                <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, padding: "0.625rem", fontSize: "0.875rem" }}>
                  <ChevronLeft size={15} /> Back
                </button>
                <button onClick={handleSubmit} disabled={isPredicting} className="btn-primary"
                  style={{ flex: 2, padding: "0.625rem", fontSize: "0.875rem", opacity: isPredicting ? 0.6 : 1, cursor: isPredicting ? "not-allowed" : "pointer" }}>
                  {isPredicting ? <><Activity className="animate-spin" size={14} />Predicting…</> : <><Activity size={14} />Get Result</>}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Result ── */}
          {step === 3 && stressInfo && (
            <div className="card" style={{ padding: "1.75rem", border: `2px solid ${stressInfo.border}`, background: stressInfo.bg, textAlign: "center" }}>
              <CheckCircle size={32} style={{ color: stressInfo.color, margin: "0 auto 0.75rem" }} />
              <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                Your Stress Level
              </p>
              <p style={{ fontSize: "2.25rem", fontWeight: 800, color: stressInfo.color, lineHeight: 1, marginBottom: "0.5rem" }}>
                {stressInfo.label}
              </p>

              {/* Bar */}
              <div style={{ margin: "1rem 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  <span>Low</span><span>Medium</span><span>High</span>
                </div>
                <div style={{ height: "7px", borderRadius: "999px", background: "var(--slate-200)" }}>
                  <div style={{ height: "100%", borderRadius: "999px", background: stressInfo.color, transition: "width 0.7s ease", width: result === 0 ? "18%" : result === 1 ? "55%" : "100%" }} />
                </div>
              </div>

              {/* Recommendation */}
              <div style={{ padding: "0.875rem", borderRadius: "0.625rem", background: "var(--bg-card)", border: "1px solid var(--border-default)", textAlign: "left", marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: "0.25rem" }}>Recommendation</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-body)", lineHeight: 1.6, margin: 0 }}>
                  {result === 0 && "Your stress levels look healthy. Keep maintaining your current lifestyle habits."}
                  {result === 1 && "Moderate stress detected. Consider short breaks, light exercise, and limiting screen time."}
                  {result === 2 && "High stress detected. Please speak with a health professional and review your workload and sleep habits."}
                </p>
              </div>

              {/* Stress & Protective Factors */}
              {(apiData?.StressFactors?.length > 0 || apiData?.ProtectiveFactors?.length > 0) && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem", textAlign: "left" }}>
                  <div style={{ padding: "0.75rem", borderRadius: "0.625rem", background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.2)" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#f43f5e", marginBottom: "0.5rem" }}>⬆ Stress Factors</p>
                    {(apiData.StressFactors || []).map((f) => (
                      <div key={f.Feature} style={{ marginBottom: "0.4rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-body)" }}>{getFeatureLabel(f.Feature)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "0.75rem", borderRadius: "0.625rem", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#10b981", marginBottom: "0.5rem" }}>⬇ Protective Factors</p>
                    {(apiData.ProtectiveFactors || []).map((f) => (
                      <div key={f.Feature} style={{ marginBottom: "0.4rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-body)" }}>{getFeatureLabel(f.Feature)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => { setStep(0); setResult(null); setApiData(null); }} className="btn-secondary" style={{ width: "100%", padding: "0.625rem", fontSize: "0.875rem" }}>
                Start Over
              </button>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
