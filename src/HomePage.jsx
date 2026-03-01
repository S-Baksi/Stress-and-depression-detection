import { Brain, BarChart3, TrendingUp, ArrowRight, Zap, Upload, Quote, Activity, Clock, FileText, Target, Shield, Mouse } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import sentimentAnalysisImg from "./assets/sentimentAnalysis.svg";
import aiResponseImg from "./assets/ai-response.svg";

function HomePage() {
  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Neuroscientist, Research Institute",
      content: "This free platform has been invaluable for our preliminary research. The accuracy of the analysis is impressive, and the fact that it's thoroughly tested and accessible to everyone makes it a game-changer in fatigue detection.",
      rating: 5
    },
    {
      name: "James Chen",
      role: "Transportation Safety Manager",
      content: "We've tested this system extensively with our drivers. Being a free, production-ready tool with professional-grade analysis has helped us implement better fatigue monitoring protocols. The visualizations are clear and actionable.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Clinical Psychologist",
      content: "As a healthcare professional, I'm impressed by the scientific rigor behind this free platform. The multi-channel EEG analysis is sophisticated yet easy to understand. It's rare to find such a well-tested tool at no cost.",
      rating: 5
    },
    {
      name: "Michael Thompson",
      role: "Sleep Research Lab Director",
      content: "The comprehensive brainwave analysis across all channels provides insights comparable to expensive commercial systems. This tested, free platform has democratized access to advanced fatigue detection technology.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg-body)' }}>
      <Header />

      <div className="flex-1">
        {/* Hero */}
        <section className="px-8 md:px-12 py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ color: 'var(--indigo-600)', background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)' }}>
                <Zap size={12} />
                AI-Powered EEG Analysis
              </span>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.12] tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Advanced Fatigue{" "}
                <span style={{ color: 'var(--indigo-600)' }}>Detection System</span>
              </h1>

              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-body)' }}>
                Harness machine learning to analyze EEG brainwave patterns across{" "}
                <strong style={{ color: 'var(--text-heading)' }}>4 channels</strong> and{" "}
                <strong style={{ color: 'var(--text-heading)' }}>5 frequency bands</strong> for precise, real-time fatigue assessment.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link to="/analysis" className="btn-primary">
                  <Upload size={17} />
                  Start Analysis
                  <ArrowRight size={15} />
                </Link>
                <a href="#how-it-works" className="btn-secondary">
                  Learn More
                  <TrendingUp size={15} />
                </a>
              </div>

              <div className="flex gap-10 pt-3" style={{ borderTop: '1px solid var(--border-default)', marginTop: '0.5rem', paddingTop: '1rem' }}>
                {[
                  { value: "4", label: "EEG Channels" },
                  { value: "5", label: "Wave Bands" },
                  { value: "95%+", label: "Accuracy" }
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-xl font-bold" style={{ color: 'var(--indigo-600)' }}>{s.value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <img src={sentimentAnalysisImg} alt="EEG Analysis" className="w-full max-w-lg" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-14 scroll-mt-20 border-y" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-default)' }}>
          <div className="px-8 md:px-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center" style={{ color: 'var(--text-heading)' }}>How It Works</h2>
            <p className="text-center mb-8 text-sm" style={{ color: 'var(--text-body)' }}>Four steps from raw data to actionable fatigue insights</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Upload, title: "Upload Data", num: "01", description: "Provide a CSV containing EEG measurements from channels TP9, AF7, AF8, TP10" },
                { icon: Brain, title: "AI Processing", num: "02", description: "ML algorithms analyze brainwave patterns to identify fatigue indicators" },
                { icon: BarChart3, title: "Visualization", num: "03", description: "Detailed graphs show power levels across frequency bands and channels" },
                { icon: TrendingUp, title: "Results", num: "04", description: "Get fatigue classification with confidence scores and statistical analysis" }
              ].map((step) => (
                <div key={step.title} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--indigo-50)' }}>
                      <step.icon size={18} style={{ color: 'var(--indigo-600)' }} />
                    </div>
                    <span className="text-[11px] font-bold tracking-wide" style={{ color: 'var(--text-muted)' }}>{step.num}</span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-14 overflow-hidden">
          <div className="px-8 md:px-12 text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>Trusted by Professionals</h2>
            <p className="text-sm" style={{ color: 'var(--text-body)' }}>What experts say about our fatigue detection platform</p>
          </div>

          <div className="relative">
            <div className="flex gap-4 animate-scroll pl-8 md:pl-12">
              {[...testimonials, ...testimonials].map((t, index) => (
                <div key={`${t.name}-${index}`} className="card shrink-0 w-[300px] p-5">
                  <Quote className="mb-2" size={16} style={{ color: 'var(--slate-300)' }} />
                  <p className="text-sm leading-relaxed mb-3 line-clamp-4" style={{ color: 'var(--text-body)' }}>
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: t.rating }, (_, i) => (
                      <svg key={`star-${index}-${i}`} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#f59e0b' }}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="pt-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-6 px-8">
            {[
              { icon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>, label: "100% Free to Use" },
              { icon: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>, label: "Clinically Tested" }
            ].map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ color: 'var(--indigo-600)', background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)' }}>
                {b.icon}
                {b.label}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-14 border-y" style={{ borderColor: 'var(--border-default)' }}>
          <div className="px-8 md:px-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center" style={{ color: 'var(--text-heading)' }}>Key Features</h2>
            <p className="text-center mb-8 text-sm" style={{ color: 'var(--text-body)' }}>Everything you need for comprehensive fatigue analysis</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Activity, title: "Brainwave Analysis", description: "Comprehensive analysis of Alpha, Beta, Gamma, and Delta wave patterns" },
                { icon: Clock, title: "Real-time Processing", description: "Instant results with our optimized Python backend processing pipeline" },
                { icon: FileText, title: "Visual Reports", description: "Interactive graphs and charts to understand your fatigue patterns" },
                { icon: Target, title: "Probability Score", description: "Accurate fatigue level prediction with confidence probability metrics" },
                { icon: Shield, title: "Secure & Private", description: "Your data is processed securely and never shared with third parties" },
                { icon: Mouse, title: "Easy to Use", description: "Simple CSV upload interface — no technical knowledge required" }
              ].map((feature) => (
                <div key={feature.title} className="card p-5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--indigo-50)' }}>
                    <feature.icon size={18} style={{ color: 'var(--indigo-600)' }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Technology */}
        <section className="py-14 px-8 md:px-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center" style={{ color: 'var(--text-heading)' }}>AI-Powered Detection Technology</h2>
          <p className="text-center mb-8 text-sm max-w-2xl mx-auto" style={{ color: 'var(--text-body)' }}>How our machine learning system analyzes brain activity patterns</p>

          <div className="grid md:grid-cols-5 gap-6 items-start mb-14">
            <div className="md:col-span-3 card p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                <Brain style={{ color: 'var(--indigo-600)' }} size={20} />
                How Our AI Detection Works
              </h3>
              <div className="space-y-2" style={{ color: 'var(--text-body)' }}>
                <p className="text-sm leading-relaxed">
                  Our system uses <strong>machine learning algorithms</strong> trained on extensive EEG datasets to identify fatigue patterns with high accuracy.
                </p>
                <ol className="space-y-2.5 mt-3">
                  {[
                    { title: "Multi-Channel Data Collection:", desc: "EEG signals from 4 electrodes (TP9, AF7, AF8, TP10) covering frontal and temporal brain regions." },
                    { title: "Frequency Band Extraction:", desc: "Raw signals decomposed into five frequency bands (Delta, Theta, Alpha, Beta, Gamma) using signal processing." },
                    { title: "Pattern Recognition:", desc: "Trained ML model identifies characteristic patterns associated with different fatigue states." },
                    { title: "Fatigue Classification:", desc: "Calculates a fatigue probability score and classifies state as \"High\" or \"Low\" fatigue." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5" style={{ backgroundColor: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>{i + 1}</span>
                      <span className="leading-relaxed"><strong>{item.title}</strong> {item.desc}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-center items-center">
              <img src={aiResponseImg} alt="AI Technology" className="w-full max-w-xs" />
            </div>
          </div>

          {/* Brainwave Guide */}
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center" style={{ color: 'var(--text-heading)' }}>What Are Brainwaves?</h2>
          <p className="text-center mb-6 text-sm max-w-xl mx-auto" style={{ color: 'var(--text-body)' }}>
            Your brain constantly produces electrical signals. These "brainwaves" change based on what you're doing and how you feel.
          </p>

          <div className="card p-5 mb-6 max-w-3xl mx-auto">
            <h3 className="text-base font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <Brain style={{ color: 'var(--indigo-600)' }} size={18} />
              How This Website Detects Your Fatigue Level
            </h3>
            <div className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
              <p>
                Think of your brain like a radio station broadcasting different frequencies. When you're alert, it broadcasts stronger "fast" frequencies. When you're tired, it switches to slower ones.
              </p>
              <p>
                We read these frequencies from your EEG data and compare them to patterns learned from thousands of people — like recognizing a song from its rhythm.
              </p>
              <p className="font-medium" style={{ color: 'var(--text-heading)' }}>
                Here are the 5 types of brainwaves and what they mean for your energy levels:
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { symbol: "δ", name: "Delta Waves", subtitle: "Deep Sleep Signals", freq: "0.5–4 Hz", emoji: "🛏️", when: "During deep sleep when your body is repairing and recovering", fatigue: "If these appear while you're awake, your brain is saying \"I need sleep NOW!\"", example: "Feeling so tired you could fall asleep standing up? That's delta waves." },
              { symbol: "θ", name: "Theta Waves", subtitle: "Drowsiness Zone", freq: "4–8 Hz", emoji: "🌙", when: "When daydreaming, in light sleep, or that drowsy feeling before falling asleep", fatigue: "When these show up during tasks needing attention, you're having trouble staying focused.", example: "Reading the same sentence 3 times without remembering? That's theta." },
              { symbol: "α", name: "Alpha Waves", subtitle: "Relaxed & Calm", freq: "8–13 Hz", emoji: "🧘", when: "When relaxed but awake — taking a break, resting with eyes closed", fatigue: "Too little = stress. Too much during work = mentally \"checked out\" from tiredness.", example: "Staring at your screen but not really working? Excessive alpha waves." },
              { symbol: "β", name: "Beta Waves", subtitle: "Active & Focused", freq: "13–30 Hz", emoji: "💡", when: "When actively working, thinking, solving problems, or conversing", fatigue: "Low beta = low energy. Your brain can't produce enough \"active\" waves when fatigued.", example: "Struggling with a normally easy task? Beta waves are too low." },
              { symbol: "γ", name: "Gamma Waves", subtitle: "Peak Performance", freq: "30–100 Hz", emoji: "🚀", when: "At your best — learning quickly, making connections, in \"flow\" state", fatigue: "Low gamma = brain fog. You can't think as clearly or remember as well.", example: "Forgetting what you just thought about? Low gamma from fatigue." }
            ].map((wave) => (
              <div key={wave.symbol} className="card p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--indigo-50)' }}>
                    <span className="text-lg font-bold" style={{ color: 'var(--indigo-600)' }}>{wave.symbol}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>{wave.name} — "{wave.subtitle}"</h4>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{wave.freq}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="rounded-md p-2.5" style={{ backgroundColor: 'var(--bg-muted)' }}>
                    <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--text-heading)' }}>{wave.emoji} When you normally have these:</p>
                    <p className="text-xs" style={{ color: 'var(--text-body)' }}>{wave.when}</p>
                  </div>
                  <div className="rounded-md p-2.5" style={{ backgroundColor: 'var(--bg-muted)' }}>
                    <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--text-heading)' }}>⚠️ What it means for fatigue:</p>
                    <p className="text-xs" style={{ color: 'var(--text-body)' }}>{wave.fatigue}</p>
                  </div>
                  <p className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>{wave.example}</p>
                </div>
              </div>
            ))}

            {/* Key Insight — spans full row */}
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl p-6" style={{ backgroundColor: 'var(--slate-900)', color: 'var(--text-on-dark)' }}>
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                <TrendingUp size={20} />
                Putting It All Together
              </h4>
              <p className="mb-4 text-sm" style={{ color: 'var(--slate-300)' }}>
                Your brain produces a mix of ALL these waves at once, but the proportions change based on how tired you are.
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--slate-800)' }}>
                  <h5 className="font-bold text-sm mb-2 flex items-center gap-1.5 text-white">
                    <span>😊</span> When You're Alert
                  </h5>
                  <ul className="space-y-1 text-sm" style={{ color: 'var(--slate-300)' }}>
                    <li className="flex gap-2"><span>↓</span><span><strong>Low slow waves</strong> (Delta & Theta)</span></li>
                    <li className="flex gap-2"><span>↑</span><span><strong>High fast waves</strong> (Beta & Gamma)</span></li>
                    <li className="flex gap-2"><span>✓</span><span><strong>Balanced Alpha</strong> — relaxed but attentive</span></li>
                  </ul>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--slate-800)' }}>
                  <h5 className="font-bold text-sm mb-2 flex items-center gap-1.5 text-white">
                    <span>😴</span> When You're Fatigued
                  </h5>
                  <ul className="space-y-1 text-sm" style={{ color: 'var(--slate-300)' }}>
                    <li className="flex gap-2"><span>↑</span><span><strong>High slow waves</strong> (Delta & Theta)</span></li>
                    <li className="flex gap-2"><span>↓</span><span><strong>Low fast waves</strong> (Beta & Gamma)</span></li>
                    <li className="flex gap-2"><span>✗</span><span><strong>Imbalanced Alpha</strong> — mentally drifting</span></li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl p-3 mt-3" style={{ backgroundColor: 'var(--slate-800)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-300)' }}>
                  <strong className="text-white">Our AI is trained on thousands of brainwave patterns</strong> and can instantly recognize this "fatigue fingerprint." By measuring all 5 wave types across 4 brain areas, we detect fatigue with high accuracy — even before you realize it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
