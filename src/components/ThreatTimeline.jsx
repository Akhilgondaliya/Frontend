import React from 'react'
import { FiCalendar, FiClock, FiShield } from 'react-icons/fi'

export const ThreatTimeline = ({ whois = {}, ssl = {} }) => {
  const creationDate = whois.creation_date || 'N/A'
  const expiryDate = ssl.expiry_date || 'N/A'
  const scanDate = new Date().toLocaleDateString('en-US')
  const ageDays = whois.age_days || 0
  const riskPenalty = whois.points || 0

  const events = [
    {
      title: 'Domain Registration Created',
      date: creationDate,
      detail: whois.registrar ? `Registered via ${whois.registrar}` : 'WHOIS registration record established.',
      icon: <FiCalendar className="w-4 h-4 text-accent" />,
    },
    {
      title: 'SSL Certificate Expiration',
      date: expiryDate,
      detail: ssl.valid ? `Valid SSL issued by ${ssl.issuer}` : 'Invalid or expired SSL transport layer.',
      icon: <FiShield className="w-4 h-4 text-accent" />,
    },
    {
      title: 'PhishZero Threat Scan',
      date: scanDate,
      detail: `Sandbox engine evaluated domain age: ${ageDays} days active.`,
      icon: <FiClock className="w-4 h-4 text-accent" />,
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">Domain Lifecycle Timeline</h3>
      <div className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 shadow-md space-y-6">
        <div className="relative pl-6 border-l border-muted/25 space-y-6 text-left">
          {events.map((event, idx) => (
            <div key={idx} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[35px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-primary border border-muted/25 dark:border-accent/20 shadow-sm flex-shrink-0">
                {event.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-accent uppercase tracking-widest">{event.date}</span>
                <h4 className="text-xs font-extrabold text-[#0d1b2a] dark:text-white uppercase tracking-wide">{event.title}</h4>
                <p className="text-[10px] text-muted leading-relaxed font-semibold">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Age Summary Stat Block */}
        <div className="pt-4 border-t border-muted/5 flex flex-wrap gap-4 justify-between items-center text-xs">
          <div>
            <span className="text-muted block text-[10px] uppercase font-bold tracking-wider">Current Age</span>
            <span className="text-sm font-extrabold text-[#0d1b2a] dark:text-white block mt-0.5">{ageDays} Days</span>
          </div>
          <div>
            <span className="text-muted block text-[10px] uppercase font-bold tracking-wider">Domain Registration Risk</span>
            <span className={`text-sm font-extrabold block mt-0.5 ${riskPenalty > 0 ? 'text-phishing' : 'text-safe'}`}>
              +{riskPenalty} Pts Penalty
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreatTimeline
