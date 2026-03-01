import { ArrowLeft, Brain } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderColor: 'var(--border-default)'
    }}>
      <div className="px-8 md:px-12 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--indigo-600)' }}>
            <Brain className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-heading)' }}>Cognivue</h1>
            <p className="text-[11px] leading-none" style={{ color: 'var(--text-muted)' }}>AI Fatigue Detection</p>
          </div>
        </Link>

        {!isHome && (
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-body)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--indigo-600)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-body)'}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
