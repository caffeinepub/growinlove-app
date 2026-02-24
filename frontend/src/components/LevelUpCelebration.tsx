import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Trophy } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface LevelUpCelebrationProps {
  newLevel: number;
  levelLabel: string;
  onComplete: () => void;
}

export function LevelUpCelebration({ newLevel, levelLabel, onComplete }: LevelUpCelebrationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade-out animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleDismiss}
      role="dialog"
      aria-labelledby="level-up-title"
      aria-modal="true"
    >
      {/* Confetti/Hearts particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {i % 3 === 0 ? (
                <Heart className="w-4 h-4 text-accent fill-accent opacity-80" />
              ) : i % 3 === 1 ? (
                <Sparkles className="w-4 h-4 text-primary opacity-80" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-accent" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main celebration card */}
      <div
        className={`relative bg-card border-2 border-primary rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl ${
          prefersReducedMotion ? '' : 'animate-level-up-bounce'
        }`}
      >
        {/* Glow effect */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl animate-pulse" />
        )}

        <div className="relative z-10 space-y-6">
          {/* Trophy icon */}
          <div className="flex justify-center">
            <div className={`p-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg ${
              prefersReducedMotion ? '' : 'animate-level-up-icon'
            }`}>
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Level up text */}
          <div className="space-y-2">
            <h2 id="level-up-title" className="text-3xl font-bold text-gradient-romantic">
              Level Up!
            </h2>
            <div className={`text-6xl font-black text-primary ${
              prefersReducedMotion ? '' : 'animate-level-number-pop'
            }`}>
              {newLevel}
            </div>
            <p className="text-xl font-semibold text-foreground">
              {levelLabel}
            </p>
          </div>

          {/* Congratulations message */}
          <p className="text-muted-foreground">
            Your love is growing stronger together! 💕
          </p>

          {/* Tap to dismiss hint */}
          <p className="text-xs text-muted-foreground/70">
            Tap anywhere to continue
          </p>
        </div>
      </div>
    </div>
  );
}
