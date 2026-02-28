import { ArrowLeft, Brain } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
    const location = useLocation();
    const path = location.pathname;

    return (
      <header style={{ backgroundColor: 'var(--bg-white)', borderBottom: '2px solid var(--border-primary-light)' }} className="sticky top-0 z-50">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <Brain style={{ color: 'var(--text-white)' }} size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>Cognivue</h1>
              <p className="text-xs" style={{ color: 'var(--text-gray)' }}>AI Powered Fatigue Detection System</p>
            </div>
          </div>
          {path !== '/' && (
            <Link 
              to="/"
              className="flex items-center gap-2 px-4 py-2 font-medium transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary-dark)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          )}
        </div>
      </header>
    )
}

export default Header
