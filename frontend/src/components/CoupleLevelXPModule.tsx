import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp } from 'lucide-react';
import { useGetCoupleProgress } from '../hooks/useQueries';
import { LoadingState } from './DataStates';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function CoupleLevelXPModule() {
  const { data: coupleProgress, isLoading } = useGetCoupleProgress();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayXP, setDisplayXP] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const previousXPRef = useRef(0);

  const totalPoints = coupleProgress ? Number(coupleProgress.totalPoints) : 0;
  const level = coupleProgress ? Number(coupleProgress.currentLevel) : 0;
  const pointsForNextLevel = coupleProgress ? Number(coupleProgress.pointsForNextLevel) : 0;
  const pointsToNextLevel = coupleProgress ? Number(coupleProgress.pointsToNextLevel) : 0;

  // Calculate progress percentage
  const currentLevelPoints = totalPoints - (pointsForNextLevel - pointsToNextLevel);
  const levelRange = pointsToNextLevel;
  const progressPercent = levelRange > 0 ? (currentLevelPoints / levelRange) * 100 : 0;

  // Animate XP counter when it changes
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayXP(totalPoints);
      setDisplayProgress(progressPercent);
      previousXPRef.current = totalPoints;
      return;
    }

    const previousXP = previousXPRef.current;
    if (previousXP === totalPoints) {
      setDisplayXP(totalPoints);
      setDisplayProgress(progressPercent);
      return;
    }

    // Animate XP counter
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = (totalPoints - previousXP) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayXP(totalPoints);
        clearInterval(timer);
      } else {
        setDisplayXP(Math.round(previousXP + increment * currentStep));
      }
    }, duration / steps);

    // Animate progress bar (CSS transition handles this)
    setDisplayProgress(progressPercent);
    previousXPRef.current = totalPoints;

    return () => clearInterval(timer);
  }, [totalPoints, progressPercent, prefersReducedMotion]);

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-4">
          <LoadingState message="Loading couple level..." size="sm" />
        </CardContent>
      </Card>
    );
  }

  if (!coupleProgress) {
    return (
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground text-sm">
            Complete activities together to unlock your couple level
          </div>
        </CardContent>
      </Card>
    );
  }

  // Level labels based on thresholds
  const getLevelLabel = (lvl: number): string => {
    if (lvl === 1) return 'Seedlings';
    if (lvl === 2) return 'Sprouts';
    if (lvl === 3) return 'Growing Strong';
    if (lvl === 4) return 'Blooming';
    if (lvl === 5) return 'Flourishing';
    if (lvl === 6) return 'Deeply Rooted';
    if (lvl === 7) return 'Thriving';
    if (lvl === 8) return 'Radiant';
    if (lvl === 9) return 'Legendary';
    if (lvl >= 10) return 'Love Legends';
    return 'Growing Together';
  };

  const levelLabel = getLevelLabel(level);

  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Couple Level {level}</h3>
              <p className="text-sm text-muted-foreground">{levelLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent">
            <TrendingUp className="w-5 h-5" />
            <span className="text-2xl font-bold tabular-nums">{displayXP}</span>
            <span className="text-sm text-muted-foreground">XP</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {level + 1}</span>
            <span className="font-medium text-foreground">
              {currentLevelPoints} / {levelRange} XP
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={displayProgress} 
              className={`h-3 ${prefersReducedMotion ? '' : 'transition-all duration-700 ease-out'}`}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {pointsToNextLevel} XP needed for next level
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Complete rituals, challenges, and build harmony to level up together
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
