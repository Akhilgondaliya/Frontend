import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { ThemeContext } from '../context/ThemeContext'
import { FiAlertOctagon, FiShield, FiAlertTriangle } from 'react-icons/fi'

export const AnimatedRiskMeter = ({ score = 0, confidence = 95, borderless = false }) => {
  const [displayScore, setDisplayScore] = useState(0)
  const [displayConfidence, setDisplayConfidence] = useState(0)
  const { theme } = useContext(ThemeContext)
  const isDark = theme === 'dark'

  useEffect(() => {
    setDisplayScore(0)
    setDisplayConfidence(0)

    const duration = 800
    const scoreInc = Math.ceil(score / (duration / 16)) || 1
    const confInc = Math.ceil(confidence / (duration / 16)) || 1
    
    let currentScore = 0
    let currentConf = 0

    const timer = setInterval(() => {
      let done = true
      
      if (currentScore < score) {
        currentScore += scoreInc
        if (currentScore >= score) currentScore = score
        setDisplayScore(currentScore)
        done = false
      }
      
      if (currentConf < confidence) {
        currentConf += confInc
        if (currentConf >= confidence) currentConf = confidence
        setDisplayConfidence(currentConf)
        done = false
      }

      if (done) {
        clearInterval(timer)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [score, confidence])

  const size = 160
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  let strokeColor = isDark ? '#00ff88' : '#16a34a'
  let textClass = 'text-safe'
  let labelText = 'Safe'
  let threatIcon = <FiShield className="w-5 h-5 text-safe" />
  let bgClass = 'bg-safe/5 border-safe/25'

  if (score >= 70) {
    strokeColor = '#ff4444'
    textClass = 'text-phishing'
    labelText = 'Danger / Phishing'
    threatIcon = <FiAlertOctagon className="w-5 h-5 text-phishing" />
    bgClass = 'bg-phishing/5 border-phishing/25'
  } else if (score >= 40) {
    strokeColor = '#ffcc00'
    textClass = 'text-suspicious'
    labelText = 'Suspicious Indicators'
    threatIcon = <FiAlertTriangle className="w-5 h-5 text-suspicious" />
    bgClass = 'bg-suspicious/5 border-suspicious/25'
  }

  return (
    <div className={borderless
      ? "flex flex-col md:flex-row items-center gap-6 justify-center w-full"
      : "flex flex-col md:flex-row items-center gap-6 justify-center p-6 bg-card border border-muted/20 dark:border-accent/10 rounded-3xl shadow-md w-full"
    }>
      {/* Circular Gauge */}
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(26, 45, 64, 0.4)"
            strokeWidth={strokeWidth}
          />
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

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black tracking-tight ${textClass}`}>
            {displayScore}
          </span>
          <span className="text-[10px] uppercase font-bold text-muted tracking-wider">
            Risk Rating
          </span>
        </div>
      </div>

      {/* Diagnostics details */}
      <div className="space-y-4 flex-1 text-left">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Threat Level</span>
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border mt-1 w-fit ${bgClass}`}>
            {threatIcon}
            <span className={`font-extrabold text-xs uppercase tracking-wider ${textClass}`}>{labelText}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Confidence Score</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-[#0d1b2a] dark:text-white">{displayConfidence}%</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">System Verdict</span>
            <div className="mt-1">
              <span className={`text-sm font-extrabold tracking-wide uppercase ${textClass}`}>{labelText.split(' ')[0]}</span>
            </div>
          </div>
        </div>
        
        <p className="text-[10px] text-muted leading-relaxed font-semibold">
          Analysis computed dynamically using 13+ heuristics, WHOIS registration duration, and transport layer validation.
        </p>
      </div>
    </div>
  )
}

export default AnimatedRiskMeter
