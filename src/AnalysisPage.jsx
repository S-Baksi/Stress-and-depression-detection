import { useState, useEffect } from "react";
import { Upload, Activity, File, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import toast, { Toaster } from 'react-hot-toast';
import Footer from "./Footer";
import Header from "./Header";
import dataInputImg from "./assets/data-input.svg";
import sentimentAnalysisImg from "./assets/sentimentAnalysis.svg";

const loadingMessages = [
  "Uploading CSV file to server...",
  "Reading and validating CSV file...",
  "Processing brainwave data...",
  "Extracting frequency band features...",
  "Analyzing alpha wave patterns...",
  "Analyzing beta wave patterns...",
  "Analyzing gamma wave patterns...",
  "Analyzing delta and theta patterns...",
  "Running machine learning model...",
  "Calculating fatigue probability...",
  "Generating visualization data...",
  "Finalizing results..."
];

const API_BASE_URL = "http://localhost:9000"; // Update if your backend runs on a different port

const CHART_COLORS = {
  delta: "#6366f1",
  theta: "#8b5cf6",
  alpha: "#10b981",
  beta: "#f59e0b",
  gamma: "#f43f5e"
};

const BAND_BG = {
  delta: "#eef2ff",
  theta: "#f5f3ff",
  alpha: "#ecfdf5",
  beta: "#fffbeb",
  gamma: "#fff1f2"
};

const BAND_TEXT = {
  delta: "#4f46e5",
  theta: "#7c3aed",
  alpha: "#059669",
  beta: "#d97706",
  gamma: "#e11d48"
};

// Helper function to calculate band statistics
const calculateBandStats = (channelData, band) => {
  const values = channelData.map(d => d[band]);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  const min = Math.min(...values).toFixed(2);
  return { avg, max, min };
};

const processChannelData = (bandpowerFeatures, channels) => {
  const channelData = {};
  channels.forEach(channel => {
    const processedData = bandpowerFeatures.map((row, index) => ({
      window: index,
      delta: row[`delta_${channel}`] || 0,
      theta: row[`theta_${channel}`] || 0,
      alpha: row[`alpha_${channel}`] || 0,
      beta: row[`beta_${channel}`] || 0,
      gamma: row[`gamma_${channel}`] || 0
    }));
    channelData[channel] = processedData.filter(row => row.delta !== 0 || row.theta !== 0);
  });
  return channelData;
};

function AnalysisPage() {
  const [csvPath, setCsvPath] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      let index = 0;
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[index]);
        index = (index + 1) % loadingMessages.length;
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!csvPath) {
      toast.error('Please enter the CSV file path');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict-fatigue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csv_path: csvPath }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorData.message || `Server returned error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if response has the expected structure
      if (!data.result?.EEGBandPowerFeatures) {
        throw new Error('Invalid response format from server');
      }

      const channels = ["TP9", "AF7", "AF8", "TP10"];
      const channelData = processChannelData(data.result.EEGBandPowerFeatures, channels);

      // Map backend fatigue level to display format
      const backendFatigue = data.result.FatigueLevel;
      let fatigueLevel;
      
      if (backendFatigue === "High Fatigue") {
        fatigueLevel = "High Fatigue";
      } else if (backendFatigue === "Fatigue") {
        fatigueLevel = "Fatigue";
      } else {
        fatigueLevel = "Normal";
      }

      setResults({
        fatigue_level: fatigueLevel,
        probability: data.result.Probability || 0,
        channels: channelData
      });

      toast.success('Analysis completed successfully!');

    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err.message || 'Failed to analyze EEG data. Please ensure the API server is running.';
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: 'var(--text-heading)',
            border: '1px solid var(--border-default)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: 'var(--shadow-md)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' }, duration: 5000 },
          loading: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
        }}
      />

      <Header />

      <div className="flex-1">
        <section className="px-8 md:px-12 py-8">
          {/* Page title */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
              EEG Brainwave Analysis
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-body)' }}>
              Upload your CSV file to analyze brainwave patterns across all frequency bands and channels
            </p>
          </div>

          {/* Upload area */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card p-5">
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>
                Upload EEG Data
              </h2>

              <form onSubmit={handleAnalyze} className="space-y-3">
                <div>
                  <label htmlFor="csv-path" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-body)' }}>
                    CSV File Path
                  </label>
                  <div className="flex gap-2.5 items-center">
                    <input
                      id="csv-path"
                      type="text"
                      value={csvPath}
                      onChange={(e) => setCsvPath(e.target.value)}
                      placeholder="C:/path/to/your/file.csv"
                      className="flex-1 px-3.5 py-2.5 border-2 rounded-xl transition-all text-sm"
                      style={{ 
                        borderColor: 'var(--slate-300)', 
                        backgroundColor: 'var(--bg-muted)',
                        color: 'var(--text-heading)'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isAnalyzing || !csvPath}
                      className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isAnalyzing ? (
                        <>
                          <Activity className="animate-spin" size={16} />
                          Analyzing…
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Analyze
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <File size={11} />
                  Enter full path to CSV file containing EEG raw data with columns: TP9, AF7, AF8, TP10
                </p>
              </form>

              {isAnalyzing && (
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--indigo-50)', border: '1px solid var(--indigo-100)' }}>
                  <div className="flex items-center gap-2.5">
                    <Activity className="animate-spin" size={18} style={{ color: 'var(--indigo-600)' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>Processing…</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--indigo-600)' }}>{loadingMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center justify-center">
              <img src={dataInputImg} alt="Upload Data" className="w-full max-w-sm" />
            </div>
          </div>

          {/* Results */}
          {results && (() => {
            // Determine fatigue level color
            let fatigueLevelColor = '#10b981'; // default green
            if (results.fatigue_level === "High") {
              fatigueLevelColor = '#f43f5e';
            } else if (results.fatigue_level === "Moderate") {
              fatigueLevelColor = '#f59e0b';
            }

            return (
            <div className="space-y-4">
              {/* Summary */}
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} style={{ color: '#10b981' }} />
                  <h2 className="text-base font-semibold" style={{ color: 'var(--text-heading)' }}>Analysis Results</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-3 items-center">
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}>
                    <p className="text-[11px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Fatigue Level</p>
                    <p className="text-2xl font-bold" style={{ color: fatigueLevelColor }}>
                      {results.fatigue_level}
                    </p>
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}>
                    <p className="text-[11px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Confidence Score</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--indigo-600)' }}>
                      {((results.probability || 0) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="hidden md:flex justify-center">
                    <img src={sentimentAnalysisImg} alt="Success" className="w-24 h-24" />
                  </div>
                </div>
              </div>

              {/* Charts */}
              {["TP9", "AF7", "AF8", "TP10"].map((channel) => (
                <div key={channel} className="card p-5">
                  <h3 className="text-base font-semibold mb-0.5" style={{ color: 'var(--text-heading)' }}>
                    {channel} Channel
                  </h3>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                    Band power distribution across time windows
                  </p>

                  <ResponsiveContainer width="100%" height={340}>
                    <LineChart data={results.channels[channel]} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-200)" />
                      <XAxis dataKey="window" label={{ value: 'Window', position: 'insideBottom', offset: -5 }} stroke="var(--slate-400)" tick={{ fontSize: 11 }} />
                      <YAxis label={{ value: 'Band Power', angle: -90, position: 'insideLeft' }} stroke="var(--slate-400)" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid var(--slate-200)',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-md)',
                        fontSize: '12px'
                      }} />
                      <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} iconType="line" />
                      {Object.entries(CHART_COLORS).map(([band, color]) => (
                        <Line key={band} type="monotone" dataKey={band} stroke={color} strokeWidth={2} dot={false} name={band} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {["delta", "theta", "alpha", "beta", "gamma"].map((band) => {
                      const { avg, max, min } = calculateBandStats(results.channels[channel], band);

                      return (
                        <div key={band} className="rounded-lg p-2.5" style={{ backgroundColor: BAND_BG[band] }}>
                          <p className="text-[11px] font-semibold uppercase mb-0.5" style={{ color: BAND_TEXT[band] }}>{band}</p>
                          <p className="text-[11px]" style={{ color: 'var(--text-body)' }}>Avg: <strong>{avg}</strong></p>
                          <p className="text-[11px]" style={{ color: 'var(--text-body)' }}>Max: <strong>{max}</strong></p>
                          <p className="text-[11px]" style={{ color: 'var(--text-body)' }}>Min: <strong>{min}</strong></p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-heading)' }}>Understanding Your Results</h3>
                <p className="text-xs leading-relaxed mb-2.5" style={{ color: 'var(--text-body)' }}>
                  Each graph shows EEG data from a different electrode. Lines represent brainwave frequency power levels across time windows.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { band: "delta", label: "Sleep & Recovery" },
                    { band: "theta", label: "Relaxation" },
                    { band: "alpha", label: "Calm Focus" },
                    { band: "beta", label: "Active Thinking" },
                    { band: "gamma", label: "Peak Focus" }
                  ].map(({ band, label }) => (
                    <div key={band} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[band] }} />
                      <span className="text-xs" style={{ color: 'var(--text-body)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            );
          })()}
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default AnalysisPage;
