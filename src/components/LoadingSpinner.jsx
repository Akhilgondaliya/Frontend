import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiLoader } from 'react-icons/fi'

export const LoadingSpinner = ({ message = 'Analyzing website elements' }) => {
  const [dots, setDots] = useState('')
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    'Checking WHOIS registries',
    'Checking SSL certificates',
    'Checking DNS validation',
    'Analyzing suspicious keywords',
    'Calculating risk rating index',
    'Generating security audit report'
  ]

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)
    return () => clearInterval(dotsInterval)
  }, [])

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 1000)
    return () => clearInterval(stepInterval)
  }, [])

  return (
    <div
      id="scanning-loader"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary/95 dark:bg-primary/98 backdrop-blur-md overflow-hidden animate-none"
    >
      {/* Cyber Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-60" />
      
      {/* Radial scan glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-6 max-w-sm px-6 text-center z-10">
        
        {/* Cybersecurity radar scanning circle */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Conic rotating line */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-accent/20"
            style={{
              background: 'conic-gradient(from 0deg, transparent 50%, rgba(0, 212, 255, 0.15) 100%)'
            }}
          />
          {/* Outer dashed ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute w-24 h-24 rounded-full border border-dashed border-accent/40"
          />
          {/* Pulse center core */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30"
          >
            <div className="w-5 h-5 rounded-full bg-accent shadow-lg shadow-accent/50" />
          </motion.div>
        </div>

        {/* Text descriptions */}
        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-wide text-[#0d1b2a] dark:text-white uppercase">
            {message}{dots}
          </h3>
          <span className="text-[9px] font-mono text-accent uppercase tracking-widest font-extrabold block">
            SECURE SCAN ACTIVE
          </span>
        </div>

        {/* Sequential checklist progress logs */}
        <div className="w-full bg-card/75 dark:bg-card/45 backdrop-blur-sm border border-muted/20 dark:border-accent/15 rounded-2xl p-4 text-left font-mono space-y-2.5 shadow-lg">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeStep
            const isActive = idx === activeStep

            return (
              <div
                key={idx}
                className={`flex items-center justify-between text-[10px] tracking-wide transition-colors duration-300 ${
                  isCompleted ? 'text-safe/85 font-extrabold' : isActive ? 'text-accent font-extrabold' : 'text-muted/40'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span>{step}</span>
                  {isActive && <span>{dots}</span>}
                </div>
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <FiCheckCircle className="w-3.5 h-3.5 text-safe" />
                  ) : isActive ? (
                    <FiLoader className="w-3.5 h-3.5 text-accent animate-spin" />
                  ) : (
                    <span className="text-muted/20">[PENDING]</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Informative advice */}
        <div className="p-3 bg-card/40 border border-muted/10 rounded-xl w-full">
          <p className="text-[9px] text-muted leading-relaxed font-semibold">
            PhishZero parses redirects, domain expiration patterns, and URL heuristics locally. Please do not close this browser window.
          </p>
        </div>

      </div>
    </div>
  )
}
export default LoadingSpinner
