import { useState, useEffect } from 'react';
import { Lightbulb, Heart, TrendingUp, Calendar, Sparkles, Award, HeartHandshake, BarChart3, TrendingDown, Activity, X, Crown, Trophy, Flame, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile, useGetCombinedQuizResultState, useIsAdmin, useGetInsightsData, useGetBadgeMilestones } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoveLanguage } from '../backend';
import { HarmonyBreakdownTrendCard } from '../components/HarmonyBreakdownTrendCard';

interface HistoryDataPoint {
  day: string;
  completed: boolean;
  harmony: number;
}

interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requirement: number;
  achieved: boolean;
  progress: number;
}

// Map backend enum to UI language
const mapToUILanguage = (backendLanguage: LoveLanguage): string => {
  const mapping: Record<LoveLanguage, string> = {
    [LoveLanguage.wordsOfAffirmation]: 'Words of Affirmation',
    [LoveLanguage.qualityTime]: 'Quality Time',
    [LoveLanguage.receivingGifts]: 'Receiving Gifts',
    [LoveLanguage.actsOfService]: 'Acts of Service',
    [LoveLanguage.physicalTouch]: 'Physical Touch',
  };
  return mapping[backendLanguage];
};

export function Insights() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: combinedQuizState } = useGetCombinedQuizResultState();
  const { data: isAdmin = false } = useIsAdmin();
  const { data: insightsData, isLoading: insightsLoading } = useGetInsightsData();
  const { data: badgeMilestones, isLoading: badgesLoading } = useGetBadgeMilestones();

  const [showCelebration, setShowCelebration] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<MilestoneBadge | null>(null);
  const [previousBadgeCount, setPreviousBadgeCount] = useState(0);

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;

  // Extract current stats from backend - strictly backend-driven, no fallbacks
  const currentStreak = insightsData ? Number(insightsData.currentStreak) : 0;
  const longestStreak = insightsData ? Number(insightsData.longestStreak) : 0;
  const averageHarmony = insightsData ? Math.round(insightsData.averageHarmony * 100) : 0;
  
  // Phase 3: Extract harmony components and trend from backend
  const currentHarmony = insightsData?.currentHarmony ?? 0;
  const quizOverlapScore = insightsData?.quizOverlapScore ?? 0;
  const recentCompletionRate = insightsData?.recentCompletionRate ?? 0;
  const harmonyTrend = insightsData?.harmonyTrend ?? [];
  
  // Calculate love language harmony score (quiz alignment only)
  const calculateLoveLanguageHarmony = (): number => {
    if (!combinedQuizState?.callerResults || !combinedQuizState?.partnerResults) return 0;

    const callerTop3 = combinedQuizState.callerResults.rankings.slice(0, 3).map(r => r.language);
    const partnerTop3 = combinedQuizState.partnerResults.rankings.slice(0, 3).map(r => r.language);

    let overlap = 0;
    callerTop3.forEach(lang => {
      if (partnerTop3.includes(lang)) overlap++;
    });

    return Math.round((overlap / 3) * 100);
  };

  const loveLanguageHarmony = calculateLoveLanguageHarmony();
  const bothCompletedQuiz = combinedQuizState?.callerCompleted && combinedQuizState?.partnerCompleted;

  // Find shared love languages
  const getSharedLoveLanguages = (): string[] => {
    if (!combinedQuizState?.callerResults || !combinedQuizState?.partnerResults) return [];

    const callerTop3 = combinedQuizState.callerResults.rankings.slice(0, 3).map(r => r.language);
    const partnerTop3 = combinedQuizState.partnerResults.rankings.slice(0, 3).map(r => r.language);

    return callerTop3
      .filter(lang => partnerTop3.includes(lang))
      .map(lang => mapToUILanguage(lang));
  };

  const sharedLanguages = getSharedLoveLanguages();

  // Build 7-Day History from backend trend data (deterministic, no randomness)
  const generateHistoryData = (): HistoryDataPoint[] => {
    if (!insightsData) return [];
    
    const last14DayTrend = insightsData.last14DayTrend || [];
    const harmonyTrendData = insightsData.harmonyTrend || [];
    
    // Take last 7 days from the 14-day trend
    const last7Completed = last14DayTrend.slice(-7);
    const last7Harmony = harmonyTrendData.slice(-7);
    
    // Pad if needed
    while (last7Completed.length < 7) {
      last7Completed.unshift(false);
    }
    while (last7Harmony.length < 7) {
      last7Harmony.unshift(0);
    }
    
    const history: HistoryDataPoint[] = [];
    for (let i = 0; i < 7; i++) {
      const daysAgo = 6 - i;
      history.push({
        day: daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`,
        completed: last7Completed[i],
        harmony: Math.round(last7Harmony[i] * 100),
      });
    }
    return history;
  };

  const historyData = generateHistoryData();
  
  // Calculate completion rate from backend data
  const completionRate = insightsData?.recentCompletionRate 
    ? Math.round(insightsData.recentCompletionRate * 100)
    : 0;

  // Generate Milestone Badges - strictly backend-driven from badgeMilestones.milestones
  const generateMilestoneBadges = (): MilestoneBadge[] => {
    const milestones = badgeMilestones?.milestones;
    
    const badges: MilestoneBadge[] = [
      {
        id: '7-days',
        title: '7 Days Strong 💪',
        description: 'Maintained a 7-day streak',
        icon: <Flame className="w-6 h-6" />,
        requirement: 7,
        achieved: isAdmin || (milestones?.sevenDayUnlocked ?? false),
        progress: Math.min(100, (currentStreak / 7) * 100),
      },
      {
        id: '30-days',
        title: '30 Days Deep 💖',
        description: 'Achieved a 30-day streak',
        icon: <Heart className="w-6 h-6" />,
        requirement: 30,
        achieved: isAdmin || (milestones?.thirtyDayUnlocked ?? false),
        progress: Math.min(100, (currentStreak / 30) * 100),
      },
      {
        id: '100-days',
        title: '100 Days of Love 💞',
        description: 'Reached 100 consecutive days',
        icon: <Trophy className="w-6 h-6" />,
        requirement: 100,
        achieved: isAdmin || (milestones?.hundredDayUnlocked ?? false),
        progress: Math.min(100, (currentStreak / 100) * 100),
      },
      {
        id: 'harmony-elite',
        title: 'Harmony Elite ✨',
        description: 'High average harmony score (≥85%)',
        icon: <Sparkles className="w-6 h-6" />,
        requirement: 85,
        achieved: isAdmin || (milestones?.harmonyEliteUnlocked ?? false),
        progress: averageHarmony,
      },
    ];

    return badges;
  };

  const milestoneBadges = generateMilestoneBadges();
  const achievedBadges = milestoneBadges.filter(b => b.achieved);
  const nextBadge = milestoneBadges.find(b => !b.achieved);

  // Enhanced badge unlock detection with synchronization validation
  useEffect(() => {
    if (!badgesLoading && badgeMilestones && achievedBadges.length > 0) {
      // Check if a new badge was unlocked
      if (achievedBadges.length > previousBadgeCount && previousBadgeCount > 0) {
        const newBadge = achievedBadges[achievedBadges.length - 1];
        
        // Validate that this is a genuine new unlock (progress at 100%)
        if (newBadge && newBadge.progress >= 100) {
          setNewlyUnlockedBadge(newBadge);
          setShowCelebration(true);
          
          // Optimized celebration duration with smooth fade-out
          setTimeout(() => {
            setShowCelebration(false);
          }, 3500);
        }
      }
      
      // Update previous count for next comparison
      setPreviousBadgeCount(achievedBadges.length);
    }
  }, [badgeMilestones, badgesLoading, achievedBadges.length, previousBadgeCount]);

  // Phase 3: Handle scroll to harmony section on mount if flag is set
  useEffect(() => {
    const scrollToHarmony = sessionStorage.getItem('scrollToHarmony');
    if (scrollToHarmony === 'true') {
      sessionStorage.removeItem('scrollToHarmony');
      setTimeout(() => {
        const harmonySection = document.getElementById('harmony-section');
        if (harmonySection) {
          harmonySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, []);

  // Admin override: bypass pairing requirement
  if (!isAuthenticated || (!isPaired && !isAdmin)) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
              <Lightbulb className="w-20 h-20 text-accent mx-auto relative glow-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Connect to See Insights</h2>
              <p className="text-muted-foreground leading-relaxed">
                To view your relationship insights, please connect with your partner in the <span className="font-semibold text-primary">Us</span> tab
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-full px-6 py-8 space-y-6 stagger-entrance relative"
      style={{
        backgroundImage: 'url(/assets/generated/analytics-dashboard-bg.dim_1000x600.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better readability */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm pointer-events-none" style={{ zIndex: -1 }} />

      {/* Optimized Celebration Overlay with Performance Enhancements */}
      {showCelebration && newlyUnlockedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-celebration-entrance will-change-transform">
          <div className="relative max-w-md w-full mx-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 z-10 rounded-full bg-background/80 hover:bg-background transition-all duration-200"
              onClick={() => setShowCelebration(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <Card className="border-4 border-amber-500/50 shadow-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur-lg animate-badge-unlock-smooth will-change-transform">
              <CardContent className="p-8 text-center space-y-6">
                <div className="relative">
                  <img 
                    src="/assets/generated/celebration-elements-transparent.dim_200x200.png" 
                    alt="Celebration" 
                    className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 opacity-80 animate-float-celebration will-change-transform"
                  />
                  <div className="w-24 h-24 rounded-full bg-amber-500/30 flex items-center justify-center mx-auto glow-pulse-smooth">
                    <div className="text-amber-600 dark:text-amber-400">
                      {newlyUnlockedBadge.icon}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-sparkle-1" />
                    <h2 className="text-2xl font-bold text-foreground">Milestone Unlocked!</h2>
                    <Sparkles className="w-5 h-5 text-amber-500 animate-sparkle-2" />
                  </div>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {newlyUnlockedBadge.title}
                  </p>
                  <p className="text-muted-foreground">
                    {newlyUnlockedBadge.description}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                  <Heart className="w-6 h-6 fill-current animate-heart-float-1" />
                  <Heart className="w-8 h-8 fill-current animate-heart-float-2" />
                  <Heart className="w-6 h-6 fill-current animate-heart-float-3" />
                </div>

                <p className="text-sm text-muted-foreground">
                  Keep up the amazing work together! 💕
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center space-y-2 gentle-entrance">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
          <Lightbulb className="w-16 h-16 text-accent mx-auto relative" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Your Love Journey
        </h1>
        <p className="text-muted-foreground text-base">
          Track your relationship growth together
        </p>
        {isAdmin && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <Crown className="w-3 h-3" />
            Admin Access - All Insights Available
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

      {/* Current Stats Overview with Enhanced Progress Rings */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-2 border-primary/20 shadow-md bg-gradient-to-br from-card/90 to-primary/5 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
          <CardContent className="p-6 text-center space-y-3">
            {/* Enhanced Progress Ring for Streak with Smooth Transitions */}
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - Math.min(currentStreak / 100, 1))}`}
                  className="text-primary glow-line-smooth transition-all duration-700 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-4xl font-bold text-primary transition-all duration-300">{currentStreak}</div>
            <p className="text-sm text-muted-foreground font-medium">Current Streak</p>
            {nextBadge && nextBadge.id.includes('days') && currentStreak < nextBadge.requirement && (
              <p className="text-xs text-muted-foreground transition-opacity duration-300">
                {nextBadge.requirement - currentStreak} days to next milestone
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 shadow-md bg-gradient-to-br from-card/90 to-accent/5 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
          <CardContent className="p-6 text-center space-y-3">
            {/* Enhanced Progress Ring for Harmony with Smooth Transitions */}
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - averageHarmony / 100)}`}
                  className="text-accent glow-line-smooth transition-all duration-700 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent fill-accent" />
              </div>
            </div>
            <div className="text-4xl font-bold text-accent transition-all duration-300">{averageHarmony}%</div>
            <p className="text-sm text-muted-foreground font-medium">Avg Harmony</p>
            {averageHarmony < 85 && (
              <p className="text-xs text-muted-foreground transition-opacity duration-300">
                {85 - averageHarmony}% to Harmony Elite
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Phase 3: Harmony Breakdown & Trend Card */}
      {isPaired && (
        <HarmonyBreakdownTrendCard
          currentHarmony={currentHarmony}
          harmonyTrend={harmonyTrend}
          quizOverlapScore={quizOverlapScore}
          recentCompletionRate={recentCompletionRate}
        />
      )}

      {/* Enhanced Milestone Badge System with Refined Animations */}
      <Card className="border-2 border-amber-500/30 shadow-md bg-gradient-to-br from-amber-500/5 to-yellow-500/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-amber-500" />
            Milestone Badges
            {badgesLoading && (
              <span className="text-xs text-muted-foreground ml-auto animate-pulse">Syncing...</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Achieved Badges with Polished Animations */}
          {achievedBadges.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Unlocked Achievements:</p>
              <div className="grid grid-cols-2 gap-3">
                {achievedBadges.map((badge, index) => (
                  <div
                    key={badge.id}
                    className="relative p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/40 shadow-md hover:scale-105 transition-all duration-300 ease-out"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center animate-badge-sparkle">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 glow-pulse-smooth">
                        {badge.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground leading-tight">
                          {badge.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Badge Progress with Smooth Animated Tooltip */}
          {nextBadge && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Next Milestone:</p>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/40 transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    {nextBadge.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {nextBadge.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {nextBadge.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs transition-all duration-300">
                    {Math.round(nextBadge.progress)}%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Progress value={nextBadge.progress} className="h-2 transition-all duration-500" />
                  <p className="text-xs text-muted-foreground text-right transition-opacity duration-300">
                    {nextBadge.id.includes('days') 
                      ? `${nextBadge.requirement - currentStreak} more days to unlock`
                      : nextBadge.id === 'harmony-elite'
                      ? `${nextBadge.requirement - averageHarmony}% more harmony to unlock`
                      : `${Math.round(nextBadge.requirement - nextBadge.progress)}% to unlock`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {achievedBadges.length === 0 && (
            <div className="text-center py-6 space-y-2">
              <Zap className="w-12 h-12 text-amber-500/50 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Start your journey to unlock milestone badges!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historical Data Visualization Section - Backend-Driven */}
      <Card className="border-2 border-blue-500/30 shadow-md bg-gradient-to-br from-blue-500/5 to-cyan-500/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-blue-500" />
            7-Day History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your completion and harmony progression over the last 7 days
          </p>
          
          {/* Backend-Driven History Chart */}
          <div className="space-y-4">
            {historyData.map((day, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer p-3 rounded-lg hover:bg-secondary/30 transition-all duration-200 will-change-transform"
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-200">
                    {day.day}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {day.completed ? (
                        <Sparkles className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-sm font-semibold ${day.completed ? 'text-green-500' : 'text-gray-400'}`}>
                        {day.completed ? 'Done' : 'Missed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span className="text-rose-500 font-semibold">{day.harmony}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Dual Progress Bars */}
                <div className="space-y-2">
                  <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out glow-line-smooth group-hover:scale-y-110 ${
                        day.completed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-400'
                      }`}
                      style={{ width: day.completed ? '100%' : '0%' }}
                    />
                  </div>
                  <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 ease-out glow-line-smooth group-hover:scale-y-110"
                      style={{ width: `${day.harmony}%` }}
                    />
                  </div>
                </div>

                {/* Tooltip on Hover */}
                <div className="hidden group-hover:block mt-2 p-2 rounded-lg bg-secondary/50 text-xs text-muted-foreground transition-opacity duration-200">
                  Completed: {day.completed ? 'Yes' : 'No'} | Harmony: {day.harmony}%
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {currentStreak >= 7 ? 'Excellent consistency!' : 'Building momentum!'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentStreak >= 7 
                    ? 'Your 7-day streak shows strong commitment to your relationship! 🎉'
                    : 'Keep completing daily rituals to build your streak! ✨'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Visual Charts Section - Harmony Progression */}
      <Card className="border-2 border-rose-500/30 shadow-md bg-gradient-to-br from-rose-500/5 to-pink-500/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-rose-500" />
            Harmony Progression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Weekly harmony averages showing your relationship growth
          </p>
          
          {/* Backend-Driven Harmony Chart */}
          <div className="space-y-3">
            {historyData.map((day, idx) => (
              <div key={idx} className="space-y-1 group">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-200">{day.day}</span>
                  <span className="text-rose-500 font-semibold transition-all duration-200">{day.harmony}%</span>
                </div>
                <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-700 ease-out glow-line-smooth group-hover:scale-y-110"
                    style={{ width: `${day.harmony}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Your harmony is {averageHarmony >= 70 ? 'thriving' : averageHarmony >= 50 ? 'growing' : 'building'}!
                </p>
                <p className="text-xs text-muted-foreground">
                  {averageHarmony >= 70 
                    ? 'Keep up the wonderful connection you\'re nurturing together! 💕'
                    : averageHarmony >= 50
                    ? 'You\'re making great progress. Keep engaging with daily rituals! ✨'
                    : 'Every ritual brings you closer. Stay consistent! 🌟'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Alignment Summary - Only show if both completed quiz */}
      {bothCompletedQuiz && (
        <Card className="border-2 border-purple-500/30 shadow-md bg-gradient-to-br from-purple-500/5 to-primary/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              Quiz Alignment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center glow-pulse-smooth">
                <HeartHandshake className="w-7 h-7 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">Quiz Alignment</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 transition-all duration-300">
                  {loveLanguageHarmony}%
                </p>
              </div>
              <div className="text-right">
                {loveLanguageHarmony >= 66 ? (
                  <TrendingUp className="w-8 h-8 text-green-500" />
                ) : loveLanguageHarmony >= 33 ? (
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-amber-500" />
                )}
              </div>
            </div>

            {sharedLanguages.length > 0 && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Shared Love Languages:
                </p>
                <div className="flex flex-wrap gap-2">
                  {sharedLanguages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-all duration-200 hover:scale-105"
                    >
                      <Heart className="w-3 h-3 fill-current" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-primary/10 border border-purple-500/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {loveLanguageHarmony >= 66 ? 'Strong Alignment' : loveLanguageHarmony >= 33 ? 'Moderate Alignment' : 'Growing Together'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {loveLanguageHarmony >= 66 
                      ? 'Your shared love languages create a strong foundation for connection!'
                      : loveLanguageHarmony >= 33
                      ? 'Some love language overlap helps maintain your connection.'
                      : 'Your unique love languages offer opportunities to learn and grow together.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Longest Streak Achievement */}
      {longestStreak > 0 && (
        <Card className="border-2 border-amber-500/30 shadow-md bg-gradient-to-br from-amber-500/5 to-primary/5 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center glow-pulse-smooth">
                <Award className="w-7 h-7 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">Longest Streak</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-500 transition-all duration-300">
                  {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
                </p>
              </div>
              {currentStreak === longestStreak && currentStreak > 0 && (
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold animate-badge-sparkle">
                    <Sparkles className="w-3 h-3" />
                    New Record!
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Summary */}
      <Card className="border border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-primary" />
            Weekly Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center space-y-1 hover:bg-secondary/40 transition-all duration-200">
              <p className="text-2xl font-bold text-primary transition-all duration-300">{Math.min(7, currentStreak)}/7</p>
              <p className="text-xs text-muted-foreground">Days Completed</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center space-y-1 hover:bg-secondary/40 transition-all duration-200">
              <p className="text-2xl font-bold text-accent transition-all duration-300">{completionRate}%</p>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-peach/10 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {currentStreak === 0 
                ? 'Start your journey today! Complete your first ritual together.'
                : currentStreak < 3
                ? 'Great start! Keep the momentum going.'
                : currentStreak < 7
                ? 'You\'re building a beautiful habit together!'
                : 'Incredible dedication! Your bond is growing stronger every day.'
              }
            </p>
            <div className="flex items-center justify-center gap-1 text-lg">
              {Array.from({ length: Math.min(5, Math.ceil(currentStreak / 2)) }).map((_, i) => (
                <Heart key={i} className="w-4 h-4 text-primary fill-primary animate-heart-float-1" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      {currentStreak > 0 && (
        <Card className="border border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-5 h-5 text-accent" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { days: 3, label: 'First Steps', emoji: '🌱', achieved: currentStreak >= 3 },
                { days: 7, label: 'One Week Strong', emoji: '⭐', achieved: currentStreak >= 7 },
                { days: 14, label: 'Two Weeks Together', emoji: '💫', achieved: currentStreak >= 14 },
                { days: 30, label: 'One Month Milestone', emoji: '🏆', achieved: currentStreak >= 30 },
              ].map((milestone) => (
                <div
                  key={milestone.days}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 hover:scale-102 ${
                    milestone.achieved
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-secondary/20 border-border/50 opacity-60'
                  }`}
                >
                  <div className="text-3xl">{milestone.emoji}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{milestone.label}</p>
                    <p className="text-xs text-muted-foreground">{milestone.days} days</p>
                  </div>
                  {milestone.achieved && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary animate-sparkle-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
