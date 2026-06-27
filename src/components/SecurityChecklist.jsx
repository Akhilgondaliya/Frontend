import React from 'react'
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi'

export const SecurityChecklist = ({ scanResult = {} }) => {
  const { results = [], ssl = {}, whois = {} } = scanResult

  const hasHttps = !results.some(r => r.name === 'No HTTPS' && r.triggered)
  const hasSsl = ssl.valid && !ssl.error
  const hasWhois = !whois.error
  const isOldDomain = whois.age_days >= 30
  const hasBrandImpersonation = results.some(r => r.name === 'Brand Impersonation' && r.triggered)
  const hasKeywords = results.some(r => r.name === 'Phishing Keywords' && r.triggered)
  const hasRedirects = results.some(r => r.name === 'Double Slash in Path' && r.triggered)
  const hasIpHost = results.some(r => r.name === 'IP as Host' && r.triggered)
  const hasSuspiciousTld = results.some(r => r.name === 'Suspicious TLD' && r.triggered)

  const items = [
    {
      name: 'HTTPS Encrypted Connection',
      desc: 'Verify if communications are encrypted.',
      status: hasHttps ? 'PASS' : 'FAIL',
    },
    {
      name: 'SSL Certificate Validity',
      desc: 'Confirm the validity of the certificates.',
      status: hasSsl ? 'PASS' : ssl.warning ? 'WARN' : 'FAIL',
    },
    {
      name: 'WHOIS Database Record',
      desc: 'Verify registry authority allocation.',
      status: hasWhois ? 'PASS' : 'WARN',
    },
    {
      name: 'Domain Age Baseline',
      desc: 'Checks if domain is registered for >30 days.',
      status: whois.error ? 'WARN' : isOldDomain ? 'PASS' : 'FAIL',
    },
    {
      name: 'Brand Spoof Mitigation',
      desc: 'Audit domain for trademark similarity.',
      status: hasBrandImpersonation ? 'FAIL' : 'PASS',
    },
    {
      name: 'Lexical Analysis Indicators',
      desc: 'Scans for social engineering keywords.',
      status: hasKeywords ? 'FAIL' : 'PASS',
    },
    {
      name: 'Path Redirect Traps',
      desc: 'Scans for traffic routing redirection.',
      status: hasRedirects ? 'FAIL' : 'PASS',
    },
    {
      name: 'IP Hostname Masking',
      desc: 'Checks if numbers obscure hostname.',
      status: hasIpHost ? 'FAIL' : 'PASS',
    },
    {
      name: 'Reputable TLD Extension',
      desc: 'Checks for statistically unsafe suffixes.',
      status: hasSuspiciousTld ? 'FAIL' : 'PASS',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">Core Security Checklist</h3>
      <div className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, idx) => {
          let icon = <FiCheckCircle className="w-5 h-5 text-safe" />
          let labelClass = 'text-safe border-safe/20 bg-safe/5'
          
          if (item.status === 'FAIL') {
            icon = <FiXCircle className="w-5 h-5 text-phishing" />
            labelClass = 'text-phishing border-phishing/20 bg-phishing/5'
          } else if (item.status === 'WARN') {
            icon = <FiAlertTriangle className="w-5 h-5 text-suspicious" />
            labelClass = 'text-suspicious border-suspicious/20 bg-suspicious/5'
          }

          return (
            <div key={idx} className="flex items-start space-x-3.5 pb-4 border-b border-muted/5 last:border-0 md:pb-0 md:border-0">
              <div className="mt-0.5 flex-shrink-0">{icon}</div>
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-[#0d1b2a] dark:text-white block">{item.name}</span>
                <p className="text-[10px] text-muted block leading-relaxed">{item.desc}</p>
                <div className={`mt-1.5 px-2 py-0.5 rounded-md border text-[9px] font-extrabold w-fit uppercase tracking-wider ${labelClass}`}>
                  {item.status}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SecurityChecklist
