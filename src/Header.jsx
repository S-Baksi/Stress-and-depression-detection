import { ArrowLeft, Brain } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
    const location = useLocation();
    const path = location.pathname;

    return (
      <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-50">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <Brain className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Cognivue</h1>
              <p className="text-xs text-gray-500">AI Powered Fatigue Detection System</p>
            </div>
          </div>
          {path !== '/' && (
            <Link 
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
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
