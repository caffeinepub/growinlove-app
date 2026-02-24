import React, { useEffect, useState, useMemo } from 'react';
import { Heart } from 'lucide-react';

export function CompletionAnimation() {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  // Memoize heart generation to avoid recalculation on every render
  const generatedHearts = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
  }, []);

  useEffect(() => {
    setHearts(generatedHearts);
  }, [generatedHearts]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up will-change-transform"
          style={{
            left: `${heart.x}%`,
            bottom: '-20px',
            animationDelay: `${heart.delay}s`,
          }}
        >
          <Heart
            className="w-6 h-6 text-primary fill-primary opacity-70"
            style={{
              filter: 'drop-shadow(0 0 8px oklch(var(--primary) / 0.6))',
            }}
          />
        </div>
      ))}
    </div>
  );
}
