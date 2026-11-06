/**
 * AutoFleet Telematics & Financial Formatting Utilities
 * Standardized, zero-division safe, and locale-consistent formatting functions.
 */

/**
 * Format numeric currency safely (defaults to USD)
 * @param {number|string} amount
 * @param {string} currency
 * @returns {string} e.g. "$1,250.00"
 */
export function formatCurrency(amount, currency = 'USD') {
  const num = Number(amount);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

/**
 * Format distance in kilometers with unit
 * @param {number|string} km
 * @param {number} precision
 * @returns {string} e.g. "124.5 km"
 */
export function formatDistance(km, precision = 1) {
  const num = Number(km);
  if (isNaN(num) || num <= 0) return '0.0 km';
  return `${num.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  })} km`;
}

/**
 * Safe division preventing NaN or Infinity
 * @param {number} numerator
 * @param {number} denominator
 * @param {number} fallback
 * @returns {number}
 */
export function safeDivision(numerator, denominator, fallback = 0) {
  const num = Number(numerator);
  const den = Number(denominator);
  if (isNaN(num) || isNaN(den) || den === 0) return fallback;
  return num / den;
}

/**
 * Format elapsed duration from minutes to human-readable string
 * @param {number} minutes
 * @returns {string} e.g. "2h 45m" or "45m"
 */
export function formatDuration(minutes) {
  const num = Math.round(Number(minutes));
  if (isNaN(num) || num <= 0) return '0m';
  const hrs = Math.floor(num / 60);
  const mins = num % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

/**
 * Format ISO datetime string consistently
 * @param {string|Date} dateVal
 * @param {boolean} includeTime
 * @returns {string} e.g. "Nov 4, 2026, 09:30 AM"
 */
export function formatDateTime(dateVal, includeTime = true) {
  if (!dateVal) return '—';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '—';

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit', hour12: true })
  };

  return new Intl.DateTimeFormat('en-US', options).format(d);
}

/**
 * Format relative time from now
 * @param {string|Date} dateVal
 * @returns {string} e.g. "5m ago", "2h ago", "Just now"
 */
export function formatRelativeTime(dateVal) {
  if (!dateVal) return '—';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '—';

  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
