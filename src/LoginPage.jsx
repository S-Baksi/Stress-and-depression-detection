import { useState } from 'react';
import { Lock, Mail, Users, ArrowRight, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import employeeData from './json/employeeHealth.json';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Check manager credentials
      if (email === 'manager@company.com' && password === 'manager123') {
        localStorage.setItem('user', JSON.stringify({ email, role: 'manager', isAuthenticated: true }));
        window.location.href = 'http://127.0.0.1:9023';
        return;
      }

      // Check employee credentials from JSON
      const emp = employeeData.find((e) => e.email === email && e.password === password);
      if (emp) {
        localStorage.setItem('user', JSON.stringify({
          email: emp.email,
          role: 'employee',
          isAuthenticated: true,
          employeeId: emp.empId,
          empName: emp.empName,
        }));
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      {/* Left Side - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Brain size={40} />
            </div>
            <h1>Cognivue</h1>
            <p className="tagline">AI Fatigue & Stress Detection</p>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h3>EEG Brainwave Analysis</h3>
                <p>Deep analysis across 5 frequency bands</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h3>Real-Time Monitoring</h3>
                <p>Live fatigue detection via webcam</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h3>Stress Prediction</h3>
                <p>ML-powered risk assessment</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h3>Employee Health Dashboard</h3>
                <p>Comprehensive health monitoring</p>
              </div>
            </div>
          </div>

          <div className="branding-footer">
            <p>Trusted by professionals in research, healthcare, and transportation</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={18} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">
                <Lock size={18} />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials</p>
            <div className="credentials-grid">
              <div className="credential-card">
                <p className="credential-role">Employee (sample)</p>
                <p className="credential-detail">debdip.bhattacharya@company.com</p>
                <p className="credential-detail">Debdip@123</p>
              </div>
              <div className="credential-card">
                <p className="credential-role">Manager</p>
                <p className="credential-detail">manager@company.com</p>
                <p className="credential-detail">manager123</p>
              </div>
            </div>
          </div>

          <div className="login-footer">
            <p>© 2025 Cognivue. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
