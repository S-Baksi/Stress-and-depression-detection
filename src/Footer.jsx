import React from 'react'

const Footer = () => {
    return (
        <div className="py-8" style={{ backgroundColor: 'var(--primary-darker)', borderTop: '2px solid var(--primary-dark)' }}>
          <div className="px-8 text-center">
            <p className="text-sm" style={{ color: 'var(--primary-lighter)' }}>
              &copy; 2026 Fatigue Detection System. Advanced brainwave analysis for better health monitoring.
            </p>
          </div>
        </div>
    )
}

export default Footer
