import React, { useState } from 'react'
import { FiShield, FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiArrowRight, FiActivity } from 'react-icons/fi'

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

export const Quiz = () => {
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

  const totalRiskScore = quizScores.reduce((acc, curr) => acc + curr, 0)
  
  let riskRating = 'Safe / Low Risk'
  let riskColor = 'text-safe border-safe/20 bg-safe/5'
  let riskBadgeColor = 'border-safe text-safe'
  let riskIcon = <FiCheckCircle className="w-5 h-5 text-safe" />
  let riskDesc = 'Excellent! You have strong security habits and can easily identify typical mail, permission, and link spoofing attacks.'

  if (totalRiskScore >= 65) {
    riskRating = 'High Vulnerability'
    riskColor = 'text-phishing border-phishing/20 bg-phishing/5'
    riskBadgeColor = 'border-phishing text-phishing'
    riskIcon = <FiAlertTriangle className="w-5 h-5 text-phishing" />
    riskDesc = 'Danger! Your habits make you highly susceptible to credential theft, fake overlays, and quishing scams. Review our How It Works guidelines!'
  } else if (totalRiskScore >= 30) {
    riskRating = 'Cautious Explorer'
    riskColor = 'text-suspicious border-suspicious/20 bg-suspicious/5'
    riskBadgeColor = 'border-suspicious text-suspicious'
    riskIcon = <FiAlertTriangle className="w-5 h-5 text-suspicious" />
    riskDesc = 'Good baseline, but you are vulnerable to social engineering or mobile permission hijacking. Practice hovering links and denying high-risk permissions.'
  }

  return (
    <div className="min-h-screen py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-accent flex items-center justify-center space-x-1.5">
          <FiActivity className="w-4 h-4" />
          <span>Interactive Assessment</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
           Phishing Vulnerability Sandbox Quiz
        </h1>
        <p className="text-sm text-muted max-w-2xl mx-auto">
          Evaluate your risk against social engineering, link clones, permission overlays, and quishing parking hacks.
        </p>
      </div>

      <div className="w-full">
        <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          {!quizStarted ? (
            /* Intro Block */
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto border border-accent/20">
                <FiShield className="w-8 h-8 text-accent animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Is Your Browsing Vulnerable to Cyber Threat Scams?</h3>
                <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                  Scammers use sophisticated psychological tactics to target victims. Take our 4-question threat scenario quiz to discover your vulnerability index.
                </p>
              </div>
              <button
                onClick={handleStartQuiz}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wide hover:bg-accent/80 hover:scale-105 active:scale-95 transition-all shadow-md shadow-accent/15 cursor-pointer"
              >
                <span>Start Threat Quiz</span>
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
                {/* Score display card */}
                <div className="bg-primary/20 border border-muted/10 rounded-2xl p-6 text-center space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted">Vulnerability Index</span>
                  <p className="text-4xl font-extrabold text-accent">{totalRiskScore} <span className="text-xs text-muted">/ 100</span></p>
                </div>

                {/* Verdict rating card */}
                <div className={`md:col-span-2 p-5 rounded-2xl border ${riskColor} space-y-2`}>
                  <div className="flex items-center space-x-2">
                    {riskIcon}
                    <span className="font-extrabold uppercase text-xs tracking-wider">Rating: {riskRating}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{riskDesc}</p>
                </div>
              </div>

              {/* Assessment checklist details */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted">Threat Diagnostics</h4>
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
                      <div key={idx} className="p-4 bg-primary/20 dark:bg-card/30 backdrop-blur-sm border border-muted/15 dark:border-accent/5 rounded-2xl text-xs space-y-1.5 hover:border-accent/30 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-[#0d1b2a] dark:text-white">Scenario {idx+1}: {q.question}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${flagColor}`}>
                            {label}
                          </span>
                        </div>
                        <p className="text-muted leading-relaxed font-semibold">
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
                    let optionBorder = 'border-muted/25 hover:border-accent/45 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 hover:scale-[1.01] hover:-translate-y-0.5'
                    if (selectedOpt !== null) {
                      if (isSelected) {
                        optionBorder = opt.risk === 0 
                          ? 'border-safe bg-safe/10 dark:bg-safe/5 text-safe' 
                          : opt.risk >= 20 
                          ? 'border-phishing bg-phishing/10 dark:bg-phishing/5 text-phishing' 
                          : 'border-suspicious bg-suspicious/10 dark:bg-suspicious/5 text-suspicious'
                      } else {
                        optionBorder = 'border-muted/10 opacity-40 bg-primary/5 dark:bg-primary/10'
                      }
                    }
                    
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(oIdx)}
                        disabled={selectedOpt !== null}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-200 ${optionBorder} ${selectedOpt === null ? 'cursor-pointer shadow-sm hover:shadow-md' : 'cursor-default'}`}
                      >
                        {opt.text}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedOpt !== null && (
                <div className="p-4 bg-primary/30 dark:bg-card/50 backdrop-blur-sm border border-muted/15 dark:border-accent/10 rounded-2xl text-xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Security Analysis:</span>
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
  )
}

export default Quiz
