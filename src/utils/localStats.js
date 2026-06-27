const STORAGE_KEY = "phishzero_local_stats";

const EMPTY_STATS = {
  today_scans: 0,
  threats_detected: 0,
  safe_urls: 0,
  qr_scans: 0,
  risk_total: 0,
};

function readLocalStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATS };
    const parsed = JSON.parse(raw);
    return { ...EMPTY_STATS, ...parsed };
  } catch {
    return { ...EMPTY_STATS };
  }
}

function writeLocalStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function recordLocalScan(score = 0, { scanType = "url" } = {}) {
  const stats = readLocalStats();
  stats.today_scans += 1;

  if (scanType === "qr") {
    stats.qr_scans += 1;
  }

  if (score >= 40) {
    stats.threats_detected += 1;
  } else {
    stats.safe_urls += 1;
  }

  stats.risk_total += Number(score) || 0;
  writeLocalStats(stats);
  window.dispatchEvent(new Event("phishzero-stats-updated"));
  return stats;
}

export function mergeStatsWithLocal(serverStats = {}, _refreshToken = 0) {
  void _refreshToken;
  const localStats = readLocalStats();
  const merged = {
    today_scans:
      Number(serverStats.today_scans || 0) + Number(localStats.today_scans || 0),
    threats_detected:
      Number(serverStats.threats_detected || 0) +
      Number(localStats.threats_detected || 0),
    safe_urls:
      Number(serverStats.safe_urls || 0) + Number(localStats.safe_urls || 0),
    qr_scans: Number(serverStats.qr_scans || 0) + Number(localStats.qr_scans || 0),
    average_risk_score: Number(serverStats.average_risk_score || 0),
  };

  if (merged.today_scans > 0 && localStats.today_scans > 0) {
    const serverScanCount = Math.max(
      Number(serverStats.today_scans || 0),
      Number(serverStats.threats_detected || 0) +
        Number(serverStats.safe_urls || 0),
    );
    const serverRiskTotal =
      Number(serverStats.average_risk_score || 0) * serverScanCount;
    merged.average_risk_score = parseFloat(
      ((serverRiskTotal + Number(localStats.risk_total || 0)) / merged.today_scans).toFixed(
        1,
      ),
    );
  }

  return merged;
}
