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
    <div className="space-y-4 text-left">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">Analysis Pipeline Execution</h3>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 shadow-md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => (
            <motion.div key={idx} variants={itemVariants} className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-safe/10 border border-safe shrink-0">
                <FiCheckCircle className="w-4 h-4 text-safe" />
                {idx === 9 && (
                  <span className="absolute -inset-1 rounded-full border border-safe/40 animate-ping pointer-events-none" />
                )}
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] uppercase font-bold text-muted block">Step {idx + 1}</span>
                <span className="text-xs font-extrabold text-[#0d1b2a] dark:text-white block truncate" title={step}>
                  {step}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default DetectionPipeline
