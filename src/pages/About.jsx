import React from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiGithub, FiExternalLink, FiAward, FiMail } from 'react-icons/fi'

export const About = () => {
  


  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
          About PhishZero
        </h1>
        <p className="text-sm text-muted max-w-xl mx-auto">
          Why PhishZero was built and the developer who crafted it.
        </p>
      </div>

      {/* Project Card Section */}
      <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl hover:shadow-lg hover:shadow-accent/5 hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300">
        
        {/* Animated Shield Logo */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="p-6 bg-accent/10 border border-accent/20 rounded-3xl"
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
          <p className="text-sm text-muted leading-relaxed font-medium">
            PhishZero was designed to make link checking simple, visual, and secure. Built as a hands-on cybersecurity project, it analyzes suspicious URLs and QR codes locally to tell you if they are safe to visit. By reading domain structures, testing SSL handshake security, and checking registration records, it provides a transparent risk score so you can browse with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
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

      {/* Developer and Academic Credentials */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Who Built This?</h2>
          <p className="text-xs text-muted">The developer behind this project.</p>
        </div>

        <div className="p-6 sm:p-8 bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-xl hover:shadow-lg hover:shadow-accent/5 hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300">
          {/* Avatar Circle with initials */}
          <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-2xl font-extrabold shadow-inner font-mono flex-shrink-0 animate-pulse">
            AG
          </div>
          
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h3 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Akhil Gondaliya</h3>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-wide self-center sm:self-auto">
                <FiAward className="w-3.5 h-3.5" />
                <span>Developer & Cybersecurity Intern</span>
              </span>
            </div>
            
            <p className="text-sm text-[#0d1b2a]/90 dark:text-white/90 font-medium">
              Diploma Engineering — Computer Engineering (Dr. S. & S.S. Ghandhy college of Engg. & Tech.)
            </p>
            
            <p className="text-xs text-muted leading-relaxed font-semibold">
              Computer Engineering student focused on building secure web applications, identifying vulnerabilities, and coding threat heuristics. Built as a hands-on cybersecurity project under the IBM CSRBOX Cybersecurity Internship 2026.
            </p>
            
            <a href="mailto:akhilgondaliya30@gmail.com" className="inline-flex items-center space-x-1.5 text-xs text-muted hover:text-accent font-mono font-semibold transition-colors">
              <FiMail className="w-3.5 h-3.5 text-accent" />
              <span>akhilgondaliya30@gmail.com</span>
            </a>
          </div>
        </div>
      </section>



      {/* Academic Disclaimer footer block */}
      <div className="p-4 rounded-xl border border-muted/20 dark:border-accent/5 text-center bg-card/40 dark:bg-card/25 backdrop-blur-sm text-xs text-muted font-semibold">
        ⚠️ <b>Internship Notice:</b> Developed as part of IBM CSRBOX Cybersecurity Internship 2026. All sandboxed audits are simulated.
      </div>

    </div>
  )
}
export default About