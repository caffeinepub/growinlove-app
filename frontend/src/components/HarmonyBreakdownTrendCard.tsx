import { useState } from 'react';
import { Heart, Info, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { harmonyToPercent, normalizeTrendSeries, getTrendLabel, getTrendDisplay } from '@/utils/harmony';

interface HarmonyBreakdownTrendCardProps {
  currentHarmony: number; // 0..1
  harmonyTrend: number[]; // backend series, 0..1 values
  quizOverlapScore: number; // 0..1
  recentCompletionRate: number; // 0..1
  challengeCompletionRate: number; // 0..1 - NEW
}

export function HarmonyBreakdownTrendCard({
  currentHarmony,
  harmonyTrend,
  quizOverlapScore,
  recentCompletionRate,
  challengeCompletionRate,
}: HarmonyBreakdownTrendCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const harmonyPercent = harmonyToPercent(currentHarmony);
  const normalizedTrend = normalizeTrendSeries(harmonyTrend);
  const trendDirection = getTrendLabel(normalizedTrend);
  const trendDisplay = getTrendDisplay(trendDirection);

  // Check if we have enough data to show meaningful trends
  const hasEnoughData = harmonyTrend.length >= 3 && harmonyTrend.some(v => v > 0);

  // Color band based on harmony level
  const getColorBand = (percent: number): string => {
    if (percent >= 80) return 'text-green-500';
    if (percent >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const colorClass = getColorBand(harmonyPercent);

  return (
    <Card 
      id="harmony-section"
      className="border-2 border-purple-500/30 shadow-md bg-gradient-to-br from-purple-500/5 to-indigo-500/5 backdrop-blur-sm"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="w-5 h-5 text-purple-500 fill-purple-500" />
          Harmony Breakdown & Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Harmony Score */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground font-medium">Current Harmony</p>
          <div className={`text-5xl font-bold ${colorClass} transition-all duration-300`}>
            {harmonyPercent}%
          </div>
          {hasEnoughData && (
            <div className="flex items-center justify-center gap-2">
              <span className={`text-sm font-semibold ${trendDisplay.color}`}>
                {trendDisplay.icon} {trendDisplay.label}
              </span>
            </div>
          )}
        </div>

        {/* 7-Day Sparkline - Deterministic from backend */}
        {hasEnoughData ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">7-Day Trend</p>
            <div className="flex items-end justify-between gap-1 h-16">
              {normalizedTrend.map((value, idx) => {
                const height = Math.max(10, value * 100);
                return (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t transition-all duration-500 hover:opacity-80"
                    style={{ height: `${height}%` }}
                    title={`Day ${idx + 1}: ${harmonyToPercent(value)}%`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>7 days ago</span>
              <span>Today</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-purple-500 mx-auto" />
            <p className="text-sm font-semibold text-foreground">Not Enough Data Yet</p>
            <p className="text-xs text-muted-foreground">
              Complete more daily rituals together to see your harmony trend visualization.
            </p>
          </div>
        )}

        {/* Breakdown - Now with 3 components */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">What Makes Up Your Harmony</p>
          
          {/* Quiz Alignment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🧠</span>
                <span className="text-sm text-foreground">Quiz Alignment</span>
              </div>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {harmonyToPercent(quizOverlapScore)}%
              </span>
            </div>
            <Progress value={quizOverlapScore * 100} className="h-2 bg-secondary" />
          </div>

          {/* Recent Ritual Consistency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">❤️</span>
                <span className="text-sm text-foreground">Recent Ritual Consistency</span>
              </div>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                {harmonyToPercent(recentCompletionRate)}%
              </span>
            </div>
            <Progress value={recentCompletionRate * 100} className="h-2 bg-secondary" />
          </div>

          {/* Challenge Completion - NEW */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🎯</span>
                <span className="text-sm text-foreground">Challenge Completion</span>
              </div>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {harmonyToPercent(challengeCompletionRate)}%
              </span>
            </div>
            <Progress value={challengeCompletionRate * 100} className="h-2 bg-secondary" />
          </div>
        </div>

        {/* Explanation Toggle */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-between text-sm"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-500" />
              <span>How is harmony calculated?</span>
            </div>
            {showExplanation ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {showExplanation && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2 text-xs text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-300">
              <p>
                <strong className="text-foreground">Harmony</strong> reflects how aligned you are and how consistently you show up for each other.
              </p>
              <p>
                <strong className="text-foreground">Quiz Alignment (40%)</strong> measures how similar your top love languages are.
              </p>
              <p>
                <strong className="text-foreground">Recent Ritual Consistency (40%)</strong> tracks your completion rate over the last 14 days.
              </p>
              <p>
                <strong className="text-foreground">Challenge Completion (20%)</strong> reflects your engagement with love challenges.
              </p>
              <p className="pt-2 border-t border-purple-500/20">
                💡 All three components work together to create your overall harmony score. Keep showing up together!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
