import React, { useState, useEffect } from 'react'

export const TypewriterAdviceBanner = () => {
  const tips = [
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

  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(60)

  useEffect(() => {
    let timer
    const fullText = tips[currentTipIndex]

    if (!isDeleting) {
      if (currentText !== fullText) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1))
        }, typingSpeed)
      } else {
        // Pause at full text
        timer = setTimeout(() => {
          setIsDeleting(true)
          setTypingSpeed(30)
        }, 4000)
      }
    } else {
      if (currentText !== '') {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length - 1))
        }, typingSpeed)
      } else {
        setIsDeleting(false)
        setCurrentTipIndex((prev) => (prev + 1) % tips.length)
        setTypingSpeed(60)
      }
    }

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentTipIndex])

  return (
    <div className="w-full mt-16 sm:mt-20 bg-card/85 dark:bg-card/45 backdrop-blur-md border-b border-muted/20 dark:border-accent/10 px-4 py-2.5 flex items-center justify-center z-40 relative select-none">
      <div className="flex items-center justify-center space-x-1 text-xs sm:text-sm font-bold text-muted dark:text-white/80 min-h-[20px] text-center">
        <span className="tracking-wide">
          {currentText}
        </span>
        <span className="w-[2px] h-3.5 bg-accent animate-pulse inline-block align-middle ml-0.5" />
      </div>
    </div>
  )
}

export default TypewriterAdviceBanner
