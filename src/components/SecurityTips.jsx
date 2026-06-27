import React, { useState, useEffect } from 'react'
import { FiShield } from 'react-icons/fi'

const TIPS = [
  'Never scan QR codes from unknown or untrusted physical flyers or emails.',
  'Always verify the domain name in the address bar before entering passwords or PINs.',
  'Use Multi-Factor Authentication (MFA) on all financial and identity accounts.',
  'Be suspicious of emails requesting immediate or urgent payments/account updates.',
  'Hover over hyperlinks to verify the actual destination URL before clicking.',
  'Avoid downloading or opening attachments (especially PDFs or macro-enabled documents) from external senders.',
  'Ensure your browser and operating system security updates are installed promptly.'
]

export const SecurityTips = () => {
  const [tip, setTip] = useState('')

  useEffect(() => {
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)]
    setTip(randomTip)
  }, [])

  return (
    <div className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 shadow-md flex items-start space-x-4 text-left">
      <div className="p-3 bg-accent/10 rounded-2xl flex-shrink-0">
        <FiShield className="w-6 h-6 text-accent animate-pulse" />
      </div>
      <div className="space-y-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent">Security Analyst Tip</span>
        <p className="text-xs text-[#0d1b2a] dark:text-gray-300 leading-relaxed font-semibold">
          {tip}
        </p>
      </div>
    </div>
  )
}

export default SecurityTips
