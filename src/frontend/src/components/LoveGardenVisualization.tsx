import { useEffect, useState } from 'react';
import type { GardenProgress } from '../backend';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface LoveGardenVisualizationProps {
  gardenProgress: GardenProgress;
}

export function LoveGardenVisualization({ gardenProgress }: LoveGardenVisualizationProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [previousLevel, setPreviousLevel] = useState<number>(Number(gardenProgress.level));
  const [newlyUnlockedPlants, setNewlyUnlockedPlants] = useState<string[]>([]);

  // Determine garden stage image based on level
  const getGardenStageImage = (level: number): string => {
    if (level <= 1) return '/assets/generated/garden-seed.dim_200x200.png';
    if (level <= 4) return '/assets/generated/garden-sapling.dim_300x300.png';
    if (level <= 7) return '/assets/generated/garden-flowers.dim_400x400.png';
    return '/assets/generated/garden-lush.dim_500x500.png';
  };

  // Detect level changes and newly unlocked plants
  useEffect(() => {
    const currentLevel = Number(gardenProgress.level);
    if (currentLevel > previousLevel) {
      setPreviousLevel(currentLevel);
    }

    // Detect newly unlocked plants
    const allPlants = [...gardenProgress.streakMilestones, ...gardenProgress.badgeAchievements];
    const newlyUnlocked = allPlants
      .filter(plant => plant.isUnlocked)
      .map(plant => plant.name);
    
    setNewlyUnlockedPlants(newlyUnlocked);
  }, [gardenProgress, previousLevel]);

  const currentLevel = Number(gardenProgress.level);
  const gardenImage = getGardenStageImage(currentLevel);
  const shouldAnimate = !prefersReducedMotion && currentLevel > previousLevel;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main Garden Stage */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-romantic-light/20 to-romantic-primary/10 border-2 border-romantic-primary/20 shadow-lg">
        <img
          src={gardenImage}
          alt={`Garden at level ${currentLevel}`}
          className={`w-full h-full object-contain transition-all duration-1000 ${
            shouldAnimate ? 'garden-stage-enter' : ''
          }`}
        />

        {/* Unlocked Plants Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {gardenProgress.streakMilestones
            .filter(plant => plant.isUnlocked)
            .map((plant, index) => (
              <div
                key={plant.name}
                className={`absolute ${
                  index === 0 ? 'bottom-4 left-4' : index === 1 ? 'bottom-4 right-4' : 'top-4 left-1/2 -translate-x-1/2'
                } ${
                  newlyUnlockedPlants.includes(plant.name) && !prefersReducedMotion
                    ? 'plant-unlock-animation'
                    : ''
                }`}
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <img
                  src={
                    plant.name.includes('Rose')
                      ? '/assets/generated/rose-bush.dim_150x150.png'
                      : '/assets/generated/cherry-blossom.dim_200x250.png'
                  }
                  alt={plant.name}
                  className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
                />
              </div>
            ))}

          {gardenProgress.badgeAchievements
            .filter(plant => plant.isUnlocked)
            .map((plant, index) => (
              <div
                key={plant.name}
                className={`absolute top-4 right-4 ${
                  newlyUnlockedPlants.includes(plant.name) && !prefersReducedMotion
                    ? 'plant-unlock-animation'
                    : ''
                }`}
                style={{
                  animationDelay: `${(gardenProgress.streakMilestones.length + index) * 200}ms`,
                }}
              >
                <img
                  src="/assets/generated/cherry-blossom.dim_200x250.png"
                  alt={plant.name}
                  className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
                />
              </div>
            ))}
        </div>

        {/* Level Badge */}
        <div className="absolute top-4 left-4 bg-romantic-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold shadow-lg">
          Level {currentLevel}
        </div>
      </div>
    </div>
  );
}
