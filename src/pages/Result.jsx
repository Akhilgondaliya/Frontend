import React, { useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FiDownload, FiRefreshCw, FiCopy, FiLock, FiCalendar, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import VerdictBanner from '../components/VerdictBanner'
import RiskMeter from '../components/RiskMeter'
import SignalCard from '../components/SignalCard'

export const Result = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const scanResult = location.state?.scanResult

  // Redirect to scan if no results are in history state
  useEffect(() => {
    if (!scanResult) {
      toast.error('No scan results found. Let\'s start a new scan first.')
      navigate('/scan')
    }
  }, [scanResult, navigate])

  if (!scanResult) {
    return null // Will redirect in useEffect
  }

  const { url, score, verdict, results = [], ssl = {}, whois = {} } = scanResult

  // Copy result details to clipboard
  const handleCopyResultUrl = () => {
    const textToCopy = `PhishZero Website Security Report\nURL: ${url}\nVerdict: ${verdict}\nRisk Score: ${score}/100`
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast.success('Report details copied to clipboard!')
      })
      .catch(() => {
        toast.error('Could not copy. Please manually select the text.')
      })
  }

  // Trigger PDF download with custom directory picker prompt (Runs picker before fetch to preserve browser user gesture)
  const handleDownloadPdf = async () => {
    let fileHandle = null
    try {
      // 1. Prompt user for saving location first while user gesture is active
      if (window.showSaveFilePicker) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: `phishzero_report_${Date.now()}.pdf`,
          types: [{
            description: 'PDF Document',
            accept: {
              'application/pdf': ['.pdf']
            }
          }]
        })
      }

      toast.info('Generating PDF report from sandbox...')
      let response
      let blob
      try {
        const postUrl = `${import.meta.env.VITE_API_URL || ''}/api/report`
        response = await fetch(postUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(scanResult)
        })
        if (response.ok) {
          blob = await response.blob()
        } else {
          console.warn(`POST report generation returned status ${response.status}. Falling back to GET...`)
        }
      } catch (postErr) {
        console.warn('POST report generation failed, trying GET fallback...', postErr)
      }

      if (!blob) {
        // Fallback: GET request with url query parameter (performs rescan on server)
        const getUrl = `${import.meta.env.VITE_API_URL || ''}/api/report?url=${encodeURIComponent(url)}`
        response = await fetch(getUrl)
        if (!response.ok) throw new Error('API server failed to generate PDF')
        blob = await response.blob()
      }

      if (fileHandle) {
        // 3. Write blob content to the chosen folder path
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
        toast.success('Report saved successfully!')
      } else {
        // Fallback standard download trigger for unsupported browsers
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', `phishzero_report_${Date.now()}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        toast.success('Report downloaded to default folder.')
      }
    } catch (err) {
      console.error(err)
      // Check if user simply closed the Save Dialogue without choosing a path
      if (err.name !== 'AbortError') {
        toast.error('Failed to download PDF report. Make sure the backend is active.')
      }
    }
  }

  let scoreBgColor = 'bg-safe'
  if (score >= 70) {
    scoreBgColor = 'bg-phishing'
  } else if (score >= 40) {
    scoreBgColor = 'bg-suspicious'
  }

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top action header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-muted/20 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d1b2a] dark:text-white">
          Website Security Breakdown
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-accent text-primary dark:text-primary font-bold text-xs tracking-wider hover:bg-accent/80 transition-colors shadow-md shadow-accent/15 cursor-pointer"
            id="download-report-btn"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={handleCopyResultUrl}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-muted/30 hover:border-accent hover:text-accent bg-card text-muted font-bold text-xs tracking-wider transition-colors cursor-pointer"
            id="copy-result-btn"
          >
            <FiCopy className="w-4 h-4" />
            <span>Copy Summary</span>
          </button>
          <Link
            to="/scan"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-accent/40 hover:bg-accent/10 text-accent font-bold text-xs tracking-wider transition-colors cursor-pointer"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Scan Another Link</span>
          </Link>
        </div>
      </div>

      {/* Main Verdict Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
         
        {/* Banner: takes 8 cols */}
        <div className="lg:col-span-8 h-full flex flex-col justify-center">
          <VerdictBanner verdict={verdict} url={url} />
        </div>

        {/* Risk score gauge: takes 4 cols */}
        <div className="lg:col-span-4 h-full flex items-center justify-center">
          <RiskMeter score={score} />
        </div>

      </div>

      {/* Zone slide indicator progress ruler */}
      <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">
          Safety Threat Level
        </h3>
        
        {/* Horizontal ruler tracking box */}
        <div className="relative pt-6 pb-2">
          
          {/* Active pointer block */}
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10"
          >
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary dark:text-primary ${scoreBgColor}`}>
              {score}
            </span>
            <div className={`w-2 h-2 rotate-45 mt-0.5 ${scoreBgColor}`} />
          </motion.div>

          {/* Three-zone background bar */}
          <div className="h-4 w-full rounded-full overflow-hidden flex bg-primary/20">
            <div className="w-[40%] bg-emerald-500/20 border-r border-[#060b14] h-full" title="Safe Range" />
            <div className="w-[30%] bg-amber-500/20 border-r border-[#060b14] h-full" title="Suspicious Range" />
            <div className="w-[30%] bg-rose-500/20 h-full" title="Dangerous Range" />
          </div>

          {/* Legend indicator marks */}
          <div className="flex justify-between text-[10px] text-muted font-bold tracking-wider pt-2">
            <span>0 (Safe)</span>
            <span className="text-emerald-500">39 (Upper Safe Limit)</span>
            <span className="text-amber-500">69 (Upper Suspicious Limit)</span>
            <span className="text-rose-500">100 (Max Danger Rating)</span>
          </div>

        </div>
      </section>

      {/* SSL & WHOIS Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SSL block */}
        <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md hover:border-accent/30 transition-colors">
          <div className="flex items-center space-x-2 text-accent border-b border-muted/5 pb-3">
            <FiLock className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0d1b2a] dark:text-white">SSL Connection & Security</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted block">Connection Status</span>
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                ssl.valid ? 'bg-safe/10 text-safe' : 'bg-phishing/10 text-phishing'
              }`}>
                {ssl.valid ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiAlertTriangle className="w-3.5 h-3.5" />}
                <span>{ssl.valid ? 'Secure / Encrypted' : 'Not Secure (HTTP)'}</span>
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">Certificate Issuer</span>
              <span className="font-semibold text-[#0d1b2a] dark:text-white truncate block" title={ssl.issuer}>{ssl.issuer || 'None'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">Expiration Date</span>
              <span className="font-semibold text-[#0d1b2a] dark:text-white font-mono block">{ssl.expiry_date || 'N/A'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">Days Left</span>
              <span className="font-semibold text-[#0d1b2a] dark:text-white font-mono block">
                {ssl.days_left !== undefined ? `${ssl.days_left} Days` : '0 Days'}
              </span>
            </div>
          </div>

          {ssl.warning && (
            <div className="flex items-start space-x-2 p-3 bg-phishing/5 border border-phishing/30 text-phishing rounded-xl text-xs">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                <b>Caution:</b> This site's security certificate is expiring in less than 30 days. Short-lived certificates are frequently used on temporary scam pages.
              </p>
            </div>
          )}

          {ssl.error && (
            <div className="p-3 bg-primary/20 text-muted rounded-xl text-[11px] leading-relaxed">
              <b>Connection Log:</b> {ssl.error === "HTTP protocol used (No SSL)" ? "The website uses plain HTTP, meaning data sent to it is not encrypted." : ssl.error}
            </div>
          )}
        </section>

        {/* WHOIS block */}
        <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md hover:border-accent/30 transition-colors">
          <div className="flex items-center space-x-2 text-accent border-b border-muted/5 pb-3">
            <FiCalendar className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0d1b2a] dark:text-white">Domain Registration details</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted block">Website Age</span>
              <span className="font-extrabold text-[#0d1b2a] dark:text-white font-mono block">
                {whois.age_days !== undefined ? `${whois.age_days} Days` : '0 Days'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">Registered On</span>
              <span className="font-semibold text-[#0d1b2a] dark:text-white font-mono block">{whois.creation_date || 'Unknown'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">Registration Risk</span>
              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                whois.risk_level === 'Very High' || whois.risk_level === 'High'
                  ? 'bg-phishing/10 text-phishing'
                  : whois.risk_level === 'Medium'
                  ? 'bg-suspicious/10 text-suspicious'
                  : 'bg-safe/10 text-safe'
              }`}>
                {whois.risk_level || 'Unknown'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">WHOIS Penalty points</span>
              <span className="font-semibold text-[#0d1b2a] dark:text-white font-mono block">
                {whois.points !== undefined ? `+${whois.points} Points` : '0 Points'}
              </span>
            </div>
          </div>

          {whois.points > 0 && (
            <div className="flex items-start space-x-2 p-3 bg-suspicious/5 border border-suspicious/30 text-suspicious rounded-xl text-xs">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                <b>Caution:</b> This website was registered very recently. Scam sites are often created, used for a few days, and then abandoned.
              </p>
            </div>
          )}

          {whois.error && (
            <div className="p-3 bg-primary/20 text-muted rounded-xl text-[11px] leading-relaxed">
              <b>Registry Log:</b> Could not pull database logs (this often happens when WHOIS servers rate-limit requests).
            </div>
          )}
        </section>

      </div>

      {/* 13 Heuristic checks grid */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">
            Security Checklist Results
          </h2>
          <p className="text-xs text-muted">A detailed look at the 13 safety checks we run on the link structure.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((sig, idx) => (
            <SignalCard key={sig.id} signal={sig} index={idx} />
          ))}
        </div>
      </section>

    </div>
  )
}
export default Result
