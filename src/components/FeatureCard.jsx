import React from 'react'
import { motion } from 'framer-motion'

export const FeatureCard = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
      }}
      className="p-6 bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/15 dark:border-muted/10 hover:border-accent/45 dark:hover:border-accent/40 rounded-2xl shadow-md transition-all duration-300 group hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1.5 hover:scale-[1.01]"
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/15 text-accent dark:text-accent flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all duration-300 shadow-sm border border-accent/10">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white mb-2 group-hover:text-accent transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-muted">
        {description}
      </p>
    </motion.div>
  )
}
export default FeatureCard
