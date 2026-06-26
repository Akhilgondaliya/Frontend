import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHelpCircle, FiChevronDown, FiAlertCircle } from 'react-icons/fi'

export const HowItWorks = () => {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // 10 Steps Timeline (Humanized)
  const steps = [
    { title: 'Step 1: Input URL or QR Code', desc: 'Paste a link directly, drag & drop a QR image, or stream it live via your webcam.' },
    { title: 'Step 2: Decode QR Target', desc: 'If you upload an image or take a webcam snapshot, we extract the hidden URL using pyzbar and OpenCV.' },
    { title: 'Step 3: Parse Website URL', desc: 'We extract the base domain, subdomains, and pathways so we can analyze them individually.' },
    { title: 'Step 4: Run Heuristic Checks', desc: 'Our backend checks the URL structure for common scam patterns (like spoofed brand names, strange characters, or link shorteners).' },
    { title: 'Step 5: Check SSL Certificate', desc: 'We check the website\'s security handshake on port 443 to see who issued their certificate and when it expires.' },
    { title: 'Step 6: Query Domain WHOIS database', desc: 'We check global database registers to see exactly when the domain was purchased and registered.' },
    { title: 'Step 7: Sum and Calculate Score', desc: 'We combine the points from our URL structure checks and the domain age records, capping the total risk rating at 100.' },
    { title: 'Step 8: Determine Safety Verdict', desc: 'We map the risk score into three ranges: Safe (0-39), Suspicious (40-69), or Phishing (70+).' },
    { title: 'Step 9: Load Verdict Dashboard', desc: 'We display the results on an interactive page, plotting a clean score ring, SSL records, and triggered flags.' },
    { title: 'Step 10: PDF Export on Demand', desc: 'You can generate a styled security PDF report to download, save, or share with your team.' }
  ]

  // Heuristic Point Table (Humanized)
  const signals = [
    { num: 1, name: 'No HTTPS', check: 'The website does not use secure SSL encryption.', pts: '+20' },
    { num: 2, name: 'IP as Host', check: 'Using raw numbers (like 192.168.1.1) in the URL instead of a normal name.', pts: '+25' },
    { num: 3, name: 'Suspicious TLD', check: 'Hosting on cheap or untrustworthy endings (like .tk, .ml, .xyz, or .top).', pts: '+20' },
    { num: 4, name: 'Brand Impersonation', check: 'Trying to trick you by putting popular brands (like "paypal" or "google") in a fake domain name.', pts: '+30' },
    { num: 5, name: 'Phishing Keywords', check: 'Containing urgent terms like "login", "verify", "secure", or "update" to build false trust.', pts: '+20' },
    { num: 6, name: '@ Symbol', check: 'Using the "@" sign, which forces browsers to ignore everything preceding it.', pts: '+15' },
    { num: 7, name: 'URL Shortener', check: 'Using URL shorteners (like bit.ly or tinyurl) to hide where the link actually goes.', pts: '+15' },
    { num: 8, name: 'Deep Subdomains', check: 'Having 3 or more subdomain prefixes, which is common in fake site pathways.', pts: '+15' },
    { num: 9, name: 'Abnormally Long URL', check: 'URL length exceeds 100 characters to try and hide parameters from your view.', pts: '+10' },
    { num: 10, name: 'Hex Obfuscation', check: 'Using percent symbols and numbers (like %20 or %3D) to hide real letters.', pts: '+10' },
    { num: 11, name: 'Domain Age < 30 days', check: 'The website was registered less than a month ago.', pts: '+25' },
    { num: 12, name: 'Domain Age < 180 days', check: 'The website was registered less than 6 months ago.', pts: '+10' },
    { num: 13, name: 'Hyphen in Domain', check: 'Using hyphens (like "secure-bank-login") to mimic official domains.', pts: '+5' },
    { num: 14, name: 'Numbers in Domain', check: 'Using numbers in the domain name, which is uncommon for popular brands.', pts: '+5' },
    { num: 15, name: 'Double Slashes', check: 'Having double slashes "//" inside the URL path to trigger hidden redirects.', pts: '+8' }
  ]

  // FAQs (Humanized)
  const faqs = [
    {
      q: 'Is PhishZero 100% accurate?',
      a: 'While our checks catch the vast majority of active phishing and spoofed pages, no automated scanner is completely perfect. Scammers create new techniques constantly. We recommend treating any "Suspicious" rating with caution and never entering passwords on sites you do not trust.'
    },
    {
      q: 'Does it store or log my scanned URLs?',
      a: 'No. PhishZero runs entirely stateless checks. Scanned links, QR pictures, and PDF reports are processed live in-memory and are never stored or logged in databases, keeping your checks completely private.'
    },
    {
      q: 'What is a heuristic check?',
      a: 'A heuristic check evaluates the structural qualities and text patterns of a URL string (such as character count, specific symbol usage, and domain prefixes). This allows us to spot fake sites instantly without relying on outdated databases.'
    },
    {
      q: 'Can I scan QR codes sent to me on chat apps?',
      a: 'Yes. Simply take a screenshot of the QR code, upload the image file to the upload zone, or hold your phone screen up to your webcam using our live camera scanner.'
    },
    {
      q: 'Is this tool free to use?',
      a: 'Yes. PhishZero is fully open-source and free, built under the IBM CSRBOX Cybersecurity Internship 2026.'
    }
  ]

  return (
    <div className="min-h-screen py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
          🤔 How We Check the Links
        </h1>
        <p className="text-sm text-muted max-w-xl mx-auto">
          A transparent look at the security rules, details, and databases we check to calculate the risk score.
        </p>
      </div>

      {/* Timeline steps */}
      <section className="space-y-8">
        <div className="border-b border-muted/20 pb-3">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Our 10-Step Scanning Process</h2>
          <p className="text-xs text-muted">What happens behind the scenes when you submit a scan.</p>
        </div>

        <div className="relative border-l border-muted/30 ml-4 pl-8 space-y-8 py-2">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <span className="absolute -left-12 top-0.5 w-8 h-8 rounded-full bg-card/90 dark:bg-card/80 border-2 border-accent text-accent font-mono font-extrabold text-xs flex items-center justify-center group-hover:bg-accent group-hover:text-primary dark:group-hover:text-[#060b14] group-hover:shadow-md group-hover:shadow-accent/20 transition-all duration-300">
                {idx + 1}
              </span>
              <h3 className="text-base font-bold text-[#0d1b2a] dark:text-white">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed mt-1 max-w-2xl">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verdict Zone Cards */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">How We Calculate the Safety Verdict</h2>
          <p className="text-xs text-muted">What the risk score ranges mean for your safety.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card/65 dark:bg-card/45 backdrop-blur-md border border-emerald-500/20 text-center space-y-2 hover:border-emerald-500/40 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5">
            <span className="text-xs font-bold text-safe bg-safe/10 px-2 py-0.5 rounded">Range: 0 – 39</span>
            <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">Verdict: SAFE</h3>
            <p className="text-xs text-muted font-semibold">Passed our checks with minimal to no flags. The website uses secure SSL encryption and has an established registration history.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card/65 dark:bg-card/45 backdrop-blur-md border border-amber-500/20 text-center space-y-2 hover:border-amber-500/40 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-amber-500/5">
            <span className="text-xs font-bold text-suspicious bg-suspicious/10 px-2 py-0.5 rounded">Range: 40 – 69</span>
            <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">Verdict: SUSPICIOUS</h3>
            <p className="text-xs text-muted font-semibold">A few warning flags were triggered (like missing SSL, a new domain, or odd keywords). We recommend browsing with caution.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card/65 dark:bg-card/45 backdrop-blur-md border border-rose-500/20 text-center space-y-2 hover:border-rose-500/40 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-rose-500/5">
            <span className="text-xs font-bold text-phishing bg-phishing/10 px-2 py-0.5 rounded">Range: 70 – 100</span>
            <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">Verdict: PHISHING</h3>
            <p className="text-xs text-muted font-semibold">High alert. Severe threat flags triggered (such as spoofed brand names, dangerous redirects, or multiple URL tricks).</p>
          </div>
        </div>
      </section>

      {/* Point Weight Table */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Our Security Checklist</h2>
          <p className="text-xs text-muted">A breakdown of the points we add when a flag is triggered.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-muted/20 dark:border-accent/10 bg-card/65 dark:bg-card/45 backdrop-blur-md shadow-md">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-card/40 dark:bg-card/25 border-b border-muted/20 text-accent font-bold uppercase tracking-wider text-xs">
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Check Name</th>
                <th className="p-4">What It Looks For</th>
                <th className="p-4 text-center w-24">Risk Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {signals.map((sig) => (
                <tr key={sig.num} className="hover:bg-card/30 dark:hover:bg-card/10 transition-colors">
                  <td className="p-4 text-center text-muted font-mono font-bold">{sig.num}</td>
                  <td className="p-4 font-semibold text-[#0d1b2a] dark:text-white">{sig.name}</td>
                  <td className="p-4 text-muted">{sig.check}</td>
                  <td className="p-4 text-center font-mono font-bold text-phishing">{sig.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Common Questions</h2>
          <p className="text-xs text-muted">Quick answers to help you get the most out of PhishZero.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer"
                id={`faq-btn-${idx}`}
              >
                <div className="flex items-center space-x-3 pr-4">
                  <FiHelpCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-[#0d1b2a] dark:text-white">{faq.q}</span>
                </div>
                <motion.div
                  animate={{ rotate: openFaq === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-muted"
                >
                  <FiChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-muted leading-relaxed border-t border-muted/10 bg-primary/20 dark:bg-primary/30">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
export default HowItWorks
