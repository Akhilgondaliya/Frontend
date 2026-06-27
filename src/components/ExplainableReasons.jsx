import React from 'react'
import { FiAlertTriangle, FiAlertCircle, FiInfo } from 'react-icons/fi'

export const ExplainableReasons = ({ scanResult = {} }) => {
  const { results = [], ssl = {}, whois = {} } = scanResult

  const reasons = []

  if (whois.age_days > 0 && whois.age_days < 30) {
    reasons.push({
      severity: 'Critical',
      name: 'Recently Registered Domain',
      desc: `Domain was created only ${whois.age_days} days ago.`,
      why: 'Most phishing sites use cheap, disposable domains registered hours or days before an attack to avoid blacklists. Established brands maintain domains for years.'
    })
  } else if (whois.error) {
    reasons.push({
      severity: 'Warning',
      name: 'Missing WHOIS Records',
      desc: 'No registry records found for this domain.',
      why: 'Private, incomplete, or missing registrar records are common in temporary setups constructed to evade logging and domain tracing.'
    })
  }

  if (ssl.error) {
    reasons.push({
      severity: 'Critical',
      name: 'Insecure SSL Handshake',
      desc: `Certificate verification failed: ${ssl.error}.`,
      why: 'An invalid or broken SSL certificate means your connection is unencrypted, and the identity of the host cannot be cryptographically proven.'
    })
  } else if (ssl.warning) {
    reasons.push({
      severity: 'Warning',
      name: 'Short Certificate Lifespan',
      desc: `SSL certificate expires in only ${ssl.days_left} days.`,
      why: 'Phishing domains frequently install short-lived, free SSL certificates that they do not intend to renew, matching their brief attack campaigns.'
    })
  }

  results.forEach(res => {
    if (res.triggered) {
      if (res.name === 'No HTTPS') {
        reasons.push({
          severity: 'Critical',
          name: 'Missing HTTPS Protocol',
          desc: 'URL uses insecure plain HTTP instead of HTTPS.',
          why: 'Plaintext traffic can be intercepted or altered in transit by intermediaries, making it unsafe for passwords or credit cards.'
        })
      } else if (res.name === 'IP as Host') {
        reasons.push({
          severity: 'Critical',
          name: 'IP Address as Hostname',
          desc: 'Numeric IP address used in place of domain.',
          why: 'Attackers use raw IP hostnames to bypass standard domain registry tracking, email authentication checks, or reputation checkers.'
        })
      } else if (res.name === 'Brand Impersonation') {
        reasons.push({
          severity: 'Critical',
          name: 'Possible Brand Impersonation',
          desc: res.description,
          why: 'The URL includes elements resembling trusted brand names to exploit cognitive bias and deceive users into thinking it is legitimate.'
        })
      } else if (res.name === 'Suspicious TLD') {
        reasons.push({
          severity: 'Warning',
          name: 'Suspicious Domain Extension',
          desc: res.description,
          why: 'Certain top-level domains (.tk, .xyz, .top) are popular with phishers because they are free or cheap to register in bulk.'
        })
      } else if (res.name === 'Phishing Keywords') {
        reasons.push({
          severity: 'Warning',
          name: 'Urgent/Deceptive Keywords',
          desc: res.description,
          why: 'Keywords like "login", "verify", or "secure" are artificially placed in subdomains or paths to trick users into entering details.'
        })
      } else if (res.name === 'URL Shortener') {
        reasons.push({
          severity: 'Warning',
          name: 'Link Obfuscation shortener',
          desc: res.description,
          why: 'Shorteners (like bit.ly) obscure the final destination domain, preventing the user from inspecting the host domain before clicking.'
        })
      } else if (res.name === 'Deep Subdomain') {
        reasons.push({
          severity: 'Warning',
          name: 'Deep Subdomain Routing',
          desc: res.description,
          why: 'Deep subdomains are used to pad URLs so that the actual host domain is pushed off-screen in mobile browsers (e.g. paypal.com.verify-login.tk).'
        })
      } else if (res.name === 'Hex Encoding') {
        reasons.push({
          severity: 'Info',
          name: 'Obfuscated Hex Encoding',
          desc: res.description,
          why: 'Encoding strings as percent hex codes masks target keywords from simple security scanners while rendering them to the victim.'
        })
      } else if (res.name === 'Double Slash in Path') {
        reasons.push({
          severity: 'Warning',
          name: 'Open Redirect Pattern',
          desc: res.description,
          why: 'Double slashes (//) in URL paths are often used to route user login actions to malicious external sites after initial load.'
        })
      }
    }
  })

  if (reasons.length === 0) {
    reasons.push({
      severity: 'Info',
      name: 'No Critical Warnings',
      desc: 'The target passed all heuristics and records tests.',
      why: 'No typical phishing signals, spoof patterns, or database indicators were triggered. Continue exercising general cybersecurity best practices.'
    })
  }

  return (
    <div className="space-y-4 text-left">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">Explainable Threat Diagnostics</h3>
      <div className="space-y-4">
        {reasons.map((reason, idx) => {
          let badgeColor = 'text-safe border-safe/20 bg-safe/5'
          let alertIcon = <FiInfo className="w-5 h-5 text-safe" />
          
          if (reason.severity === 'Critical') {
            badgeColor = 'text-phishing border-phishing/20 bg-phishing/5'
            alertIcon = <FiAlertCircle className="w-5 h-5 text-phishing" />
          } else if (reason.severity === 'Warning') {
            badgeColor = 'text-suspicious border-suspicious/20 bg-suspicious/5'
            alertIcon = <FiAlertTriangle className="w-5 h-5 text-suspicious" />
          }

          return (
            <div key={idx} className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  {alertIcon}
                  <h4 className="text-xs font-extrabold text-[#0d1b2a] dark:text-white uppercase tracking-wide">{reason.name}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded-md border text-[8px] font-extrabold uppercase tracking-widest ${badgeColor}`}>
                  {reason.severity}
                </span>
              </div>
              <div className="text-xs text-muted pl-7 space-y-2">
                <p className="font-bold text-[#0d1b2a] dark:text-gray-300">{reason.desc}</p>
                <p className="leading-relaxed text-[10px] bg-primary/20 p-2.5 rounded-xl border border-muted/10 font-semibold text-muted">
                  <span className="font-extrabold text-accent block text-[9px] uppercase tracking-wider mb-0.5">Why it matters:</span>
                  {reason.why}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExplainableReasons
