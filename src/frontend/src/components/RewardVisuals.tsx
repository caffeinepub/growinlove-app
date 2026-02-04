import { useState } from 'react';
import { Heart, Award, Star, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RewardVisualsProps {
  isAdmin?: boolean;
}

interface Milestone {
  threshold: number;
  label: string;
  icon: typeof Award;
  achieved: boolean;
}

export function RewardVisuals({ isAdmin = false }: RewardVisualsProps) {
  // Placeholder progress for UI demonstration
  const progress = 0;
  const completedChallenges = 0;
  const totalChallenges = 0;

  // Define milestones
  const milestones: Milestone[] = [
    { threshold: 25, label: 'Getting Started', icon: Star, achieved: progress >= 25 },
    { threshold: 50, label: 'Halfway There', icon: Heart, achieved: progress >= 50 },
    { threshold: 75, label: 'Almost Complete', icon: Award, achieved: progress >= 75 },
    { threshold: 100, label: 'Love Master', icon: Trophy, achieved: progress >= 100 },
  ];

  return (
    <div className="space-y-6 gentle-entrance">
      {/* Heart Progress Meter */}
      <Card className="border-2 border-primary/20 shadow-lg overflow-hidden relative">
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-primary flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 fill-primary" />
              Your Love Journey Progress
            </h3>
            <p className="text-sm text-muted-foreground">
              Coming soon: Track your challenge progress here
            </p>
          </div>

          {/* Heart-shaped progress visualization */}
          <div className="relative flex items-center justify-center py-8">
            {/* Background heart outline */}
            <div className="relative w-48 h-48">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))' }}
              >
                {/* Background heart */}
                <path
                  d="M50,90 C50,90 10,65 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,65 50,90 50,90 Z"
                  fill="oklch(95% 0.02 15)"
                  stroke="oklch(70% 0.15 15)"
                  strokeWidth="2"
                />
                {/* Filled heart based on progress */}
                <defs>
                  <linearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="oklch(75% 0.18 5)" />
                    <stop offset="100%" stopColor="oklch(70% 0.15 15)" />
                  </linearGradient>
                  <clipPath id="heartClip">
                    <path d="M50,90 C50,90 10,65 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,65 50,90 50,90 Z" />
                  </clipPath>
                </defs>
                <rect
                  x="0"
                  y={100 - progress}
                  width="100"
                  height={progress}
                  fill="url(#heartGradient)"
                  clipPath="url(#heartClip)"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: progress > 0 ? 'drop-shadow(0 0 8px oklch(70% 0.15 15 / 0.6))' : 'none',
                  }}
                />
              </svg>

              {/* Progress percentage in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar as backup visualization */}
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-center text-muted-foreground">
              Challenge system coming soon! 💞
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Badge Unlock Section */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-primary flex items-center justify-center gap-2">
              <Award className="w-6 h-6" />
              Achievement Badges
            </h3>
            <p className="text-sm text-muted-foreground">
              Unlock badges as you reach milestones
            </p>
          </div>

          {/* Badges grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isUnlocked = milestone.achieved;

              return (
                <div
                  key={milestone.threshold}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-500 ${
                    isUnlocked
                      ? 'border-primary/40 bg-primary/5 shadow-lg'
                      : 'border-muted/40 bg-muted/20 opacity-60'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Badge icon */}
                  <div
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-primary to-accent shadow-lg'
                        : 'bg-muted'
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 transition-all duration-500 ${
                        isUnlocked ? 'text-white' : 'text-muted-foreground'
                      }`}
                    />
                    {isUnlocked && (
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                    )}
                  </div>

                  {/* Badge label */}
                  <div className="text-center">
                    <p className="text-xs font-semibold text-primary">
                      {milestone.threshold}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {milestone.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next milestone indicator */}
          <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Challenge badges will unlock as you complete activities together
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
