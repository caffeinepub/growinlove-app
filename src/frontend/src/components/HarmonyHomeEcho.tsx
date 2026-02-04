import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { harmonyToPercent, getTrendLabel, getTrendDisplay, normalizeTrendSeries } from '@/utils/harmony';

interface HarmonyHomeEchoProps {
  currentHarmony: number; // 0..1
  harmonyTrend: number[]; // 7-day series
  onNavigateToInsights: () => void;
}

export function HarmonyHomeEcho({
  currentHarmony,
  harmonyTrend,
  onNavigateToInsights,
}: HarmonyHomeEchoProps) {
  const harmonyPercent = harmonyToPercent(currentHarmony);
  const normalizedTrend = normalizeTrendSeries(harmonyTrend);
  const trendDirection = getTrendLabel(normalizedTrend);
  const trendDisplay = getTrendDisplay(trendDirection);

  return (
    <Button
      variant="ghost"
      className="w-full p-4 h-auto flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 hover:bg-purple-500/15 transition-all duration-200"
      onClick={onNavigateToInsights}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-purple-500 fill-purple-500" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">Harmony</p>
          <p className="text-xs text-muted-foreground">Tap to see breakdown</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
          {harmonyPercent}%
        </span>
        <span className={`text-sm font-semibold ${trendDisplay.color}`}>
          {trendDisplay.icon}
        </span>
      </div>
    </Button>
  );
}
