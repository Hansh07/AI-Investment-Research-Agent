// ============================================================
// Formatter Utilities
// ============================================================
// Helper functions for displaying data in the UI.
// ============================================================

/**
 * Returns a color class based on the score (0-100).
 */
export function getScoreColor(score) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 40) return 'text-yellow-400';
  if (score >= 20) return 'text-orange-400';
  return 'text-red-400';
}

/**
 * Returns a background gradient class based on the score.
 */
export function getScoreGradient(score) {
  if (score >= 80) return 'from-emerald-500 to-emerald-600';
  if (score >= 60) return 'from-blue-500 to-blue-600';
  if (score >= 40) return 'from-yellow-500 to-yellow-600';
  if (score >= 20) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
}

/**
 * Returns a label for the score range.
 */
export function getScoreLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 45) return 'Fair';
  if (score >= 30) return 'Weak';
  return 'Poor';
}

/**
 * Returns the color scheme for a risk level.
 */
export function getRiskColors(risk) {
  switch (risk) {
    case 'Low':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/30',
        fill: '#10b981',
      };
    case 'High':
      return {
        text: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        fill: '#ef4444',
      };
    default:
      return {
        text: 'text-yellow-400',
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/30',
        fill: '#eab308',
      };
  }
}

/**
 * Formats a timestamp to a readable relative time string.
 */
export function formatTimeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}
