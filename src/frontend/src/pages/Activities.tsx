import { Sparkles, Heart, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetCallerUserProfile, useGetCombinedQuizResultState, useGetInsightsData, useIsAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SpinWheel } from '../components/SpinWheel';
import { UnlockPacks } from '../components/UnlockPacks';
import { LoveChallenges } from '../components/LoveChallenges';
import { RewardVisuals } from '../components/RewardVisuals';

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
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
              <Sparkles className="w-20 h-20 text-accent mx-auto relative glow-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Connect to Explore Activities</h2>
              <p className="text-muted-foreground leading-relaxed">
                To access love activities, please connect with your partner in the <span className="font-semibold text-primary">Us</span> tab
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-full px-6 py-8 space-y-6 stagger-entrance">
      {/* Header Section */}
      <div className="text-center space-y-2 gentle-entrance">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
          <Sparkles className="w-16 h-16 text-accent mx-auto relative" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Love Activities
        </h1>
        <p className="text-muted-foreground text-base">
          Discover new ways to connect through your love languages
        </p>
        {isAdmin && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <Crown className="w-3 h-3" />
            Admin Access - All Features Unlocked
          </div>
        )}
      </div>

      {/* Floating hearts decoration */}
      <div className="fixed top-20 right-8 text-primary/10 float-heart pointer-events-none">
        <Heart className="w-8 h-8" fill="currentColor" />
      </div>
      <div className="fixed bottom-32 left-8 text-primary/10 float-heart-delayed pointer-events-none">
        <Heart className="w-6 h-6" fill="currentColor" />
      </div>

      {/* Love Challenges Section - Positioned at the top */}
      <LoveChallenges />

      {/* Reward Visuals Section - Positioned below Love Challenges */}
      <RewardVisuals isAdmin={isAdmin} />

      {/* Spin the Love Wheel */}
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-card via-card to-accent/5 overflow-hidden relative">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Spin the Love Wheel
              </h2>
              <p className="text-sm text-muted-foreground">
                Discover a personalized activity based on your love languages
              </p>
            </div>
            <span className="text-sm text-muted-foreground italic">Coming soon</span>
          </div>
          <SpinWheel 
            bothCompletedQuiz={bothCompletedQuiz}
            combinedQuizState={combinedQuizState}
          />
        </CardContent>
      </Card>

      {/* Love Language Unlock Packs */}
      <UnlockPacks 
        bothCompletedQuiz={bothCompletedQuiz}
        currentStreak={currentStreak}
        combinedQuizState={combinedQuizState}
        isAdmin={isAdmin}
      />
    </div>
  );
}
