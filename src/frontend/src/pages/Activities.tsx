import { Sparkles, Heart, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetCallerUserProfile, useGetCombinedQuizResultState, useGetInsightsData, useIsAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SpinWheel } from '../components/SpinWheel';
import { UnlockPacks } from '../components/UnlockPacks';
import { LoveChallenges } from '../components/LoveChallenges';
import { RewardVisuals } from '../components/RewardVisuals';
import { CoupleLevelXPModule } from '../components/CoupleLevelXPModule';
import { StreakMilestoneBadges } from '../components/StreakMilestoneBadges';

export function Activities() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: combinedQuizState } = useGetCombinedQuizResultState();
  const { data: insightsData } = useGetInsightsData();
  const { data: isAdmin = false } = useIsAdmin();

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;
  const bothCompletedQuiz = !!(combinedQuizState?.callerCompleted && combinedQuizState?.partnerCompleted);

  const currentStreak = insightsData ? Number(insightsData.currentStreak) : 0;

  // Admin override: bypass pairing requirement
  if (!isAuthenticated || (!isPaired && !isAdmin)) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative inline-block">
              <Heart className="w-20 h-20 text-primary/30 fill-primary/30 glow-pulse" />
              <Sparkles className="w-8 h-8 text-accent absolute -top-2 -right-2" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-primary">Activities Await!</h2>
              <p className="text-muted-foreground leading-relaxed">
                Complete your pairing to unlock fun activities, challenges, and rewards with your partner.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-full px-6 py-8 space-y-8 pb-24">
      {/* Admin Badge */}
      {isAdmin && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
          <Crown className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-accent">Admin Mode Active</span>
        </div>
      )}

      {/* Weekly Challenge Section */}
      <section className="space-y-4">
        <LoveChallenges />
      </section>

      {/* Couple Level XP Module */}
      <section className="space-y-4">
        <CoupleLevelXPModule />
      </section>

      {/* Streak Milestone Badges */}
      <section className="space-y-4">
        <StreakMilestoneBadges />
      </section>

      {/* Reward Visuals Section */}
      <section className="space-y-4">
        <RewardVisuals isAdmin={isAdmin} />
      </section>

      {/* Spin the Love Wheel Section */}
      <section className="space-y-4">
        <Card className="border-2 border-primary/20 shadow-lg gentle-entrance">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                🎡 Spin the Love Wheel
              </h2>
              <p className="text-muted-foreground">
                Spin for a surprise activity based on your love languages!
              </p>
            </div>
            
            {bothCompletedQuiz ? (
              <SpinWheel bothCompletedQuiz={bothCompletedQuiz} combinedQuizState={combinedQuizState} />
            ) : (
              <div className="text-center py-8 space-y-3">
                <Heart className="w-12 h-12 text-primary/30 fill-primary/30 mx-auto" />
                <p className="text-muted-foreground">
                  Complete the Love Languages Quiz together to unlock the wheel!
                </p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground/70 text-center italic">
              Note: Smoother slow-stop/deceleration polish coming soon
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Love Language Unlock Packs Section */}
      <section className="space-y-4">
        <UnlockPacks 
          bothCompletedQuiz={bothCompletedQuiz} 
          currentStreak={currentStreak} 
          combinedQuizState={combinedQuizState}
          isAdmin={isAdmin} 
        />
      </section>
    </div>
  );
}
