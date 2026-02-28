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
            color: '#1f2937',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            duration: 5000,
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Header */}
        <Header/>

      <div className="flex-1">
        {/* Main Content */}
        <section className="px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            EEG Brainwave Analysis
          </h2>
          <p className="text-gray-600">
            Upload your CSV file to analyze brainwave patterns across all frequency bands and channels
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 bg-slate-50 -mx-8 px-8 py-12 border-y-2 border-slate-200">
          <div className="bg-white rounded-xl border-2 border-slate-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Upload EEG Data
            </h3>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <div className="flex gap-3 items-center">
                <label 
                  htmlFor="csv-file"
                  className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-slate-400 cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100 flex items-center gap-2"
                >
                  <File size={20} className="text-gray-500" />
                  <span className="text-gray-700 text-sm">
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
                  className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800 flex items-center gap-2 transition-all transform hover:scale-105"
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
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <File size={14} />
              CSV file should contain EEG raw data with columns: TP9, AF7, AF8, TP10
            </p>
          </form>
          {/* Loading Message */}
          {isAnalyzing && (
            <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-300 rounded-xl">
              <div className="flex items-center gap-4">
                <Activity className="text-blue-600 animate-spin" size={24} />
                <div>
                  <p className="text-blue-900 font-semibold">Processing Analysis</p>
                  <p className="text-blue-700 text-sm mt-1">{loadingMessage}</p>
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
          <div className="space-y-6">
            {/* Fatigue Level Result */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-10">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="text-green-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-8 border-2 border-slate-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Fatigue Level</p>
                  <p className={`text-3xl font-bold ${
                    results.fatigue_level === "High" ? "text-red-600" : "text-green-600"
                  }`}>
                    {results.fatigue_level}
                  </p>
                </div>
                
                <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-8 border-2 border-slate-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Confidence Score</p>
                  <p className="text-3xl font-bold text-slate-700">
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
              <div key={channel} className="bg-white rounded-xl border-2 border-slate-200 p-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {channel} Channel Analysis
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Band power distribution across time windows
                </p>
                
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={results.channels[channel]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="window" 
                      label={{ value: 'Window', position: 'insideBottom', offset: -5 }}
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      label={{ value: 'Band Power', angle: -90, position: 'insideLeft' }}
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
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
                      stroke="#0ea5e9" 
                      strokeWidth={1.5}
                      dot={false}
                      name="delta"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="theta" 
                      stroke="#f59e0b" 
                      strokeWidth={1.5}
                      dot={false}
                      name="theta"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="alpha" 
                      stroke="#10b981" 
                      strokeWidth={1.5}
                      dot={false}
                      name="alpha"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="beta" 
                      stroke="#ef4444" 
                      strokeWidth={1.5}
                      dot={false}
                      name="beta"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gamma" 
                      stroke="#8b5cf6" 
                      strokeWidth={1.5}
                      dot={false}
                      name="gamma"
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                {/* Statistical Summary for this channel */}
                <div className="mt-6 grid grid-cols-5 gap-3">
                  {["delta", "theta", "alpha", "beta", "gamma"].map((band) => {
                    const values = results.channels[channel].map(d => d[band]);
                    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                    const max = Math.max(...values).toFixed(2);
                    const min = Math.min(...values).toFixed(2);
                    
                    const colors = {
                      delta: "bg-cyan-50 border-2 border-cyan-300 text-cyan-800",
                      theta: "bg-amber-50 border-2 border-amber-300 text-amber-800",
                      alpha: "bg-emerald-50 border-2 border-emerald-300 text-emerald-800",
                      beta: "bg-rose-50 border-2 border-rose-300 text-rose-800",
                      gamma: "bg-violet-50 border-2 border-violet-300 text-violet-800"
                    };
                    
                    return (
                      <div key={band} className={`rounded-xl p-4 border ${colors[band]}`}>
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
            <div className="bg-linear-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl p-8">
              <h4 className="text-base font-semibold text-slate-900 mb-3">Understanding Your Results</h4>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                Each graph represents EEG data from a different electrode placement. The lines show power levels 
                of different brainwave frequencies measured across time windows.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-xs font-medium text-slate-700">Delta: Sleep & Recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-medium text-slate-700">Theta: Relaxation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-medium text-slate-700">Alpha: Calm Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-xs font-medium text-slate-700">Beta: Active Thinking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                  <span className="text-xs font-medium text-slate-700">Gamma: Peak Focus</span>
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
