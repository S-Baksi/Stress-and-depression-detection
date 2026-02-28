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
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg-gray)' }}>
      {/* Header */}
        <Header />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
              <div className="space-y-4">
                {/* Badge */}
                <div className="badge-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold">
                  <Zap size={16} style={{ color: 'var(--text-primary)' }} />
                  <span>AI-Powered EEG Analysis</span>
                </div>
                
                {/* Main Heading */}
                <h1 className="text-5xl md:text-6xl font-bold leading-tight" style={{ color: 'var(--text-dark)' }}>
                  Advanced Fatigue Detection
                  <span className="block text-4xl md:text-5xl mt-2" style={{ color: 'var(--text-primary)' }}>
                    {' '}with AI-Powered EEG Analysis
                  </span>
                </h1>
                
                {/* Description */}
                <p className="text-xl leading-relaxed max-w-xl" style={{ color: 'var(--text-gray)' }}>
                  Harness the power of machine learning to analyze EEG brainwave patterns across
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{' '}4 channels</span>
                  {' '}and
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{' '}5 frequency bands</span>
                  {' '}for precise, real-time fatigue assessment.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/analysis"
                    className="btn-primary inline-flex items-center justify-center gap-3"
                  >
                    <Upload size={20} />
                    Start Analysis
                    <ArrowRight size={18} />
                  </Link>
                  <a 
                    href="#how-it-works"
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    Learn More
                    <TrendingUp size={18} />
                  </a>
                </div>
                
                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>4</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-gray)' }}>EEG Channels</div>
                  </div>
                  <div className="text-center" style={{ borderLeft: '2px solid var(--border-primary-light)', borderRight: '2px solid var(--border-primary-light)' }}>
                    <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>5</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-gray)' }}>Wave Bands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>95%+</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-gray)' }}>Accuracy</div>
                  </div>
                </div>
              </div>
              
              {/* Hero Image */}
              <div className="flex justify-center">
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src={sentimentAnalysisImg} 
                    alt="Advanced EEG Analysis" 
                    className="w-full max-w-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <div id="how-it-works" className="mb-8 mt-10 -mx-8 px-8 py-8 scroll-mt-20" style={{ backgroundColor: 'var(--bg-primary-lighter)', borderTop: '2px solid var(--border-primary-light)', borderBottom: '2px solid var(--border-primary-light)' }}>
          <h3 className="section-header">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-6 px-8">
            {[
              {
                icon: Upload,
                title: "1. Upload Data",
                description: "Provide a CSV file containing EEG measurements across multiple channels (TP9, AF7, AF8, TP10)"
              },
              {
                icon: Brain,
                title: "2. AI Processing",
                description: "Machine learning algorithms analyze brainwave patterns to identify fatigue indicators"
              },
              {
                icon: BarChart3,
                title: "3. Visualization",
                description: "View detailed graphs showing power levels across all frequency bands and channels"
              },
              {
                icon: TrendingUp,
                title: "4. Results",
                description: "Receive accurate fatigue classification with confidence scores and statistical analysis"
              }
            ].map((step) => (
              <div key={step.title} className="relative">
                <div className="card-primary h-full">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--bg-primary-light)', border: '2px solid var(--border-primary)' }}>
                    <step.icon size={24} style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <h4 className="text-base font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>{step.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-gray)' }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-10 mb-8 overflow-hidden">
          <div className="text-center mb-6">
            <h3 className="section-header">
              Trusted by Professionals
            </h3>
            <p className="section-description">See what experts say about our free, tested fatigue detection platform</p>
          </div>

          {/* Continuous Scrolling Carousel */}
          <div className="relative">
            <div className="flex gap-6 animate-scroll">
              {/* Duplicate testimonials for seamless loop */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="card-primary shrink-0 w-80 p-5"
                >
                  <Quote className="mb-2" size={20} style={{ color: 'var(--primary-lighter)' }} />
                  
                  <p className="text-sm leading-relaxed mb-4 line-clamp-4" style={{ color: 'var(--text-gray)' }}>
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <svg key={`star-${index}-${i}`} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--primary-medium)' }}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <div className="pt-3" style={{ borderTop: '1px solid var(--border-primary-light)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-dark)' }}>
                      {testimonial.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-gray)' }}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Free & Tested Badge */}
          <div className="flex justify-center gap-4 mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--bg-primary-light)', color: 'var(--text-primary-dark)', border: '2px solid var(--border-primary)' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Free to Use
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--bg-primary-light)', color: 'var(--text-primary-dark)', border: '2px solid var(--border-primary)' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Clinically Tested
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="-mx-8 p-8" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '2px solid var(--primary-dark)', borderBottom: '2px solid var(--primary-dark)' }}>
          <h3 className="text-3xl font-semibold text-center mb-6" style={{ color: 'var(--text-white)' }}>Key Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: "Brainwave Analysis",
                description: "Comprehensive analysis of Alpha, Beta, Gamma, and Delta wave patterns"
              },
              {
                icon: Clock,
                title: "Real-time Processing",
                description: "Instant results with our optimized Python backend processing pipeline"
              },
              {
                icon: FileText,
                title: "Visual Reports",
                description: "Interactive graphs and charts to understand your fatigue patterns"
              },
              {
                icon: Target,
                title: "Probability Score",
                description: "Accurate fatigue level prediction with confidence probability metrics"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your data is processed securely and never shared with third parties"
              },
              {
                icon: Mouse,
                title: "Easy to Use",
                description: "Simple CSV upload interface - no technical knowledge required"
              }
            ].map((feature) => (
              <div key={feature.title} className="card-feature">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--primary-darker)' }}>
                  <feature.icon size={24} style={{ color: 'var(--primary-lighter)' }} />
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm" style={{ color: 'var(--primary-lighter)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="px-8 py-10">
        {/* AI Technology Section */}
        <div className="mb-10">
          <h3 className="section-header">
            AI-Powered Fatigue Detection Technology
          </h3>
          <p className="section-description">
            Understanding how our advanced machine learning system analyzes brain activity patterns
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 items-start mb-6">
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-primary-light)', border: '2px solid var(--border-primary)' }}>
              <h4 className="text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
                <Brain style={{ color: 'var(--text-primary)' }} size={24} />
                How Our AI Detection Works
              </h4>
              <div className="space-y-3" style={{ color: 'var(--text-gray)' }}>
                <p className="leading-relaxed">
                  Our system employs advanced <strong>machine learning algorithms</strong> trained on extensive EEG datasets 
                  to identify fatigue patterns with high accuracy. The process involves:
                </p>
                <ol className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="font-bold shrink-0" style={{ color: 'var(--text-primary)' }}>1.</span>
                    <span><strong>Multi-Channel Data Collection:</strong> We analyze EEG signals from 4 strategically placed 
                    electrodes (TP9, AF7, AF8, TP10) covering frontal and temporal brain regions.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold shrink-0" style={{ color: 'var(--text-primary)' }}>2.</span>
                    <span><strong>Frequency Band Extraction:</strong> The raw signals are decomposed into five key frequency 
                    bands (Delta, Theta, Alpha, Beta, Gamma) using signal processing techniques.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold shrink-0" style={{ color: 'var(--text-primary)' }}>3.</span>
                    <span><strong>Pattern Recognition:</strong> Our trained ML model identifies characteristic patterns 
                    associated with different fatigue states by analyzing power distributions across frequencies.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold shrink-0" style={{ color: 'var(--text-primary)' }}>4.</span>
                    <span><strong>Fatigue Classification:</strong> The system calculates a fatigue probability score and 
                    classifies your state as "High" or "Low" fatigue with confidence metrics.</span>
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src={aiResponseImg} 
                alt="AI Technology Illustration" 
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Brainwave Understanding Section */}
        <div>
          <h3 className="section-header">
            What Are Brainwaves? A Simple Guide
          </h3>
          <p className="section-description">
            Your brain is constantly producing electrical signals, like radio waves. These "brainwaves" change based on what you're doing and how you're feeling.
          </p>
          
          {/* Introduction Card */}
          <div className="max-w-4xl mx-auto mb-6 rounded-xl p-5" style={{ backgroundColor: 'var(--bg-primary-light)', border: '2px solid var(--border-primary)' }}>
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
              <Brain style={{ color: 'var(--text-primary)' }} size={24} />
              How This Website Detects Your Fatigue Level
            </h4>
            <div className="space-y-3 text-base leading-relaxed" style={{ color: 'var(--text-gray)' }}>
              <p>
                Think of your brain like a busy radio station broadcasting different frequencies throughout the day.
                When you're alert and focused, it broadcasts stronger "fast" frequencies. When you're tired or sleepy,
                it switches to slower frequencies.
              </p>
              <p>
                Our website reads these brain frequencies from your EEG data and compares them to patterns we've learned
                from thousands of people. Just like recognizing a song from its rhythm, we can identify if you're 
                experiencing fatigue by looking at your unique brainwave pattern.
              </p>
              <p className="font-semibold" style={{ color: 'var(--text-primary-dark)' }}>
                Below, we'll explain the 5 types of brainwaves and what they mean for your energy levels:
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Delta Waves */}
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-primary-lighter)', border: '2px solid var(--border-primary-light)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary-light)', border: '2px solid var(--border-primary)' }}>
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>δ</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>Delta Waves - "Deep Sleep Signals"</h4>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>The Slowest Waves (0.5-4 cycles/second)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>🛏️ When you normally have these:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>During deep sleep when your body is repairing and recovering</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>⚠️ What it means for fatigue:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>
                    If these waves appear while you're awake, it's like your brain is saying "I need sleep NOW!"
                    High delta waves during the day mean you're extremely tired and your body is trying to shut down.
                  </p>
                </div>
                <p className="text-xs italic" style={{ color: 'var(--text-light)' }}>Example: Ever felt so tired you could fall asleep standing up? That's delta waves appearing when they shouldn't.</p>
              </div>
            </div>

            {/* Theta Waves */}
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-primary-lighter)', border: '2px solid var(--border-primary-light)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary-light)', border: '2px solid var(--border-primary)' }}>
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}> θ</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>Theta Waves - "Drowsiness Zone"</h4>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>Slow Waves (4-8 cycles/second)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>🌙 When you normally have these:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>When you're daydreaming, in light sleep, or that drowsy feeling before falling asleep</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>⚠️ What it means for fatigue:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>
                    When these waves show up during tasks that need attention (like driving or working), it means
                    you're having trouble staying focused. Your brain is starting to "zone out" from tiredness.
                  </p>
                </div>
                <p className="text-xs italic" style={{ color: 'var(--text-light)' }}>Example: Reading the same sentence 3 times and not remembering it? That's theta waves interfering with your focus.</p>
              </div>
            </div>

            {/* Alpha Waves */}
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-primary-lighter)', border: '2px solid var(--border-primary-light)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary-light)', border: '2px solid var(--border-primary)' }}>
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>α</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>Alpha Waves - "Relaxed & Calm"</h4>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>Medium Waves (8-13 cycles/second)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>🧘 When you normally have these:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>When you're relaxed but awake - taking a break, resting with eyes closed, or feeling calm</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>⚠️ What it means for fatigue:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>
                    The right amount is good! But too little means you're stressed, and too much during work means
                    you're mentally "checked out" from being tired. It's like your brain putting itself on pause mode.
                  </p>
                </div>
                <p className="text-xs italic" style={{ color: 'var(--text-light)' }}>Example: Staring at your computer but not really working? That's excessive alpha waves - your tired brain trying to rest.</p>
              </div>
            </div>

            {/* Beta Waves */}
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-primary-lighter)', border: '2px solid var(--border-primary-light)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary-light)', border: '2px solid var(--border-primary)' }}>
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>β</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>Beta Waves - "Active & Focused"</h4>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>Fast Waves (13-30 cycles/second)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>💡 When you normally have these:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>When you're actively working, thinking, solving problems, or having a conversation</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>⚠️ What it means for fatigue:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>
                    Low beta waves = low energy. When you're fatigued, your brain can't produce enough of these
                    "active" waves. It's like trying to run a race when you're exhausted - you just can't keep up the pace.
                  </p>
                </div>
                <p className="text-xs italic" style={{ color: 'var(--text-light)' }}>Example: Struggling to concentrate on a simple task that's normally easy? Your beta waves are too low from fatigue.</p>
              </div>
            </div>

            {/* Gamma Waves */}
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-primary-lighter)', border: '2px solid var(--border-primary-light)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary-light)', border: '2px solid var(--border-primary)' }}>
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>γ</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>Gamma Waves - "Peak Performance"</h4>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>Very Fast Waves (30-100 cycles/second)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>🚀 When you normally have these:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>When you're at your best - learning quickly, making connections, or in the "flow" state</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-primary-light)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary-dark)' }}>⚠️ What it means for fatigue:</p>
                  <p className="text-sm" style={{ color: 'var(--text-gray)' }}>
                    Low gamma = brain fog. When you're tired, these peak performance waves drop. You'll notice you
                    can't think as clearly, remember as well, or solve complex problems like you normally can.
                  </p>
                </div>
                <p className="text-xs italic" style={{ color: 'var(--text-light)' }}>Example: Forgetting what you were just thinking about, or taking forever to solve a puzzle? Low gamma waves from fatigue.</p>
              </div>
            </div>

            {/* Key Insight */}
            <div className="rounded-xl p-5 md:col-span-2" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-white)', border: '2px solid var(--primary-dark)' }}>
              <h4 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <TrendingUp size={24} />
                Putting It All Together: How We Detect Fatigue
              </h4>
              
              <div className="space-y-4">
                <p className="text-base leading-relaxed">
                  Here's the simple secret: Your brain produces a mix of ALL these waves at once, but the proportions change based on how tired you are.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--primary-lighter)', border: '2px solid var(--primary-light)' }}>
                    <h5 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary-dark)' }}>
                      <span className="text-2xl">😊</span> When You're Alert & Energized
                    </h5>
                    <ul className="space-y-2" style={{ color: 'var(--text-primary-dark)' }}>
                      <li className="flex gap-2 items-start">
                        <span className="shrink-0">↓</span>
                        <span className="text-sm"><strong>Low slow waves</strong> (Delta & Theta) - your brain isn't trying to sleep</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="shrink-0">↑</span>
                        <span className="text-sm"><strong>High fast waves</strong> (Beta & Gamma) - you're sharp and focused</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="shrink-0">✓</span>
                        <span className="text-sm"><strong>Balanced Alpha</strong> - relaxed but attentive</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--primary-darker)', border: '2px solid var(--primary-dark)' }}>
                    <h5 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: 'var(--primary-lightest)' }}>
                      <span className="text-2xl">😴</span> When You're Tired & Fatigued
                    </h5>
                    <ul className="space-y-2" style={{ color: 'var(--primary-lightest)' }}>
                      <li className="flex gap-2 items-start">
                        <span className="shrink-0">↑</span>
                        <span className="text-sm"><strong>High slow waves</strong> (Delta & Theta) - brain wants to shut down</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="shrink-0">↓</span>
                        <span className="text-sm"><strong>Low fast waves</strong> (Beta & Gamma) - can't stay focused</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="shrink-0">✗</span>
                        <span className="text-sm"><strong>Imbalanced Alpha</strong> - mentally drifting off</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--primary-dark)' }}>
                  <p className="text-base leading-relaxed">
                    <strong style={{ color: 'var(--primary-lightest)' }}>Our AI has been trained on thousands of brainwave patterns</strong> and can instantly
                    recognize this "fatigue fingerprint." By measuring all 5 wave types across 4 areas of your brain,
                    we can tell with high accuracy whether you're fighting fatigue - even before you might fully realize it yourself!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default HomePage;
