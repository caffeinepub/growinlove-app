import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Star, Heart, Flame, Trophy, Award, Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface BadgeData {
  id: string;
  title: string;
  description: string;
  requirement: string;
  unlocked: boolean;
  isNew?: boolean;
  icon: 'star' | 'heart' | 'flame' | 'trophy' | 'award' | 'sparkles';
}

interface BadgeShowcaseProps {
  badges: BadgeData[];
  title?: string;
}

const iconMap = {
  star: Star,
  heart: Heart,
  flame: Flame,
  trophy: Trophy,
  award: Award,
  sparkles: Sparkles,
};

export function BadgeShowcase({ badges, title = 'Achievement Badges' }: BadgeShowcaseProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Trophy className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => {
              const Icon = iconMap[badge.icon];
              const isUnlocked = badge.unlocked;
              const isNew = badge.isNew && isUnlocked;

              return (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-500 cursor-pointer hover:scale-105 ${
                        isUnlocked
                          ? 'border-accent/40 bg-accent/5 shadow-md'
                          : 'border-muted/40 bg-muted/10 opacity-60'
                      } ${
                        isNew && !prefersReducedMotion ? 'animate-badge-entrance' : ''
                      }`}
                      style={{
                        animationDelay: prefersReducedMotion ? '0s' : `${index * 0.1}s`,
                      }}
                    >
                      {/* New badge indicator */}
                      {isNew && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <Badge variant="default" className="bg-accent text-accent-foreground text-xs px-2 py-0.5">
                            New!
                          </Badge>
                        </div>
                      )}

                      {/* Badge icon */}
                      <div
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-accent to-primary shadow-lg'
                            : 'bg-muted'
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            <Icon className="w-8 h-8 text-white" />
                            {!prefersReducedMotion && (
                              <div className="absolute inset-0 rounded-full bg-accent/20 blur-lg animate-pulse" />
                            )}
                          </>
                        ) : (
                          <Lock className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Badge title */}
                      <p className="text-xs font-semibold text-center text-foreground line-clamp-2">
                        {badge.title}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">{badge.title}</p>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <p className="text-xs text-muted-foreground italic">
                        {isUnlocked ? '✓ Unlocked' : `Requirement: ${badge.requirement}`}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {badges.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Complete activities together to earn badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
