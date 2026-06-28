import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiGithub, FiExternalLink, FiAward, FiMail, FiCheck, FiCpu, FiTrendingUp, FiActivity, FiGlobe, FiDatabase, FiLock, FiTerminal, FiLayers } from 'react-icons/fi'
import RateUsCard from '../components/RateUsCard'


// Reusable Animated Counter component
const StatCard = ({ label, endVal, suffix = '' }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(String(endVal).replace(/[^\d]/g, ''), 10)
    if (isNaN(end) || end === 0) {
      setCount(endVal)
      return
    }

    const duration = 1200
    const increment = Math.ceil(end / 60) || 1

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [endVal])

  return (
    <div className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-3xl p-5 text-center shadow-md hover:border-accent/30 transition-all duration-300">
      <span className="text-3xl font-black text-[#0d1b2a] dark:text-white block">
        {typeof count === 'number' ? count.toLocaleString() : count}{suffix}
      </span>
      <p className="text-[10px] text-muted font-extrabold uppercase tracking-widest mt-1.5">{label}</p>
    </div>
  )
}

export const About = () => {
  const techStack = [
    { name: 'React', category: 'Frontend' },
    { name: 'Flask', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'WHOIS Lookup', category: 'Security' },
    { name: 'SSL Verification', category: 'Security' },
    { name: 'DNS Analysis', category: 'Security' },
    { name: 'QR Detection', category: 'Security' },
    { name: 'PDF Reports', category: 'Utility' },
    { name: 'Vercel', category: 'DevOps' },
    { name: 'GitHub', category: 'DevOps' }
  ]

  const pipelineSteps = [
    'User submits URL',
    'Domain Extraction',
    'WHOIS Lookup',
    'SSL Verification',
    'DNS Validation',
    'Security Heuristics',
    'Risk Score Calculation',
    'Final Verdict'
  ]

  const highlights = [
    'URL Phishing Detection',
    'QR Code Scanner',
    'SSL Analysis',
    'Domain Age Detection',
    'PDF Report Generator',
    'Responsive Design',
    'Modern UI',
    'Security Focused'
  ]

  const stats = [
    { label: 'Lines of Code', val: '2850', suffix: '+' },
    { label: 'Security Checks', val: '13', suffix: '' },
    { label: 'Detection Modules', val: '6', suffix: '' },
    { label: 'QR Scanner Accuracy', val: '100', suffix: '%' },
    { label: 'PDF Report Layouts', val: '1', suffix: '' },
    { label: 'Responsive Pages', val: '8', suffix: '' }
  ]

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
          About PhishZero
        </h1>
        <p className="text-sm text-muted max-w-xl mx-auto">
          Intelligent phishing sandbox, diagnostic checks, and credential protection dashboard.
        </p>
      </div>

      {/* Project Card Section */}
      <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl hover:shadow-lg hover:shadow-accent/5 hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300">
        
        {/* Animated Shield Logo */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="p-6 bg-accent/10 border border-accent/20 rounded-3xl flex-shrink-0"
        >
          <FiShield className="w-20 h-20 text-accent" />
        </motion.div>

        <div className="space-y-4 flex-1 text-center md:text-left">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-[#0d1b2a] dark:text-white">PhishZero</h2>
            <p className="text-xs uppercase font-extrabold tracking-widest text-accent font-mono">
              Built as part of IBM CSRBOX Cybersecurity Internship 2026
            </p>
          </div>
          <p className="text-sm text-muted leading-relaxed font-semibold">
            PhishZero is an intelligent phishing detection platform designed to analyze suspicious URLs and QR codes using domain intelligence, SSL verification, WHOIS data, and heuristic analysis. The platform helps users identify phishing attempts before interacting with malicious websites by providing transparent security insights and risk assessments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-2">
            <a
              href="https://github.com/Akhilgondaliya"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-accent text-primary dark:text-primary font-bold text-xs tracking-wider cursor-pointer hover:bg-accent/80 transition-colors"
            >
              <FiGithub className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
            <a
              href="/scan"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-muted/30 hover:border-accent/40 bg-card text-muted hover:text-accent font-bold text-xs tracking-wider cursor-pointer transition-all"
            >
              <span>Scan a Link Now</span>
              <FiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3 text-left">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Technology Stack</h2>
          <p className="text-xs text-muted">The technologies and tools driving the PhishZero analytics engine.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="px-4 py-2 bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 hover:border-accent/40 rounded-2xl text-xs font-extrabold text-[#0d1b2a] dark:text-white cursor-default hover:scale-105 transition-all duration-300 shadow-sm shadow-accent/5 flex items-center space-x-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How PhishZero Works */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3 text-left">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">How PhishZero Works</h2>
          <p className="text-xs text-muted">Chronological pipeline sequence of our sandbox execution thread.</p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="p-6 bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl shadow-md overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-x-auto pb-2 text-left">
            {pipelineSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <motion.div variants={itemVariants} className="flex items-center space-x-2.5 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent flex items-center justify-center text-[10px] font-bold text-accent">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold text-[#0d1b2a] dark:text-white">{step}</span>
                </motion.div>
                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden md:block w-8 h-[1px] bg-gradient-to-r from-accent/40 to-accent/10 flex-shrink-0 self-center" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Meet the Developer */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3 text-left">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Meet the Developer</h2>
          <p className="text-xs text-muted">The developer behind this project.</p>
        </div>

        <div className="p-6 sm:p-8 bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-xl hover:shadow-lg hover:shadow-accent/5 hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-2xl font-extrabold shadow-inner font-mono flex-shrink-0 animate-pulse">
            AG
          </div>
          
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h3 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Akhil Gondaliya</h3>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-wide self-center sm:self-auto">
                <FiAward className="w-3.5 h-3.5" />
                <span>Student & Intern</span>
              </span>
            </div>
            
            <p className="text-sm text-[#0d1b2a]/90 dark:text-white/90 font-medium">
              Diploma Engineering — Computer Engineering (Dr. S. & S.S. Ghandhy college of Engg. & Tech.)
            </p>
            
            <p className="text-xs text-muted leading-relaxed font-semibold">
              Computer Engineering student focused on developing threat heuristics, identifying web vulnerabilities, and analyzing attack vectors. Built as a core cybersecurity project under the IBM CSRBOX Cybersecurity Internship 2026.
            </p>
            
            <a href="mailto:akhilgondaliya30@gmail.com" className="inline-flex items-center space-x-1.5 text-xs text-muted hover:text-accent font-mono font-semibold transition-colors">
              <FiMail className="w-3.5 h-3.5 text-accent" />
              <span>akhilgondaliya30@gmail.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3 text-left">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Project Highlights</h2>
          <p className="text-xs text-muted">Core capabilities and key architectural aspects of PhishZero.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-2xl flex items-center space-x-2.5 hover:border-accent/30 transition-colors duration-300 text-left"
            >
              <div className="w-5 h-5 rounded-full bg-safe/10 flex items-center justify-center flex-shrink-0">
                <FiCheck className="w-3.5 h-3.5 text-safe" />
              </div>
              <span className="text-xs font-bold text-[#0d1b2a] dark:text-white truncate">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Project Statistics */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3 text-left">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Project Statistics</h2>
          <p className="text-xs text-muted">Quantifying the code scale and diagnostics tests loaded.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} label={stat.label} endVal={stat.val} suffix={stat.suffix} />
          ))}
        </div>
      </section>

      {/* Academic Disclaimer */}
      <div className="p-4 rounded-xl border border-muted/20 dark:border-accent/5 text-center bg-card/40 dark:bg-card/25 backdrop-blur-sm text-xs text-muted font-semibold">
        ⚠️ <b>Internship Notice:</b> Developed as part of IBM CSRBOX Cybersecurity Internship 2026. All sandboxed audits are simulated.
      </div>

    </div>
  )
}

export default About