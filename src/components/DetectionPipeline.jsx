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
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
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
        {/* Row 1: Steps 1–5 */}
        <div className="grid grid-cols-5 items-center mb-4">
          {steps.slice(0, 5).map((step, idx) => (
            <React.Fragment key={idx}>
              <motion.div variants={itemVariants} className="flex items-center space-x-2.5">
                <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-safe/10 border border-safe shrink-0">
                  <FiCheckCircle className="w-3.5 h-3.5 text-safe" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-muted block">Step {idx + 1}</span>
                  <span className="text-xs font-extrabold text-[#0d1b2a] dark:text-white block">{step}</span>
                </div>
                {/* Connector line after each step except the last in the row */}
                {idx < 4 && (
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-safe to-safe/40 mx-2 min-w-[12px]" />
                )}
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-muted/10 mb-4" />

        {/* Row 2: Steps 6–10 */}
        <div className="grid grid-cols-5 items-center">
          {steps.slice(5, 10).map((step, idx) => (
            <React.Fragment key={idx + 5}>
              <motion.div variants={itemVariants} className="flex items-center space-x-2.5">
                <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-safe/10 border border-safe shrink-0">
                  <FiCheckCircle className="w-3.5 h-3.5 text-safe" />
                  {idx === 4 && (
                    <span className="absolute -inset-1 rounded-full border border-safe/40 animate-ping pointer-events-none" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-muted block">Step {idx + 6}</span>
                  <span className="text-xs font-extrabold text-[#0d1b2a] dark:text-white block">{step}</span>
                </div>
                {/* Connector line after each step except the last in the row */}
                {idx < 4 && (
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-safe to-safe/40 mx-2 min-w-[12px]" />
                )}
              </motion.div>
            </React.Fragment>
          ))}
        </div>

      </motion.div>
    </div>
  )
}

export default DetectionPipeline
