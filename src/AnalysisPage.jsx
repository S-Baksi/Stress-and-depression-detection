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

const API_BASE_URL = "http://localhost:5000";

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
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setSelectedFile(file);
      toast.success(`File "${file.name}" selected successfully`);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a CSV file to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze EEG data');
      }

      const data = await response.json();
      
      // Process API response to match expected format
      const channels = ["TP9", "AF7", "AF8", "TP10"];
      const channelData = processChannelData(data.eeg_bandpower_features, channels);
      
      // Map API fatigue levels to frontend format
      let fatigueLevel = "Low";
      if (data.fatigue_level === "High Fatigue" || data.fatigue_level === "Fatigue") {
        fatigueLevel = "High";
      }
      
      setResults({
        fatigue_level: fatigueLevel,
        probability: data.probability,
        channels: channelData
      });
      
      toast.success('Analysis completed successfully!');
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to analyze EEG data. Please ensure the API server is running.';
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex flex-col overflow-x-hidden">
    {/* showing the toast message on the top right corner */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#00695C',
            border: '2px solid #4DB6AC',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#26A69A',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#00695C',
              secondary: '#fff',
            },
            duration: 5000,
          },
          loading: {
            iconTheme: {
              primary: '#00897B',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Header */}
        <Header/>

      <div className="flex-1">
        {/* Main Content */}
        <section className="px-8 py-6">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            EEG Brainwave Analysis
          </h2>
          <p className="text-gray-600">
            Upload your CSV file to analyze brainwave patterns across all frequency bands and channels
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6 -mx-8 px-8 py-6 border-y-2" style={{ backgroundColor: 'var(--bg-primary-lighter)', borderColor: 'var(--border-primary-light)' }}>
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-white)', border: '2px solid var(--border-primary-light)' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>
              Upload EEG Data
            </h3>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label htmlFor="csv-file" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-gray)' }}>
                Select CSV File
              </label>
              <div className="flex gap-3 items-center">
                <label 
                  htmlFor="csv-file"
                  className="flex-1 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                  style={{ 
                    borderColor: 'var(--border-gray)',
                    backgroundColor: 'var(--bg-gray)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary-lighter)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-gray)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-gray)';
                  }}
                >
                  <File size={20} style={{ color: 'var(--text-light)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-gray)' }}>
                    {selectedFile ? selectedFile.name : 'Choose CSV file...'}
                  </span>
                </label>
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="submit"
                  disabled={isAnalyzing || !selectedFile}
                  className="px-6 py-3 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-white)'
                  }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--primary-dark)')}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="animate-spin" size={20} />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs flex items-center gap-2" style={{ color: 'var(--text-light)' }}>
              <File size={14} />
              CSV file should contain EEG raw data with columns: TP9, AF7, AF8, TP10
            </p>
          </form>
          {/* Loading Message */}
          {isAnalyzing && (
            <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-primary-lighter)', border: '2px solid var(--border-primary-light)' }}>
              <div className="flex items-center gap-4">
                <Activity className="animate-spin" size={24} style={{ color: 'var(--text-primary)' }} />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary-dark)' }}>Processing Analysis</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{loadingMessage}</p>
                </div>
              </div>
            </div>
          )}
          </div>
          
          <div className="hidden md:flex items-center justify-center">
            <img 
              src={dataInputImg} 
              alt="Upload Data Illustration" 
              className="w-full max-w-md"
            />
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-4">
            {/* Fatigue Level Result */}
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-white)', border: '2px solid var(--border-primary-light)' }}>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={24} style={{ color: 'var(--primary-medium)' }} />
                <h3 className="text-xl font-semibold" style={{ color: 'var(--text-dark)' }}>Analysis Results</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 items-center">
                <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-gray)', border: '2px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-gray)' }}>Fatigue Level</p>
                  <p className={`text-3xl font-bold`} style={{
                    color: results.fatigue_level === "High" ? 'var(--primary-darker)' : 'var(--primary-medium)'
                  }}>
                    {results.fatigue_level}
                  </p>
                </div>
                
                <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-gray)', border: '2px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-gray)' }}>Confidence Score</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {(results.probability * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="hidden md:flex justify-center">
                  <img 
                    src={sentimentAnalysisImg} 
                    alt="Success Illustration" 
                    className="w-32 h-32"
                  />
                </div>
              </div>
            </div>

            {/* Graphs Section - One for each channel */}
            {["TP9", "AF7", "AF8", "TP10"].map((channel) => (
              <div key={channel} className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-white)', border: '2px solid var(--border-primary-light)' }}>
                <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>
                  {channel} Channel Analysis
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-gray)' }}>
                  Band power distribution across time windows
                </p>
                
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={results.channels[channel]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#B2DFDB" />
                    <XAxis 
                      dataKey="window" 
                      label={{ value: 'Window', position: 'insideBottom', offset: -5 }}
                      stroke="#4DB6AC"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      label={{ value: 'Band Power', angle: -90, position: 'insideLeft' }}
                      stroke="#4DB6AC"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #4DB6AC',
                        borderRadius: '6px',
                        boxShadow: '0 1px 3px 0 rgba(0, 137, 123, 0.1)',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                      iconType="line"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="delta" 
                      stroke="#00897B" 
                      strokeWidth={2}
                      dot={false}
                      name="delta"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="theta" 
                      stroke="#26A69A" 
                      strokeWidth={2}
                      dot={false}
                      name="theta"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="alpha" 
                      stroke="#4DB6AC" 
                      strokeWidth={2}
                      dot={false}
                      name="alpha"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="beta" 
                      stroke="#80CBC4" 
                      strokeWidth={2}
                      dot={false}
                      name="beta"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gamma" 
                      stroke="#B2DFDB" 
                      strokeWidth={2}
                      dot={false}
                      name="gamma"
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                {/* Statistical Summary for this channel */}
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {["delta", "theta", "alpha", "beta", "gamma"].map((band) => {
                    const values = results.channels[channel].map(d => d[band]);
                    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                    const max = Math.max(...values).toFixed(2);
                    const min = Math.min(...values).toFixed(2);
                    
                    const colors = {
                      delta: "text-white",
                      theta: "text-white",
                      alpha: "text-white",
                      beta: "text-white",
                      gamma: "text-white"
                    };
                    
                    const bgColors = {
                      delta: "#00897B",
                      theta: "#26A69A",
                      alpha: "#4DB6AC",
                      beta: "#80CBC4",
                      gamma: "#B2DFDB"
                    };
                    
                    return (
                      <div key={band} className={`rounded-xl p-4 border-2 ${colors[band]}`} style={{ 
                        backgroundColor: bgColors[band],
                        borderColor: bgColors[band]
                      }}>
                        <p className="text-xs font-semibold uppercase mb-1">{band}</p>
                        <p className="text-xs">Avg: <strong>{avg}</strong></p>
                        <p className="text-xs">Max: <strong>{max}</strong></p>
                        <p className="text-xs">Min: <strong>{min}</strong></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Overall Interpretation */}
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-primary-lighter)', border: '2px solid var(--border-primary-light)' }}>
              <h4 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>Understanding Your Results</h4>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-gray)' }}>
                Each graph represents EEG data from a different electrode placement. The lines show power levels 
                of different brainwave frequencies measured across time windows.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00897B' }}></div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-gray)' }}>Delta: Sleep & Recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#26A69A' }}></div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-gray)' }}>Theta: Relaxation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4DB6AC' }}></div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-gray)' }}>Alpha: Calm Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#80CBC4' }}></div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-gray)' }}>Beta: Active Thinking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#B2DFDB' }}></div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-gray)' }}>Gamma: Peak Focus</span>
                </div>
              </div>
            </div>
          </div>
        )}
        </section>
      </div>
        {/* Footer */}
        <Footer />
    </div>
  );
}

export default AnalysisPage;
