import { useEffect, useState } from 'react';
import { Flower2, Sparkles, Heart } from 'lucide-react';
import { useGetLoveGardenProgress, useCreateGarden, useIsAdmin } from '../hooks/useQueries';
import { LoveGardenVisualization } from '../components/LoveGardenVisualization';
import { GardenPlantCard } from '../components/GardenPlantCard';
import { LoadingState, ErrorState, EmptyState, SectionHeader } from '../components/DataStates';
import { Progress } from '@/components/ui/progress';
import { CompletionAnimation } from '../components/CompletionAnimation';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Garden() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: gardenProgress, isLoading, error, refetch } = useGetLoveGardenProgress();
  const createGarden = useCreateGarden();
  const [showCelebration, setShowCelebration] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // For now, assume user is paired if they're authenticated
  // In a real app, this would check actual pairing status
  const isPaired = !!identity;
  const canAccess = isPaired || isAdmin;

  // Show celebration when new rewards are available
  useEffect(() => {
    if (gardenProgress?.hasAvailableRewards && !prefersReducedMotion) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [gardenProgress?.hasAvailableRewards, prefersReducedMotion]);

  // Handle garden creation
  const handleCreateGarden = async () => {
    try {
      await createGarden.mutateAsync();
      await refetch();
    } catch (err) {
      console.error('Failed to create garden:', err);
    }
  };

  if (adminLoading) {
    return <LoadingState message="Loading garden..." />;
  }

  if (!canAccess) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <EmptyState
          icon={<Flower2 className="w-16 h-16 text-primary/40" />}
          title="Garden Access Required"
          description="You need to be paired with a partner to access your Love Garden. Complete the pairing process in the Us tab to start growing your garden together."
        />
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState message="Loading your Love Garden..." />;
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if garden needs to be created
    if (errorMessage.includes('not initialized') || errorMessage.includes('not found')) {
      return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <SectionHeader
            title="Love Garden"
            description="Your shared garden of growth and connection"
            icon={<Flower2 className="w-8 h-8 text-romantic-primary" />}
          />
          <EmptyState
            icon={<Flower2 className="w-16 h-16 text-primary/40" />}
            title="Start Your Love Garden"
            description="Create your Love Garden to visualize your relationship's growth. As you complete rituals and reach milestones, your garden will flourish with beautiful plants and flowers."
            action={{
              label: createGarden.isPending ? 'Creating Garden...' : 'Create Garden',
              onClick: handleCreateGarden,
            }}
          />
        </div>
      );
    }

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <ErrorState
          message="Failed to load your Love Garden"
          details={errorMessage}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!gardenProgress) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <EmptyState
          icon={<Flower2 className="w-16 h-16 text-primary/40" />}
          title="No Garden Data"
          description="Unable to load garden data. Please try again."
          action={{
            label: 'Retry',
            onClick: () => refetch(),
          }}
        />
      </div>
    );
  }

  const currentXP = Number(gardenProgress.xp);
  const currentLevel = Number(gardenProgress.level);
  const levelProgress = gardenProgress.levelProgress * 100;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-24">
      {/* Celebration Animation */}
      {showCelebration && <CompletionAnimation />}

      {/* Header */}
      <SectionHeader
        title="Love Garden"
        description="Watch your relationship bloom as you grow together"
        icon={<Flower2 className="w-8 h-8 text-romantic-primary" />}
      />

      {/* Garden Visualization */}
      <div className="space-y-4">
        <LoveGardenVisualization gardenProgress={gardenProgress} />

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-romantic-primary">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Total XP</span>
            </div>
            <p className="text-2xl font-bold">{currentXP}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-romantic-accent">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Garden Level</span>
            </div>
            <p className="text-2xl font-bold">{currentLevel}</p>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Progress to Next Level
            </span>
            <span className="text-sm font-semibold text-romantic-primary">
              {levelProgress.toFixed(0)}%
            </span>
          </div>
          <Progress value={levelProgress} className="h-3" />
        </div>
      </div>

      {/* Streak Milestones */}
      {gardenProgress.streakMilestones.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Flower2 className="w-6 h-6 text-romantic-primary" />
            Streak Milestones
          </h3>
          <div className="grid gap-4">
            {gardenProgress.streakMilestones.map((plant) => (
              <GardenPlantCard
                key={plant.name}
                plant={plant}
                highlight={plant.name === gardenProgress.unlockedPlant?.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Badge Achievements */}
      {gardenProgress.badgeAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-romantic-accent" />
            Badge Achievements
          </h3>
          <div className="grid gap-4">
            {gardenProgress.badgeAchievements.map((plant) => (
              <GardenPlantCard
                key={plant.name}
                plant={plant}
                highlight={plant.name === gardenProgress.unlockedPlant?.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {gardenProgress.isComplete && (
        <div className="bg-gradient-to-r from-romantic-primary/10 to-romantic-accent/10 border-2 border-romantic-primary/30 rounded-2xl p-6 text-center space-y-2">
          <Sparkles className="w-12 h-12 text-romantic-primary mx-auto" />
          <h3 className="text-xl font-bold text-foreground">Garden Complete!</h3>
          <p className="text-muted-foreground">
            Your Love Garden is in full bloom. Keep nurturing your relationship to maintain this beautiful garden.
          </p>
        </div>
      )}
    </div>
  );
}
