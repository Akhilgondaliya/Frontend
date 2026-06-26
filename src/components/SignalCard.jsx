import React from 'react'
import { motion } from 'framer-motion'

export const SignalCard = ({ signal, index = 0 }) => {
  const { name, triggered, points, description, category } = signal

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full backdrop-blur-md ${
        triggered
          ? 'border-phishing/40 bg-phishing/10 dark:bg-phishing/5 shadow-md shadow-phishing/5'
          : 'bg-card/65 dark:bg-card/45 border-muted/20 dark:border-muted/10 hover:border-accent/45 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5'
      }`}
    >
      <div className="space-y-2">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted px-2 py-0.5 rounded-full bg-primary/40">
            {category}
          </span>
          <div className="flex items-center space-x-2">
            {/* Status Indicator Dot */}
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                triggered ? 'bg-phishing animate-pulse' : 'bg-safe'
              }`}
            />
            <span
              className={`text-xs font-bold uppercase ${
                triggered ? 'text-phishing' : 'text-safe'
              }`}
            >
              {triggered ? 'Triggered' : 'Clean'}
            </span>
          </div>
        </div>

        {/* Name and Description */}
        <h4 className="text-base font-bold text-[#0d1b2a] dark:text-white pt-1">
          {name}
        </h4>
        <p className="text-xs text-muted leading-relaxed">
          {description}
        </p>
      </div>

      {/* Points Weight */}
      <div className="mt-4 pt-3 border-t border-muted/5 flex items-center justify-between text-xs">
        <span className="text-muted">Risk Weight</span>
        <span
          className={`px-2 py-1 rounded font-mono font-bold ${
            triggered ? 'bg-phishing/10 text-phishing' : 'bg-safe/10 text-safe'
          }`}
        >
          {triggered ? `+${points} Points` : '0 Points'}
        </span>
      </div>
    </motion.div>
  )
}
export default SignalCard
