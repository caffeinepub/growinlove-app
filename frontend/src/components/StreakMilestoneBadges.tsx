import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Lock, Star, TrendingUp } from 'lucide-react';
import { useGetInsightsData } from '../hooks/useQueries';
import { LoadingState } from './DataStates';
import { Progress } from '@/components/ui/progress';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface StreakMilestone {
  days: number;
  label: string;
  unlocked: boolean;
}

export function StreakMilestoneBadges() {
  const { data: insightsData, isLoading } = useGetInsightsData();
  const prefersReducedMotion = usePrefersReducedMotion();
  const previousUnlockedRef = useRef<Set<number>>(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState<Set<number>>(new Set());

  const currentStreak = insightsData ? Number(insightsData.currentStreak) : 0;

  // Define streak milestones
  const milestones: StreakMilestone[] = [
    { days: 3, label: '3-Day Streak', unlocked: currentStreak >= 3 },
    { days: 7, label: '7-Day Streak', unlocked: currentStreak >= 7 },
    { days: 14, label: '14-Day Streak', unlocked: currentStreak >= 14 },
    { days: 30, label: '30-Day Streak', unlocked: currentStreak >= 30 },
    { days: 60, label: '60-Day Streak', unlocked: currentStreak >= 60 },
    { days: 100, label: '100-Day Streak', unlocked: currentStreak >= 100 },
  ];

  // Detect newly unlocked badges
  useEffect(() => {
    const currentUnlocked = new Set(milestones.filter(m => m.unlocked).map(m => m.days));
    const previousUnlocked = previousUnlockedRef.current;
    
    const newUnlocks = new Set<number>();
    currentUnlocked.forEach(days => {
      if (!previousUnlocked.has(days)) {
        newUnlocks.add(days);
      }
    });

    if (newUnlocks.size > 0) {
      setNewlyUnlocked(newUnlocks);
      // Clear the "new" indicator after animation completes
      setTimeout(() => {
        setNewlyUnlocked(new Set());
      }, 3000);
    }

    previousUnlockedRef.current = currentUnlocked;
  }, [currentStreak]);

  // Find next milestone
  const nextMilestone = milestones.find(m => !m.unlocked);
  const daysUntilNext = nextMilestone ? nextMilestone.days - currentStreak : 0;
  const progressToNext = nextMilestone 
    ? (currentStreak / nextMilestone.days) * 100 
    : 100;

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-4">
          <LoadingState message="Loading streak milestones..." size="sm" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-accent/30 shadow-lg gentle-entrance">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-primary flex items-center justify-center gap-2">
            <Flame className="w-6 h-6 text-accent fill-accent" />
            Streak Milestones
          </h3>
          <p className="text-sm text-muted-foreground">
            Keep your daily ritual streak going to unlock badges
          </p>
        </div>

        {/* Current Streak Display */}
        <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <Flame className="w-5 h-5 text-accent fill-accent" />
          <span className="text-lg font-bold text-accent">
            {currentStreak} Day{currentStreak !== 1 ? 's' : ''}
          </span>
          <span className="text-sm text-muted-foreground">Current Streak</span>
        </div>

        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <div className="space-y-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                Next Badge
              </span>
              <span className="font-semibold text-primary">
                {daysUntilNext} day{daysUntilNext !== 1 ? 's' : ''} to go!
              </span>
            </div>
            <Progress 
              value={progressToNext} 
              className={`h-2 ${prefersReducedMotion ? '' : 'transition-all duration-700 ease-out'}`}
            />
            <p className="text-xs text-muted-foreground text-center">
              {currentStreak} / {nextMilestone.days} days until <span className="font-semibold">{nextMilestone.label}</span>
            </p>
          </div>
        )}

        {/* Milestones Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {milestones.map((milestone, index) => {
            const isUnlocked = milestone.unlocked;
            const isNext = nextMilestone?.days === milestone.days;
            const isNewlyUnlocked = newlyUnlocked.has(milestone.days);

            return (
              <div
                key={milestone.days}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-500 ${
                  isUnlocked
                    ? 'border-accent/40 bg-accent/5 shadow-md'
                    : isNext
                    ? 'border-primary/40 bg-primary/5 shadow-sm'
                    : 'border-muted/40 bg-muted/10 opacity-50'
                } ${
                  isNewlyUnlocked && !prefersReducedMotion ? 'animate-badge-unlock' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Particle effects for newly unlocked */}
                {isNewlyUnlocked && !prefersReducedMotion && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute animate-particle-burst"
                        style={{
                          left: '50%',
                          top: '50%',
                          animationDelay: `${i * 0.1}s`,
                          transform: `rotate(${i * 60}deg)`,
                        }}
                      >
                        <Star className="w-3 h-3 text-accent fill-accent" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Badge Icon */}
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-accent to-primary shadow-lg'
                      : 'bg-muted'
                  } ${
                    isNewlyUnlocked && !prefersReducedMotion ? 'animate-badge-icon-pop' : ''
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <Star className="w-6 h-6 text-white fill-white" />
                      {!prefersReducedMotion && (
                        <div className="absolute inset-0 rounded-full bg-accent/20 blur-lg animate-pulse" />
                      )}
                    </>
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Badge Label */}
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">
                    {milestone.label}
                  </p>
                  {isUnlocked && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {isNewlyUnlocked ? 'New!' : 'Unlocked'}
                    </Badge>
                  )}
                  {isNext && !isUnlocked && (
                    <Badge variant="outline" className="mt-1 text-xs border-primary text-primary">
                      Next Goal
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* All Unlocked Message */}
        {!nextMilestone && currentStreak >= 100 && (
          <div className="pt-2 text-center">
            <p className="text-sm font-semibold text-accent flex items-center justify-center gap-2">
              <Star className="w-4 h-4 fill-accent" />
              Amazing! You've unlocked all streak milestones!
              <Star className="w-4 h-4 fill-accent" />
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
