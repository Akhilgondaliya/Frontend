import React, { useState } from 'react'
import { FiMail, FiGithub, FiLinkedin, FiShield, FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiArrowRight, FiActivity } from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'

const QUESTIONS = [
  {
    question: "How do you usually check if a link is safe before clicking it?",
    options: [
      { text: "I hover over the link to verify the exact destination domain name.", risk: 0, feedback: "Correct! Hovering reveals the true destination domain, which is the most reliable check." },
      { text: "I click it, and if the page design looks professional, I trust it.", risk: 25, feedback: "High Risk! Phishing sites can easily copy the exact styles, logos, and layouts of official pages." },
      { text: "I check if there is a secure lock icon (HTTPS) in the browser address bar.", risk: 15, feedback: "Medium Risk. HTTPS only encrypts the connection—it does not prove the website ownership or safety." }
    ]
  },
  {
    question: "You receive an email warning that your bank account is locked. What is your first action?",
    options: [
      { text: "Click the 'Unlock Now' link immediately to resolve the issue.", risk: 25, feedback: "High Risk! Official banks will never ask you to unlock accounts through direct links in emails." },
      { text: "Delete the email and visit the bank's official website in a new tab.", risk: 0, feedback: "Correct! Accessing the website directly through a trusted bookmark or official domain is safe." },
      { text: "Reply to the sender email asking for identity verification.", risk: 15, feedback: "Medium Risk. Replying confirms your email address is active to scammers and exposes you to social engineering." }
    ]
  },
  {
    question: "A downloaded app requests permissions to 'Read and Send SMS messages'. What do you do?",
    options: [
      { text: "Grant the permission, as many utility apps need system access.", risk: 25, feedback: "High Risk! SMS permissions can be hijacked by malware to read your bank's 2FA OTP codes." },
      { text: "Deny permission and uninstall the application immediately.", risk: 0, feedback: "Correct! If the app has no legitimate need to read SMS, it is likely a security threat." },
      { text: "Grant it temporarily to check if the app runs correctly.", risk: 20, feedback: "High Risk. Even temporary access is enough for background malware to scrape your SMS inbox." }
    ]
  },
  {
    question: "A QR code sticker on a public parking meter promises a discount. How do you respond?",
    options: [
      { text: "Scan it and input my card details to secure the discount rate.", risk: 25, feedback: "High Risk! This is a typical 'quishing' scam where stickers are placed over real barcodes." },
      { text: "Ignore it and purchase parking only from the official terminal or app.", risk: 0, feedback: "Correct! Always pay through official domains or apps instead of scanning random codes." },
      { text: "Scan it to check the link destination but enter no payment details.", risk: 10, feedback: "Medium Risk. Just scanning can expose your browser version or trigger automated download scripts." }
    ]
  }
]

export const Contact = () => {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [quizScores, setQuizScores] = useState([])
  const [quizFinished, setQuizFinished] = useState(false)

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setCurrentIdx(0)
    setSelectedOpt(null)
    setQuizScores([])
    setQuizFinished(false)
  }

  const handleOptionSelect = (optIdx) => {
    if (selectedOpt !== null) return // Already answered
    setSelectedOpt(optIdx)
  }

  const handleNext = () => {
    const currentScore = QUESTIONS[currentIdx].options[selectedOpt].risk
    const updatedScores = [...quizScores, currentScore]
    setQuizScores(updatedScores)

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1)
      setSelectedOpt(null)
    } else {
      setQuizFinished(true)
    }
  }

  // Calculate total risk index (sum of answers, max 100)
  const totalRiskScore = quizScores.reduce((acc, curr) => acc + curr, 0)
  
  let riskRating = 'Safe / Low Risk'
  let riskColor = 'text-safe border-safe/20 bg-safe/5'
  let riskBadgeColor = 'border-safe text-safe'
  let riskIcon = <FiCheckCircle className="w-5 h-5 text-safe" />
  let riskDesc = 'Excellent! You have strong security awareness habits and can identify typical email, permission, and link spoofing techniques.'

  if (totalRiskScore >= 65) {
    riskRating = 'High Vulnerability'
    riskColor = 'text-phishing border-phishing/20 bg-phishing/5'
    riskBadgeColor = 'border-phishing text-phishing'
    riskIcon = <FiAlertTriangle className="w-5 h-5 text-phishing" />
    riskDesc = 'Danger! Your current habits make you highly susceptible to credential theft, fake overlays, and quishing scams. Review our How It Works guidelines!'
  } else if (totalRiskScore >= 30) {
    riskRating = 'Cautious Explorer'
    riskColor = 'text-suspicious border-suspicious/20 bg-suspicious/5'
    riskBadgeColor = 'border-suspicious text-suspicious'
    riskIcon = <FiAlertTriangle className="w-5 h-5 text-suspicious" />
    riskDesc = 'Good baseline, but you are vulnerable to advanced social engineering or mobile permission hijacking. Practice hovering links and denying high-risk permissions.'
  }

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-accent flex items-center justify-center space-x-1.5">
          <FiActivity className="w-4 h-4" />
          <span>Interactive Risk Assessment</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
           Vulnerability Sandbox Quiz
        </h1>
        <p className="text-sm text-muted max-w-xl mx-auto">
          Test your cybersecurity skills. Find out how likely you are to fall for modern phishing templates, permissions traps, and QR scams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Contact info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Box 1: Developer Info */}
          <section className="bg-card border border-muted/20 rounded-3xl p-6 space-y-6 shadow-md">
            <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white border-b border-muted/5 pb-3">
              Internship Details
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3 text-muted">
                <FaGraduationCap className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <span className="font-bold text-[#0d1b2a] dark:text-white block">Internship Project</span>
                  <span>IBM CSRBOX Cybersecurity Internship 2026</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-muted">
                <FiMail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <span className="font-bold text-[#0d1b2a] dark:text-white block">Email Direct</span>
                  <a href="mailto:akhilgondaliya30@gmail.com" className="hover:text-accent font-mono transition-colors">
                    akhilgondaliya30@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="border-t border-muted/5 pt-4 space-y-3">
              <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider block">Developer Links</span>
              <div className="flex items-center space-x-3">
                <a
                  href="https://github.com/Akhilgondaliya"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 text-xs text-muted hover:text-accent font-semibold transition-colors"
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
                  className="flex items-center space-x-1.5 text-xs text-muted hover:text-accent font-semibold transition-colors"
                  id="linkedin-profile-link"
                >
                  <FiLinkedin className="w-4 h-4 text-accent" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

          </section>
        </div>

        {/* Right Col: Quiz Area */}
        <div className="lg:col-span-8">
          <section className="bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 shadow-md">
            
            {!quizStarted ? (
              /* Intro Block */
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto border border-accent/20">
                  <FiShield className="w-8 h-8 text-accent animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Is Your Browser Safety Scammed?</h3>
                  <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                    Social engineering accounts for 90% of cyber attacks. Answer these 4 situational questions to calculate your vulnerability quotient.
                  </p>
                </div>
                <button
                  onClick={handleStartQuiz}
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wide hover:bg-accent/80 hover:scale-105 active:scale-95 transition-all shadow-md shadow-accent/15 cursor-pointer"
                >
                  <span>Start Security Audit</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : quizFinished ? (
              /* Results Block */
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white border-b border-muted/5 pb-3">
                  Threat Vulnerability Report
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Gauge Card */}
                  <div className="bg-primary/20 border border-muted/10 rounded-2xl p-6 text-center space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted">Vulnerability Score</span>
                    <p className="text-4xl font-extrabold text-accent">{totalRiskScore} <span className="text-xs text-muted">/ 100</span></p>
                  </div>

                  {/* Verdict Card */}
                  <div className={`md:col-span-2 p-5 rounded-2xl border ${riskColor} space-y-2`}>
                    <div className="flex items-center space-x-2">
                      {riskIcon}
                      <span className="font-extrabold uppercase text-xs tracking-wider">Rating: {riskRating}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{riskDesc}</p>
                  </div>
                </div>

                {/* Question Feedback Summary */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted">Assessment Diagnostics</h4>
                  <div className="space-y-3">
                    {QUESTIONS.map((q, idx) => {
                      const score = quizScores[idx]
                      let flagColor = 'bg-safe text-white'
                      let label = 'Clean'
                      if (score >= 25) {
                        flagColor = 'bg-phishing text-white'
                        label = 'Critical'
                      } else if (score >= 10) {
                        flagColor = 'bg-suspicious text-white'
                        label = 'Warning'
                      }
                      
                      return (
                        <div key={idx} className="p-3.5 bg-primary/10 border border-muted/5 rounded-2xl text-xs space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-[#0d1b2a] dark:text-white">Q{idx+1}: {q.question}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${flagColor}`}>
                              {label}
                            </span>
                          </div>
                          <p className="text-muted leading-relaxed">
                            {q.options.find((_, oIdx) => q.options[oIdx].risk === score)?.feedback || q.options[0].feedback}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleStartQuiz}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-accent/40 hover:bg-accent/10 text-accent font-bold text-xs tracking-wide transition-all cursor-pointer"
                  >
                    <FiRefreshCw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Quiz Question */
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-muted/5 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
                    Question {currentIdx + 1} of {QUESTIONS.length}
                  </span>
                  <span className="text-xs font-bold text-accent">
                    {Math.round(((currentIdx) / QUESTIONS.length) * 100)}% Complete
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#0d1b2a] dark:text-white leading-relaxed">
                    {QUESTIONS[currentIdx].question}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {QUESTIONS[currentIdx].options.map((opt, oIdx) => {
                      const isSelected = selectedOpt === oIdx
                      let optionBorder = 'border-muted/20 hover:border-accent/40 bg-primary/20'
                      if (selectedOpt !== null) {
                        if (isSelected) {
                          optionBorder = opt.risk === 0 
                            ? 'border-safe bg-safe/5 text-safe' 
                            : opt.risk >= 20 
                            ? 'border-phishing bg-phishing/5 text-phishing' 
                            : 'border-suspicious bg-suspicious/5 text-suspicious'
                        } else {
                          optionBorder = 'border-muted/10 opacity-40 bg-primary/10'
                        }
                      }
                      
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(oIdx)}
                          disabled={selectedOpt !== null}
                          className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all ${optionBorder} ${selectedOpt === null ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          {opt.text}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Show feedback if answered */}
                {selectedOpt !== null && (
                  <div className="p-4 bg-primary/20 border border-muted/10 rounded-2xl text-xs space-y-2.5 animate-fadeIn">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Security Analysis Verdict:</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        QUESTIONS[currentIdx].options[selectedOpt].risk === 0 
                          ? 'bg-safe/10 text-safe border border-safe/20' 
                          : QUESTIONS[currentIdx].options[selectedOpt].risk >= 20 
                          ? 'bg-phishing/10 text-phishing border border-phishing/20' 
                          : 'bg-suspicious/10 text-suspicious border border-suspicious/20'
                      }`}>
                        {QUESTIONS[currentIdx].options[selectedOpt].risk === 0 ? 'Correct' : 'Vulnerable'}
                      </span>
                    </div>
                    <p className="text-muted leading-relaxed font-medium">
                      {QUESTIONS[currentIdx].options[selectedOpt].feedback}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNext}
                        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-accent text-primary dark:text-primary font-bold text-xs tracking-wide hover:bg-accent/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>{currentIdx + 1 === QUESTIONS.length ? 'Finish' : 'Next Question'}</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </section>
        </div>

      </div>

    </div>
  )
}

export default Contact
