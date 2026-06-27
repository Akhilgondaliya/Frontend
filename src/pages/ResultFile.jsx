import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiAlertTriangle,
  FiCheckCircle,
  FiShield,
  FiFileText,
  FiLink,
  FiInfo,
  FiActivity,
  FiDownload,
} from "react-icons/fi";
import AnimatedRiskMeter from "../components/AnimatedRiskMeter";
import SecurityChecklist from "../components/SecurityChecklist";
import ThreatTimeline from "../components/ThreatTimeline";
import ExplainableReasons from "../components/ExplainableReasons";
import SecurityTips from "../components/SecurityTips";

export const ResultFile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scanResult = location.state?.scanResult;

  const handleDownloadPdf = async () => {
    let fileHandle = null;
    try {
      if (window.showSaveFilePicker) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: `phishzero_file_report_${Date.now()}.pdf`,
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
      const postUrl = `${import.meta.env.VITE_API_URL || ""}/api/report`;
      const response = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scanResult),
      });
      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const serverMessage = errorJson?.error ? `: ${errorJson.error}` : "";
        throw new Error(`API server failed to generate PDF${serverMessage}`);
      }
      const blob = await response.blob();

      if (fileHandle) {
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        toast.success("Report saved successfully!");
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute(
          "download",
          `phishzero_file_report_${Date.now()}.pdf`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Report downloaded to default folder.");
      }
    } catch (err) {
      console.error(err);
      if (err.name !== "AbortError") {
        const message = err.message || "Failed to download PDF report.";
        toast.error(
          `PDF generation failed. ${message} Make sure the backend is running at http://localhost:5000.`,
        );
      }
    }
  };

  if (!scanResult) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <FiAlertTriangle className="w-16 h-16 text-muted/60" />
        <h2 className="text-2xl font-bold text-[#0d1b2a] dark:text-white">
          No File Scan Data Found
        </h2>
        <p className="text-sm text-muted max-w-sm">
          Please upload an APK file or Image in the PhishZero sandbox to
          generate a security report.
        </p>
        <Link
          to="/scan"
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-accent text-primary dark:text-primary font-bold text-sm hover:bg-accent/80 transition-colors shadow-lg shadow-accent/15"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </Link>
      </div>
    );
  }

  const filename = scanResult?.filename || "Unknown File";
  const filesize = scanResult?.filesize || 0;
  const filetype = scanResult?.filetype || "unknown";
  const score = scanResult?.score || 0;
  const verdict = scanResult?.verdict || "Safe";
  const permissions = scanResult?.permissions || [];
  const high_risk_permissions = scanResult?.high_risk_permissions || [];
  const qr_url = scanResult?.qr_url || null;
  const extracted_urls = scanResult?.extracted_urls || [];
  const url_scans = scanResult?.url_scans || [];
  const stego_payload = scanResult?.stego_payload || null;

  // Formatter for file size
  const formatBytes = (bytes) => {
    if (!bytes || isNaN(bytes) || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    if (i < 0 || i >= sizes.length) return bytes + " Bytes";
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Theme matching based on verdict
  let themeColor = "text-safe border-safe/20 bg-safe/5";
  let ringColor = "border-safe text-safe";
  let statusIcon = <FiCheckCircle className="w-6 h-6 text-safe" />;
  let verdictLabel = "Clean / Safe";
  let verdictDesc =
    "No suspicious permissions or phishing domains were discovered inside this file. It appears safe to use.";

  if (verdict === "Phishing") {
    themeColor = "text-phishing border-phishing/20 bg-phishing/5";
    ringColor = "border-phishing text-phishing";
    statusIcon = <FiAlertTriangle className="w-6 h-6 text-phishing" />;
    verdictLabel = "High Phishing Risk";
    verdictDesc =
      "CRITICAL ALERT: This file contains hardcoded phishing domains or requests highly dangerous permissions capable of phishing overlays/credential theft. Do not run or trust this file.";
  } else if (verdict === "Suspicious") {
    themeColor = "text-suspicious border-suspicious/20 bg-suspicious/5";
    ringColor = "border-suspicious text-suspicious";
    statusIcon = <FiAlertTriangle className="w-6 h-6 text-suspicious" />;
    verdictLabel = "Suspicious Indicators";
    verdictDesc =
      "WARNING: Potential security threats detected. The file requests high-risk access privileges or links to unverified domains. Run with extra caution.";
  }

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center">
        <Link
          to="/scan"
          className="inline-flex items-center space-x-2 text-sm text-muted hover:text-accent font-bold transition-colors"
          id="back-to-scanner-btn"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to sandbox scanner</span>
        </Link>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-muted/20 pb-6">
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent flex items-center space-x-1.5">
            <FiFileText className="w-3.5 h-3.5" />
            <span>File Threat Sandbox Analysis</span>
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
            Sandbox Threat Report
          </h1>
        </div>
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-accent text-primary dark:text-primary font-bold text-xs tracking-wider hover:bg-accent/80 transition-colors shadow-md shadow-accent/15 cursor-pointer"
            id="download-report-btn"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1: Verdict Dashboard Ring & File Info */}
        <div className="lg:col-span-1 space-y-8">
          {/* Verdict Ring Widget */}
          <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 text-center space-y-6 shadow-md">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted">
              Analysis Verdict
            </h3>

            <div className="flex justify-center">
              <AnimatedRiskMeter
                score={score}
                confidence={95}
                borderless={true}
              />
            </div>

            <div
              className={`p-4 rounded-2xl border ${themeColor} flex items-center justify-center space-x-2.5`}
            >
              {statusIcon}
              <span className="font-extrabold text-sm tracking-wide uppercase">
                {verdictLabel}
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed px-2 font-semibold">
              {verdictDesc}
            </p>
          </section>

          {/* File Metadata Card */}
          <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 space-y-4 shadow-md hover:border-accent/30 transition-colors duration-300">
            <div className="flex items-center space-x-2 border-b border-muted/5 pb-3">
              <FiShield className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold text-[#0d1b2a] dark:text-white">
                File Properties
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-muted/5 pb-2">
                <span className="text-muted">Filename:</span>
                <span
                  className="font-semibold text-right truncate max-w-[180px]"
                  title={filename}
                >
                  {filename}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/5 pb-2">
                <span className="text-muted">File Size:</span>
                <span className="font-semibold font-mono text-[#0d1b2a] dark:text-white">
                  {formatBytes(filesize)}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/5 pb-2">
                <span className="text-muted">Inferred Type:</span>
                <span className="font-semibold uppercase text-accent">
                  {filetype}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted">Hardcoded Domains:</span>
                <span className="font-semibold text-[#0d1b2a] dark:text-white">
                  {extracted_urls.length} Found
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Col 2 & 3: Threat Elements Detail */}
        <div className="lg:col-span-2 space-y-8">
          {/* QR & Stego Details (If Image) */}
          {filetype === "image" && (
            <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md hover:border-accent/30 transition-colors duration-300">
              <div className="flex items-center space-x-2.5 text-accent border-b border-muted/5 pb-4">
                <FiLink className="w-5.5 h-5.5" />
                <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">
                  Embedded Image Channels
                </h3>
              </div>

              <div className="space-y-4">
                {/* QR scan check */}
                <div className="p-4 bg-primary/20 rounded-2xl border border-muted/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
                      QR Code Link
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${qr_url ? "bg-amber-500/10 text-amber-500" : "bg-safe/10 text-safe"}`}
                    >
                      {qr_url ? "Detected" : "None Detected"}
                    </span>
                  </div>
                  {qr_url ? (
                    <p className="text-xs font-mono font-bold text-accent break-all">
                      {qr_url}
                    </p>
                  ) : (
                    <p className="text-xs text-muted">
                      No readable QR code layout was found in the image frame.
                    </p>
                  )}
                </div>

                {/* Steganography check */}
                <div className="p-4 bg-primary/20 rounded-2xl border border-muted/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
                      Steganography & Appended Bytes
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        extracted_urls.length > 0 || stego_payload
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-safe/10 text-safe"
                      }`}
                    >
                      {extracted_urls.length > 0 || stego_payload
                        ? "Indicators Found"
                        : "Clean"}
                    </span>
                  </div>
                  {stego_payload ? (
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white block">
                        🔑 Decoded Stego Payload:
                      </span>
                      <p className="text-xs font-mono font-bold text-accent bg-black/45 p-3 rounded-xl border border-[#1f2937] break-all select-all shadow-inner leading-relaxed">
                        {stego_payload}
                      </p>
                      <p className="text-[10px] text-muted">
                        Successfully extracted Least Significant Bit (LSB)
                        hidden text from pixel color channels.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted leading-relaxed">
                      We scanned the image color channels for LSB steganography
                      text payloads, and checked the raw binary file bytes for
                      appended hidden URLs.
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Permissions Details (If APK) */}
          {filetype === "apk" && (
            <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md hover:border-accent/30 transition-colors duration-300">
              <div className="flex items-center space-x-2.5 text-accent border-b border-muted/5 pb-4">
                <FiShield className="w-5.5 h-5.5" />
                <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">
                  Android Manifest Analysis
                </h3>
              </div>

              {/* High risk permissions */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#0d1b2a] dark:text-white">
                  🚨 High-Risk Permissions Detected (
                  {high_risk_permissions.length})
                </h4>

                {high_risk_permissions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {high_risk_permissions.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-phishing/5 border border-phishing/20 rounded-2xl flex items-start space-x-3"
                      >
                        <FiAlertTriangle className="w-5 h-5 text-phishing mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <span className="text-xs font-bold font-mono text-phishing block break-all">
                            {p.permission}
                          </span>
                          <p className="text-xs text-muted leading-relaxed">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-safe/5 border border-safe/20 rounded-2xl flex items-center space-x-3">
                    <FiCheckCircle className="w-5 h-5 text-safe flex-shrink-0" />
                    <p className="text-xs text-muted">
                      No high-risk permissions (like intercepting SMS or
                      overlays) were flagged.
                    </p>
                  </div>
                )}
              </div>

              {/* General permission flags */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                  All Declared App Permissions ({permissions.length})
                </h4>
                {permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((perm, idx) => {
                      const isHighRisk = high_risk_permissions.some(
                        (hp) => hp.permission === perm,
                      );
                      return (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-semibold tracking-wide border ${
                            isHighRisk
                              ? "bg-phishing/10 border-phishing/30 text-phishing"
                              : "bg-primary/20 border-muted/10 text-muted"
                          }`}
                        >
                          {perm.replace("android.permission.", "")}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted">
                    No permissions found in the Android Manifest.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Extracted URLs scan detail */}
          <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md hover:border-accent/30 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-muted/5 pb-4">
              <div className="flex items-center space-x-2.5 text-accent">
                <FiLink className="w-5.5 h-5.5" />
                <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">
                  Extracted Domains Threat Level
                </h3>
              </div>
              <span className="text-xs text-muted font-bold font-mono">
                Scanned {url_scans.length} / {extracted_urls.length}
              </span>
            </div>

            {url_scans.length > 0 ? (
              <div className="space-y-4">
                {url_scans.map((scan, idx) => {
                  let vColor = "text-safe bg-safe/10 border-safe/20";
                  if (scan?.verdict === "Phishing")
                    vColor = "text-phishing bg-phishing/10 border-phishing/20";
                  else if (scan?.verdict === "Suspicious")
                    vColor =
                      "text-suspicious bg-suspicious/10 border-suspicious/20";

                  return (
                    <div
                      key={idx}
                      className="p-4 bg-primary/20 rounded-2xl border border-muted/10 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-muted/5 pb-2">
                        <span
                          className="text-xs font-bold font-mono text-accent truncate max-w-[320px] sm:max-w-[420px]"
                          title={scan?.url || ""}
                        >
                          {scan?.url || "Unknown URL"}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${vColor}`}
                          >
                            {scan?.verdict || "Unknown"}
                          </span>
                          <span className="text-xs font-bold font-mono text-muted">
                            Score: {scan?.score || 0}/100
                          </span>
                        </div>
                      </div>

                      {/* Signals triggers list */}
                      {scan?.results && scan.results.length > 0 ? (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted flex items-center space-x-1">
                            <FiActivity className="w-3 h-3" />
                            <span>Security Heuristics Triggered</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {scan.results.map((sig, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded bg-phishing/5 border border-phishing/15 text-phishing text-[10px]"
                                title={sig?.desc || sig?.description || ""}
                              >
                                {sig?.title || sig?.name || "Triggered check"}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted flex items-center space-x-1.5">
                          <FiCheckCircle className="w-3.5 h-3.5 text-safe flex-shrink-0" />
                          <span>
                            No phishing indicators detected on this specific URL
                            string structure.
                          </span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-muted border border-dashed border-muted/20 rounded-2xl space-y-2">
                <FiCheckCircle className="w-10 h-10 mx-auto text-safe/60" />
                <h4 className="text-sm font-bold text-[#0d1b2a] dark:text-white">
                  No Suspicious URLs Detected
                </h4>
                <p className="text-xs max-w-sm mx-auto">
                  We checked all binary classes, package descriptors, and
                  assets, and found zero hidden HTTP/HTTPS links inside.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Full-width visual panels for File Sandbox Scan */}
      <div className="space-y-8">
        <SecurityChecklist scanResult={scanResult} />
        <ThreatTimeline
          whois={scanResult.whois || {}}
          ssl={scanResult.ssl || {}}
        />
        <ExplainableReasons scanResult={scanResult} />
        <SecurityTips />
      </div>
    </div>
  );
};

export default ResultFile;
