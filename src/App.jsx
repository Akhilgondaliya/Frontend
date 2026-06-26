import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ThemeContext } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import MarqueeBanner from './components/MarqueeBanner'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import Scan from './pages/Scan'
import Result from './pages/Result'
import ResultMail from './pages/ResultMail'
import ResultFile from './pages/ResultFile'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import Contact from './pages/Contact'

export const App = () => {
  const { theme } = useContext(ThemeContext)

  return (
    <Router>
      <ScrollToTop />
      {/* 
        Parent structural wrapper inheriting base background and text colors 
        configured dynamically in index.css based on dark class 
      */}
      <div className="flex flex-col min-h-screen text-[#0d1b2a] dark:text-white bg-transparent">
        {/* Scroll Progress line indicator */}
        <ScrollProgress />

        {/* Global Navigation header */}
        <Navbar />

        {/* Infinite statistics marquee banner */}
        <MarqueeBanner />

        {/* Dynamic Route Pages Container */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/result" element={<Result />} />
            <Route path="/result-mail" element={<ResultMail />} />
            <Route path="/result-file" element={<ResultFile />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
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
    </Router>
  )
}
export default App
