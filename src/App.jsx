import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AnimatePresence } from 'framer-motion'

import { ThemeContext } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import MarqueeBanner from './components/MarqueeBanner'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'

import Home from './pages/Home'
import Scan from './pages/Scan'
import Result from './pages/Result'
import ResultMail from './pages/ResultMail'
import ResultFile from './pages/ResultFile'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import Contact from './pages/Contact'
import Quiz from './pages/Quiz'

const AppContent = () => {
  const { theme } = useContext(ThemeContext)
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen w-full text-[#0d1b2a] dark:text-white bg-primary grid-bg relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/5 dark:bg-accent/5 filter blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent/5 dark:bg-accent/5 filter blur-[150px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Scroll Progress line indicator */}
      <ScrollProgress />

      {/* Global Navigation header */}
      <Navbar />

      {/* Infinite statistics marquee banner */}
      <MarqueeBanner />

      {/* Dynamic Route Pages Container */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/scan" element={<PageTransition><Scan /></PageTransition>} />
            <Route path="/result" element={<PageTransition><Result /></PageTransition>} />
            <Route path="/result-mail" element={<PageTransition><ResultMail /></PageTransition>} />
            <Route path="/result-file" element={<PageTransition><ResultFile /></PageTransition>} />
            <Route path="/how-it-works" element={<PageTransition><HowItWorks /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Global footer details */}
      <Footer />

      {/* Notifications center */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  )
}

export const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  )
}

export default App
