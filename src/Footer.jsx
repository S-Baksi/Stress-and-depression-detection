import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t" style={{ backgroundColor: 'var(--slate-900)', borderColor: 'var(--slate-800)' }}>
      <div className="max-w-6xl mx-auto px-6 py-6 text-center">
        <p className="text-sm" style={{ color: 'var(--slate-400)' }}>
          &copy; {new Date().getFullYear()} Cognivue. Advanced brainwave analysis for better health monitoring.
        </p>
      </div>
    </footer>
  )
}

export default Footer
