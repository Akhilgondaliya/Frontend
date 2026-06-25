import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiAlertTriangle, FiCheckCircle, FiShield, FiMail, FiLink, FiInfo, FiFileText } from 'react-icons/fi'

export const ResultMail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const scanResult = location.state?.scanResult

  if (!scanResult) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <FiAlertTriangle className="w-16 h-16 text-muted/60" />
        <h2 className="text-2xl font-bold text-[#0d1b2a] dark:text-white">No Scan Data Found</h2>
        <p className="text-sm text-muted max-w-sm">
          Please submit email text contents in the PhishZero sandbox to generate a security report.
        </p>
        <Link
          to="/scan"
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm hover:bg-accent/80 transition-colors shadow-lg shadow-accent/15"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </Link>
      </div>
    )
  }

  const { score, verdict, results, sender_analysis, body_analysis, link_analysis } = scanResult

  // Theme matching based on verdict
  let themeColor = 'text-safe border-safe/20 bg-safe/5'
  let ringColor = 'border-safe text-safe'
  let statusIcon = <FiCheckCircle className="w-6 h-6 text-safe" />
  let verdictLabel = 'Clean / Safe'
  let verdictDesc = 'This email does not exhibit typical phishing signals, brand impersonations, or suspicious domain characteristics. It appears safe to interact with.'

  if (verdict === 'Phishing') {
    themeColor = 'text-phishing border-phishing/20 bg-phishing/5'
    ringColor = 'border-phishing text-phishing'
    statusIcon = <FiAlertTriangle className="w-6 h-6 text-phishing" />
    verdictLabel = 'Likely Phishing'
    verdictDesc = 'CRITICAL ALERT: This email has a very high probability of being a phishing attempt. It uses sender spoofing, high-urgency keywords, or links pointing to malicious sites. Do not reply or click any links.'
  } else if (verdict === 'Suspicious') {
    themeColor = 'text-suspicious border-suspicious/20 bg-suspicious/5'
    ringColor = 'border-suspicious text-suspicious'
    statusIcon = <FiAlertTriangle className="w-6 h-6 text-suspicious" />
    verdictLabel = 'Suspicious Indicators'
    verdictDesc = 'WARNING: Potential threat factors detected. The sender domain uses public mail services, has minor urgency cues, or lists links that require extra caution before clicking.'
  }

  // Mitigation advice list
  const mitigations = verdict === 'Phishing' ? [
    { title: "Do Not Reply or Interact", desc: "Never reply to this sender, and do not input passwords, credit cards, or personal data on links from this email." },
    { title: "Report as Phishing", desc: "Forward this email to your organization's IT support team or flag it as phishing inside your mail client." },
    { title: "Delete Immediately", desc: "Remove this message from your inbox and trash folder to prevent accidental clicks in the future." },
    { title: "Reset Compromised Accounts", desc: "If you have already entered login details on links inside this email, change those passwords immediately on the official website." }
  ] : verdict === 'Suspicious' ? [
    { title: "Verify Sender Identity", desc: "Contact the sender using a phone number or contact channel you trust (not details provided inside the email)." },
    { title: "Inspect URL Redirects", desc: "Hover over all links to check their destination. Do not click them if they lead to unfamiliar hostnames." },
    { title: "Avoid Attachments", desc: "Do not download or open any attachments (e.g. PDFs, documents, zips) as they may carry hidden script macros." },
    { title: "Check Mail Headers", desc: "Inspect the detailed email headers to verify that the Return-Path matches the declared sender domain." }
  ] : [
    { title: "Standard Email Safety", desc: "Although scanned as clean, always exercise general caution when entering personal details from email links." },
    { title: "Double-check Urgent Requests", desc: "Be alert for social engineering triggers if the sender starts requesting immediate payments or credentials." },
    { title: "Enable Anti-Spam Filters", desc: "Ensure your email client's built-in junk/phishing filters are enabled and active." }
  ]

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back button */}
      <div className="flex items-center">
        <Link
          to="/scan"
          className="inline-flex items-center space-x-2 text-sm text-muted hover:text-accent font-bold transition-colors"
          id="back-to-scanner-btn"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to sandbox scanner</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-accent flex items-center space-x-1.5">
          <FiMail className="w-3.5 h-3.5" />
          <span>Email Security Audit</span>
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
          Email Threat Intelligence Report
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Col 1: Verdict Dashboard Ring & Sender/Body Analysis */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Verdict Ring Widget */}
          <section className="bg-card border border-muted/20 rounded-3xl p-6 text-center space-y-6 shadow-md">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted">Analysis Verdict</h3>
            
            <div className="flex justify-center">
              <div className={`w-36 h-36 rounded-full border-4 ${ringColor} flex flex-col items-center justify-center relative shadow-inner`}>
                <span className="text-3xl font-extrabold tracking-tight">{score}</span>
                <span className="text-[10px] text-muted font-bold tracking-wide">RISK SCORE</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${themeColor} flex items-center justify-center space-x-2.5`}>
              {statusIcon}
              <span className="font-extrabold text-sm tracking-wide uppercase">{verdictLabel}</span>
            </div>

            <p className="text-xs text-muted leading-relaxed px-2">
              {verdictDesc}
            </p>
          </section>

          {/* Sender analysis details */}
          <section className="bg-card border border-muted/20 rounded-3xl p-6 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 border-b border-muted/5 pb-3">
              <FiShield className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold text-[#0d1b2a] dark:text-white">Sender Authenticity</h3>
            </div>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-muted/5 pb-2">
                <span className="text-muted">Sender Email:</span>
                <span className="font-semibold text-right truncate max-w-[180px]" title={sender_analysis.email}>
                  {sender_analysis.email}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/5 pb-2">
                <span className="text-muted">Sender Domain:</span>
                <span className="font-semibold font-mono">{sender_analysis.domain || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-muted/5 pb-2">
                <span className="text-muted">Public Mail Service:</span>
                <span className={`font-semibold ${sender_analysis.is_free_provider ? 'text-suspicious' : 'text-safe'}`}>
                  {sender_analysis.is_free_provider ? 'Yes (Gmail/Yahoo)' : 'No (Private Domain)'}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted">Brand Spoofing:</span>
                <span className={`font-semibold ${sender_analysis.is_spoofed_brand ? 'text-phishing' : 'text-safe'}`}>
                  {sender_analysis.is_spoofed_brand ? `Yes (${sender_analysis.impersonated_brand})` : 'None Flagged'}
                </span>
              </div>
            </div>
          </section>

          {/* Body Heuristics details */}
          <section className="bg-card border border-muted/20 rounded-3xl p-6 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 border-b border-muted/5 pb-3">
              <FiFileText className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold text-[#0d1b2a] dark:text-white">Content Structure Audit</h3>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-muted/5 pb-2">
                <span className="text-muted">Generic Greeting:</span>
                <span className={`font-semibold ${body_analysis.generic_greeting ? 'text-phishing' : 'text-safe'}`}>
                  {body_analysis.generic_greeting ? `Found ('${body_analysis.generic_greeting_text}')` : 'No (Personalized)'}
                </span>
              </div>
              
              <div className="flex items-center justify-between border-b border-muted/5 pb-2">
                <span className="text-muted">Requests Credentials:</span>
                <span className={`font-semibold ${body_analysis.sensitive_info_requested ? 'text-phishing' : 'text-safe'}`}>
                  {body_analysis.sensitive_info_requested ? 'Yes (High Risk)' : 'No'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted">Triggered Urgency Keywords:</span>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {body_analysis.urgent_keywords_found && body_analysis.urgent_keywords_found.length > 0 ? (
                    body_analysis.urgent_keywords_found.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-phishing/10 text-phishing">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-safe italic text-[11px]">None detected</span>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Col 2 & 3: Threat Indicators list & Links inspection Grid */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Flagged threat details list */}
          <section className="bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
            <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">Triggered Phishing Indicators</h3>
            
            <div className="space-y-3">
              {results.map((rule, idx) => (
                <div key={idx} className="flex items-start space-x-3.5 p-3 rounded-2xl bg-primary/10 border border-muted/5">
                  {rule.triggered !== false ? (
                    <span className="flex-shrink-0 mt-0.5 text-xs font-bold px-2 py-0.5 rounded-md bg-phishing text-white uppercase tracking-wider">
                      +{rule.points} pts
                    </span>
                  ) : (
                    <span className="flex-shrink-0 mt-0.5 text-xs font-bold px-2 py-0.5 rounded-md bg-safe text-white uppercase tracking-wider">
                      Clean
                    </span>
                  )}
                  <div className="space-y-1 text-xs">
                    <h4 className="font-extrabold text-[#0d1b2a] dark:text-white">{rule.name}</h4>
                    <p className="text-muted leading-relaxed">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Links Verification Grid */}
          <section className="bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-muted/5 pb-3">
              <div className="flex items-center space-x-2">
                <FiLink className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">Email Links Verification</h3>
              </div>
              <span className="text-xs text-muted font-semibold bg-primary/30 border border-muted/20 px-3 py-1 rounded-full">
                {link_analysis.total_links} Links Found
              </span>
            </div>

            {link_analysis.total_links > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-muted/10 text-muted uppercase font-bold tracking-wider text-[10px]">
                      <th className="pb-3 pr-4">Displayed Text</th>
                      <th className="pb-3 px-4">Actual Target URL</th>
                      <th className="pb-3 px-4">Redirect Status</th>
                      <th className="pb-3 pl-4 text-right">URL Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {link_analysis.flagged_links.map((link, i) => (
                      <tr key={i} className="border-b border-muted/5 hover:bg-primary/5 transition-colors">
                        <td className="py-3.5 pr-4 max-w-[150px] truncate font-medium" title={link.displayed}>
                          {link.displayed}
                        </td>
                        <td className="py-3.5 px-4 max-w-[200px] truncate font-mono text-muted" title={link.actual}>
                          {link.actual}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {link.is_spoofed ? (
                            <span className="inline-flex items-center space-x-1 text-phishing">
                              <span>⚠️ Hijacked Link</span>
                            </span>
                          ) : (
                            <span className="text-safe">Matched</span>
                          )}
                        </td>
                        <td className="py-3.5 pl-4 text-right font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            link.score >= 70 ? 'bg-phishing/15 text-phishing' : link.score >= 40 ? 'bg-suspicious/15 text-suspicious' : 'bg-safe/15 text-safe'
                          }`}>
                            {link.score}/100
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* List non-flagged standard links */}
                    {link_analysis.total_links > link_analysis.flagged_links_count && (
                      <tr>
                        <td colSpan="4" className="py-3 text-center text-muted italic text-[11px]">
                          + {link_analysis.total_links - link_analysis.flagged_links_count} other clean links resolved without threats
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted text-xs italic bg-primary/5 rounded-2xl border border-muted/5">
                No URLs or anchor links were found inside the provided email content.
              </div>
            )}
          </section>

          {/* Mitigation Actions */}
          <section className="bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
            <div className="flex items-center space-x-2 border-b border-muted/5 pb-3">
              <FiInfo className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">Email Actionable Mitigation Plan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mitigations.map((action, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-2xl bg-primary/10 border border-muted/5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/15 text-accent text-xs font-extrabold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-bold text-[#0d1b2a] dark:text-white">{action.title}</h4>
                    <p className="text-muted leading-relaxed">{action.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  )
}
export default ResultMail
