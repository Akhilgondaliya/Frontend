import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { ThemeContext } from '../context/ThemeContext'

export const RiskMeter = ({ score = 0, borderless = false }) => {
  const [displayScore, setDisplayScore] = useState(0)
  const { theme } = useContext(ThemeContext)
  const isDark = theme === 'dark'

  // Count-up animation effect
  useEffect(() => {
    setDisplayScore(0)
    if (score === 0) return

    const duration = 800 // Total ms
    const increment = Math.ceil(score / (duration / 16)) // ~60fps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(current)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [score])

  // Circular gauge calculations
  const size = 150
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  // Color mapping based on score: dynamic green for safe status
  let strokeColor = isDark ? '#00ff88' : '#16a34a' // Safe
  let textThemeClass = 'text-safe'
  let labelText = 'Safe'

  if (score >= 70) {
    strokeColor = '#ff4444' // Phishing
    textThemeClass = 'text-phishing'
    labelText = 'High Phishing Threat'
  } else if (score >= 40) {
    strokeColor = '#ffcc00' // Suspicious
    textThemeClass = 'text-suspicious'
    labelText = 'Suspicious Indicators'
  } else {
    labelText = 'Low Risk / Safe'
  }

  return (
    <div className={borderless
      ? "flex flex-col items-center justify-center w-full max-w-[260px] mx-auto"
      : "flex flex-col items-center justify-center p-6 bg-card border border-muted/20 rounded-3xl shadow-md w-full max-w-[260px] mx-auto"
    }>
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* SVG Circle Gauge */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Base track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(26, 45, 64, 0.4)"
            strokeWidth={strokeWidth}
          />
          {/* Active progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Score Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold tracking-tight ${textThemeClass}`}>
            {displayScore}
          </span>
          <span className="text-[10px] uppercase font-bold text-muted tracking-wider">
            Risk Score
          </span>
        </div>

      </div>

      <div className="mt-4 text-center">
        <h4 className={`text-sm font-extrabold uppercase tracking-wide ${textThemeClass}`}>
          {labelText}
        </h4>
        <p className="text-xs text-muted mt-1">Capped at 100 maximum risk rating</p>
      </div>
    </div>
  )
}
export default RiskMeter
