import { Brain, Activity, ArrowRight, Zap, CheckCircle, Clock, Target, Shield, Quote, Eye, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import sentimentAnalysisImg from "./assets/sentimentAnalysis.svg";
import aiResponseImg from "./assets/ai-response.svg";

function HomePage() {
  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Neuroscientist",
      content: "Impressive accuracy for a free platform. The ML-powered analysis rivals commercial systems."
    },
    {
      name: "James Chen",
      role: "Safety Manager",
      content: "We've implemented this for fleet monitoring. The real-time alerts have significantly improved driver safety."
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Clinical Psychologist",
      content: "Scientifically rigorous with multi-channel EEG analysis. A valuable tool for fatigue research."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Header />

      <div className="flex-1">
        {/* Hero */}
        <section className="px-8 md:px-12 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ color: 'var(--indigo-600)', background: 'var(--indigo-50)' }}>
                <Zap size={14} />
                AI-Powered Detection System
              </span>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Detect Fatigue
                <br />
                <span style={{ color: 'var(--indigo-600)' }}>Before It's Too Late</span>
              </h1>

              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-body)' }}>
                Professional-grade fatigue detection using <strong>EEG brainwave analysis</strong> and <strong>real-time computer vision</strong>. Prevent accidents, optimize performance, and protect lives.
              </p>

              <div className="flex gap-8 pt-6" style={{ borderTop: '1px solid var(--border-default)' }}>
                {[
                  { value: "2", label: "Detection Methods" },
                  { value: "95%", label: "Accuracy" },
                  { value: "Free", label: "Open Access" }
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold" style={{ color: 'var(--indigo-600)' }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <img src={sentimentAnalysisImg} alt="Fatigue Detection" className="w-full max-w-md" />
            </div>
          </div>
        </section>

        {/* Detection Methods */}
        <section className="py-16 px-8 md:px-12" style={{ backgroundColor: 'var(--bg-muted)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
                Three Powerful Detection Methods
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-body)' }}>
                Choose the approach that fits your needs — or use all three for complete coverage
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* EEG Analysis */}
              <div className="card p-8 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--indigo-50)' }}>
                  <Brain size={28} style={{ color: 'var(--indigo-600)' }} />
                </div>
                
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
                  EEG Brainwave Analysis
                </h3>
                
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-body)' }}>
                  Upload EEG data for deep analysis of brain activity across 5 frequency bands. 
                  Get precise fatigue measurements and detailed insights into mental state.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    "4-channel EEG processing",
                    "5 frequency band analysis",
                    "ML-powered classification",
                    "Detailed visual reports"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle size={18} style={{ color: 'var(--emerald-500)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-body)' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to="/analysis" className="btn-primary w-full justify-center">
                  Start Analysis
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Driver Monitoring */}
              <div className="card p-8 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <Activity size={28} style={{ color: 'var(--emerald-500)' }} />
                </div>
                
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
                  Real-Time Monitoring
                </h3>
                
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-body)' }}>
                  Use your webcam for instant drowsiness detection through facial analysis. 
                  Perfect for drivers, operators, and anyone needing continuous monitoring.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    "Live camera detection",
                    "Eye closure tracking",
                    "Instant audio alerts",
                    "Session analytics"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle size={18} style={{ color: 'var(--emerald-500)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-body)' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/driver-monitoring" 
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold rounded-lg transition-all"
                  style={{ 
                    color: 'white',
                    backgroundColor: 'var(--emerald-500)'
                  }}
                >
                  Start Monitoring
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Stress Detection */}
              <div className="card p-8 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(251, 146, 60, 0.1)' }}>
                  <Zap size={28} style={{ color: 'var(--orange-500)' }} />
                </div>
                
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
                  Stress Level Analysis
                </h3>
                
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-body)' }}>
                  Predict stress and depression levels through behavioral pattern analysis. 
                  Early detection for better mental health management and intervention.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    "Behavioral pattern analysis",
                    "Multi-factor assessment",
                    "Depression risk scoring",
                    "Preventive insights"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle size={18} style={{ color: 'var(--emerald-500)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-body)' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/stress-prediction" 
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold rounded-lg transition-all"
                  style={{ 
                    color: 'white',
                    backgroundColor: '#f97316'
                  }}
                >
                  Check Stress Level
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-8 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
                How It Works
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-body)' }}>
                Advanced AI algorithms analyze multiple fatigue indicators
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* EEG Process */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--indigo-50)' }}>
                    <Brain size={20} style={{ color: 'var(--indigo-600)' }} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                    EEG Analysis Pipeline
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    { num: "01", title: "Data Upload", desc: "Upload CSV with 4-channel EEG recordings" },
                    { num: "02", title: "Signal Processing", desc: "Extract 5 frequency bands (Delta to Gamma)" },
                    { num: "03", title: "Pattern Analysis", desc: "ML model identifies fatigue signatures" },
                    { num: "04", title: "Classification", desc: "Generate fatigue score with confidence" }
                  ].map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
                        {step.num}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>{step.title}</h4>
                        <p className="text-sm" style={{ color: 'var(--text-body)' }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vision Process */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <Eye size={20} style={{ color: 'var(--emerald-500)' }} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                    Vision Detection Pipeline
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    { num: "01", title: "Face Detection", desc: "Real-time facial landmark identification" },
                    { num: "02", title: "Eye Tracking", desc: "Monitor eye aspect ratio and closure" },
                    { num: "03", title: "Fatigue Scoring", desc: "Calculate PERCLOS and blink metrics" },
                    { num: "04", title: "Alert System", desc: "Trigger audio warnings on drowsiness" }
                  ].map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald-600)' }}>
                        {step.num}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>{step.title}</h4>
                        <p className="text-sm" style={{ color: 'var(--text-body)' }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technology Image */}
            <div className="flex justify-center">
              <img src={aiResponseImg} alt="AI Technology" className="w-full max-w-md" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-8 md:px-12" style={{ backgroundColor: 'var(--bg-muted)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
                Why Choose Our Platform
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-body)' }}>
                Professional-grade detection accessible to everyone
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Cpu, title: "AI-Powered", desc: "Machine learning models trained on extensive datasets" },
                { icon: Clock, title: "Real-Time", desc: "Instant processing and immediate results" },
                { icon: Target, title: "Accurate", desc: "95%+ accuracy across multiple fatigue indicators" },
                { icon: Shield, title: "Secure", desc: "Your data stays private and is never shared" }
              ].map((feature) => (
                <div key={feature.title} className="card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--indigo-50)' }}>
                    <feature.icon size={24} style={{ color: 'var(--indigo-600)' }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-heading)' }}>{feature.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-body)' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-8 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
                Trusted by Professionals
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-body)' }}>
                Used in research, healthcare, and transportation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="card p-6">
                  <Quote size={20} className="mb-4" style={{ color: 'var(--indigo-300)' }} />
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-body)' }}>
                    "{t.content}"
                  </p>
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;