import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiActivity,
  FiShield,
  FiFileText,
  FiPercent,
} from "react-icons/fi";
import { useGetStatsQuery } from "../app/apiSlice";
import { mergeStatsWithLocal } from "../utils/localStats";

export const CyberDashboard = () => {
  const {
    data: serverStats = {
      today_scans: 0,
      threats_detected: 0,
      safe_urls: 0,
      qr_scans: 0,
      average_risk_score: 0.0,
    },
    isFetching,
  } = useGetStatsQuery(undefined, {
    pollingInterval: 8000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [localStatsVersion, setLocalStatsVersion] = useState(0);
  const stats = mergeStatsWithLocal(serverStats, localStatsVersion);

  useEffect(() => {
    const handleLocalStatsUpdate = () => {
      setLocalStatsVersion((version) => version + 1);
    };

    window.addEventListener("phishzero-stats-updated", handleLocalStatsUpdate);
    return () => {
      window.removeEventListener("phishzero-stats-updated", handleLocalStatsUpdate);
    };
  }, []);

  const [counts, setCounts] = useState({
    today_scans: 0,
    threats_detected: 0,
    safe_urls: 0,
    qr_scans: 0,
    average_risk_score: 0.0,
  });

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;

    let step = 0;
    const start = { ...counts };
    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setCounts(stats);
        clearInterval(timer);
      } else {
        const factor = step / steps;
        setCounts({
          today_scans: Math.round(
            start.today_scans + (stats.today_scans - start.today_scans) * factor,
          ),
          threats_detected: Math.round(
            start.threats_detected +
              (stats.threats_detected - start.threats_detected) * factor,
          ),
          safe_urls: Math.round(
            start.safe_urls + (stats.safe_urls - start.safe_urls) * factor,
          ),
          qr_scans: Math.round(
            start.qr_scans + (stats.qr_scans - start.qr_scans) * factor,
          ),
          average_risk_score: parseFloat(
            (
              start.average_risk_score +
              (stats.average_risk_score - start.average_risk_score) * factor
            ).toFixed(1),
          ),
        });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [
    stats.today_scans,
    stats.threats_detected,
    stats.safe_urls,
    stats.qr_scans,
    stats.average_risk_score,
  ]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 w-full">
      {/* Total Scans */}
      <div className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between hover:border-accent/30 transition-all duration-300 shadow-md">
        <div className="flex items-center justify-between text-muted">
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            Total Scans
          </span>
          <FiActivity className="w-4 h-4 text-accent animate-pulse" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
            {counts.today_scans}
          </span>
        </div>
      </div>

      {/* Threats Detected */}
      <div className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between hover:border-accent/30 transition-all duration-300 shadow-md">
        <div className="flex items-center justify-between text-muted">
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            Threats Detected
          </span>
          <FiTrendingUp className="w-4 h-4 text-phishing" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-extrabold tracking-tight text-phishing">
            {counts.threats_detected}
          </span>
        </div>
      </div>

      {/* Safe URLs */}
      <div className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between hover:border-accent/30 transition-all duration-300 shadow-md">
        <div className="flex items-center justify-between text-muted">
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            Safe Elements
          </span>
          <FiShield className="w-4 h-4 text-safe" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-extrabold tracking-tight text-safe">
            {counts.safe_urls}
          </span>
        </div>
      </div>

      {/* QR Scans */}
      <div className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between hover:border-accent/30 transition-all duration-300 shadow-md">
        <div className="flex items-center justify-between text-muted">
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            QR Vect Audits
          </span>
          <FiFileText className="w-4 h-4 text-accent" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
            {counts.qr_scans}
          </span>
        </div>
      </div>

      {/* Average Risk Score */}
      <div className="bg-card/65 dark:bg-card/45 backdrop-blur-md border border-muted/20 dark:border-accent/10 rounded-2xl p-4 flex flex-col justify-between hover:border-accent/30 transition-all duration-300 shadow-md col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-muted">
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            Avg Risk Score
          </span>
          <FiPercent className="w-4 h-4 text-accent" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-extrabold tracking-tight text-[#0d1b2a] dark:text-white">
            {counts.average_risk_score}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CyberDashboard;
