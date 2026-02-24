// Harmony UI helpers for consistent rendering and trend analysis

/**
 * Round harmony value (0..1) to percent with consistent precision
 */
export function harmonyToPercent(harmony: number): number {
  return Math.round(harmony * 100);
}

/**
 * Normalize a harmony trend series to exactly 7 values
 * Handles missing data gracefully
 */
export function normalizeTrendSeries(series: number[]): number[] {
  if (series.length === 0) {
    return Array(7).fill(0);
  }
  
  if (series.length >= 7) {
    return series.slice(-7);
  }
  
  // Pad with first value if series is shorter than 7
  const padding = Array(7 - series.length).fill(series[0] || 0);
  return [...padding, ...series];
}

/**
 * Compute simple trend label from 7-day series
 */
export function getTrendLabel(series: number[]): 'up' | 'down' | 'stable' {
  if (series.length < 2) return 'stable';
  
  const normalized = normalizeTrendSeries(series);
  const first = normalized[0];
  const last = normalized[normalized.length - 1];
  const diff = last - first;
  
  if (diff > 0.05) return 'up';
  if (diff < -0.05) return 'down';
  return 'stable';
}

/**
 * Get trend icon and color based on direction
 */
export function getTrendDisplay(trend: 'up' | 'down' | 'stable'): {
  icon: string;
  color: string;
  label: string;
} {
  switch (trend) {
    case 'up':
      return { icon: '↗', color: 'text-green-500', label: 'improving' };
    case 'down':
      return { icon: '↘', color: 'text-amber-500', label: 'slipping' };
    case 'stable':
      return { icon: '→', color: 'text-blue-500', label: 'stable' };
  }
}
