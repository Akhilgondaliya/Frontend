import React from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle } from 'react-icons/fi'

export const DetectionPipeline = () => {
  const steps = [
    'Submitted Target',
    'Domain Extraction',
    'WHOIS Lookup',
    'DNS Validation',
    'SSL Verification',
    'Redirect Analysis',
    'Keyword Detection',
    'Blacklist Check',
    'Heuristic Analysis',
    'Final Verdict'
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">Analysis Pipeline Execution</h3>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 shadow-md"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-x-auto pb-2">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              {/* Step item */}
              <motion.div variants={itemVariants} className="flex items-center space-x-2.5 flex-shrink-0">
                <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-safe/10 border border-safe">
                  <FiCheckCircle className="w-3.5 h-3.5 text-safe" />
                  {idx === steps.length - 1 && (
                    <span className="absolute -inset-1 rounded-full border border-safe/40 animate-ping pointer-events-none" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-muted block">Step {idx + 1}</span>
                  <span className="text-xs font-extrabold text-[#0d1b2a] dark:text-white block">{step}</span>
                </div>
              </motion.div>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block w-full min-w-[20px] h-[1px] bg-gradient-to-r from-safe to-safe/40 self-center flex-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default DetectionPipeline
