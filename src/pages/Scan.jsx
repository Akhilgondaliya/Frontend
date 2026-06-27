import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiLink,
  FiCamera,
  FiUploadCloud,
  FiSearch,
  FiVideo,
  FiVideoOff,
  FiMail,
  FiFileText,
  FiDownload,
  FiInfo,
} from "react-icons/fi";
import {
  useScanUrlMutation,
  useScanQrMutation,
  useScanMailMutation,
  useScanFileMutation,
} from "../app/apiSlice";
import jsQR from "jsqr";
import LoadingSpinner from "../components/LoadingSpinner";

export const Scan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("url");

  // URL Scan States
  const [urlInput, setUrlInput] = useState("");

  // QR Scan States
  const [qrFile, setQrFile] = useState(null);
  const [qrFileName, setQrFileName] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  // Email Scan States
  const [mailSender, setMailSender] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");

  // Image Scan States
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const imageInputRef = useRef(null);

  // APK Scan States
  const [apkFile, setApkFile] = useState(null);
  const [apkFileName, setApkFileName] = useState("");
  const apkInputRef = useRef(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // API Hooks
  const [scanUrl, { isLoading: isUrlScanning }] = useScanUrlMutation();
  const [scanQr, { isLoading: isQrScanning }] = useScanQrMutation();
  const [scanMail, { isLoading: isMailScanning }] = useScanMailMutation();
  const [scanFile, { isLoading: isFileScanning }] = useScanFileMutation();

  const requestRef = useRef(null);
  const lastScanTimeRef = useRef(0);

  const extractApiError = (err, fallbackMessage) => {
    if (!err) return fallbackMessage;
    if (err.data?.error) return err.data.error;
    if (err.status === "FETCH_ERROR")
      return "Cannot reach backend. Please confirm the server is running.";
    if (err.error)
      return typeof err.error === "string" ? err.error : String(err.error);
    if (err.message) return err.message;
    return fallbackMessage;
  };

  // Real-time camera QR decoding loop (throttled to 5 scans per second for smooth 60 FPS video preview)
  const scanFrame = (timestamp) => {
    if (!videoRef.current) return;

    // Run QR decoding every 200ms (5 times per second) to keep preview running at maximum native FPS
    if (timestamp - lastScanTimeRef.current >= 200) {
      lastScanTimeRef.current = timestamp;

      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth || 640;
          canvas.height = videoRef.current.videoHeight || 480;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && code.data && code.data.trim()) {
            const decodedUrl = code.data.trim();
            stopCamera();
            handleDecodedUrl(decodedUrl);
            return; // Stop looping
          }
        } catch (err) {
          console.error("Frame scanning error:", err);
        }
      }
    }

    requestRef.current = requestAnimationFrame(scanFrame);
  };

  // Start real-time QR scanning loop when camera turns on
  useEffect(() => {
    if (isCameraActive && cameraStream) {
      requestRef.current = requestAnimationFrame(scanFrame);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isCameraActive, cameraStream]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Camera stream activation
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      toast.info("Camera active! Hold your QR code up to the lens.");
    } catch (err) {
      console.error("Camera access failed:", err);
      toast.error(
        "Could not access your camera. Please check your browser permissions.",
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Decode QR code content directly client-side and trigger API scan
  const handleDecodedUrl = async (decodedUrl) => {
    let formattedUrl = decodedUrl.trim();

    // Prepend protocol if missing
    if (formattedUrl.toLowerCase().startsWith("http://")) {
      formattedUrl = "https://" + formattedUrl.slice(7);
    } else if (!formattedUrl.toLowerCase().startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    toast.info(`Decoded QR: ${formattedUrl}`);

    try {
      const data = await scanUrl({ url: formattedUrl }).unwrap();
      toast.success("Website analyzed successfully!");
      navigate("/result", { state: { scanResult: data } });
    } catch (err) {
      const errMsg = extractApiError(
        err,
        "Oops, our server had trouble checking this URL. Please try again.",
      );
      toast.error(errMsg);
    }
  };

  // Capture frame from webcam and submit
  const captureAndScan = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Attempt instant client-side QR decode on capture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code && code.data && code.data.trim()) {
      stopCamera();
      handleDecodedUrl(code.data.trim());
      return;
    }

    // Fallback: send captured blob to backend if client-side check misses it
    canvas.toBlob((blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append("qr_image", blob, "webcam_capture.png");
        handleQrScanSubmit(formData);
      } else {
        toast.error("Failed to capture picture. Let's try again.");
      }
    }, "image/png");
  };

  // Handle URL scanning
  const handleUrlScanSubmit = async (e) => {
    e.preventDefault();
    let formattedUrl = urlInput.trim();

    if (!formattedUrl) {
      toast.error("Please type or paste a website URL first.");
      return;
    }

    if (formattedUrl.toLowerCase().startsWith("http://")) {
      formattedUrl = "https://" + formattedUrl.slice(7);
    } else if (!formattedUrl.toLowerCase().startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      const data = await scanUrl({ url: formattedUrl }).unwrap();
      toast.success("Website analyzed successfully!");
      navigate("/result", { state: { scanResult: data } });
    } catch (err) {
      const errMsg = extractApiError(
        err,
        "Oops, our server had trouble checking this URL. Please try again.",
      );
      toast.error(errMsg);
    }
  };

  // Handle file picker selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrFile(file);
      setQrFileName(file.name);
    }
  };

  // Handle file dropzone events
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileType = file.type;
      if (
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          fileType,
        )
      ) {
        setQrFile(file);
        setQrFileName(file.name);
        toast.info(`Loaded: ${file.name}`);
      } else {
        toast.error("Please drop a valid image file (PNG, JPG, or WEBP)");
      }
    }
  };

  // Trigger scanning of uploaded file
  const handleFileUploadScan = () => {
    if (!qrFile) {
      toast.error("Please select or drop a QR code image first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data && code.data.trim()) {
            handleDecodedUrl(code.data.trim());
            return;
          }
        } catch (err) {
          console.error("Client side upload decode error:", err);
        }

        const formData = new FormData();
        formData.append("qr_image", qrFile);
        handleQrScanSubmit(formData);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(qrFile);
  };

  // Unified QR scan submit
  const handleQrScanSubmit = async (formData) => {
    stopCamera();

    try {
      const data = await scanQr(formData).unwrap();
      toast.success("QR Code successfully decoded!");
      navigate("/result", { state: { scanResult: data } });
    } catch (err) {
      const errMsg = err.data?.error || "QR code not found Try again!";
      toast.warning(errMsg);
    }
  };

  // Handle Email scanning submit
  const handleMailScanSubmit = async (e) => {
    e.preventDefault();
    const sender = mailSender.trim();
    const subject = mailSubject.trim();
    const body = mailBody.trim();

    if (!sender) {
      toast.error("Please enter the sender email address.");
      return;
    }
    if (!body) {
      toast.error("Please enter the email body text.");
      return;
    }

    try {
      const data = await scanMail({ sender, subject, body }).unwrap();
      toast.success("Email scanned successfully!");
      navigate("/result-mail", { state: { scanResult: data } });
    } catch (err) {
      const errMsg =
        err.data?.error ||
        "Oops, our server had trouble checking this email. Please try again.";
      toast.error(errMsg);
    }
  };

  // Handle Image Scan Selection
  const handleImageScanChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
        setImageFile(file);
        setImageFileName(file.name);
        toast.info(`Loaded image: ${file.name}`);
      } else {
        toast.error(
          "Please select a standard Image file (PNG, JPG, JPEG, WEBP)",
        );
      }
    }
  };

  // Handle Image Scan Drop
  const handleImageScanDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
        setImageFile(file);
        setImageFileName(file.name);
        toast.info(`Loaded image: ${file.name}`);
      } else {
        toast.error("Please drop a standard Image file (PNG, JPG, JPEG, WEBP)");
      }
    }
  };

  // Submit Image Scan
  const handleImageScanSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select or drop an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const data = await scanFile(formData).unwrap();
      toast.success("Image scanned successfully!");
      navigate("/result-file", { state: { scanResult: data } });
    } catch (err) {
      const errMsg =
        err.data?.error ||
        "Oops, our server had trouble scanning this image. Make sure the backend is active.";
      toast.error(errMsg);
    }
  };

  // Handle APK Scan Selection
  const handleApkScanChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext === "apk") {
        setApkFile(file);
        setApkFileName(file.name);
        toast.info(`Loaded APK: ${file.name}`);
      } else {
        toast.error("Please select an Android APK file (.apk)");
      }
    }
  };

  // Handle APK Scan Drop
  const handleApkScanDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext === "apk") {
        setApkFile(file);
        setApkFileName(file.name);
        toast.info(`Loaded APK: ${file.name}`);
      } else {
        toast.error("Please drop an Android APK file (.apk)");
      }
    }
  };

  // Submit APK Scan
  const handleApkScanSubmit = async (e) => {
    e.preventDefault();
    if (!apkFile) {
      toast.error("Please select or drop an APK file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", apkFile);

    try {
      const data = await scanFile(formData).unwrap();
      toast.success("APK scanned successfully!");
      navigate("/result-file", { state: { scanResult: data } });
    } catch (err) {
      const errMsg =
        err.data?.error ||
        "Oops, our server had trouble scanning this APK file. Make sure the backend is active.";
      toast.error(errMsg);
    }
  };

  const loadSampleFile = async (endpoint, filename, setFile, setFileName) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const url = `${apiUrl}${endpoint}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });
      setFile(file);
      setFileName(filename);
      toast.success(
        `Loaded sample: ${filename}! Click scan to start analysis.`,
      );
    } catch (err) {
      console.error(err);
      toast.error(`Failed to load ${filename} sample from server.`);
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Loading Spinners */}
      {(isUrlScanning || isQrScanning || isMailScanning || isFileScanning) && (
        <LoadingSpinner
          message={
            isUrlScanning
              ? "Reading website details"
              : isQrScanning
                ? "Decoding your QR code link"
                : isMailScanning
                  ? "Analyzing email content safety"
                  : "Uploading and sandboxing file contents..."
          }
        />
      )}

      {/* Premium Hero Title and glowing badge */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-extrabold text-[10px] uppercase tracking-widest shadow-sm shadow-accent/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>Real-time Secure Sandbox Environment</span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white pb-1">
          🔍 Phish<span className="text-accent">Zero</span> Scanning Sandbox
        </h1>

        <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl mx-auto">
          Audit suspicious websites, parse hidden QR vectors, run email spoofing
          diagnostics, or sandbox APK binaries & images inside our threat
          defense console.
        </p>
      </div>

      {/* Tab Navigation Menu (Segmented capsule list) */}
      <div className="relative max-w-4xl mx-auto p-1.5 bg-primary/20 backdrop-blur-md rounded-2xl border border-muted/10 shadow-lg flex flex-wrap justify-between items-center gap-1 sm:gap-2">
        {[
          {
            id: "url",
            label: "Website URL",
            icon: <FiLink className="w-4 h-4" />,
          },
          {
            id: "qr",
            label: "QR Code",
            icon: <FiCamera className="w-4 h-4" />,
          },
          {
            id: "email",
            label: "Email Sandbox",
            icon: <FiMail className="w-4 h-4" />,
          },
          {
            id: "image",
            label: "Image Threat",
            icon: <FiCamera className="w-4 h-4" />,
          },
          {
            id: "apk",
            label: "APK Sandbox",
            icon: <FiFileText className="w-4 h-4" />,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                stopCamera();
                setActiveTab(tab.id);
              }}
              className={`relative flex-1 min-w-[125px] flex items-center justify-center space-x-2 py-3 px-4 text-xs font-extrabold tracking-wide transition-all duration-300 rounded-xl cursor-pointer ${
                isActive
                  ? "text-primary dark:text-primary z-10"
                  : "text-muted hover:text-[#0d1b2a] dark:hover:text-white"
              }`}
              id={`${tab.id}-tab-btn`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-accent rounded-xl shadow-lg shadow-accent/15 z-[-1]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="max-w-2xl mx-auto">
        {/* Tab 1: URL Scan */}
        {activeTab === "url" && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-card/65 dark:bg-card/45 backdrop-blur-xl border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <FiLink className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0d1b2a] dark:text-white">
                  Scan a Website Link
                </h2>
                <p className="text-xs text-muted">
                  Audits DNS structure, registry age, and lexical redirects.
                </p>
              </div>
            </div>

            <form onSubmit={handleUrlScanSubmit} className="space-y-4">
              <div className="space-y-2.5">
                <label
                  htmlFor="url-scan-input"
                  className="text-[10px] font-extrabold uppercase tracking-widest text-muted block"
                >
                  🔗 Paste website URL
                </label>
                <input
                  id="url-scan-input"
                  type="text"
                  placeholder="e.g. login-secure-paypal.com/verify"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-primary/20 hover:bg-primary/35 focus:bg-primary/45 border border-muted/25 dark:border-accent/15 focus:border-accent focus:ring-4 focus:ring-accent/10 rounded-xl px-4 py-3.5 text-sm text-[#0d1b2a] dark:text-white placeholder-muted/40 focus:outline-none transition-all"
                />
                <p className="text-[10px] text-muted leading-normal">
                  Our system normalizes URL schemes automatically (e.g. adding
                  https:// if missing).
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-accent text-primary dark:text-primary font-extrabold text-sm tracking-wide hover:bg-accent/80 transition-all shadow-lg hover:shadow-accent/15 cursor-pointer mt-2"
                id="scan-url-btn"
              >
                <FiSearch className="w-4.5 h-4.5 font-bold" />
                <span>Scan Link Now</span>
              </button>
            </form>

            <div className="border-t border-muted/10 pt-5 space-y-3">
              <div className="flex items-center space-x-2">
                <FiInfo className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white">
                  🧪 Try a Sample URL
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Load a pre-configured mock testing domain to check how the
                sandbox processes DNS and security analysis.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput("http://paypal-secure-login.verify-account.tk");
                    toast.info(
                      'Loaded phishing sample URL! Click "Scan Link Now" to test.',
                    );
                  }}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-phishing/30 bg-phishing/5 hover:bg-phishing/10 text-phishing font-bold text-xs tracking-wider transition-all cursor-pointer"
                  id="try-phishing-url-btn"
                >
                  <FiLink className="w-3.5 h-3.5" />
                  <span>Phishing URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput("https://google.com");
                    toast.info(
                      'Loaded safe sample URL! Click "Scan Link Now" to test.',
                    );
                  }}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-safe/30 bg-safe/5 hover:bg-safe/10 text-safe font-bold text-xs tracking-wider transition-all cursor-pointer"
                  id="try-safe-url-btn"
                >
                  <FiLink className="w-3.5 h-3.5" />
                  <span>Safe URL</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: QR Scanner */}
        {activeTab === "qr" && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-card/65 dark:bg-card/45 backdrop-blur-xl border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <FiCamera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0d1b2a] dark:text-white">
                  QR Code Decoder
                </h2>
                <p className="text-xs text-muted">
                  Checks behind physical QR code redirects to prevent quishing.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Camera Scanner */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                    📷 Live Camera Scanner
                  </span>
                  <button
                    onClick={() =>
                      isCameraActive ? stopCamera() : startCamera()
                    }
                    className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      isCameraActive
                        ? "border-phishing/40 bg-phishing/10 text-phishing hover:bg-phishing/20"
                        : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
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
                        videoRef.current = el;
                        if (el && cameraStream) {
                          el.srcObject = cameraStream;
                          el.play().catch((err) => {
                            console.error("Error playing video stream:", err);
                          });
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
                  <span className="text-[10px] text-muted uppercase font-bold tracking-widest">
                    — OR USE FILE UPLOAD —
                  </span>
                </div>
              )}

              {/* Drag and Drop Box */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                  📷 Upload QR Image file
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted/25 dark:border-accent/20 hover:border-accent/60 dark:hover:border-accent/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-primary/10 hover:bg-primary/20 dark:bg-card/20 dark:hover:bg-card/40 transition-all shadow-inner group hover:shadow-accent/5"
                  id="qr-dropzone"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <FiUploadCloud className="w-10 h-10 text-muted group-hover:text-accent mb-2 transition-colors duration-300 transform group-hover:scale-110" />
                  <p className="text-xs font-semibold text-muted">
                    Drag & drop your QR image here, or{" "}
                    <span className="text-accent underline">browse</span>
                  </p>
                  <p className="text-[10px] text-muted/60 mt-1">
                    Accepts standard images (JPG, PNG, GIF, or WEBP)
                  </p>
                </div>

                {qrFileName && (
                  <div className="p-3 bg-primary/45 rounded-xl border border-muted/20 text-xs flex justify-between items-center">
                    <span className="text-muted truncate mr-2">
                      Loaded file:
                    </span>
                    <span className="font-semibold text-accent font-mono truncate max-w-[200px]">
                      {qrFileName}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleFileUploadScan}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl border border-accent text-accent hover:bg-accent/10 font-bold text-sm tracking-wide transition-all cursor-pointer"
                id="scan-qr-btn"
              >
                <FiSearch className="w-4.5 h-4.5 font-bold" />
                <span>Decode & Scan QR file</span>
              </button>
            </div>

            <div className="border-t border-muted/10 pt-5 space-y-4">
              <div className="flex items-center space-x-2">
                <FiInfo className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white">
                  🧪 Try Sample QR Codes
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Load a mock QR image directly into the uploader state without
                downloading, or save it to your local device.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phishing QR Card */}
                <div className="p-4 bg-phishing/5 rounded-2xl border border-phishing/15 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-phishing">
                        Phishing QR Sample
                      </h4>
                      <p className="text-[10px] text-muted leading-normal">
                        Points to mock phishing site:
                        `paypal-secure-login.verify-account.tk`
                      </p>
                    </div>
                    <img
                      src={`${import.meta.env.VITE_API_URL || ""}/api/sample-qr`}
                      alt="Phish QR"
                      className="w-12 h-12 rounded bg-white p-0.5 border border-muted/20 flex-shrink-0"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23fee2e2"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23ef4444">QR</text></svg>';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        loadSampleFile(
                          "/api/sample-qr",
                          "sample_phishing_qr.png",
                          setQrFile,
                          setQrFileName,
                        )
                      }
                      className="flex-1 py-2 px-3 rounded-lg bg-phishing/10 hover:bg-phishing/20 text-phishing font-bold text-xs transition-all cursor-pointer text-center font-sans"
                      id="try-phishing-qr-btn"
                    >
                      Try Sample
                    </button>
                    <a
                      href={`${import.meta.env.VITE_API_URL || ""}/api/sample-qr`}
                      download="sample_phishing_qr.png"
                      className="p-2 rounded-lg bg-primary/20 hover:bg-primary/35 text-muted hover:text-[#0d1b2a] dark:hover:text-white transition-all cursor-pointer"
                      title="Download QR Image"
                      id="download-sample-qr-btn"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Safe QR Card */}
                <div className="p-4 bg-safe/5 rounded-2xl border border-safe/15 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-safe">
                        Safe QR Sample
                      </h4>
                      <p className="text-[10px] text-muted leading-normal">
                        Points to standard safe site: `https://google.com`
                      </p>
                    </div>
                    <img
                      src={`${import.meta.env.VITE_API_URL || ""}/api/sample-qr-safe`}
                      alt="Safe QR"
                      className="w-12 h-12 rounded bg-white p-0.5 border border-muted/20 flex-shrink-0"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23d1fae5"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2310b981">QR</text></svg>';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        loadSampleFile(
                          "/api/sample-qr-safe",
                          "sample_safe_qr.png",
                          setQrFile,
                          setQrFileName,
                        )
                      }
                      className="flex-1 py-2 px-3 rounded-lg bg-safe/10 hover:bg-safe/20 text-safe font-bold text-xs transition-all cursor-pointer text-center font-sans"
                      id="try-safe-qr-btn"
                    >
                      Try Sample
                    </button>
                    <a
                      href={`${import.meta.env.VITE_API_URL || ""}/api/sample-qr-safe`}
                      download="sample_safe_qr.png"
                      className="p-2 rounded-lg bg-primary/20 hover:bg-primary/35 text-muted hover:text-[#0d1b2a] dark:hover:text-white transition-all cursor-pointer"
                      title="Download Safe QR Image"
                      id="download-sample-qr-safe-btn"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Email Scan Form */}
        {activeTab === "email" && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-card/65 dark:bg-card/45 backdrop-blur-xl border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0d1b2a] dark:text-white">
                  Email Phishing Sandbox
                </h2>
                <p className="text-xs text-muted">
                  Checks headers, semantic pressure tactics, and link spoofing.
                </p>
              </div>
            </div>

            <form onSubmit={handleMailScanSubmit} className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="mail-sender-input"
                  className="text-[10px] font-extrabold uppercase tracking-widest text-muted"
                >
                  ✉️ Sender Address
                </label>
                <input
                  id="mail-sender-input"
                  type="text"
                  placeholder="e.g. billing-support@paypal-security.com"
                  value={mailSender}
                  onChange={(e) => setMailSender(e.target.value)}
                  className="w-full bg-primary/20 hover:bg-primary/35 focus:bg-primary/45 border border-muted/25 dark:border-accent/15 focus:border-accent focus:ring-4 focus:ring-accent/10 rounded-xl px-4 py-3.5 text-sm text-[#0d1b2a] dark:text-white placeholder-muted/40 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="mail-subject-input"
                  className="text-[10px] font-extrabold uppercase tracking-widest text-muted"
                >
                  📝 Subject Line
                </label>
                <input
                  id="mail-subject-input"
                  type="text"
                  placeholder="e.g. ACTION REQUIRED: Reset your credentials"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="w-full bg-primary/20 hover:bg-primary/35 focus:bg-primary/45 border border-muted/25 dark:border-accent/15 focus:border-accent focus:ring-4 focus:ring-accent/10 rounded-xl px-4 py-3.5 text-sm text-[#0d1b2a] dark:text-white placeholder-muted/40 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="mail-body-input"
                  className="text-[10px] font-extrabold uppercase tracking-widest text-muted"
                >
                  📄 Email Content (Body)
                </label>
                <textarea
                  id="mail-body-input"
                  rows="6"
                  placeholder="Paste the full text of the email here. E.g. Dear Customer, your account is suspended. Click here to reactivate: http://secure-paypal-login.tk"
                  value={mailBody}
                  onChange={(e) => setMailBody(e.target.value)}
                  className="w-full bg-primary/20 hover:bg-primary/35 focus:bg-primary/45 border border-muted/25 dark:border-accent/15 focus:border-accent focus:ring-4 focus:ring-accent/10 rounded-xl px-4 py-3 text-sm text-[#0d1b2a] dark:text-white placeholder-muted/40 focus:outline-none transition-all font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wide hover:bg-accent/80 transition-all shadow-lg hover:shadow-accent/15 cursor-pointer mt-2"
                id="scan-email-btn"
              >
                <FiSearch className="w-4.5 h-4.5 font-bold" />
                <span>Analyze Email Security</span>
              </button>
            </form>

            <div className="border-t border-muted/10 pt-5 space-y-3">
              <div className="flex items-center space-x-2">
                <FiInfo className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white">
                  🧪 Fill Mock Email Templates
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Automatically fill the form inputs with threat diagnostic
                scenarios to evaluate linguistic markers and domain reputation
                checks.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMailSender("billing-update@paypal-support-security.com");
                    setMailSubject(
                      "URGENT: Review suspicious activity on your account",
                    );
                    setMailBody(
                      "Dear customer,\n\nWe detected unauthorized login attempts to your account. To prevent permanent suspension, you must verify your identity immediately.\n\nPlease visit the secure portal below to restore access:\nhttp://paypal-secure-login.verify-account.tk/login\n\nIf you do not complete this within 24 hours, your account will be locked.\n\nSincerely,\nSecurity & Fraud Prevention Team",
                    );
                    toast.info(
                      'Phishing email template filled! Click "Analyze Email Security" to run.',
                    );
                  }}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-phishing/30 bg-phishing/5 hover:bg-phishing/10 text-phishing font-bold text-xs tracking-wider transition-all cursor-pointer"
                  id="try-phishing-email-btn"
                >
                  <FiMail className="w-3.5 h-3.5" />
                  <span>Phishing Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMailSender("newsletter@github.com");
                    setMailSubject("Your GitHub weekly digest");
                    setMailBody(
                      "Hi developer,\n\nHere are some trending repositories this week that you might find interesting.\n\n1. react-query - Performant state management for React\n2. tailwindcss - A utility-first CSS framework\n\nYou are receiving this email because you subscribed to weekly updates from GitHub.\n\nGitHub, Inc. 88 Colin P Kelly Jr St, San Francisco, CA 94107",
                    );
                    toast.info(
                      'Safe email template filled! Click "Analyze Email Security" to run.',
                    );
                  }}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-safe/30 bg-safe/5 hover:bg-safe/10 text-safe font-bold text-xs tracking-wider transition-all cursor-pointer"
                  id="try-safe-email-btn"
                >
                  <FiMail className="w-3.5 h-3.5" />
                  <span>Safe Email</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Image Threat Scan Form */}
        {activeTab === "image" && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-card/65 dark:bg-card/45 backdrop-blur-xl border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <FiCamera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0d1b2a] dark:text-white">
                  Image Threat Scanner
                </h2>
                <p className="text-xs text-muted">
                  Audits EXIF metadata tags and trailing steganographic bytes.
                </p>
              </div>
            </div>

            <form onSubmit={handleImageScanSubmit} className="space-y-5">
              {/* Drag and Drop Box */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                  📁 Upload standard Image file
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageScanDrop}
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-muted/25 dark:border-accent/20 hover:border-accent/60 dark:hover:border-accent/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-primary/10 hover:bg-primary/20 dark:bg-card/20 dark:hover:bg-card/40 transition-all shadow-inner group hover:shadow-accent/5"
                  id="image-scan-dropzone"
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageScanChange}
                    className="hidden"
                  />
                  <FiUploadCloud className="w-12 h-12 text-muted mb-2 transition-transform duration-300 hover:scale-105" />
                  <p className="text-xs font-semibold text-muted">
                    Drag & drop your image here, or{" "}
                    <span className="text-accent underline">browse</span>
                  </p>
                  <p className="text-[10px] text-muted/60 mt-1">
                    Accepts standard images (PNG, JPG, JPEG, or WEBP)
                  </p>
                </div>

                {imageFileName && (
                  <div className="p-3 bg-primary/45 rounded-xl border border-muted/20 text-xs flex justify-between items-center">
                    <span className="text-muted truncate mr-2">
                      Loaded file:
                    </span>
                    <span className="font-semibold text-accent font-mono truncate max-w-[300px]">
                      {imageFileName}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wide hover:bg-accent/80 transition-all shadow-lg hover:shadow-accent/15 cursor-pointer mt-2"
                id="scan-image-file-btn"
              >
                <FiSearch className="w-4.5 h-4.5 font-bold" />
                <span>Upload & Scan Image</span>
              </button>
            </form>

            <div className="border-t border-muted/10 pt-5 space-y-3">
              <div className="flex items-center space-x-2">
                <FiInfo className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white">
                  🧪 Try Sample Images
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Load a sample image directly into the scanner state without
                downloading, or save it to your local device.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Phishing Stego Image Card */}
                <div className="p-4 bg-phishing/5 rounded-2xl border border-phishing/15 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-phishing">
                      Phishing Stego PNG
                    </h4>
                    <p className="text-[10px] text-muted leading-normal">
                      Contains raw phishing link bytes appended at the end of
                      the image stream.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        loadSampleFile(
                          "/api/sample-image",
                          "sample_stego.png",
                          setImageFile,
                          setImageFileName,
                        )
                      }
                      className="flex-1 py-2 px-3 rounded-lg bg-phishing/10 hover:bg-phishing/20 text-phishing font-bold text-xs transition-all cursor-pointer text-center font-sans"
                      id="try-phishing-image-btn"
                    >
                      Try Sample
                    </button>
                    <a
                      href={`${import.meta.env.VITE_API_URL || ""}/api/sample-image`}
                      download="sample_stego.png"
                      className="p-2 rounded-lg bg-primary/20 hover:bg-primary/35 text-muted hover:text-[#0d1b2a] dark:hover:text-white transition-all cursor-pointer"
                      title="Download Stego Image"
                      id="download-stego-image-btn"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Safe Image Card */}
                <div className="p-4 bg-safe/5 rounded-2xl border border-safe/15 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-safe">Safe PNG</h4>
                    <p className="text-[10px] text-muted leading-normal">
                      Standard image file without any embedded hidden phishing
                      links or threats.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        loadSampleFile(
                          "/api/sample-image-safe",
                          "sample_safe.png",
                          setImageFile,
                          setImageFileName,
                        )
                      }
                      className="flex-1 py-2 px-3 rounded-lg bg-safe/10 hover:bg-safe/20 text-safe font-bold text-xs transition-all cursor-pointer text-center font-sans"
                      id="try-safe-image-btn"
                    >
                      Try Sample
                    </button>
                    <a
                      href={`${import.meta.env.VITE_API_URL || ""}/api/sample-image-safe`}
                      download="sample_safe.png"
                      className="p-2 rounded-lg bg-primary/20 hover:bg-primary/35 text-muted hover:text-[#0d1b2a] dark:hover:text-white transition-all cursor-pointer"
                      title="Download Safe Image"
                      id="download-safe-image-btn"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 5: APK Threat Scan Form */}
        {activeTab === "apk" && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-card/65 dark:bg-card/45 backdrop-blur-xl border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="flex items-center space-x-3 text-accent border-b border-muted/5 pb-4">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <FiFileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0d1b2a] dark:text-white">
                  APK Sandbox Scanner
                </h2>
                <p className="text-xs text-muted">
                  Inspects classes.dex strings and AndroidManifest permissions.
                </p>
              </div>
            </div>

            <form onSubmit={handleApkScanSubmit} className="space-y-5">
              {/* Drag and Drop Box */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                  📁 Upload Android APK package file
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleApkScanDrop}
                  onClick={() => apkInputRef.current?.click()}
                  className="border-2 border-dashed border-muted/25 dark:border-accent/20 hover:border-accent/60 dark:hover:border-accent/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-primary/10 hover:bg-primary/20 dark:bg-card/20 dark:hover:bg-card/40 transition-all shadow-inner group hover:shadow-accent/5"
                  id="apk-scan-dropzone"
                >
                  <input
                    ref={apkInputRef}
                    type="file"
                    accept=".apk"
                    onChange={handleApkScanChange}
                    className="hidden"
                  />
                  <FiUploadCloud className="w-12 h-12 text-muted mb-2 transition-transform duration-300 hover:scale-105" />
                  <p className="text-xs font-semibold text-muted">
                    Drag & drop your APK file here, or{" "}
                    <span className="text-accent underline">browse</span>
                  </p>
                  <p className="text-[10px] text-muted/60 mt-1">
                    Accepts Android app packages (.apk)
                  </p>
                </div>

                {apkFileName && (
                  <div className="p-3 bg-primary/45 rounded-xl border border-muted/20 text-xs flex justify-between items-center">
                    <span className="text-muted truncate mr-2">
                      Loaded file:
                    </span>
                    <span className="font-semibold text-accent font-mono truncate max-w-[300px]">
                      {apkFileName}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm tracking-wide hover:bg-accent/80 transition-all shadow-lg hover:shadow-accent/15 cursor-pointer mt-2"
                id="scan-apk-file-btn"
              >
                <FiSearch className="w-4.5 h-4.5 font-bold" />
                <span>Upload & Scan APK</span>
              </button>
            </form>

            <div className="border-t border-muted/10 pt-5 space-y-3">
              <div className="flex items-center space-x-2">
                <FiInfo className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white">
                  🧪 Try Sample APKs
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Load a sample APK directly into the scanner state without
                downloading, or save it to your local device.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Phishing APK Card */}
                <div className="p-4 bg-phishing/5 rounded-2xl border border-phishing/15 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-phishing">
                      Phishing APK Sample
                    </h4>
                    <p className="text-[10px] text-muted leading-normal">
                      Contains unsafe permissions (SMS intercept) and hardcoded
                      phishing URLs.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        loadSampleFile(
                          "/api/sample-apk",
                          "sample_phish.apk",
                          setApkFile,
                          setApkFileName,
                        )
                      }
                      className="flex-1 py-2 px-3 rounded-lg bg-phishing/10 hover:bg-phishing/20 text-phishing font-bold text-xs transition-all cursor-pointer text-center font-sans"
                      id="try-phishing-apk-btn"
                    >
                      Try Sample
                    </button>
                    <a
                      href={`${import.meta.env.VITE_API_URL || ""}/api/sample-apk`}
                      download="sample_phish.apk"
                      className="p-2 rounded-lg bg-primary/20 hover:bg-primary/35 text-muted hover:text-[#0d1b2a] dark:hover:text-white transition-all cursor-pointer"
                      title="Download Phish APK"
                      id="download-sample-apk-btn"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Safe APK Card */}
                <div className="p-4 bg-safe/5 rounded-2xl border border-safe/15 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-safe">
                      Safe APK Sample
                    </h4>
                    <p className="text-[10px] text-muted leading-normal">
                      Contains only standard Internet permission and a clean
                      safe URL.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        loadSampleFile(
                          "/api/sample-apk-safe",
                          "sample_safe.apk",
                          setApkFile,
                          setApkFileName,
                        )
                      }
                      className="flex-1 py-2 px-3 rounded-lg bg-safe/10 hover:bg-safe/20 text-safe font-bold text-xs transition-all cursor-pointer text-center font-sans"
                      id="try-safe-apk-btn"
                    >
                      Try Sample
                    </button>
                    <a
                      href={`${import.meta.env.VITE_API_URL || ""}/api/sample-apk-safe`}
                      download="sample_safe.apk"
                      className="p-2 rounded-lg bg-primary/20 hover:bg-primary/35 text-muted hover:text-[#0d1b2a] dark:hover:text-white transition-all cursor-pointer"
                      title="Download Safe APK"
                      id="download-sample-apk-safe-btn"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default Scan;
