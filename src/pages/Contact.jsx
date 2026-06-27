import React, { useState } from 'react'
import { FiMail, FiGithub, FiLinkedin, FiUser, FiMapPin, FiCheckCircle, FiLock, FiGlobe, FiClock, FiSend } from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'
import { toast } from 'react-toastify'

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nameTrim = formData.name.trim()
    const emailTrim = formData.email.trim()
    const subjectTrim = formData.subject.trim()
    const messageTrim = formData.message.trim()

    if (!nameTrim || !emailTrim || !subjectTrim || !messageTrim) {
      toast.error('All fields are required.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailTrim)) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nameTrim,
          email: emailTrim,
          subject: subjectTrim,
          message: messageTrim
        })
      })

      if (response.ok) {
        toast.success('Your message has been sent successfully!')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        const errData = await response.json().catch(() => ({}))
        toast.error(errData.error || 'Failed to send message. Please try again.')
      }
    } catch (err) {
      toast.error('Unable to reach the server. Please check your network connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
          Contact & Collaboration
        </h1>
        <p className="text-sm text-muted">
          Connect directly for cybersecurity feedback, research, or internship inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Metadata details & developer profile card) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Profile Card */}
          <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden text-center hover:scale-[1.01] hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-accent/10 rounded-full filter blur-xl" />
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent/10 rounded-full filter blur-xl" />

            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto border border-accent/20 mb-4">
              <FiUser className="w-10 h-10 text-accent" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[#0d1b2a] dark:text-white">Akhil Gondaliya</h2>
              <p className="text-xs text-accent font-semibold tracking-wider uppercase">Computer Engineering (CE)</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-muted/5 text-left text-xs sm:text-sm">
              <div className="flex items-start space-x-3 text-muted">
                <FaGraduationCap className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0d1b2a] dark:text-white block">College</span>
                  <span>Dr. S. & S.S. Ghandhy College of Engg. & Tech.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-muted">
                <FiMapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0d1b2a] dark:text-white block">Location</span>
                  <span>Surat, Gujarat</span>
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

          {/* Availability */}
          <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 space-y-4 shadow-xl text-left">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white">Availability</h3>
            <div className="space-y-3">
              {[
                'Cybersecurity Projects',
                'Internships',
                'Research',
                'Freelance',
                'Open Source'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-muted">
                  <FiCheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-xs font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Skills */}
          <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 space-y-4 shadow-xl text-left">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Python', 'React', 'Flask', 'Tailwind CSS', 'Cybersecurity', 'Networking', 'Machine Learning', 'Linux', 'Git', 'GitHub'
              ].map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-accent/5 border border-accent/10 hover:border-accent/30 rounded-xl text-[10px] font-extrabold text-accent select-none cursor-default transition-all duration-300">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Response Time */}
          <section className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-3xl p-5 flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-3">
              <FiClock className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold text-muted">Average Reply Time</span>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-accent/10 text-accent uppercase tracking-wider">
              Within 24 Hours
            </span>
          </section>

          {/* Quick Links */}
          <section className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-3xl p-6 space-y-4 shadow-xl text-left">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="https://github.com/Akhilgondaliya" target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-muted/20 hover:border-accent/30 bg-card/40 text-muted hover:text-accent font-bold text-xs transition-colors">
                <FiGithub className="w-4 h-4 text-accent" />
                <span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/akhil-gondaliya" target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-muted/20 hover:border-accent/30 bg-card/40 text-muted hover:text-accent font-bold text-xs transition-colors">
                <FiLinkedin className="w-4 h-4 text-accent" />
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/Akhilgondaliya/PhishZero" target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-muted/20 hover:border-accent/30 bg-card/40 text-muted hover:text-accent font-bold text-xs transition-colors">
                <FiGlobe className="w-4 h-4 text-accent" />
                <span>Portfolio</span>
              </a>
              <a href="mailto:akhilgondaliya30@gmail.com" className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-muted/20 hover:border-accent/30 bg-card/40 text-muted hover:text-accent font-bold text-xs transition-colors">
                <FiMail className="w-4 h-4 text-accent" />
                <span>Email</span>
              </a>
            </div>
          </section>

          {/* Security Notice */}
          <div className="p-4 rounded-2xl border border-muted/15 bg-card/30 backdrop-blur-sm text-left flex items-start space-x-3">
            <FiLock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted leading-relaxed font-semibold">
              <b>Security Notice:</b> Your submitted information is only used to respond to your inquiry. No information is stored or shared.
            </p>
          </div>

        </div>

        {/* Right Column (Let's Collaborate and Contact Form) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Collaborate Intro Card */}
          <section className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl text-left">
            <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Let's Collaborate</h2>
            <p className="text-sm text-muted leading-relaxed font-semibold">
              I'm always open to discussing cybersecurity, software development, internships, open-source contributions, research, and innovative project ideas.
            </p>
          </section>

          {/* Contact Form Card */}
          <section className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 shadow-xl text-left">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0d1b2a] dark:text-white uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 bg-card/50 dark:bg-card/30 border border-muted/20 focus:border-accent/40 rounded-xl text-sm font-semibold text-[#0d1b2a] dark:text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0d1b2a] dark:text-white uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-card/50 dark:bg-card/30 border border-muted/20 focus:border-accent/40 rounded-xl text-sm font-semibold text-[#0d1b2a] dark:text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0d1b2a] dark:text-white uppercase tracking-wider block mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Inquiry Topic"
                  className="w-full px-4 py-3 bg-card/50 dark:bg-card/30 border border-muted/20 focus:border-accent/40 rounded-xl text-sm font-semibold text-[#0d1b2a] dark:text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0d1b2a] dark:text-white uppercase tracking-wider block mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 bg-card/50 dark:bg-card/30 border border-muted/20 focus:border-accent/40 rounded-xl text-sm font-semibold text-[#0d1b2a] dark:text-white outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wider hover:bg-accent/80 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </section>

        </div>

      </div>

    </div>
  )
}

export default Contact
