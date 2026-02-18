import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Lock, Star } from 'lucide-react';
import { useGetInsightsData } from '../hooks/useQueries';
import { LoadingState } from './DataStates';

interface StreakMilestone {
  days: number;
  label: string;
  unlocked: boolean;
}

export function StreakMilestoneBadges() {
  const { data: insightsData, isLoading } = useGetInsightsData();

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

  // Find next milestone
  const nextMilestone = milestones.find(m => !m.unlocked);

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

        {/* Milestones Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {milestones.map((milestone, index) => {
            const isUnlocked = milestone.unlocked;
            const isNext = nextMilestone?.days === milestone.days;

            return (
              <div
                key={milestone.days}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-500 ${
                  isUnlocked
                    ? 'border-accent/40 bg-accent/5 shadow-md'
                    : isNext
                    ? 'border-primary/40 bg-primary/5 shadow-sm'
                    : 'border-muted/40 bg-muted/10 opacity-50'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Badge Icon */}
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-accent to-primary shadow-lg'
                      : 'bg-muted'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <Star className="w-6 h-6 text-white fill-white" />
                      <div className="absolute inset-0 rounded-full bg-accent/20 blur-lg animate-pulse" />
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
                      Unlocked
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

        {/* Next Milestone Indicator */}
        {nextMilestone && (
          <div className="pt-2 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">
                {nextMilestone.days - currentStreak} more day{nextMilestone.days - currentStreak !== 1 ? 's' : ''}
              </span>{' '}
              until {nextMilestone.label}!
            </p>
          </div>
        )}

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
