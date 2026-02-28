import { Brain, BarChart3, TrendingUp, ArrowRight, Zap, Upload, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import sentimentAnalysisImg from "./assets/sentimentAnalysis.svg";
import aiResponseImg from "./assets/ai-response.svg";

function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex flex-col overflow-x-hidden">
      {/* Header */}
        <Header />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium mb-6">
              <Zap size={16} />
              AI-Powered Analysis
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Advanced Fatigue Detection
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Analyze EEG brainwave data with machine learning to accurately assess fatigue levels. 
              Our system processes alpha, beta, gamma, delta, and theta wave patterns for comprehensive insights.
            </p>
            <Link 
              to="/analysis"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all transform hover:scale-105"
            >
              <Upload size={20} />
              Begin Analysis
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="flex justify-center">
            <img 
              src={sentimentAnalysisImg} 
              alt="Data Analysis Illustration" 
              className="w-full max-w-md"
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 mt-20 bg-slate-50 -mx-8 px-8 py-16 border-y-2 border-slate-200">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Upload,
                title: "1. Upload Data",
                description: "Provide a CSV file containing EEG measurements across multiple channels (TP9, AF7, AF8, TP10)",
                color: "bg-blue-50 text-blue-600 border-blue-200"
              },
              {
                icon: Brain,
                title: "2. AI Processing",
                description: "Machine learning algorithms analyze brainwave patterns to identify fatigue indicators",
                color: "bg-slate-50 text-slate-600 border-slate-200"
              },
              {
                icon: BarChart3,
                title: "3. Visualization",
                description: "View detailed graphs showing power levels across all frequency bands and channels",
                color: "bg-emerald-50 text-emerald-600 border-emerald-200"
              },
              {
                icon: TrendingUp,
                title: "4. Results",
                description: "Receive accurate fatigue classification with confidence scores and statistical analysis",
                color: "bg-amber-50 text-amber-600 border-amber-200"
              }
            ].map((step) => (
              <div key={step.title} className="relative">
                <div className="bg-white rounded-xl p-8 border-2 border-slate-200 hover:border-slate-400 transition-all h-full">
                  <div className={`h-12 w-12 rounded-lg ${step.color} border flex items-center justify-center mb-4`}>
                    <step.icon size={24} />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Trusted by Professionals
            </h3>
            <p className="text-gray-600">See what experts say about our free, tested fatigue detection platform</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-linear-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200 p-8 md:p-12">
              <Quote className="text-slate-300 mb-4" size={40} />
              
              <div className="mb-6">
                <p className="text-gray-700 text-lg leading-relaxed italic mb-6">
                  "{testimonials[currentTestimonial].content}"
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  {Array.from({ length: testimonials[currentTestimonial].rating }, (_, i) => (
                    <svg key={`star-${currentTestimonial}-${i}`} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <div>
                  <p className="text-gray-900 font-semibold text-base">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="text-gray-600" size={20} />
                </button>

                <div className="flex gap-2">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={`dot-${testimonial.name}-${index}`}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentTestimonial
                          ? "w-8 bg-slate-800"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="text-gray-600" size={20} />
                </button>
              </div>
            </div>

            {/* Free & Tested Badge */}
            <div className="flex justify-center gap-4 mt-8">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium border border-green-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Free to Use
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Clinically Tested
              </div>
            </div>
          </div>
        </div>
        </section>

        {/* Features */}
        <div className="bg-slate-800 p-12 md:p-16 text-white -mx-8 border-y-2 border-slate-900">
          <h3 className="text-3xl font-semibold text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Brainwave Analysis",
                description: "Comprehensive analysis of Alpha, Beta, Gamma, and Delta wave patterns"
              },
              {
                title: "Real-time Processing",
                description: "Instant results with our optimized Python backend processing pipeline"
              },
              {
                title: "Visual Reports",
                description: "Interactive graphs and charts to understand your fatigue patterns"
              },
              {
                title: "Probability Score",
                description: "Accurate fatigue level prediction with confidence probability metrics"
              },
              {
                title: "Secure & Private",
                description: "Your data is processed securely and never shared with third parties"
              },
              {
                title: "Easy to Use",
                description: "Simple CSV upload interface - no technical knowledge required"
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-slate-700 rounded-xl p-8 border-2 border-slate-600 hover:border-slate-500 transition-all">
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-slate-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="px-8 py-20">
        {/* AI Technology Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
            AI-Powered Fatigue Detection Technology
          </h3>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Understanding how our advanced machine learning system analyzes brain activity patterns
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
            <div className="bg-linear-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="text-blue-600" size={24} />
                How Our AI Detection Works
              </h4>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Our system employs advanced <strong>machine learning algorithms</strong> trained on extensive EEG datasets 
                  to identify fatigue patterns with high accuracy. The process involves:
                </p>
                <ol className="space-y-3 ml-4">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 shrink-0">1.</span>
                    <span><strong>Multi-Channel Data Collection:</strong> We analyze EEG signals from 4 strategically placed 
                    electrodes (TP9, AF7, AF8, TP10) covering frontal and temporal brain regions.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 shrink-0">2.</span>
                    <span><strong>Frequency Band Extraction:</strong> The raw signals are decomposed into five key frequency 
                    bands (Delta, Theta, Alpha, Beta, Gamma) using signal processing techniques.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 shrink-0">3.</span>
                    <span><strong>Pattern Recognition:</strong> Our trained ML model identifies characteristic patterns 
                    associated with different fatigue states by analyzing power distributions across frequencies.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 shrink-0">4.</span>
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
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Understanding Brainwaves & Their Impact on Fatigue
          </h3>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Learn how different brain frequencies reveal your mental state and fatigue levels
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Delta Waves */}
            <div className="bg-linear-to-br from-cyan-50 to-white rounded-xl border-2 border-cyan-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-100 border-2 border-cyan-300 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cyan-700">δ</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Delta Waves</h4>
                  <p className="text-sm text-gray-600">0.5 - 4 Hz</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>What they are:</strong> The slowest brainwaves, dominant during deep, dreamless sleep 
                and unconscious states. Essential for physical restoration and healing.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Impact on Fatigue:</strong> <span className="text-cyan-700 font-semibold">Increased delta activity 
                during wakefulness indicates severe mental exhaustion</span> and the brain's need for rest. High delta 
                levels while awake strongly correlate with fatigue, drowsiness, and reduced alertness.
              </p>
            </div>

            {/* Theta Waves */}
            <div className="bg-linear-to-br from-amber-50 to-white rounded-xl border-2 border-amber-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                  <span className="text-2xl font-bold text-amber-700">θ</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Theta Waves</h4>
                  <p className="text-sm text-gray-600">4 - 8 Hz</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>What they are:</strong> Associated with light sleep, deep meditation, and the twilight state 
                between wakefulness and sleep. Connected to creativity and subconscious processing.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Impact on Fatigue:</strong> <span className="text-amber-700 font-semibold">Elevated theta during 
                tasks requiring attention signals mental fatigue</span> and difficulty maintaining focus. The theta/beta 
                ratio is a key indicator of drowsiness and reduced cognitive performance.
              </p>
            </div>

            {/* Alpha Waves */}
            <div className="bg-linear-to-br from-emerald-50 to-white rounded-xl border-2 border-emerald-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-700">α</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Alpha Waves</h4>
                  <p className="text-sm text-gray-600">8 - 13 Hz</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>What they are:</strong> Present during relaxed wakefulness with closed eyes, calm mental states, 
                and light meditation. Bridge between conscious and subconscious mind.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Impact on Fatigue:</strong> <span className="text-emerald-700 font-semibold">Low alpha power 
                indicates stress and anxiety</span>, while excessive alpha during tasks suggests mental disengagement 
                and fatigue. Balanced alpha reflects optimal relaxed alertness and recovery states.
              </p>
            </div>

            {/* Beta Waves */}
            <div className="bg-linear-to-br from-rose-50 to-white rounded-xl border-2 border-rose-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-rose-100 border-2 border-rose-300 flex items-center justify-center">
                  <span className="text-2xl font-bold text-rose-700">β</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Beta Waves</h4>
                  <p className="text-sm text-gray-600">13 - 30 Hz</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>What they are:</strong> Dominant during active thinking, problem-solving, and focused mental 
                activity. Associated with normal waking consciousness and active concentration.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Impact on Fatigue:</strong> <span className="text-rose-700 font-semibold">Reduced beta activity 
                correlates with decreased alertness</span> and cognitive fatigue. When fatigued, the brain struggles to 
                maintain beta rhythms needed for sustained attention and mental performance.
              </p>
            </div>

            {/* Gamma Waves */}
            <div className="bg-linear-to-br from-violet-50 to-white rounded-xl border-2 border-violet-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-violet-100 border-2 border-violet-300 flex items-center justify-center">
                  <span className="text-2xl font-bold text-violet-700">γ</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Gamma Waves</h4>
                  <p className="text-sm text-gray-600">30 - 100 Hz</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>What they are:</strong> The fastest brainwaves, associated with peak cognitive functioning, 
                information processing, and higher-order brain functions like perception and consciousness.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Impact on Fatigue:</strong> <span className="text-violet-700 font-semibold">Diminished gamma 
                activity indicates impaired cognitive integration</span> and processing speed. Fatigue disrupts gamma 
                synchronization, affecting memory consolidation and complex problem-solving abilities.
              </p>
            </div>

            {/* Key Insight */}
            <div className="bg-linear-to-br from-slate-50 to-white rounded-xl border-2 border-slate-300 p-8 md:col-span-2">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="text-slate-700" size={24} />
                The Fatigue Detection Formula
              </h4>
              <p className="text-gray-700 leading-relaxed mb-3">
                Our AI system analyzes the{' '}
                <strong>ratio between slow waves (Delta/Theta) and fast waves (Alpha/Beta/Gamma)</strong>
                {' '}across all four electrode channels. When you&apos;re alert and well-rested:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 mb-3">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Low delta and theta power (minimal sleepiness signals)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Higher beta and gamma activity (active, focused state)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Balanced alpha waves (relaxed but attentive)</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>During fatigue</strong>, this pattern inverts: slow waves increase while fast waves decrease, creating 
                a distinctive signature that our machine learning model recognizes with high accuracy.
              </p>
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
