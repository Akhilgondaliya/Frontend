import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { FiLink, FiCamera, FiUploadCloud, FiSearch, FiVideo, FiVideoOff } from 'react-icons/fi'
import { useScanUrlMutation, useScanQrMutation } from '../app/apiSlice'
import jsQR from 'jsqr'
import LoadingSpinner from '../components/LoadingSpinner'
import SampleSection from '../components/SampleSection'

export const Scan = () => {
  const navigate = useNavigate()
  const [urlInput, setUrlInput] = useState('')
  const [qrFile, setQrFile] = useState(null)
  const [qrFileName, setQrFileName] = useState('')
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

  // API Hooks
  const [scanUrl, { isLoading: isUrlScanning }] = useScanUrlMutation()
  const [scanQr, { isLoading: isQrScanning }] = useScanQrMutation()

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
      // Direct call to scan-url API with decoded URL, avoiding heavy multi-step server side zbar dependency
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

    // Convert http:// to https:// or prepend https:// if missing
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

    // Attempt client-side QR decode first for instant results
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

        // Fallback to server side scanning if client side fails to decode
        const formData = new FormData()
        formData.append('qr_image', qrFile)
        handleQrScanSubmit(formData)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(qrFile)
  }

  // Unified QR scan logic
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

  // Fills URL input from Sample section
  const handleSelectSampleUrl = (url) => {
    setUrlInput(url)
    toast.info('Loaded sample link! Click "Scan URL" to run the test.')
  }

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Loading Spinners */}
      {(isUrlScanning || isQrScanning) && (
        <LoadingSpinner message={isUrlScanning ? 'Reading website details' : 'Decoding your QR code link'} />
      )}

      {/* Header title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
          🔍 PhishZero Scanning Sandbox
        </h1>
        <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed">
          Paste a website link, drop a QR code image, or point your camera at a QR code to run a quick security analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* URL section */}
        <section className="bg-card dark:bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md h-full">
          <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
            <FiLink className="w-6 h-6" />
            <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Scan a Website Link</h2>
          </div>
          
          <form onSubmit={handleUrlScanSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="url-scan-input" className="text-xs font-extrabold uppercase tracking-wide text-muted">
                🔗 Paste website URL
              </label>
              <div className="relative">
                <input
                  id="url-scan-input"
                  type="text"
                  placeholder="e.g. login-secure-paypal.com/verify"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-primary/30 border border-muted/30 focus:border-accent rounded-xl px-4 py-3.5 text-sm text-[#0d1b2a] dark:text-white placeholder-muted/50 focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[10px] text-muted">We will add http:// or https:// automatically if you forget it.</p>
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

        {/* QR Section */}
        <section className="bg-card dark:bg-card border border-muted/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md h-full">
          <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
            <FiCamera className="w-6 h-6" />
            <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white">Scan a QR Code</h2>
          </div>

          <div className="space-y-5">
            
            {/* Camera live scan box */}
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

              {isCameraActive ? (
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
              ) : (
                <div className="hidden" />
              )}
            </div>

            {/* OR Divider if camera active */}
            {isCameraActive && (
              <div className="flex items-center justify-center my-2">
                <span className="text-[10px] text-muted uppercase font-bold tracking-widest">— OR USE FILE UPLOAD —</span>
              </div>
            )}

            {/* Drag and Drop zone */}
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

              {/* Selected File Name display */}
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

      </div>

      {/* Try a Sample section */}
      <SampleSection onSelectUrl={handleSelectSampleUrl} />

    </div>
  )
}
export default Scan
