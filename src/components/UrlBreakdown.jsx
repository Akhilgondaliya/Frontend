import React from 'react'
import { FiGlobe, FiCpu, FiKey, FiShield, FiSliders, FiClock } from 'react-icons/fi'

export const UrlBreakdown = ({ url = '', ipAddress = 'Unavailable', registrar = 'Unavailable', whoisError = null, sslError = null }) => {
  let protocol = 'N/A'
  let domain = 'N/A'
  let subdomain = 'None'
  let path = 'N/A'
  let tld = 'N/A'
  let length = url.length
  let specialChars = 0

  try {
    const standardizedUrl = url.startsWith('http') ? url : 'https://' + url
    const urlObj = new URL(standardizedUrl)
    protocol = urlObj.protocol.replace(':', '').toUpperCase()
    path = urlObj.pathname === '/' ? '/' : urlObj.pathname
    
    const specialMatch = url.match(/[!\-@?=&_%]/g)
    specialChars = specialMatch ? specialMatch.length : 0
    
    const host = urlObj.hostname
    const parts = host.split('.')
    if (parts.length >= 2) {
      tld = '.' + parts[parts.length - 1]
      domain = parts[parts.length - 2]
      if (parts.length > 2) {
        subdomain = parts.slice(0, parts.length - 2).join('.')
      }
    } else {
      domain = host
    }
  } catch (e) {
    // fallback
  }

  const items = [
    { label: 'Protocol', val: protocol, icon: <FiGlobe className="text-accent" /> },
    { label: 'Domain', val: domain, icon: <FiGlobe className="text-accent" /> },
    { label: 'Subdomain', val: subdomain, icon: <FiGlobe className="text-accent" /> },
    { label: 'Top-Level Domain (TLD)', val: tld, icon: <FiGlobe className="text-accent" /> },
    { label: 'Path Reference', val: path, icon: <FiGlobe className="text-accent" /> },
    { label: 'URL Length', val: `${length} chars`, icon: <FiSliders className="text-accent" /> },
    { label: 'Special Characters', val: `${specialChars} detected`, icon: <FiSliders className="text-accent" /> },
    { label: 'Resolved IP Address', val: ipAddress, icon: <FiCpu className="text-accent" /> },
    { label: 'Authorized Registrar', val: registrar, icon: <FiKey className="text-accent" /> },
    { label: 'WHOIS Database Status', val: whoisError ? 'Incomplete / Private' : 'Active Registry', icon: <FiClock className="text-accent" /> },
    { label: 'Transport Security (SSL)', val: sslError ? 'Faulty / Inactive' : 'Secured / Handshake OK', icon: <FiShield className="text-accent" /> },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">URL Diagnostics Breakdown</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex items-start space-x-3.5 hover:border-accent/30 transition-all duration-300 shadow-sm">
            <div className="p-2 bg-accent/10 rounded-lg mt-0.5 flex-shrink-0">
              {item.icon}
            </div>
            <div className="space-y-1 truncate w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">{item.label}</span>
              <span className="text-xs font-mono font-bold text-[#0d1b2a] dark:text-white truncate block" title={item.val}>
                {item.val}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UrlBreakdown
