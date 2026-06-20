import { useState, useEffect, useRef } from 'react';
import { Keyboard, Activity, CheckCircle, AlertCircle, Clock, Target } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import './KeystrokeFatigue.css';

const KEYSTROKE_API_URL = 'http://localhost:5005/predict-fatigue/keystrokes';

// Sample texts for typing test (each ~150 characters = ~150 keystrokes)
const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. Technology has revolutionized our daily lives in countless ways. Modern computing systems enable us to work faster and more efficiently than ever before. Innovation drives progress in every field of human endeavor.",
  "Artificial intelligence and machine learning are transforming industries worldwide. Data science helps organizations make better decisions. Cloud computing provides scalable infrastructure for businesses. Digital transformation is essential for staying competitive in today's market.",
  "Software development requires continuous learning and adaptation. Programming languages evolve with changing technology needs. Debugging skills are crucial for writing reliable code. Testing ensures quality and performance of applications before deployment to production environments."
];

const FATIGUE_LABELS = {
  0: { name: 'Above Average', color: '#ef4444', description: 'High fatigue detected' },
  1: { name: 'Average', color: '#f59e0b', description: 'Moderate fatigue' },
  2: { name: 'Below Average', color: '#eab308', description: 'Mild fatigue' },
  3: { name: 'Low', color: '#84cc16', description: 'Low fatigue' },
  4: { name: 'No Fatigue', color: '#10b981', description: 'No fatigue detected' },
  5: { name: 'Very High', color: '#dc2626', description: 'Critical fatigue level' }
};

export default function KeystrokeFatigue() {
  const [sampleText, setSampleText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [keystrokes, setKeystrokes] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    // Select random sample text on mount
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setSampleText(randomText);
  }, []);

  const handleStart = () => {
    setIsTyping(true);
    setTypedText('');
    setKeystrokes([]);
    setErrors(0);
    setWpm(0);
    setResult(null);
    setStartTime(Date.now());
    inputRef.current?.focus();
    toast.success('Start typing the text below!');
  };

  const handleKeyDown = (e) => {
    if (!isTyping) return;

    const pressTime = new Date().toISOString().replace('T', ' ').substring(0, 23);
    
    // Store key press time
    const keystrokeData = {
      key: e.key,
      pressTime: pressTime,
      keyCode: e.keyCode
    };

    setKeystrokes(prev => [...prev, keystrokeData]);
  };

  const handleKeyUp = (e) => {
    if (!isTyping) return;

    const releaseTime = new Date().toISOString().replace('T', ' ').substring(0, 23);
    
    // Update the last keystroke with release time
    setKeystrokes(prev => {
      const updated = [...prev];
      const lastKeystroke = updated[updated.length - 1];
      if (lastKeystroke && lastKeystroke.key === e.key) {
        lastKeystroke.releaseTime = releaseTime;
      }
      return updated;
    });
  };

  const handleInputChange = (e) => {
    if (!isTyping) return;

    const typed = e.target.value;
    setTypedText(typed);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== sampleText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Calculate WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
      const wordsTyped = typed.length / 5; // Standard: 5 characters = 1 word
      setWpm(Math.round(wordsTyped / timeElapsed));
    }

    // Check if test is complete
    if (typed.length >= sampleText.length) {
      handleTestComplete();
    }
  };

  const handleTestComplete = async () => {
    setIsTyping(false);
    
    // Filter keystrokes with both press and release time
    const validKeystrokes = keystrokes.filter(k => k.pressTime && k.releaseTime);

    if (validKeystrokes.length < 150) {
      toast.error(`Need at least 150 keystrokes. You typed ${validKeystrokes.length} keys. Please try again.`);
      return;
    }

    // Take first 150 keystrokes
    const first150 = validKeystrokes.slice(0, 150);

    setIsAnalyzing(true);

    try {
      const payload = {
        keystrokes: first150.map(k => ({
          Key: k.key,
          Press_Time: k.pressTime,
          Relase_Time: k.releaseTime // Note: typo in API (Relase instead of Release)
        }))
      };

      const response = await fetch(KEYSTROKE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      setResult({
        fatigueLevel: data.predicted_class_index,
        fatigueLabel: FATIGUE_LABELS[data.predicted_class_index].name,
        confidence: data.confidence,
        description: FATIGUE_LABELS[data.predicted_class_index].description
      });

      toast.success('Fatigue analysis complete!');
    } catch (error) {
      console.error('Keystroke prediction error:', error);
      toast.error('Failed to analyze keystrokes. Please ensure the API is running on port 5005.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setSampleText(randomText);
    setTypedText('');
    setKeystrokes([]);
    setIsTyping(false);
    setResult(null);
    setErrors(0);
    setWpm(0);
    setStartTime(null);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Toaster position="top-right" />
      <Header />

      <div className="flex-1 px-8 md:px-12 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
            Keystroke Fatigue Detection
          </h1>
          <p className="text-base" style={{ color: 'var(--text-body)' }}>
            Type the text below to analyze your typing patterns and detect fatigue levels using AI
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Stats */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
                <Keyboard size={20} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>
                Progress
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    Keystrokes
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>
                    {keystrokes.length} / 150
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((keystrokes.length / 150) * 100, 100)}%`,
                      backgroundColor: 'var(--indigo-600)'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>WPM</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                    {wpm}
                  </p>
                </div>

                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Target size={14} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Errors</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: errors > 0 ? '#ef4444' : 'var(--text-heading)' }}>
                    {errors}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="card p-5 md:col-span-2">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
              How It Works
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ backgroundColor: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
                  <span className="text-xs font-bold">1</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  Click "Start Test" to begin typing the displayed text
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ backgroundColor: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
                  <span className="text-xs font-bold">2</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  Type exactly as shown - the system records your keystroke timing
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ backgroundColor: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
                  <span className="text-xs font-bold">3</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  After 150+ keystrokes, AI analyzes your typing patterns for fatigue
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Typing Test Area */}
        <div className="card p-6 mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
              Type This Text:
            </h3>
            <div className="p-4 rounded-lg font-mono text-sm leading-relaxed"
                 style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-body)' }}>
              {sampleText.split('').map((char, idx) => (
                <span
                  key={idx}
                  style={{
                    color: idx < typedText.length
                      ? typedText[idx] === char
                        ? '#10b981'
                        : '#ef4444'
                      : 'var(--text-body)'
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-body)' }}>
              Your Typing:
            </label>
            <textarea
              ref={inputRef}
              value={typedText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              disabled={!isTyping || isAnalyzing}
              rows={4}
              className="w-full px-4 py-3 rounded-lg font-mono text-sm border-2"
              style={{
                borderColor: 'var(--border-default)',
                backgroundColor: isTyping ? 'white' : 'var(--bg-muted)',
                color: 'var(--text-heading)'
              }}
              placeholder={isTyping ? "Start typing..." : "Click 'Start Test' to begin"}
            />
          </div>

          <div className="flex gap-3">
            {!isTyping && !result && (
              <button onClick={handleStart} className="btn-primary">
                <Activity size={18} />
                Start Test
              </button>
            )}
            
            {isAnalyzing && (
              <button disabled className="btn-primary opacity-50">
                <Activity size={18} className="animate-spin" />
                Analyzing...
              </button>
            )}

            {result && (
              <button onClick={handleReset} className="btn-primary">
                <Activity size={18} />
                Try Again
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={24} style={{ color: '#10b981' }} />
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                Analysis Results
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl" 
                   style={{ backgroundColor: 'var(--bg-muted)' }}>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Fatigue Level
                </p>
                <p className="text-3xl font-bold mb-1" 
                   style={{ color: FATIGUE_LABELS[result.fatigueLevel].color }}>
                  {result.fatigueLabel}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  {result.description}
                </p>
              </div>

              <div className="p-6 rounded-xl" 
                   style={{ backgroundColor: 'var(--bg-muted)' }}>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Confidence
                </p>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--indigo-600)' }}>
                  {result.confidence}%
                </p>
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  Model certainty level
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg flex items-start gap-3"
                 style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <AlertCircle size={20} style={{ color: '#3b82f6', flexShrink: 0 }} />
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-heading)' }}>
                  Recommendation
                </p>
                <p className="text-sm" style={{ color: 'var(--text-body)' }}>
                  {result.fatigueLevel >= 3 
                    ? "Your typing patterns show low fatigue. You're performing well!" 
                    : "Your typing shows signs of fatigue. Consider taking a break and resting."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
