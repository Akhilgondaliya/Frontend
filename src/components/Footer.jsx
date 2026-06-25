import React from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin, FiMail, FiShield } from 'react-icons/fi'

export const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-card/30 border-t border-muted/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FiShield className="w-6 h-6 text-accent" />
              <span className="text-lg font-bold tracking-tight text-[#0d1b2a] dark:text-white">
                Phish<span className="text-accent">Zero</span>
              </span>
            </div>
            <p className="text-sm text-muted">
              Advanced heuristics, SSL, and domain age analytics tool checking for malicious phishing threats and QR-based quishing scams instantly.
            </p>
          </div>

          {/* Col 2: Project Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-accent">IBM CSRBOX Project 2026</h4>
            <p className="text-sm text-muted">
              Built as part of IBM CSRBOX Cybersecurity Internship 2026.
            </p>
          </div>

          {/* Col 3: Developer Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Developer</h4>
            <p className="text-sm text-[#0d1b2a] dark:text-white font-medium">Akhil Gondaliya</p>
            <p className="text-sm text-muted">Computer Engineering (CE)</p>
            <div className="flex space-x-4 pt-1">
              <a
                href="https://github.com/Akhilgondaliya"
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-accent transition-colors duration-200"
                aria-label="GitHub"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/akhil-gondaliya"
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-accent transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:akhilgondaliya30@gmail.com"
                className="text-muted hover:text-accent transition-colors duration-200"
                aria-label="Email"
              >
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>
        
        {/* Border / Copyright */}
        <div className="mt-8 pt-8 border-t border-muted/10 flex flex-col sm:flex-row items-center justify-between text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} PhishZero. Educational Purpose Only.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/about" className="hover:text-accent transition-colors">About Project</Link>
            <Link to="/how-it-works" className="hover:text-accent transition-colors">Documentation</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
export default Footer
