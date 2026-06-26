import React from 'react'
import { FiMail, FiGithub, FiLinkedin, FiUser } from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'

export const Contact = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
            Contact the Developer
          </h1>
          <p className="text-sm text-muted">
            Connect with me directly for project feedback or questions.
          </p>
        </div>

        {/* Profile Card */}
        <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden text-center hover:scale-[1.01] hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-accent/10 rounded-full filter blur-xl" />
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent/10 rounded-full filter blur-xl" />

          {/* Profile Icon */}
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto border border-accent/20 mb-4">
            <FiUser className="w-10 h-10 text-accent" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#0d1b2a] dark:text-white">Akhil Gondaliya</h2>
            <p className="text-xs text-accent font-semibold tracking-wider uppercase">Computer Engineering (CE)</p>
          </div>

          {/* Details list */}
          <div className="space-y-4 pt-4 border-t border-muted/5 text-left text-xs sm:text-sm">
            <div className="flex items-start space-x-3 text-muted">
              <FaGraduationCap className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5">
                <span className="font-bold text-[#0d1b2a] dark:text-white block">College</span>
                <span>Dr. S. & S.S. Ghandhy College of Engg. & Tech.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-muted">
              <FiMail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5">
                <span className="font-bold text-[#0d1b2a] dark:text-white block">Email Direct</span>
                <a href="mailto:akhilgondaliya30@gmail.com" className="hover:text-accent font-mono transition-colors">
                  akhilgondaliya30@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="border-t border-muted/5 pt-5 flex justify-center space-x-6">
            <a
              href="https://github.com/Akhilgondaliya"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-xs text-muted hover:text-accent font-semibold transition-colors"
              id="github-profile-link"
            >
              <FiGithub className="w-4 h-4 text-accent" />
              <span>GitHub</span>
            </a>
            <span className="text-muted/30">|</span>
            <a
              href="https://www.linkedin.com/in/akhil-gondaliya"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-xs text-muted hover:text-accent font-semibold transition-colors"
              id="linkedin-profile-link"
            >
              <FiLinkedin className="w-4 h-4 text-accent" />
              <span>LinkedIn</span>
            </a>
          </div>

        </section>

      </div>
    </div>
  )
}

export default Contact
