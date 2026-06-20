import { Brain, LogOut, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header-main">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="header-logo" onClick={closeMobileMenu}>
            <div className="logo-icon">
              <Brain className="text-white" size={18} />
            </div>
            <div className="logo-text">
              <h1>Cognivue</h1>
              <p>AI Fatigue & Stress Detection</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              EEG Home
            </NavLink>
            <NavLink to="/analysis" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              EEG Analysis
            </NavLink>
            <NavLink to="/stress-prediction" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Stress Prediction
            </NavLink>
            <NavLink to="/driver-monitoring" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Driver Monitoring
            </NavLink>
            <NavLink to="/driver-analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Driver Analytics
            </NavLink>
            <NavLink to="/keystroke-fatigue" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Keystroke Analysis
            </NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="desktop-actions">
            {user && (
              <div className="user-email">
                <span>{user.email}</span>
              </div>
            )}
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-links">
              <NavLink to="/" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={closeMobileMenu}>
                EEG Home
              </NavLink>
              <NavLink to="/analysis" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={closeMobileMenu}>
                EEG Analysis
              </NavLink>
              <NavLink to="/stress-prediction" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={closeMobileMenu}>
                Stress Prediction
              </NavLink>
              <NavLink to="/driver-monitoring" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={closeMobileMenu}>
                Driver Monitoring
              </NavLink>
              <NavLink to="/driver-analytics" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={closeMobileMenu}>
                Driver Analytics
              </NavLink>
              <NavLink to="/keystroke-fatigue" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={closeMobileMenu}>
                Keystroke Analysis
              </NavLink>
            </div>

            <div className="mobile-user">
              {user && (
                <div className="mobile-user-info">
                  <span className="user-email-mobile">{user.email}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              )}
              <button onClick={handleLogout} className="mobile-logout">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <style jsx>{`
        .header-main {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid var(--border-default);
          backdrop-filter: blur(10px);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 3rem;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--indigo-600);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text h1 {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-heading);
          margin: 0;
          line-height: 1;
        }

        .logo-text p {
          font-size: 0.6875rem;
          color: var(--text-muted);
          margin: 2px 0 0 0;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          font-size: 0.875rem;
          color: var(--text-body);
          text-decoration: none;
          transition: color 0.3s;
          font-weight: 500;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--indigo-600);
          font-weight: 600;
        }

        .desktop-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-email {
          padding: 0.5rem 0.875rem;
          background: var(--bg-muted);
          border-radius: 6px;
        }

        .user-email span {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--text-body);
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .mobile-hamburger {
          display: none;
        }

        .mobile-menu {
          display: none;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .header-content {
            padding: 0.75rem 1rem;
          }

          .logo-text p {
            display: none;
          }

          .desktop-nav,
          .desktop-actions {
            display: none;
          }

          .mobile-hamburger {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
            background: transparent;
            border: none;
            color: var(--text-heading);
            cursor: pointer;
          }

          .mobile-menu {
            display: block;
            background: white;
            border-top: 1px solid var(--border-default);
            animation: slideDown 0.3s ease-out;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .mobile-links {
            padding: 1rem;
          }

          .mobile-link {
            display: block;
            padding: 0.875rem 1rem;
            color: var(--text-body);
            text-decoration: none;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            font-size: 0.9375rem;
            font-weight: 500;
            transition: all 0.3s;
          }

          .mobile-link:hover,
          .mobile-link.active {
            background: var(--indigo-50);
            color: var(--indigo-600);
          }

          .mobile-user {
            padding: 1rem;
            border-top: 1px solid var(--border-default);
            background: var(--bg-muted);
          }

          .mobile-user-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            margin-bottom: 0.875rem;
            padding: 0.75rem;
            background: white;
            border-radius: 8px;
          }

          .user-email-mobile {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-heading);
          }

          .user-role {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: capitalize;
          }

          .mobile-logout {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.875rem;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.9375rem;
            font-weight: 600;
            cursor: pointer;
          }
        }

        @media (max-width: 480px) {
          .logo-icon {
            width: 32px;
            height: 32px;
          }

          .logo-text h1 {
            font-size: 1rem;
          }

          .mobile-link {
            padding: 0.75rem 0.875rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  )
}

export default Header
