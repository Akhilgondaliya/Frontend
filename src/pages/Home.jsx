import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShield, FiLink, FiCamera, FiLock, FiCalendar, FiFileText, FiArrowRight } from 'react-icons/fi'
import FeatureCard from '../components/FeatureCard'

// Helper component for counting numbers up on load
const StatCounter = ({ endValue, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const parsedEnd = parseInt(String(endValue).replace(/[^\d]/g, ''), 10)
    if (isNaN(parsedEnd)) {
      setCount(endValue)
      return
    }

    const duration = 1500
    const stepTime = Math.abs(Math.floor(duration / parsedEnd))
    const timer = setInterval(() => {
      start += 1
      if (start >= parsedEnd) {
        setCount(endValue)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, Math.max(stepTime, 15))

    return () => clearInterval(timer)
  }, [endValue])

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

export const Home = () => {
  const [typeCount, setTypeCount] = useState(0)

  const line1 = "Links Lie. Scammers Hide."
  // Line 2 is rendered with styled PhishZero after line1 finishes
  const line2Text = " Finds Them."
  const phishZeroLen = 9 // "PhishZero" length
  const totalLength = line1.length + phishZeroLen + line2Text.length

  // Typewriter effect (Safe from React StrictMode double-rendering)
  useEffect(() => {
    let count = 0
    let isMounted = true
    let timeoutId = null

    const typeCharacter = () => {
      if (count <= totalLength && isMounted) {
        setTypeCount(count)
        count++
        timeoutId = setTimeout(typeCharacter, 70)
      }
    }

    typeCharacter()

    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  // Calculate how much of line2 (PhishZero + Finds Them.) to show
  const line2Count = Math.max(0, typeCount - line1.length)
  const phishZeroCount = Math.min(line2Count, phishZeroLen)
  const findsThemCount = Math.max(0, line2Count - phishZeroLen)

  return (
    <div className="min-h-screen grid-bg overflow-x-hidden flex flex-col justify-between">
      
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span>Smart website security scanning</span>
            </div>
            
            {/* Typing effect title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white min-h-[120px] sm:min-h-[160px] leading-tight">
              {/* Line 1: Links Lie. Scammers Hide. */}
              <span>{line1.slice(0, typeCount)}</span>
              
              {/* Line 2: PhishZero Finds Them. */}
              {typeCount > line1.length && (
                <span className="block mt-2 sm:mt-4">
                  {/* "Phish" part — inherits dark/white text */}
                  <span>{"Phish".slice(0, Math.min(phishZeroCount, 5))}</span>
                  {/* "Zero" part — accent color */}
                  {phishZeroCount > 5 && (
                    <span className="text-accent">{"Zero".slice(0, phishZeroCount - 5)}</span>
                  )}
                  {/* " Finds Them." part */}
                  {findsThemCount > 0 && (
                    <span>{line2Text.slice(0, findsThemCount)}</span>
                  )}
                </span>
              )}
              
              {typeCount < totalLength && (
                <span className="text-accent animate-pulse font-light ml-1">|</span>
              )}
            </h1>
            
            <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Suspicious link in an email? Odd QR code in a message? PhishZero scans them in seconds using domain details, SSL security, and 13+ smart checklist tests—helping you stay one step ahead of online scammers.
            </p>
            
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/demo"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-accent text-primary dark:text-primary font-extrabold text-sm tracking-wide shadow-lg shadow-accent/20 hover:bg-accent/80 hover:shadow-accent/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                id="hero-scan-cta"
              >
                <span>Start Scanning</span>
                <FiArrowRight className="w-4 h-4 font-bold" />
              </Link>
              <Link
                to="/how-it-works"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl border border-muted/30 hover:border-accent/40 bg-card/40 text-muted hover:text-accent font-extrabold text-sm tracking-wide transition-all cursor-pointer"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Right Hero Column: Animated Floating Shield */}
          <div className="lg:col-span-5 flex justify-center z-10">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="relative flex items-center justify-center"
            >
              {/* Outer glow aura */}
              <div className="absolute w-72 h-72 sm:w-80 sm:h-80 bg-accent/10 dark:bg-accent/5 rounded-full filter blur-3xl animate-pulse" />
              
              {/* Floating holographic card container */}
              <div className="relative p-8 rounded-3xl bg-card border border-muted/20 shadow-2xl flex flex-col items-center justify-center text-center max-w-[280px]">
                <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
                  <FiShield className="w-16 h-16 text-accent" />
                </div>
                <h3 className="text-base font-bold text-[#0d1b2a] dark:text-white">Active Shield</h3>
                <p className="text-xs text-muted mt-2">Checking links, identifying clones, and flagging threats to keep you browsing safely.</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-muted/20 bg-card/25 dark:bg-card/25 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-accent">
                <StatCounter endValue={13} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm font-semibold text-muted uppercase tracking-wider">Security Tests</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] dark:text-white">
                <StatCounter endValue={100} />
              </p>
              <p className="text-xs sm:text-sm font-semibold text-muted uppercase tracking-wider">Max Risk Score</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-safe">
                <StatCounter endValue={0} suffix="ms" />
              </p>
              <p className="text-xs sm:text-sm font-semibold text-muted uppercase tracking-wider">Scan Delay</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-suspicious">
                <StatCounter endValue={3} />
              </p>
              <p className="text-xs sm:text-sm font-semibold text-muted uppercase tracking-wider">Safety Ratings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
            How We Protect You
          </h2>
          <p className="text-sm sm:text-base text-muted font-medium">
            PhishZero runs local sandboxed checks to evaluate domain authenticity and certificate registry dates—without saving or logging your personal details.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <FeatureCard
            title="🔗 URL Structure Scans"
            description="We read the URL structure to check if it's hiding something, like strange symbols, double slashes, or hidden redirects."
            icon={FiLink}
          />
          <FeatureCard
            title="📷 QR Code Scanning"
            description="Easily verify QR codes from your screen, a file upload, or your live webcam to make sure they lead to where they claim."
            icon={FiCamera}
          />
          <FeatureCard
            title="🔐 SSL Connection Audit"
            description="We test the site's secure handshake connection, check who issued the certificate, and alert you if it is about to expire."
            icon={FiLock}
          />
          <FeatureCard
            title="📅 Domain Age Lookup"
            description="Brand-new domains are a common red flag. We query WHOIS registers to check when the site was created."
            icon={FiCalendar}
          />
          <FeatureCard
            title="🎭 Brand Spoof Detection"
            description="Scammers love to clone sites like PayPal or Google. We instantly flag URLs trying to pass as popular platforms."
            icon={FiShield}
          />
          <FeatureCard
            title="📄 PDF Report Creator"
            description="Save a clean, printable PDF report containing details of the threat signals to share with your friends or team."
            icon={FiFileText}
          />
        </motion.div>
      </section>

      {/* How It Works Preview */}
      <section className="border-t border-muted/20 bg-card/10 dark:bg-card/10 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">Our 3-Step Scanning Process</h2>
            <p className="text-sm text-muted font-medium">Get a clear safety verdict on any website in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-center">
            
            {/* Step 1 */}
            <div className="p-6 bg-card border border-muted/20 rounded-2xl text-center space-y-2">
              <span className="text-xs uppercase font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Step 1</span>
              <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">Submit a Link or QR</h3>
              <p className="text-xs text-muted">Paste any link you're unsure about, drop a QR image, or scan it live with your webcam.</p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-card border border-muted/20 rounded-2xl text-center space-y-2">
              <span className="text-xs uppercase font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Step 2</span>
              <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">Let Us Do the Checking</h3>
              <p className="text-xs text-muted">We fetch the website's SSL details, run a WHOIS check, and evaluate the domain structure.</p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-card border border-muted/20 rounded-2xl text-center space-y-2">
              <span className="text-xs uppercase font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Step 3</span>
              <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">Get a Clear Verdict</h3>
              <p className="text-xs text-muted">Instantly see if the site is Safe, Suspicious, or a Phishing risk with a clean PDF report.</p>
            </div>

          </div>

          <div className="text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center space-x-2 text-sm font-bold text-accent hover:text-accent/80 transition-colors"
            >
              <span>Explore all security rules</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Phishing Stats Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-[#0d1b2a] dark:text-white">Understanding the Threats</h2>
          <p className="text-sm text-muted font-medium">Why screening your links is a critical cybersecurity habit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 bg-card border border-muted/20 rounded-3xl space-y-3 relative hover:scale-102 transition-transform duration-300">
            <span className="text-5xl">📧</span>
            <h3 className="text-xl font-extrabold text-[#0d1b2a] dark:text-white">They Land in Your Inbox</h3>
            <p className="text-xs text-muted leading-relaxed">
              Standard email filters miss a huge portion of phishing links. Statistically, 1 out of every 99 emails delivered contains a malicious target link.
            </p>
          </div>

          <div className="p-8 bg-card border border-muted/20 rounded-3xl space-y-3 relative hover:scale-102 transition-transform duration-300">
            <span className="text-5xl">📷</span>
            <h3 className="text-xl font-extrabold text-[#0d1b2a] dark:text-white">QR Codes Are the New Target</h3>
            <p className="text-xs text-muted leading-relaxed">
              Scammers love QR codes because filters can't read links inside images. QR phishing (also known as quishing) has grown by 587% recently.
            </p>
          </div>

          <div className="p-8 bg-card border border-muted/20 rounded-3xl space-y-3 relative hover:scale-102 transition-transform duration-300">
            <span className="text-5xl">⌛</span>
            <h3 className="text-xl font-extrabold text-[#0d1b2a] dark:text-white">They Vanish Quickly</h3>
            <p className="text-xs text-muted leading-relaxed">
              The average phishing page stays online for less than 5 hours to avoid security blocks. Static database blacklists just can't keep up.
            </p>
          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-card border-t border-muted/20 py-16 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-[#0d1b2a] dark:text-white">Want to Check a Link?</h2>
          <p className="text-sm text-muted max-w-xl mx-auto font-medium">
            Paste a link or point your camera at a QR code to see if it is safe to visit.
          </p>
          <div className="pt-2">
            <Link
              to="/demo"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-accent text-primary dark:text-primary font-extrabold text-sm tracking-wide hover:bg-accent/80 transition-all hover:scale-105 cursor-pointer"
              id="final-cta-btn"
            >
              <span>Scan Website Now</span>
              <FiArrowRight className="w-4 h-4 font-bold" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
export default Home