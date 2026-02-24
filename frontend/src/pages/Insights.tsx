import { useState, useEffect, useRef } from 'react';
import { Lightbulb, Heart, TrendingUp, Calendar, Sparkles, Award, HeartHandshake, BarChart3, TrendingDown, Activity, X, Crown, Trophy, Flame, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile, useGetCombinedQuizResultState, useIsAdmin, useGetInsightsData, useGetBadgeMilestones, useGetCompletedChallenges, useGetCoupleProgress } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoveLanguage } from '../backend';
import { HarmonyBreakdownTrendCard } from '../components/HarmonyBreakdownTrendCard';
import { LevelUpCelebration } from '../components/LevelUpCelebration';
import { BadgeShowcase, BadgeData } from '../components/BadgeShowcase';

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
  const { data: completedChallengeIds = [] } = useGetCompletedChallenges();
  const { data: coupleProgress } = useGetCoupleProgress();

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(0);
  const [celebrationLabel, setCelebrationLabel] = useState('');
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<MilestoneBadge | null>(null);
  const [previousBadgeCount, setPreviousBadgeCount] = useState(0);
  const previousLevelRef = useRef<number | null>(null);

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
  
  // Phase 1c: Calculate challenge completion rate
  const totalChallenges = 15; // Total number of challenges available
  const completedChallengesCount = completedChallengeIds.length;
  const challengeCompletionRate = totalChallenges > 0 ? completedChallengesCount / totalChallenges : 0;
  
  // Level-up detection
  useEffect(() => {
    if (!coupleProgress) return;

    const currentLevel = Number(coupleProgress.currentLevel);
    
    // Initialize on first load
    if (previousLevelRef.current === null) {
      previousLevelRef.current = currentLevel;
      return;
    }

    // Detect level increase
    if (currentLevel > previousLevelRef.current) {
      const getLevelLabel = (lvl: number): string => {
        if (lvl === 1) return 'Seedlings';
        if (lvl === 2) return 'Sprouts';
        if (lvl === 3) return 'Growing Strong';
        if (lvl === 4) return 'Blooming';
        if (lvl === 5) return 'Flourishing';
        if (lvl === 6) return 'Deeply Rooted';
        if (lvl === 7) return 'Thriving';
        if (lvl === 8) return 'Radiant';
        if (lvl === 9) return 'Legendary';
        if (lvl >= 10) return 'Love Legends';
        return 'Growing Together';
      };

      setCelebrationLevel(currentLevel);
      setCelebrationLabel(getLevelLabel(currentLevel));
      setShowCelebration(true);
      previousLevelRef.current = currentLevel;
    }
  }, [coupleProgress]);

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

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
        title: 'Harmony Elite 🌟',
        description: 'Achieved 90%+ harmony',
        icon: <Sparkles className="w-6 h-6" />,
        requirement: 90,
        achieved: isAdmin || (milestones?.harmonyEliteUnlocked ?? false),
        progress: Math.min(100, averageHarmony),
      },
    ];

    return badges;
  };

  const milestoneBadges = generateMilestoneBadges();

  // Convert milestone badges to BadgeData format for BadgeShowcase
  const badgeShowcaseData: BadgeData[] = milestoneBadges.map(badge => ({
    id: badge.id,
    title: badge.title,
    description: badge.description,
    requirement: `${badge.requirement}${badge.id === 'harmony-elite' ? '% harmony' : ' days'}`,
    unlocked: badge.achieved,
    icon: badge.id === '7-days' ? 'flame' : badge.id === '30-days' ? 'heart' : badge.id === '100-days' ? 'trophy' : 'sparkles',
  }));

  // Detect newly unlocked badges
  useEffect(() => {
    const currentUnlockedCount = milestoneBadges.filter(b => b.achieved).length;
    
    if (previousBadgeCount > 0 && currentUnlockedCount > previousBadgeCount) {
      const newBadge = milestoneBadges.find((b, i) => 
        b.achieved && !milestoneBadges.slice(0, i).every(prev => prev.achieved)
      );
      if (newBadge) {
        setNewlyUnlockedBadge(newBadge);
        setTimeout(() => setNewlyUnlockedBadge(null), 3000);
      }
    }
    
    setPreviousBadgeCount(currentUnlockedCount);
  }, [milestoneBadges.map(b => b.achieved).join(',')]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <Lightbulb className="w-16 h-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Login Required</h2>
            <p className="text-muted-foreground">
              Please log in to view your relationship insights and progress.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isPaired) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <HeartHandshake className="w-16 h-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Pair with Your Partner</h2>
            <p className="text-muted-foreground">
              Connect with your partner to unlock insights about your relationship journey together.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 space-y-6 max-w-4xl">
      {/* Level-up celebration overlay */}
      {showCelebration && (
        <LevelUpCelebration
          newLevel={celebrationLevel}
          levelLabel={celebrationLabel}
          onComplete={handleCelebrationComplete}
        />
      )}

      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gradient-romantic flex items-center justify-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          Relationship Insights
        </h1>
        <p className="text-muted-foreground">
          Track your journey and celebrate your growth together
        </p>
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div className="flex justify-center">
          <Badge variant="default" className="bg-accent text-accent-foreground">
            <Crown className="w-3 h-3 mr-1" />
            Admin Mode Active
          </Badge>
        </div>
      )}

      {/* Harmony Breakdown & Trend Card */}
      <HarmonyBreakdownTrendCard
        currentHarmony={currentHarmony}
        harmonyTrend={harmonyTrend}
        quizOverlapScore={quizOverlapScore}
        recentCompletionRate={recentCompletionRate}
        challengeCompletionRate={challengeCompletionRate}
      />

      {/* Challenge Impact Metrics */}
      <Card className="border-2 border-accent/30 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Target className="w-5 h-5" />
            Challenge Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-3xl font-bold text-accent">
                {Math.round(challengeCompletionRate * 100)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-3xl font-bold text-primary">
                +{Math.round(challengeCompletionRate * 15)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Harmony Contribution</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Completing challenges together strengthens your harmony score
          </p>
        </CardContent>
      </Card>

      {/* 7-Day Activity History */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            7-Day Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {historyData.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      day.completed ? 'bg-accent' : 'bg-muted-foreground/30'
                    }`}
                  />
                  <span className="text-sm font-medium text-foreground">{day.day}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {day.harmony}% harmony
                    </span>
                  </div>
                  {day.completed ? (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Missed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-semibold text-foreground">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="mt-2 h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quiz Alignment Summary */}
      {bothCompletedQuiz && (
        <Card className="border-2 border-secondary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary-foreground">
              <Heart className="w-5 h-5" />
              Love Language Alignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {loveLanguageHarmony}%
              </div>
              <p className="text-sm text-muted-foreground">
                Alignment Score
              </p>
            </div>
            {sharedLanguages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Shared Love Languages:</p>
                <div className="flex flex-wrap gap-2">
                  {sharedLanguages.map((lang, i) => (
                    <Badge key={i} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Badge Showcase */}
      <BadgeShowcase badges={badgeShowcaseData} title="Milestone Achievements" />
    </div>
  );
}
