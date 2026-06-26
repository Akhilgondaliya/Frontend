import React, { useState, useEffect } from 'react'

export const TerminalThreatLogger = () => {
  const stats = [
    "🎣 90%+ of cyberattacks start with phishing attempts.",
    "📧 Over 3 billion phishing emails are sent every day.",
    "🌐 A new phishing site is created every few seconds.",
    "📱 QR phishing (Quishing) attacks are rapidly increasing.",
    "⚠️ One click on a malicious link can compromise sensitive data.",
    "🔒 HTTPS does not always mean a website is safe.",
    "🎯 Cybercriminals often impersonate trusted brands.",
    "🔍 Always verify URLs before entering passwords.",
    "🛡️ Scan • Verify • Protect with PhishZero."
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(50)

  useEffect(() => {
    let timer
    const fullText = stats[currentIndex]

    if (!isDeleting) {
      if (currentText !== fullText) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1))
        }, typingSpeed)
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true)
          setTypingSpeed(25)
        }, 5000)
      }
    } else {
      if (currentText !== '') {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length - 1))
        }, typingSpeed)
      } else {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % stats.length)
        setTypingSpeed(50)
      }
    }

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentIndex])

  return (
    <div className="w-full mt-16 sm:mt-20 bg-primary px-4 py-4 border-b border-muted/20 dark:border-accent/10 z-40 relative">
      <div className="max-w-4xl mx-auto rounded-xl bg-[#030712] border border-[#1f2937] text-emerald-400 font-mono text-[11px] sm:text-xs shadow-2xl overflow-hidden">
        
        {/* Terminal Header */}
        <div className="bg-[#0f172a] px-4 py-2.5 flex items-center justify-between border-b border-[#1f2937] select-none">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] text-muted font-bold tracking-wider uppercase opacity-80">
            phishzero-threat-feed ~ bash
          </span>
          <div className="w-12" />
        </div>

        {/* Terminal Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center space-x-2 text-muted select-none">
            <span className="text-accent font-bold">phishzero@sec-daemon:~$</span>
            <span>./monitor_threats --realtime</span>
          </div>
          
          <div className="flex items-center space-x-2 text-[#60a5fa] select-none">
            <span className="font-bold">[status]</span>
            <span>Analyzing global phishing indicators...</span>
          </div>

          <div className="flex items-start space-x-2 min-h-[36px] sm:min-h-[24px]">
            <span className="text-amber-400 font-bold flex-shrink-0">[threat-feed]</span>
            <div className="flex items-center">
              <span className="text-white tracking-wide break-all sm:break-normal">
                {currentText}
              </span>
              <span className="w-[1.5px] h-3.5 bg-emerald-400 animate-pulse ml-0.5" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TerminalThreatLogger
