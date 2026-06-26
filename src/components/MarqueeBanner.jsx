import React from 'react'

export const MarqueeBanner = () => {
  const stats = [
    { text: "90%+ of cyberattacks start with phishing attempts", icon: "🎣" },
    { text: "Over 3 billion phishing emails are sent every day", icon: "📧" },
    { text: "A new phishing site is created every few seconds", icon: "🌐" },
    { text: "QR phishing (Quishing) attacks are rapidly increasing", icon: "📱" },
    { text: "One click on a malicious link can compromise sensitive data", icon: "⚠️" },
    { text: "HTTPS does not always mean a website is safe", icon: "🔒" },
    { text: "Cybercriminals often impersonate trusted brands and banks", icon: "🎯" },
    { text: "Always verify URLs before entering passwords", icon: "🔍" },
    { text: "Phishing remains one of the leading causes of data breaches", icon: "🚨" },
    { text: "Phishing attacks cost organizations millions of dollars annually", icon: "💰" },
    { text: "Human error is involved in most cybersecurity incidents", icon: "📊" },
    { text: "Shortened URLs can hide dangerous destinations", icon: "🔗" },
    { text: "Security awareness is the first line of defense", icon: "🧠" },
    { text: "Never trust a QR code without checking its destination", icon: "🚫" },
    { text: "Scan • Verify • Protect", icon: "🛡️" }
  ]

  return (
    <div className="hidden md:block bg-accent text-primary py-2.5 overflow-hidden whitespace-nowrap relative z-40 select-none shadow-sm font-bold text-xs sm:text-sm tracking-wide border-b border-accent/10">
      <div className="flex w-max animate-marquee">
        {/* Render items twice for seamless loop */}
        <div className="flex items-center space-x-12 px-6">
          {stats.map((item, idx) => (
            <span key={idx} className="inline-flex items-center space-x-2">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-12 px-6" aria-hidden="true">
          {stats.map((item, idx) => (
            <span key={idx} className="inline-flex items-center space-x-2">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarqueeBanner
