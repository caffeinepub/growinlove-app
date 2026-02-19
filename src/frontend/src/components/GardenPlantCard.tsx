import { Lock, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Plant } from '../backend';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface GardenPlantCardProps {
  plant: Plant;
  highlight?: boolean;
}

export function GardenPlantCard({ plant, highlight = false }: GardenPlantCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLocked = !plant.isUnlocked;

  return (
    <Card
      className={`transition-all duration-300 ${
        isLocked ? 'opacity-60 grayscale' : 'hover:shadow-lg'
      } ${
        highlight && !prefersReducedMotion ? 'plant-card-highlight' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {isLocked ? (
              <Lock className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Check className="w-5 h-5 text-romantic-accent" />
            )}
            <span className={isLocked ? 'text-muted-foreground' : 'text-foreground'}>
              {plant.name}
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {plant.description}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs font-medium text-romantic-primary">
            {plant.milestone}
          </span>
          <span className="text-xs text-muted-foreground">
            {plant.xpRequired} XP
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
