import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiAlertTriangle, FiCheckCircle, FiInfo, FiActivity, FiShield } from 'react-icons/fi'
import { toast } from 'react-toastify'

export const TyposquattingSimulator = () => {
  const [domainInput, setDomainInput] = useState('paypal.com')
  const [results, setResults] = useState([])
  const [activeScanIndex, setActiveScanIndex] = useState(null)
  const [scanState, setScanState] = useState('idle') // idle, scanning, finished

  // Main generator function
  const generateTypos = (input) => {
    let rawDomain = input.trim().toLowerCase()
    if (!rawDomain) return

    // Strip http/https/www if entered
    rawDomain = rawDomain.replace(/^(https?:\/\/)?(www\.)?/, '')

    const dotIndex = rawDomain.indexOf('.')
    let name = dotIndex > -1 ? rawDomain.substring(0, dotIndex) : rawDomain
    let tld = dotIndex > -1 ? rawDomain.substring(dotIndex) : '.com'

    if (name.length < 2) {
      toast.error('Please enter a longer brand name domain.')
      return
    }

    const generated = []

    // 1. Homoglyphs (Lookalikes)
    let homoglyph = name
    let substitutionNote = ''
    if (homoglyph.includes('l')) {
      homoglyph = homoglyph.replace(/l/g, 'I') // Replace lowercase L with capital I
      substitutionNote = 'Replaced lowercase "l" with capital "I". Near-identical in many browser fonts.'
    } else if (homoglyph.includes('o')) {
      homoglyph = homoglyph.replace(/o/g, '0') // o -> zero
      substitutionNote = 'Replaced letter "o" with number "0" (zero).'
    } else if (homoglyph.includes('rn')) {
      homoglyph = homoglyph.replace(/rn/g, 'm')
      substitutionNote = 'Replaced letter combination "rn" with letter "m".'
    } else if (homoglyph.includes('m')) {
      homoglyph = homoglyph.replace(/m/g, 'rn')
      substitutionNote = 'Replaced letter "m" with letter combination "rn".'
    } else {
      // General lookalike substitution if no matches
      homoglyph = homoglyph.substring(0, homoglyph.length - 1) + '1'
      substitutionNote = 'Appended numeric "1" substitution trick.'
    }
    generated.push({
      typo: `${homoglyph}${tld}`,
      technique: 'Homoglyph Substitution',
      description: substitutionNote,
      riskScore: 95,
      verdict: 'Phishing',
      details: [
        'Uses visually deceptive unicode lookalikes.',
        'High probability of browser font rendering mimicry.',
        'Commonly used in target credential theft campaigns.'
      ]
    })

    // 2. Character Omission
    const omitIndex = Math.floor(name.length / 2)
    const omitted = name.substring(0, omitIndex) + name.substring(omitIndex + 1)
    generated.push({
      typo: `${omitted}${tld}`,
      technique: 'Character Omission',
      description: `Omitted the letter "${name[omitIndex]}" from the center of the domain name.`,
      riskScore: 78,
      verdict: 'Suspicious',
      details: [
        'Harnesses common user typing errors.',
        'Unregistered domain with no formal organization records.',
        'Slightly shorter domain length anomaly.'
      ]
    })

    // 3. Character Addition (Doubling)
    const doubleIndex = 0 // Double first character
    const doubled = name[doubleIndex] + name
    generated.push({
      typo: `${doubled}${tld}`,
      technique: 'Character Doubling',
      description: `Doubled the starting character "${name[doubleIndex]}" in the domain name.`,
      riskScore: 82,
      verdict: 'Suspicious',
      details: [
        'Tricks readers scanned quickly in emails.',
        'Heuristics mismatch relative to official registries.',
        'Domain age likely under 30 days.'
      ]
    })

    // 4. Combosquatting (Subdomain / Keywords)
    generated.push({
      typo: `login-${name}${tld}-security.net`,
      technique: 'Combosquatting / Keywords',
      description: `Appended phishing keywords "login" and "security" around the brand domain.`,
      riskScore: 98,
      verdict: 'Phishing',
      details: [
        'High risk keyword "login" used in domain namespace.',
        'Spoofs security verification authority.',
        'Likely references non-standard certificate authority.'
      ]
    })

    // 5. TLD Swap (Alternative domains)
    const fakeTld = '.secure-portal.info'
    generated.push({
      typo: `${name}${fakeTld}`,
      technique: 'TLD Swap',
      description: `Swapped standard TLD "${tld}" for unsafe extension "${fakeTld}".`,
      riskScore: 88,
      verdict: 'Phishing',
      details: [
        'Registered under generic TLD with high spam reputation.',
        'Hides destination using nested subdomains.',
        'Lacks standard EV (Extended Validation) brand records.'
      ]
    })

    setResults(generated)
    setActiveScanIndex(null)
    setScanState('idle')
  }

  // Trigger default run
  useEffect(() => {
    generateTypos('paypal.com')
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    generateTypos(domainInput)
  }

  const runSimulatedScan = (idx) => {
    setActiveScanIndex(idx)
    setScanState('scanning')
    
    // Animate scanning states
    setTimeout(() => {
      setScanState('finished')
    }, 1500)
  }

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header section */}
      <div className="border-b border-muted/20 pb-6 space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-accent flex items-center space-x-1.5">
          <FiActivity className="w-3.5 h-3.5" />
          <span>Educational Simulator Module</span>
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
          🎯 Lookalike Domain (Typosquatting) Simulator
        </h1>
        <p className="text-sm text-muted max-w-3xl">
          Attackers create sneaky lookalike domains (e.g. replacing `l` with `I`) to trick users into entering passwords. Enter your favorite brand domain below to see how these deceptive domains are constructed and audited.
        </p>
      </div>

      {/* Simulator Control Panel */}
      <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="e.g. netflix.com, google.com, paypal.com"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-muted/25 dark:border-accent/20 bg-primary/20 hover:border-accent/50 focus:border-accent focus:outline-none text-sm font-semibold tracking-wide transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-accent text-primary dark:text-primary font-extrabold text-sm tracking-wider hover:bg-accent/80 transition-all shadow-lg hover:shadow-accent/15 cursor-pointer"
          >
            Generate Lookalikes
          </button>
        </form>
      </section>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left side: Results Cards list */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted px-1">
            Generated Lookalike Scenarios
          </h3>
          
          <div className="space-y-4">
            {results.map((item, idx) => {
              let scoreColor = 'text-safe bg-safe/10 border-safe/20'
              if (item.riskScore >= 70) scoreColor = 'text-phishing bg-phishing/10 border-phishing/20'
              else if (item.riskScore >= 40) scoreColor = 'text-suspicious bg-suspicious/10 border-suspicious/20'

              return (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl bg-card border transition-all duration-300 ${
                    activeScanIndex === idx 
                      ? 'border-accent shadow-lg shadow-accent/5 scale-[1.01]' 
                      : 'border-muted/20 dark:border-accent/10 hover:border-accent/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-muted/5 pb-3">
                    <span className="text-sm font-mono font-bold text-accent break-all">
                      {item.typo}
                    </span>
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${scoreColor}`}>
                        Risk: {item.riskScore}%
                      </span>
                      <span className="text-[10px] text-muted font-semibold bg-primary/30 px-2 py-0.5 rounded border border-muted/10">
                        {item.technique}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted mt-3 leading-relaxed font-medium">
                    🔍 {item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[10px] text-muted font-bold tracking-wider">
                      <span>Original:</span>
                      <span className="text-[#0d1b2a] dark:text-white underline decoration-accent/40 font-mono">
                        {domainInput}
                      </span>
                    </div>
                    <button
                      onClick={() => runSimulatedScan(idx)}
                      className="px-3.5 py-1.5 rounded-lg border border-accent/40 hover:bg-accent/10 text-accent font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Audit Threat Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right side: Interactive Sandbox console output */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted px-1">
            Sandbox Intelligence Console
          </h3>

          <div className="rounded-3xl bg-[#030712] border border-[#1f2937] p-6 shadow-2xl font-mono text-xs text-emerald-400 min-h-[380px] flex flex-col justify-between">
            {activeScanIndex === null ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 py-10">
                <FiShield className="w-12 h-12 text-muted/30 animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-muted uppercase tracking-widest">Sandbox Offline</h4>
                  <p className="text-[11px] text-muted/60 max-w-[240px] leading-relaxed">
                    Click "Audit Threat Details" on any lookalike domain card to run a simulated sandbox heuristics scan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-between">
                
                {/* Console Log Area */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-muted pb-2 border-b border-[#1f2937]">
                    <span className="text-accent font-bold">phishzero@sandbox:~$</span>
                    <span>./audit --domain {results[activeScanIndex].typo}</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {scanState === 'scanning' ? (
                      <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 text-muted"
                      >
                        <div className="flex items-center space-x-2">
                          <FiActivity className="w-3.5 h-3.5 text-accent animate-spin" />
                          <span>Fetching WHOIS registrar logs...</span>
                        </div>
                        <div>[heuristics] Loading glyph homoglyph matching algorithms...</div>
                        <div>[ssl] Probing HTTPS certificates...</div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="finished"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3.5"
                      >
                        {/* Diagnostics list */}
                        <div className="space-y-1.5 text-white/90">
                          <div className="flex items-center space-x-1.5 text-rose-400 font-bold">
                            <FiAlertTriangle className="w-3.5 h-3.5" />
                            <span>[audit-alert] Flagged Typo: {results[activeScanIndex].typo}</span>
                          </div>
                          
                          <div className="text-[11px] text-muted pl-5 space-y-1 leading-relaxed">
                            {results[activeScanIndex].details.map((detail, dIdx) => (
                              <div key={dIdx}>• {detail}</div>
                            ))}
                          </div>
                        </div>

                        {/* Domain Age check */}
                        <div className="text-[11px] space-y-0.5">
                          <div className="text-muted font-bold">WHOIS records:</div>
                          <div className="pl-4 text-amber-300 font-medium">Registry Date: Created under 24 hours ago (Anomalous).</div>
                        </div>

                        {/* SSL Details */}
                        <div className="text-[11px] space-y-0.5">
                          <div className="text-muted font-bold">SSL Certificate:</div>
                          <div className="pl-4 text-amber-300 font-medium">Issuer: Let's Encrypt (DV Verified only). Mismatches brand registrar profile.</div>
                        </div>

                        {/* Output verdict badge */}
                        <div className="pt-2 border-t border-[#1f2937] flex items-center justify-between">
                          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Final Verdict:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            results[activeScanIndex].verdict === 'Phishing' 
                              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-500' 
                              : 'bg-amber-500/10 border border-amber-500/30 text-amber-500'
                          }`}>
                            {results[activeScanIndex].verdict}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Console footer */}
                <div className="text-[10px] text-muted flex items-center justify-between border-t border-[#1f2937] pt-3 select-none">
                  <span>Daemon active</span>
                  <span>Exit: 0</span>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

export default TyposquattingSimulator
