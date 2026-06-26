import React from 'react'
import { FiLink, FiDownload, FiInfo } from 'react-icons/fi'

export const SampleSection = ({ onSelectUrl }) => {
  const phishingUrl = 'http://paypal-secure-login.verify-account.tk'
  const safeUrl = 'https://google.com'
  const qrEndpoint = `${import.meta.env.VITE_API_URL || ''}/api/sample-qr`

  return (
    <section className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
      
      <div className="flex items-center space-x-2 border-b border-muted/5 pb-4">
        <FiInfo className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-bold text-[#0d1b2a] dark:text-white">
          🧪 Try a Sample Scan
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: URL Testing Buttons */}
        <div className="flex flex-col justify-center space-y-4">
          <p className="text-xs text-muted leading-relaxed">
            Click either button below to automatically populate the URL scanner field with pre-configured mock testing domains.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onSelectUrl(phishingUrl)}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-phishing/30 bg-phishing/5 hover:bg-phishing/10 text-phishing font-semibold text-xs tracking-wider transition-all cursor-pointer"
              id="try-phishing-url-btn"
            >
              <FiLink className="w-4 h-4" />
              <span>Try Phishing URL</span>
            </button>
            <button
              onClick={() => onSelectUrl(safeUrl)}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-safe/30 bg-safe/5 hover:bg-safe/10 text-safe font-semibold text-xs tracking-wider transition-all cursor-pointer"
              id="try-safe-url-btn"
            >
              <FiLink className="w-4 h-4" />
              <span>Try Safe URL</span>
            </button>
          </div>
        </div>

        {/* Right Col: QR testing info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-primary/20 dark:bg-card/30 backdrop-blur-sm rounded-2xl border border-muted/15 dark:border-accent/5">
          <div className="flex flex-col items-center space-y-2">
            <img
              src={qrEndpoint}
              alt="Sample Phishing QR Code"
              className="w-24 h-24 rounded-lg bg-white p-1 border border-muted/20"
              onError={(e) => {
                // If backend is not running yet, show fallback representation
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23f7fafc"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%23a0aec0">Sample QR</text></svg>'
              }}
            />
            <span className="text-[10px] text-muted font-bold">QR Image Preview</span>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#0d1b2a] dark:text-white">Sample Phishing QR</h4>
            <p className="text-xs text-muted leading-relaxed">
              This QR code contains the phishing PayPal link. Download the file, then upload it in the QR section, or scan it via camera to inspect how the decoder extracts links.
            </p>
            <a
              href={qrEndpoint}
              download="sample_phishing_qr.png"
              className="inline-flex items-center space-x-2 text-xs font-bold text-accent hover:text-accent/80 transition-colors pt-1 cursor-pointer"
              id="download-sample-qr-btn"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download QR Image</span>
            </a>
          </div>
        </div>

      </div>

    </section>
  )
}
export default SampleSection
