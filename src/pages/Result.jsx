import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiRefreshCw,
  FiCopy,
  FiLock,
  FiCalendar,
  FiAlertTriangle,
  FiCheckCircle,
  FiEye,
  FiImage,
  FiMonitor,
  FiAlertCircle,
} from "react-icons/fi";
import VerdictBanner from "../components/VerdictBanner";
import AnimatedRiskMeter from "../components/AnimatedRiskMeter";
import SignalCard from "../components/SignalCard";
import UrlBreakdown from "../components/UrlBreakdown";
import DetectionPipeline from "../components/DetectionPipeline";
import SecurityChecklist from "../components/SecurityChecklist";
import ThreatTimeline from "../components/ThreatTimeline";
import ExplainableReasons from "../components/ExplainableReasons";
import SecurityTips from "../components/SecurityTips";

export const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scanResult = location.state?.scanResult;
  const [previewMode, setPreviewMode] = useState("screenshot");

  // Redirect to scan if no results are in history state
  useEffect(() => {
    if (!scanResult) {
      toast.error("No scan results found. Let's start a new scan first.");
      navigate("/scan");
    }
  }, [scanResult, navigate]);

  if (!scanResult) {
    return null; // Will redirect in useEffect
  }

  const {
    url,
    score,
    verdict,
    results = [],
    ssl = {},
    whois = {},
    scan_duration = 0.08,
    ip_address = "Unavailable",
    confidence = 95,
  } = scanResult;

  // Copy result details to clipboard
  const handleCopyResultUrl = () => {
    const textToCopy = `PhishZero Website Security Report\nURL: ${url}\nVerdict: ${verdict}\nRisk Score: ${score}/100`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Report details copied to clipboard!");
      })
      .catch(() => {
        toast.error("Could not copy. Please manually select the text.");
      });
  };

  // Trigger PDF download with custom directory picker prompt (Runs picker before fetch to preserve browser user gesture)
  const handleDownloadPdf = async () => {
    let fileHandle = null;
    try {
      // 1. Prompt user for saving location first while user gesture is active
      if (window.showSaveFilePicker) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: `phishzero_report_${Date.now()}.pdf`,
          types: [
            {
              description: "PDF Document",
              accept: {
                "application/pdf": [".pdf"],
              },
            },
          ],
        });
      }

      toast.info("Generating PDF report from sandbox...");
      let response;
      let blob;
      try {
        const postUrl = `${import.meta.env.VITE_API_URL || ""}/api/report`;
        response = await fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scanResult),
        });
        if (response.ok) {
          blob = await response.blob();
        } else {
          const errorJson = await response.json().catch(() => null);
          console.warn(
            `POST report generation returned status ${response.status}. Falling back to GET...`,
            errorJson,
          );
        }
      } catch (postErr) {
        console.warn(
          "POST report generation failed, trying GET fallback...",
          postErr,
        );
      }

      if (!blob) {
        // Fallback: GET request with url query parameter (performs rescan on server)
        const getUrl = `${import.meta.env.VITE_API_URL || ""}/api/report?url=${encodeURIComponent(url)}`;
        response = await fetch(getUrl);
        if (!response.ok) {
          const errorJson = await response.json().catch(() => null);
          const serverMessage = errorJson?.error ? `: ${errorJson.error}` : "";
          throw new Error(`API server failed to generate PDF${serverMessage}`);
        }
        blob = await response.blob();
      }

      if (fileHandle) {
        // 3. Write blob content to the chosen folder path
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        toast.success("Report saved successfully!");
      } else {
        // Fallback standard download trigger for unsupported browsers
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `phishzero_report_${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Report downloaded to default folder.");
      }
    } catch (err) {
      console.error(err);
      // Check if user simply closed the Save Dialogue without choosing a path
      if (err.name !== "AbortError") {
        const message = err.message || "Failed to download PDF report.";
        toast.error(
          `PDF generation failed. ${message} Make sure the backend is running at http://localhost:5000.`,
        );
      }
    }
  };

  let scoreBgColor = "bg-safe";
  if (score >= 70) {
    scoreBgColor = "bg-phishing";
  } else if (score >= 40) {
    scoreBgColor = "bg-suspicious";
  }

  const getRecommendations = () => {
    if (verdict === "Phishing") {
      return [
        "DO NOT ENTER passwords, credit cards, or logins on this website.",
        "Avoid downloading any files or software installers from this source.",
        "Verify the domain name character-by-character to check for homoglyphs.",
        "Report this website immediately to security authorities or your IT administrator.",
      ];
    } else if (verdict === "Suspicious") {
      return [
        "Exercise high caution before submitting any inputs on this page.",
        "Confirm the sender or source of this link through a secondary verified channel.",
        "Check the SSL certificate details for warning messages or recent registrations.",
      ];
    } else {
      return [
        "This website exhibits standard security indicators. Proceed safely.",
        "Ensure browser anti-phishing filters are active for general navigation protection.",
        "Verify sensitive requests (payments, password resets) independently.",
      ];
    }
  };

  const isBrandImpersonation = results.some(
    (r) => r.name === "Brand Impersonation" && r.triggered,
  );

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top action header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-muted/20 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d1b2a] dark:text-white">
          Website Security Breakdown
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-accent text-primary dark:text-primary font-bold text-xs tracking-wider hover:bg-accent/80 transition-colors shadow-md shadow-accent/15 cursor-pointer"
            id="download-report-btn"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={handleCopyResultUrl}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-muted/30 hover:border-accent hover:text-accent bg-card text-muted font-bold text-xs tracking-wider transition-colors cursor-pointer"
            id="copy-result-btn"
          >
            <FiCopy className="w-4 h-4" />
            <span>Copy Summary</span>
          </button>
          <Link
            to="/scan"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-accent/40 hover:bg-accent/10 text-accent font-bold text-xs tracking-wider transition-colors cursor-pointer"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Scan Another Link</span>
          </Link>
        </div>
      </div>

      {/* Brand Impersonation Alert Banner */}
      {isBrandImpersonation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-phishing/10 border border-phishing rounded-2xl flex items-start space-x-3 text-left shadow-lg shadow-phishing/5"
        >
          <FiAlertTriangle className="w-6 h-6 text-phishing flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-extrabold text-phishing uppercase tracking-wider">
              ⚠ Possible Brand Impersonation Detected
            </h4>
            <p className="text-xs text-muted mt-1 leading-relaxed font-semibold">
              CRITICAL: This website's address appears to mimic a popular brand
              (like PayPal or Google) but does not resolve to their official
              registry domain. This is a common tactic for credential stealing.
            </p>
          </div>
        </motion.div>
      )}

      {/* Scan Summary Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between shadow-sm text-left">
          <span className="text-[9px] uppercase font-bold text-muted tracking-wider block">
            Threat Level
          </span>
          <span
            className={`text-base font-extrabold block mt-2 uppercase ${
              score >= 70
                ? "text-phishing"
                : score >= 40
                  ? "text-suspicious"
                  : "text-safe"
            }`}
          >
            {score >= 70 ? "Danger" : score >= 40 ? "Warning" : "Safe"}
          </span>
        </div>
        <div className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between shadow-sm text-left">
          <span className="text-[9px] uppercase font-bold text-muted tracking-wider block">
            Risk Score
          </span>
          <span className="text-base font-extrabold text-[#0d1b2a] dark:text-white block mt-2">
            {score} / 100
          </span>
        </div>
        <div className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between shadow-sm text-left">
          <span className="text-[9px] uppercase font-bold text-muted tracking-wider block">
            Confidence
          </span>
          <span className="text-base font-extrabold text-[#0d1b2a] dark:text-white block mt-2">
            {confidence}%
          </span>
        </div>
        <div className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between shadow-sm text-left">
          <span className="text-[9px] uppercase font-bold text-muted tracking-wider block">
            Scan Duration
          </span>
          <span className="text-base font-extrabold text-[#0d1b2a] dark:text-white block mt-2">
            {scan_duration}s
          </span>
        </div>
        <div className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between shadow-sm text-left">
          <span className="text-[9px] uppercase font-bold text-muted tracking-wider block">
            Domain Age
          </span>
          <span className="text-base font-extrabold text-[#0d1b2a] dark:text-white block mt-2">
            {whois.age_days !== undefined ? `${whois.age_days}d` : "N/A"}
          </span>
        </div>
        <div className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between shadow-sm col-span-2 md:col-span-1 text-left">
          <span className="text-[9px] uppercase font-bold text-muted tracking-wider block">
            Final Verdict
          </span>
          <span
            className={`text-base font-extrabold block mt-2 uppercase ${
              score >= 70
                ? "text-phishing"
                : score >= 40
                  ? "text-suspicious"
                  : "text-safe"
            }`}
          >
            {verdict}
          </span>
        </div>
      </div>

      {/* Main Verdict Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Banner: takes 8 cols */}
        <div className="lg:col-span-8 h-full flex flex-col justify-center">
          <VerdictBanner verdict={verdict} url={url} />
        </div>

        {/* Risk score gauge: takes 4 cols */}
        <div className="lg:col-span-4 h-full flex items-center justify-center">
          <AnimatedRiskMeter score={score} confidence={confidence} />
        </div>
      </div>

      {/* Zone slide indicator progress ruler */}
      <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">
          Safety Threat Level
        </h3>

        {/* Horizontal ruler tracking box */}
        <div className="relative pt-6 pb-2">
          {/* Active pointer block */}
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10"
          >
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary dark:text-primary ${scoreBgColor}`}
            >
              {score}
            </span>
            <div className={`w-2 h-2 rotate-45 mt-0.5 ${scoreBgColor}`} />
          </motion.div>

          {/* Three-zone background bar */}
          <div className="h-4 w-full rounded-full overflow-hidden flex bg-primary/20">
            <div
              className="w-[40%] bg-emerald-500/20 border-r border-[#060b14] h-full"
              title="Safe Range"
            />
            <div
              className="w-[30%] bg-amber-500/20 border-r border-[#060b14] h-full"
              title="Suspicious Range"
            />
            <div
              className="w-[30%] bg-rose-500/20 h-full"
              title="Dangerous Range"
            />
          </div>

          {/* Legend indicator marks */}
          <div className="flex justify-between text-[10px] text-muted font-bold tracking-wider pt-2">
            <span>0 (Safe)</span>
            <span className="text-emerald-500">39 (Upper Safe Limit)</span>
            <span className="text-amber-500">69 (Upper Suspicious Limit)</span>
            <span className="text-rose-500">100 (Max Danger Rating)</span>
          </div>
        </div>
      </section>

      {/* Detection Pipeline progression */}
      <DetectionPipeline />

      {/* URL Diagnostics Breakdown Cards */}
      <UrlBreakdown
        url={url}
        ipAddress={ip_address}
        registrar={whois.registrar}
        whoisError={whois.error}
        sslError={ssl.error}
      />

      {/* Secure Website Preview Section */}
      <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md hover:border-accent/30 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted/5 pb-4">
          <div className="flex items-center space-x-2 text-accent">
            <FiEye className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0d1b2a] dark:text-white">
              Secure Website Preview
            </h3>
          </div>
          
          {/* Switcher Tabs */}
          <div className="flex bg-primary/20 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setPreviewMode("screenshot")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === "screenshot"
                  ? "bg-accent text-primary shadow-sm"
                  : "text-muted hover:text-accent"
              }`}
            >
              <FiImage className="w-3.5 h-3.5" />
              <span>Safe Capture (Screenshot)</span>
            </button>
            <button
              onClick={() => setPreviewMode("sandbox")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                previewMode === "sandbox"
                  ? "bg-accent text-primary shadow-sm"
                  : "text-muted hover:text-accent"
              }`}
            >
              <FiMonitor className="w-3.5 h-3.5" />
              <span>Interactive Sandbox</span>
            </button>
          </div>
        </div>

        {/* Warning / Explanation Banner */}
        <div className="flex items-start space-x-3 p-4 bg-primary/30 border border-muted/20 rounded-2xl text-xs text-left">
          <FiAlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-extrabold text-[#0d1b2a] dark:text-white">
              {previewMode === "screenshot" 
                ? "Static Screen Capture Mode" 
                : "Strict Isolated Sandbox Mode"}
            </p>
            <p className="text-muted leading-relaxed font-semibold">
              {previewMode === "screenshot"
                ? "This is a safe, server-side visual screenshot of the destination. No code runs on your device, making it 100% secure even for active malware or phishing pages."
                : "The site is loaded inside a strictly sandboxed container. Script execution, form submissions, cookie storage, and popups are completely blocked to prevent drive-by attacks."}
            </p>
          </div>
        </div>

        {/* Browser Mock Window Frame */}
        <div className="border border-muted/20 dark:border-accent/10 rounded-2xl overflow-hidden bg-[#060b14]/40 shadow-inner flex flex-col">
          {/* Browser Address Bar */}
          <div className="bg-[#0b1322] border-b border-muted/20 dark:border-accent/10 px-4 py-3 flex items-center space-x-3">
            <div className="flex space-x-1.5 flex-shrink-0">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="bg-[#060b14]/70 border border-muted/10 dark:border-accent/5 rounded-lg px-3 py-1 flex items-center space-x-2 text-xs text-muted w-full overflow-hidden truncate font-mono select-all">
              <FiLock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="truncate">{url}</span>
            </div>
          </div>

          {/* Browser Body / Preview Content */}
          <div className="relative aspect-video w-full bg-[#060b14]/10 min-h-[300px] sm:min-h-[450px] flex items-center justify-center overflow-auto">
            {previewMode === "screenshot" ? (
              <div className="w-full h-full relative">
                <img
                  src={`https://image.thum.io/get/width/1280/crop/800/maxAge/12/${url}`}
                  alt="Safe screenshot preview of the scanned URL"
                  className="w-full h-full object-cover object-top select-none"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://mini.s-shot.ru/1024x768/PNG/1024/?${url}`;
                  }}
                />
              </div>
            ) : (
              <iframe
                src={url}
                title="PhishZero Isolated Sandbox URL Preview"
                sandbox=""
                referrerPolicy="no-referrer"
                className="w-full h-full border-none bg-white min-h-[300px] sm:min-h-[450px]"
              />
            )}
          </div>
        </div>
      </section>

      {/* SSL & WHOIS Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SSL block */}
        <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md hover:border-accent/30 transition-colors">
          <div className="flex items-center space-x-2 text-accent border-b border-muted/5 pb-3">
            <FiLock className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0d1b2a] dark:text-white">
              SSL Connection & Security
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-left">
            <div className="space-y-1">
              <span className="text-xs text-muted block">
                Connection Status
              </span>
              <span
                className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  ssl.valid
                    ? "bg-safe/10 text-safe"
                    : "bg-phishing/10 text-phishing"
                }`}
              >
                {ssl.valid ? (
                  <FiCheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <FiAlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>
                  {ssl.valid ? "Secure / Encrypted" : "Not Secure (HTTP)"}
                </span>
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">
                Certificate Issuer
              </span>
              <span
                className="font-semibold text-[#0d1b2a] dark:text-white truncate block"
                title={ssl.issuer}
              >
                {ssl.issuer || "None"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">Expiration Date</span>
              <span className="font-semibold text-[#0d1b2a] dark:text-white font-mono block">
                {ssl.expiry_date || "N/A"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">Days Left</span>
              <span className="font-semibold text-[#0d1b2a] dark:text-white font-mono block">
                {ssl.days_left !== undefined
                  ? `${ssl.days_left} Days`
                  : "0 Days"}
              </span>
            </div>
          </div>

          {ssl.warning && (
            <div className="flex items-start space-x-2 p-3 bg-phishing/5 border border-phishing/30 text-phishing rounded-xl text-xs text-left">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                <b>Caution:</b> This site's security certificate is expiring in
                less than 30 days. Short-lived certificates are frequently used
                on temporary scam pages.
              </p>
            </div>
          )}

          {ssl.error && (
            <div className="p-3 bg-primary/20 text-muted rounded-xl text-[11px] leading-relaxed text-left">
              <b>Connection Log:</b>{" "}
              {ssl.error === "HTTP protocol used (No SSL)"
                ? "The website uses plain HTTP, meaning data sent to it is not encrypted."
                : ssl.error}
            </div>
          )}
        </section>

        {/* WHOIS block */}
        <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md hover:border-accent/30 transition-colors">
          <div className="flex items-center space-x-2 text-accent border-b border-muted/5 pb-3">
            <FiCalendar className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0d1b2a] dark:text-white">
              Domain Registration details
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-left">
            <div className="space-y-1">
              <span className="text-xs text-muted block">Website Age</span>
              <span className="font-extrabold text-[#0d1b2a] dark:text-white font-mono block">
                {whois.age_days !== undefined
                  ? `${whois.age_days} Days`
                  : "0 Days"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">Registered On</span>
              <span className="font-semibold text-[#0d1b2a] dark:text-white font-mono block">
                {whois.creation_date || "Unknown"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">
                Registration Risk
              </span>
              <span
                className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                  whois.risk_level === "Very High" ||
                  whois.risk_level === "High"
                    ? "bg-phishing/10 text-phishing"
                    : whois.risk_level === "Medium"
                      ? "bg-suspicious/10 text-suspicious"
                      : "bg-safe/10 text-safe"
                }`}
              >
                {whois.risk_level || "Unknown"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted block">
                WHOIS Penalty points
              </span>
              <span className="font-semibold text-[#0d1b2a] dark:text-white font-mono block">
                {whois.points !== undefined
                  ? `+${whois.points} Points`
                  : "0 Points"}
              </span>
            </div>
          </div>

          {whois.points > 0 && (
            <div className="flex items-start space-x-2 p-3 bg-suspicious/5 border border-suspicious/30 text-suspicious rounded-xl text-xs text-left">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                <b>Caution:</b> This website was registered very recently. Scam
                sites are often created, used for a few days, and then
                abandoned.
              </p>
            </div>
          )}

          {whois.error && (
            <div className="p-3 bg-primary/20 text-muted rounded-xl text-[11px] leading-relaxed text-left">
              <b>Registry Log:</b> Could not pull database logs (this often
              happens when WHOIS servers rate-limit requests).
            </div>
          )}
        </section>
      </div>

      {/* Security Checklist Table */}
      <SecurityChecklist scanResult={scanResult} />

      {/* Security Timeline */}
      <ThreatTimeline whois={whois} ssl={ssl} />

      {/* Explainable Reasons Diagnosis Deck */}
      <ExplainableReasons scanResult={scanResult} />

      {/* Dynamic Security Recommendations */}
      <div className="bg-card/65 dark:bg-card/45 border border-muted/20 dark:border-accent/10 rounded-3xl p-6 shadow-md text-left space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">
          Cybersecurity Recommendations
        </h3>
        <ul className="space-y-3 text-xs">
          {getRecommendations().map((rec, idx) => (
            <li
              key={idx}
              className="flex items-start space-x-2 text-muted font-semibold"
            >
              <span className="text-accent font-extrabold">&#9656;</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Random Security Tips Callout */}
      <SecurityTips />

      {/* 13 Heuristic checks grid */}
      <section className="space-y-6">
        <div className="border-b border-muted/20 pb-3">
          <h2 className="text-xl font-bold text-[#0d1b2a] dark:text-white text-left">
            Raw Heuristic Signal Cards
          </h2>
          <p className="text-xs text-muted text-left">
            A detailed look at the 13 safety checks we run on the link
            structure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((sig, idx) => (
            <SignalCard key={sig.id} signal={sig} index={idx} />
          ))}
        </div>
      </section>
    </div>
  );
};
export default Result;
