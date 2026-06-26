import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { FiLink, FiCamera, FiUploadCloud, FiSearch, FiVideo, FiVideoOff, FiMail, FiFileText } from 'react-icons/fi'
import { useScanUrlMutation, useScanQrMutation, useScanMailMutation, useScanFileMutation } from '../app/apiSlice'
import jsQR from 'jsqr'
import LoadingSpinner from '../components/LoadingSpinner'
import SampleSection from '../components/SampleSection'

export const Scan = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('url')
  
  // URL Scan States
  const [urlInput, setUrlInput] = useState('')
  
  // QR Scan States
  const [qrFile, setQrFile] = useState(null)
  const [qrFileName, setQrFileName] = useState('')
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  
  // Email Scan States
  const [mailSender, setMailSender] = useState('')
  const [mailSubject, setMailSubject] = useState('')
  const [mailBody, setMailBody] = useState('')
  
  // Image Scan States
  const [imageFile, setImageFile] = useState(null)
  const [imageFileName, setImageFileName] = useState('')
  const imageInputRef = useRef(null)

  // APK Scan States
  const [apkFile, setApkFile] = useState(null)
  const [apkFileName, setApkFileName] = useState('')
  const apkInputRef = useRef(null)
  
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

  // API Hooks
  const [scanUrl, { isLoading: isUrlScanning }] = useScanUrlMutation()
  const [scanQr, { isLoading: isQrScanning }] = useScanQrMutation()
  const [scanMail, { isLoading: isMailScanning }] = useScanMailMutation()
  const [scanFile, { isLoading: isFileScanning }] = useScanFileMutation()

  const requestRef = useRef(null)
  const lastScanTimeRef = useRef(0)

  // Real-time camera QR decoding loop (throttled to 5 scans per second for smooth 60 FPS video preview)
  const scanFrame = (timestamp) => {
    if (!videoRef.current) return

    // Run QR decoding every 200ms (5 times per second) to keep preview running at maximum native FPS
    if (timestamp - lastScanTimeRef.current >= 200) {
      lastScanTimeRef.current = timestamp

      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = videoRef.current.videoWidth || 640
          canvas.height = videoRef.current.videoHeight || 480
          const ctx = canvas.getContext('2d')
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          })

          if (code && code.data && code.data.trim()) {
            const decodedUrl = code.data.trim()
            stopCamera()
            handleDecodedUrl(decodedUrl)
            return // Stop looping
          }
        } catch (err) {
          console.error("Frame scanning error:", err)
        }
      }
    }

    requestRef.current = requestAnimationFrame(scanFrame)
  }

  // Start real-time QR scanning loop when camera turns on
  useEffect(() => {
    if (isCameraActive && cameraStream) {
      requestRef.current = requestAnimationFrame(scanFrame)
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isCameraActive, cameraStream])

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  // Camera stream activation
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      })
      setCameraStream(stream)
      setIsCameraActive(true)
      toast.info('Camera active! Hold your QR code up to the lens.')
    } catch (err) {
      console.error('Camera access failed:', err)
      toast.error('Could not access your camera. Please check your browser permissions.')
      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setIsCameraActive(false)
  }

  // Decode QR code content directly client-side and trigger API scan
  const handleDecodedUrl = async (decodedUrl) => {
    let formattedUrl = decodedUrl.trim()
    
    // Prepend protocol if missing
    if (formattedUrl.toLowerCase().startsWith('http://')) {
      formattedUrl = 'https://' + formattedUrl.slice(7)
    } else if (!formattedUrl.toLowerCase().startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }

    toast.info(`Decoded QR: ${formattedUrl}`)
    
    try {
      const data = await scanUrl({ url: formattedUrl }).unwrap()
      toast.success('Website analyzed successfully!')
      navigate('/result', { state: { scanResult: data } })
    } catch (err) {
      const errMsg = err.data?.error || 'Oops, our server had trouble checking this URL. Please try again.'
      toast.error(errMsg)
    }
  }

  // Capture frame from webcam and submit
  const captureAndScan = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth || 640
    canvas.height = videoRef.current.videoHeight || 480
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    
    // Attempt instant client-side QR decode on capture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    if (code && code.data && code.data.trim()) {
      stopCamera()
      handleDecodedUrl(code.data.trim())
      return
    }

    // Fallback: send captured blob to backend if client-side check misses it
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const formData = new FormData()
          formData.append('qr_image', blob, 'webcam_capture.png')
          handleQrScanSubmit(formData)
        } else {
          toast.error('Failed to capture picture. Let\'s try again.')
        }
      },
      'image/png'
    )
  }

  // Handle URL scanning
  const handleUrlScanSubmit = async (e) => {
    e.preventDefault()
    let formattedUrl = urlInput.trim()
    
    if (!formattedUrl) {
      toast.error('Please type or paste a website URL first.')
      return
    }

    if (formattedUrl.toLowerCase().startsWith('http://')) {
      formattedUrl = 'https://' + formattedUrl.slice(7)
    } else if (!formattedUrl.toLowerCase().startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }

    try {
      const data = await scanUrl({ url: formattedUrl }).unwrap()
      toast.success('Website analyzed successfully!')
      navigate('/result', { state: { scanResult: data } })
    } catch (err) {
      const errMsg = err.data?.error || 'Oops, our server had trouble checking this URL. Please try again.'
      toast.error(errMsg)
    }
  }

  // Handle file picker selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setQrFile(file)
      setQrFileName(file.name)
    }
  }

  // Handle file dropzone events
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const fileType = file.type
      if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(fileType)) {
        setQrFile(file)
        setQrFileName(file.name)
        toast.info(`Loaded: ${file.name}`)
      } else {
        toast.error('Please drop a valid image file (PNG, JPG, or WEBP)')
      }
    }
  }

  // Trigger scanning of uploaded file
  const handleFileUploadScan = () => {
    if (!qrFile) {
      toast.error('Please select or drop a QR code image first.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          if (code && code.data && code.data.trim()) {
            handleDecodedUrl(code.data.trim())
            return
          }
        } catch (err) {
          console.error("Client side upload decode error:", err)
        }

        const formData = new FormData()
        formData.append('qr_image', qrFile)
        handleQrScanSubmit(formData)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(qrFile)
  }

  // Unified QR scan submit
  const handleQrScanSubmit = async (formData) => {
    stopCamera()

    try {
      const data = await scanQr(formData).unwrap()
      toast.success('QR Code successfully decoded!')
      navigate('/result', { state: { scanResult: data } })
    } catch (err) {
      const errMsg = err.data?.error || 'QR code not found Try again!'
      toast.warning(errMsg)
    }
  }

  // Handle Email scanning submit
  const handleMailScanSubmit = async (e) => {
    e.preventDefault()
    const sender = mailSender.trim()
    const subject = mailSubject.trim()
    const body = mailBody.trim()

    if (!sender) {
      toast.error('Please enter the sender email address.')
      return
    }
    if (!body) {
      toast.error('Please enter the email body text.')
      return
    }

    try {
      const data = await scanMail({ sender, subject, body }).unwrap()
      toast.success('Email scanned successfully!')
      navigate('/result-mail', { state: { scanResult: data } })
    } catch (err) {
      const errMsg = err.data?.error || 'Oops, our server had trouble checking this email. Please try again.'
      toast.error(errMsg)
    }
  }

  // Handle Image Scan Selection
  const handleImageScanChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
        setImageFile(file)
        setImageFileName(file.name)
        toast.info(`Loaded image: ${file.name}`)
      } else {
        toast.error('Please select a standard Image file (PNG, JPG, JPEG, WEBP)')
      }
    }
  }

  // Handle Image Scan Drop
  const handleImageScanDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
        setImageFile(file)
        setImageFileName(file.name)
        toast.info(`Loaded image: ${file.name}`)
      } else {
        toast.error('Please drop a standard Image file (PNG, JPG, JPEG, WEBP)')
      }
    }
  }

  // Submit Image Scan
  const handleImageScanSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) {
      toast.error('Please select or drop an image first.')
      return
    }

    const formData = new FormData()
    formData.append('file', imageFile)

    try {
      const data = await scanFile(formData).unwrap()
      toast.success('Image scanned successfully!')
      navigate('/result-file', { state: { scanResult: data } })
    } catch (err) {
      const errMsg = err.data?.error || 'Oops, our server had trouble scanning this image. Make sure the backend is active.'
      toast.error(errMsg)
    }
  }

  // Handle APK Scan Selection
  const handleApkScanChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (ext === 'apk') {
        setApkFile(file)
        setApkFileName(file.name)
        toast.info(`Loaded APK: ${file.name}`)
      } else {
        toast.error('Please select an Android APK file (.apk)')
      }
    }
  }

  // Handle APK Scan Drop
  const handleApkScanDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (ext === 'apk') {
        setApkFile(file)
        setApkFileName(file.name)
        toast.info(`Loaded APK: ${file.name}`)
      } else {
        toast.error('Please drop an Android APK file (.apk)')
      }
    }
  }

  // Submit APK Scan
  const handleApkScanSubmit = async (e) => {
    e.preventDefault()
    if (!apkFile) {
      toast.error('Please select or drop an APK file first.')
      return
    }

    const formData = new FormData()
    formData.append('file', apkFile)

    try {
      const data = await scanFile(formData).unwrap()
      toast.success('APK scanned successfully!')
      navigate('/result-file', { state: { scanResult: data } })
    } catch (err) {
      const errMsg = err.data?.error || 'Oops, our server had trouble scanning this APK file. Make sure the backend is active.'
      toast.error(errMsg)
    }
  }

  // Fills URL input from Sample section
  const handleSelectSampleUrl = (url) => {
    setUrlInput(url)
    setActiveTab('url')
    toast.info('Loaded sample link! Click "Scan website" to run the test.')
  }

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Loading Spinners */}
      {(isUrlScanning || isQrScanning || isMailScanning || isFileScanning) && (
        <LoadingSpinner message={
          isUrlScanning ? 'Reading website details' : 
          isQrScanning ? 'Decoding your QR code link' : 
          isMailScanning ? 'Analyzing email content safety' : 
          'Uploading and sandboxing file contents...'
        } />
      )}

      {/* Header title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
          🔍 PhishZero Scanning Sandbox
        </h1>
        <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed">
          Paste a website link, upload/scan a QR code, or paste suspicious email contents to perform a real-time security audit.
        </p>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex justify-center border-b border-muted/10 max-w-3xl mx-auto flex-wrap">
        <button
          onClick={() => {
            stopCamera()
            setActiveTab('url')
          }}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
            activeTab === 'url' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-[#0d1b2a] dark:hover:text-white'
          }`}
          id="url-tab-btn"
        >
          <FiLink className="w-4 h-4" />
          <span>Website URL</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('qr')
          }}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
            activeTab === 'qr' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-[#0d1b2a] dark:hover:text-white'
          }`}
          id="qr-tab-btn"
        >
          <FiCamera className="w-4 h-4" />
          <span>QR Code</span>
        </button>
        <button
          onClick={() => {
            stopCamera()
            setActiveTab('email')
          }}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
            activeTab === 'email' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-[#0d1b2a] dark:hover:text-white'
          }`}
          id="email-tab-btn"
        >
          <FiMail className="w-4 h-4" />
          <span>Email Sandbox</span>
        </button>
        <button
          onClick={() => {
            stopCamera()
            setActiveTab('image')
          }}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
            activeTab === 'image' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-[#0d1b2a] dark:hover:text-white'
          }`}
          id="image-tab-btn"
        >
          <FiCamera className="w-4 h-4" />
          <span>Image Threat</span>
        </button>
        <button
          onClick={() => {
            stopCamera()
            setActiveTab('apk')
          }}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
            activeTab === 'apk' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-[#0d1b2a] dark:hover:text-white'
          }`}
          id="apk-tab-btn"
        >
          <FiFileText className="w-4 h-4" />
          <span>APK Sandbox</span>
        </button>
      </div>

      {/* Active Tab Panel */}
      <div className="max-w-2xl mx-auto">
        
        {/* Tab 1: URL Scan */}
        {activeTab === 'url' && (
          <section className="bg-card dark:bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <FiLink className="w-6 h-6" />
              <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Scan a Website Link</h2>
            </div>
            
            <form onSubmit={handleUrlScanSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="url-scan-input" className="text-xs font-extrabold uppercase tracking-wide text-muted">
                  🔗 Paste website URL
                </label>
                <input
                  id="url-scan-input"
                  type="text"
                  placeholder="e.g. login-secure-paypal.com/verify"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-primary/30 border border-muted/30 focus:border-accent rounded-xl px-4 py-3.5 text-sm text-[#0d1b2a] dark:text-white placeholder-muted/50 focus:outline-none transition-colors"
                />
                <p className="text-[10px] text-muted mt-1">We will add http:// or https:// automatically if you forget it.</p>
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wide hover:bg-accent/80 transition-colors shadow-lg shadow-accent/10 cursor-pointer"
                id="scan-url-btn"
              >
                <FiSearch className="w-4 h-4 font-bold" />
                <span>Scan website</span>
              </button>
            </form>
          </section>
        )}

        {/* Tab 2: QR Scanner */}
        {activeTab === 'qr' && (
          <section className="bg-card dark:bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <FiCamera className="w-6 h-6" />
              <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Scan a QR Code</h2>
            </div>

            <div className="space-y-5">
              
              {/* Camera Scanner */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-muted">📷 Live Camera Scanner</span>
                  <button
                    onClick={() => (isCameraActive ? stopCamera() : startCamera())}
                    className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      isCameraActive
                        ? 'border-phishing/40 bg-phishing/10 text-phishing hover:bg-phishing/20'
                        : 'border-accent/40 bg-accent/10 text-accent hover:bg-accent/20'
                    }`}
                    id="camera-toggle-btn"
                  >
                    {isCameraActive ? (
                      <>
                        <FiVideoOff className="w-3.5 h-3.5" />
                        <span>Turn Camera Off</span>
                      </>
                    ) : (
                      <>
                        <FiVideo className="w-3.5 h-3.5" />
                        <span>Scan with Camera</span>
                      </>
                    )}
                  </button>
                </div>

                {isCameraActive && (
                  <div className="relative border border-accent/40 rounded-2xl overflow-hidden bg-black flex flex-col items-center">
                    <video
                      ref={(el) => {
                        videoRef.current = el
                        if (el && cameraStream) {
                          el.srcObject = cameraStream
                          el.play().catch((err) => {
                            console.error("Error playing video stream:", err)
                          })
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-[240px] object-cover bg-black"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-36 h-36 border-2 border-dashed border-accent/60 rounded-xl relative">
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent" />
                      </div>
                    </div>
                    <div className="p-3 bg-black/80 w-full flex justify-center border-t border-accent/20">
                      <button
                        onClick={captureAndScan}
                        className="px-6 py-2 bg-accent text-primary dark:text-primary rounded-lg text-xs font-extrabold uppercase hover:bg-accent/80 transition-all cursor-pointer"
                        id="camera-capture-scan-btn"
                      >
                        Capture and Scan QR
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              {isCameraActive && (
                <div className="flex items-center justify-center my-2">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-widest">— OR USE FILE UPLOAD —</span>
                </div>
              )}

              {/* Drag and Drop Box */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wide text-muted">
                  📷 Upload QR Image file
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted/30 hover:border-accent/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-primary/10 transition-colors"
                  id="qr-dropzone"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <FiUploadCloud className="w-10 h-10 text-muted mb-2 group-hover:text-accent" />
                  <p className="text-xs font-semibold text-muted">
                    Drag & drop your QR image here, or <span className="text-accent underline">browse</span>
                  </p>
                  <p className="text-[10px] text-muted/60 mt-1">Accepts standard images (JPG, PNG, GIF, or WEBP)</p>
                </div>

                {qrFileName && (
                  <div className="p-2.5 bg-primary/40 rounded-xl border border-muted/20 text-xs flex justify-between items-center">
                    <span className="text-muted truncate mr-2">Loaded file:</span>
                    <span className="font-semibold text-accent font-mono truncate max-w-[200px]">{qrFileName}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleFileUploadScan}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-accent text-accent hover:bg-accent/10 font-bold text-sm tracking-wide transition-colors cursor-pointer"
                id="scan-qr-btn"
              >
                <FiSearch className="w-4 h-4 font-bold" />
                <span>Decode & Scan QR file</span>
              </button>

            </div>
          </section>
        )}

        {/* Tab 3: Email Scan Form */}
        {activeTab === 'email' && (
          <section className="bg-card dark:bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <FiMail className="w-6 h-6" />
              <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Email Phishing Sandbox</h2>
            </div>
            
            <form onSubmit={handleMailScanSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="mail-sender-input" className="text-xs font-extrabold uppercase tracking-wide text-muted">
                  ✉️ Sender Address
                </label>
                <input
                  id="mail-sender-input"
                  type="text"
                  placeholder="e.g. billing-support@paypal-security.com"
                  value={mailSender}
                  onChange={(e) => setMailSender(e.target.value)}
                  className="w-full bg-primary/30 border border-muted/30 focus:border-accent rounded-xl px-4 py-3 text-sm text-[#0d1b2a] dark:text-white placeholder-muted/50 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="mail-subject-input" className="text-xs font-extrabold uppercase tracking-wide text-muted">
                  📝 Subject Line
                </label>
                <input
                  id="mail-subject-input"
                  type="text"
                  placeholder="e.g. ACTION REQUIRED: Reset your credentials"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="w-full bg-primary/30 border border-muted/30 focus:border-accent rounded-xl px-4 py-3 text-sm text-[#0d1b2a] dark:text-white placeholder-muted/50 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="mail-body-input" className="text-xs font-extrabold uppercase tracking-wide text-muted">
                  📄 Email Content (Body)
                </label>
                <textarea
                  id="mail-body-input"
                  rows="6"
                  placeholder="Paste the full text of the email here. E.g. Dear Customer, your account is suspended. Click here to reactivate: http://secure-paypal-login.tk"
                  value={mailBody}
                  onChange={(e) => setMailBody(e.target.value)}
                  className="w-full bg-primary/30 border border-muted/30 focus:border-accent rounded-xl px-4 py-3 text-sm text-[#0d1b2a] dark:text-white placeholder-muted/50 focus:outline-none transition-colors font-sans resize-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wide hover:bg-accent/80 transition-colors shadow-lg shadow-accent/10 cursor-pointer mt-2"
                id="scan-email-btn"
              >
                <FiSearch className="w-4 h-4 font-bold" />
                <span>Analyze Email Security</span>
              </button>
            </form>
          </section>
        )}

        {/* Tab 4: Image Threat Scan Form */}
        {activeTab === 'image' && (
          <section className="bg-card dark:bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <FiCamera className="w-6 h-6" />
              <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Image Threat Scanner</h2>
            </div>
            
            <form onSubmit={handleImageScanSubmit} className="space-y-5">
              
              {/* Drag and Drop Box */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wide text-muted">
                  📷 Upload standard Image file
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageScanDrop}
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-muted/30 hover:border-accent/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-primary/10 transition-colors"
                  id="image-scan-dropzone"
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageScanChange}
                    className="hidden"
                  />
                  <FiUploadCloud className="w-12 h-12 text-muted mb-2" />
                  <p className="text-xs font-semibold text-muted">
                    Drag & drop your image here, or <span className="text-accent underline">browse</span>
                  </p>
                  <p className="text-[10px] text-muted/60 mt-1">Accepts standard images (PNG, JPG, JPEG, or WEBP)</p>
                </div>

                {imageFileName && (
                  <div className="p-3 bg-primary/40 rounded-xl border border-muted/20 text-xs flex justify-between items-center">
                    <span className="text-muted truncate mr-2">Loaded file:</span>
                    <span className="font-semibold text-accent font-mono truncate max-w-[300px]">{imageFileName}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wide hover:bg-accent/80 transition-colors shadow-lg shadow-accent/10 cursor-pointer mt-2"
                id="scan-image-file-btn"
              >
                <FiSearch className="w-4 h-4 font-bold" />
                <span>Upload & Scan Image</span>
              </button>
            </form>
          </section>
        )}

        {/* Tab 5: APK Threat Scan Form */}
        {activeTab === 'apk' && (
          <section className="bg-card dark:bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <FiFileText className="w-6 h-6" />
              <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">APK Sandbox Scanner</h2>
            </div>
            
            <form onSubmit={handleApkScanSubmit} className="space-y-5">
              
              {/* Drag and Drop Box */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wide text-muted">
                  📁 Upload Android APK package file
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleApkScanDrop}
                  onClick={() => apkInputRef.current?.click()}
                  className="border-2 border-dashed border-muted/30 hover:border-accent/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-primary/10 transition-colors"
                  id="apk-scan-dropzone"
                >
                  <input
                    ref={apkInputRef}
                    type="file"
                    accept=".apk"
                    onChange={handleApkScanChange}
                    className="hidden"
                  />
                  <FiUploadCloud className="w-12 h-12 text-muted mb-2" />
                  <p className="text-xs font-semibold text-muted">
                    Drag & drop your APK file here, or <span className="text-accent underline">browse</span>
                  </p>
                  <p className="text-[10px] text-muted/60 mt-1">Accepts Android app packages (.apk)</p>
                </div>

                {apkFileName && (
                  <div className="p-3 bg-primary/40 rounded-xl border border-muted/20 text-xs flex justify-between items-center">
                    <span className="text-muted truncate mr-2">Loaded file:</span>
                    <span className="font-semibold text-accent font-mono truncate max-w-[300px]">{apkFileName}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wide hover:bg-accent/80 transition-colors shadow-lg shadow-accent/10 cursor-pointer mt-2"
                id="scan-apk-file-btn"
              >
                <FiSearch className="w-4 h-4 font-bold" />
                <span>Upload & Scan APK</span>
              </button>
            </form>
          </section>
        )}

      </div>

      {/* Try a Sample section */}
      <SampleSection onSelectUrl={handleSelectSampleUrl} />

    </div>
  )
}
export default Scan
