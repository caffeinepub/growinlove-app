import { Heart, Sparkles, ChevronRight, ChevronLeft, Check, Share2, RotateCcw, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { 
  useGetCallerUserProfile, 
  useGetCallerQuizResults, 
  useGetCombinedQuizResultState,
  useSaveQuizResults,
  useResetQuizResults
} from '../hooks/useQueries';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LoveLanguage, LoveLanguagesQuizResult, LoveLanguageRanking } from '../backend';

// Love Language types for UI
type LoveLanguageUI = 'Words of Affirmation' | 'Quality Time' | 'Receiving Gifts' | 'Acts of Service' | 'Physical Touch';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    language: LoveLanguageUI;
  }[];
}

interface LoveLanguageScore {
  language: LoveLanguageUI;
  score: number;
  percentage: number;
}

// Map UI language to backend enum
const mapToBackendLanguage = (uiLanguage: LoveLanguageUI): LoveLanguage => {
  const mapping: Record<LoveLanguageUI, LoveLanguage> = {
    'Words of Affirmation': LoveLanguage.wordsOfAffirmation,
    'Quality Time': LoveLanguage.qualityTime,
    'Receiving Gifts': LoveLanguage.receivingGifts,
    'Acts of Service': LoveLanguage.actsOfService,
    'Physical Touch': LoveLanguage.physicalTouch,
  };
  return mapping[uiLanguage];
};

// Map backend enum to UI language
const mapToUILanguage = (backendLanguage: LoveLanguage): LoveLanguageUI => {
  const mapping: Record<LoveLanguage, LoveLanguageUI> = {
    [LoveLanguage.wordsOfAffirmation]: 'Words of Affirmation',
    [LoveLanguage.qualityTime]: 'Quality Time',
    [LoveLanguage.receivingGifts]: 'Receiving Gifts',
    [LoveLanguage.actsOfService]: 'Acts of Service',
    [LoveLanguage.physicalTouch]: 'Physical Touch',
  };
  return mapping[backendLanguage];
};

// Quiz questions
const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What makes you feel most loved by your partner?",
    options: [
      { text: "When they tell me they love me and appreciate me", language: "Words of Affirmation" },
      { text: "When they spend uninterrupted time with me", language: "Quality Time" },
      { text: "When they surprise me with thoughtful gifts", language: "Receiving Gifts" },
      { text: "When they help me with tasks or do things for me", language: "Acts of Service" },
      { text: "When they hug, kiss, or hold my hand", language: "Physical Touch" },
    ],
  },
  {
    id: 2,
    question: "What hurts you most when your partner doesn't do it?",
    options: [
      { text: "Not expressing their feelings or appreciation", language: "Words of Affirmation" },
      { text: "Being too busy to spend time together", language: "Quality Time" },
      { text: "Forgetting special occasions or not giving gifts", language: "Receiving Gifts" },
      { text: "Not helping when I need support", language: "Acts of Service" },
      { text: "Not being physically affectionate", language: "Physical Touch" },
    ],
  },
  {
    id: 3,
    question: "How do you prefer to show love to your partner?",
    options: [
      { text: "By telling them how much they mean to me", language: "Words of Affirmation" },
      { text: "By planning activities we can do together", language: "Quality Time" },
      { text: "By giving them meaningful presents", language: "Receiving Gifts" },
      { text: "By doing things to make their life easier", language: "Acts of Service" },
      { text: "By being physically close and affectionate", language: "Physical Touch" },
    ],
  },
  {
    id: 4,
    question: "What would be your ideal date?",
    options: [
      { text: "A deep conversation where we share our feelings", language: "Words of Affirmation" },
      { text: "A full day together doing something we both enjoy", language: "Quality Time" },
      { text: "Receiving a surprise gift that shows they know me", language: "Receiving Gifts" },
      { text: "Having them plan everything so I can just relax", language: "Acts of Service" },
      { text: "Cuddling on the couch watching a movie", language: "Physical Touch" },
    ],
  },
  {
    id: 5,
    question: "What makes you feel most appreciated?",
    options: [
      { text: "Hearing 'thank you' and words of encouragement", language: "Words of Affirmation" },
      { text: "Having their full attention without distractions", language: "Quality Time" },
      { text: "Receiving a token of their appreciation", language: "Receiving Gifts" },
      { text: "When they notice and help with things I need", language: "Acts of Service" },
      { text: "A warm hug or gentle touch", language: "Physical Touch" },
    ],
  },
  {
    id: 6,
    question: "When you're stressed, what helps you most?",
    options: [
      { text: "Hearing reassuring and supportive words", language: "Words of Affirmation" },
      { text: "Having someone sit with me and listen", language: "Quality Time" },
      { text: "Receiving a small gift to cheer me up", language: "Receiving Gifts" },
      { text: "Having someone take care of tasks for me", language: "Acts of Service" },
      { text: "A comforting hug or back rub", language: "Physical Touch" },
    ],
  },
  {
    id: 7,
    question: "What would make you feel most connected to your partner?",
    options: [
      { text: "Exchanging heartfelt messages or compliments", language: "Words of Affirmation" },
      { text: "Going on a trip or adventure together", language: "Quality Time" },
      { text: "Exchanging meaningful gifts", language: "Receiving Gifts" },
      { text: "Working together on a project or chore", language: "Acts of Service" },
      { text: "Being physically intimate and close", language: "Physical Touch" },
    ],
  },
];

export function LoveLanguages() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: savedResults, isLoading: loadingResults, error: resultsError, refetch: refetchResults } = useGetCallerQuizResults();
  const { data: combinedState, isLoading: loadingCombined, error: combinedError, refetch: refetchCombined } = useGetCombinedQuizResultState();
  const saveQuizMutation = useSaveQuizResults();
  const resetQuizMutation = useResetQuizResults();

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, LoveLanguageUI>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<LoveLanguageScore[]>([]);
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);
  const [showSyncBanner, setShowSyncBanner] = useState(false);
  const [syncError, setSyncError] = useState(false);

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;

  // Load saved results on mount
  useEffect(() => {
    if (savedResults && !quizStarted && !quizCompleted) {
      // Convert backend results to UI format
      const uiResults: LoveLanguageScore[] = savedResults.rankings.map(ranking => ({
        language: mapToUILanguage(ranking.language),
        score: Math.round(ranking.score),
        percentage: Math.round(ranking.score),
      }));
      setResults(uiResults);
      setQuizCompleted(true);
    }
  }, [savedResults, quizStarted, quizCompleted]);

  // Show sync banner when both partners complete
  useEffect(() => {
    if (combinedState?.callerCompleted && combinedState?.partnerCompleted && quizCompleted) {
      setShowSyncBanner(true);
      setSyncError(false);
      // Auto-hide banner after 5 seconds
      const timer = setTimeout(() => setShowSyncBanner(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [combinedState?.callerCompleted, combinedState?.partnerCompleted, quizCompleted]);

  // Detect sync errors
  useEffect(() => {
    if ((resultsError || combinedError) && quizCompleted) {
      setSyncError(true);
    }
  }, [resultsError, combinedError, quizCompleted]);

  const calculateResults = (): LoveLanguageScore[] => {
    const scores: Record<LoveLanguageUI, number> = {
      'Words of Affirmation': 0,
      'Quality Time': 0,
      'Receiving Gifts': 0,
      'Acts of Service': 0,
      'Physical Touch': 0,
    };

    Object.values(answers).forEach((language) => {
      scores[language]++;
    });

    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const results: LoveLanguageScore[] = Object.entries(scores)
      .map(([language, score]) => ({
        language: language as LoveLanguageUI,
        score,
        percentage: total > 0 ? Math.round((score / total) * 100) : 0,
      }))
      .sort((a, b) => b.score - a.score);

    return results;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setSyncError(false);
  };

  const handleAnswer = (language: LoveLanguageUI) => {
    setAnswers({ ...answers, [currentQuestion]: language });
  };

  const handleNext = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed - calculate and save results
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setQuizCompleted(true);

      // Save to backend
      try {
        const backendRankings: LoveLanguageRanking[] = calculatedResults.map(result => ({
          language: mapToBackendLanguage(result.language),
          score: result.percentage,
        }));

        const quizResult: LoveLanguagesQuizResult = {
          userId: identity!.getPrincipal(),
          rankings: backendRankings,
          completionTime: BigInt(Date.now() * 1000000), // Convert to nanoseconds
        };

        await saveQuizMutation.mutateAsync(quizResult);
        
        // Wait a moment for backend synchronization
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Refetch combined state to check for sync
        await refetchCombined();
        
        toast.success('Quiz completed! 🎉', {
          description: 'Your results have been saved and will sync with your partner.',
        });
      } catch (error) {
        console.error('Failed to save quiz results:', error);
        setSyncError(true);
        toast.error('Failed to save results', {
          description: 'Please try refreshing the page or retrying.',
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRetakeClick = () => {
    // Show confirmation dialog if results exist
    if (savedResults) {
      setShowRetakeConfirm(true);
    } else {
      handleRetakeConfirmed();
    }
  };

  const handleRetakeConfirmed = async () => {
    setShowRetakeConfirm(false);
    try {
      await resetQuizMutation.mutateAsync();
      setQuizStarted(false);
      setQuizCompleted(false);
      setCurrentQuestion(0);
      setAnswers({});
      setResults([]);
      setSyncError(false);
      toast.success('Ready to retake the quiz!', {
        description: 'Your previous results have been cleared.',
      });
    } catch (error) {
      console.error('Failed to reset quiz:', error);
      toast.error('Failed to reset quiz');
    }
  };

  const handleShare = () => {
    const topLanguage = results[0];
    const shareText = `My top love language is ${topLanguage.language} (${topLanguage.percentage}%)! Discover yours on GrowInLove 💕`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Love Language Results',
        text: shareText,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast.success('Copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    }
  };

  const handleRetrySync = async () => {
    setSyncError(false);
    try {
      await Promise.all([refetchResults(), refetchCombined()]);
      toast.success('Refreshed successfully!');
    } catch (error) {
      console.error('Failed to refresh:', error);
      setSyncError(true);
      toast.error('Failed to refresh. Please try again.');
    }
  };

  const progress = quizStarted && !quizCompleted 
    ? ((currentQuestion + 1) / quizQuestions.length) * 100 
    : 0;

  const currentQuestionData = quizQuestions[currentQuestion];
  const currentAnswer = answers[currentQuestion];

  // Calculate harmony score if both partners completed
  const calculateHarmonyScore = (): number => {
    if (!combinedState?.callerResults || !combinedState?.partnerResults) return 0;

    const callerTop3 = combinedState.callerResults.rankings.slice(0, 3).map(r => r.language);
    const partnerTop3 = combinedState.partnerResults.rankings.slice(0, 3).map(r => r.language);

    let overlap = 0;
    callerTop3.forEach(lang => {
      if (partnerTop3.includes(lang)) overlap++;
    });

    return Math.round((overlap / 3) * 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="w-16 h-16 text-primary fill-primary mx-auto" />
            <h2 className="text-2xl font-bold text-primary">Welcome to GrowInLove</h2>
            <p className="text-muted-foreground">
              Please log in to discover your love languages
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isPaired) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Heart className="w-20 h-20 text-primary fill-primary mx-auto relative glow-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Connect with Your Partner</h2>
              <p className="text-muted-foreground leading-relaxed">
                To discover your love languages together, please connect with your partner in the <span className="font-semibold text-primary">Us</span> tab
              </p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                💡 Go to the Us tab to generate or enter a pairing code
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loadingResults || loadingCombined) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your love languages...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Results View - Show synced results if both completed
  if (quizCompleted && results.length > 0) {
    const topLanguage = results[0];
    const bothCompleted = combinedState?.callerCompleted && combinedState?.partnerCompleted;
    const harmonyScore = bothCompleted ? calculateHarmonyScore() : 0;

    return (
      <div className="min-h-full px-6 py-8 space-y-6 stagger-entrance">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <Heart className="w-16 h-16 text-primary fill-primary mx-auto relative glow-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            {bothCompleted ? 'Your Love Languages - Synced!' : 'Your Love Languages'}
          </h1>
          <p className="text-muted-foreground">
            {bothCompleted ? 'Combined insights for your relationship' : 'Here\'s how you feel most loved'}
          </p>
        </div>

        {/* Sync Error Banner - Emergency Fallback */}
        {syncError && (
          <Card className="border-2 border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-red-500/10 animate-in slide-in-from-top duration-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    Sync Issue Detected
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    We're having trouble syncing your results. Your data is saved, but synchronization may be delayed.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 gap-2 border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950"
                    onClick={handleRetrySync}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Sync
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sync Status Banner - Animated */}
        {showSyncBanner && bothCompleted && !syncError && (
          <Card className="border-2 border-green-500/50 bg-gradient-to-r from-green-500/10 to-primary/10 animate-in slide-in-from-top duration-500">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                <Check className="w-5 h-5" />
                <span>Results Synced! Both partners completed 🎉</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Persistent Sync Status */}
        {bothCompleted && !showSyncBanner && !syncError && (
          <Card className="border-2 border-accent/50 bg-gradient-to-r from-accent/10 to-primary/10">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-accent font-semibold">
                <Check className="w-5 h-5" />
                <span>Results Synced - Both Partners Completed!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Waiting for Partner Banner */}
        {!bothCompleted && !syncError && (
          <Card className="border border-primary/30 bg-primary/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                ⏳ Waiting for your partner to complete the quiz...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Top Love Language Card */}
        <Card className="border-2 border-primary/30 shadow-lg bg-gradient-to-br from-primary/5 via-card to-accent/5">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto glow-pulse">
              <Heart className="w-10 h-10 text-primary fill-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                Your Primary Love Language
              </p>
              <h2 className="text-3xl font-bold text-primary">
                {topLanguage.language}
              </h2>
              <p className="text-5xl font-bold text-accent">
                {topLanguage.percentage}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* All Results */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Your Complete Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={result.language} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-foreground">
                      {result.language}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {result.percentage}%
                  </span>
                </div>
                <Progress value={result.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Partner's Results - Show if both completed */}
        {bothCompleted && combinedState?.partnerResults && (
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-primary" />
                Your Partner's Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {combinedState.partnerResults.rankings
                .sort((a, b) => b.score - a.score)
                .map((ranking, index) => (
                  <div key={ranking.language} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-foreground">
                          {mapToUILanguage(ranking.language)}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {Math.round(ranking.score)}%
                      </span>
                    </div>
                    <Progress value={ranking.score} className="h-2" />
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Harmony Score Ring */}
        {bothCompleted && (
          <Card className="border border-accent/30 shadow-sm bg-gradient-to-br from-accent/5 to-primary/5">
            <CardContent className="p-6 text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <img 
                  src="/assets/generated/harmony-ring-transparent.dim_200x200.png" 
                  alt="Harmony Ring" 
                  className="w-full h-full object-contain glow-pulse"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-accent">{harmonyScore}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Harmony Score</h3>
                <p className="text-sm text-muted-foreground">
                  You share {harmonyScore}% overlap in your top love languages!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="rounded-2xl h-12 gap-2"
            onClick={handleRetakeClick}
            disabled={resetQuizMutation.isPending}
          >
            {resetQuizMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Re-take Quiz
          </Button>
          <Button
            className="rounded-2xl h-12 gap-2 bg-primary hover:bg-primary/90"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share Results
          </Button>
        </div>

        {/* Info Card */}
        <Card className="border border-border/50 bg-secondary/20">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  What's Next?
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {bothCompleted 
                    ? 'Your daily rituals are now personalized based on both your love languages! Prompts will resonate with your shared preferences.'
                    : 'Your daily rituals will be personalized once your partner completes the quiz. Results are saved and will sync automatically!'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retake Confirmation Dialog */}
        <AlertDialog open={showRetakeConfirm} onOpenChange={setShowRetakeConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Retake Quiz?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  Are you sure you want to retake the quiz? This will:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Clear your current results</li>
                  <li>Reset your love language rankings</li>
                  <li>Update your partner's synced view when you complete it again</li>
                </ul>
                <p className="text-sm font-semibold text-foreground pt-2">
                  Your partner will be notified when you complete the new quiz.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRetakeConfirmed} className="bg-primary hover:bg-primary/90">
                Yes, Retake Quiz
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Quiz In Progress View
  if (quizStarted && !quizCompleted) {
    return (
      <div className="min-h-full px-6 py-8 space-y-6">
        {/* Progress Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </h2>
            <span className="text-sm text-muted-foreground font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 space-y-6">
            <h3 className="text-xl font-semibold text-foreground leading-relaxed">
              {currentQuestionData.question}
            </h3>

            <RadioGroup value={currentAnswer} onValueChange={handleAnswer}>
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                      currentAnswer === option.language
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50'
                    }`}
                    onClick={() => handleAnswer(option.language)}
                  >
                    <RadioGroupItem value={option.language} id={`option-${index}`} className="mt-0.5" />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 text-base leading-relaxed cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="rounded-2xl h-12 gap-2 flex-1"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            className="rounded-2xl h-12 gap-2 flex-1 bg-primary hover:bg-primary/90"
            onClick={handleNext}
            disabled={!currentAnswer || saveQuizMutation.isPending}
          >
            {saveQuizMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : currentQuestion === quizQuestions.length - 1 ? (
              <>
                <Check className="w-4 h-4" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Initial Welcome View
  return (
    <div className="min-h-full px-6 py-8 space-y-8 stagger-entrance">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-primary tracking-tight">
          Our Love Languages
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Discover how you both feel most loved
        </p>
      </div>

      {/* Central Content Card */}
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-card via-card to-secondary/10 overflow-hidden relative max-w-2xl mx-auto">
        {/* Decorative floating hearts */}
        <div className="absolute top-4 right-4 text-primary/20 float-heart">
          <Heart className="w-6 h-6" fill="currentColor" />
        </div>
        <div className="absolute bottom-8 left-6 text-primary/15 float-heart-delayed">
          <Heart className="w-5 h-5" fill="currentColor" />
        </div>

        <CardContent className="p-8 space-y-6">
          {/* Illustration */}
          <div className="flex justify-center">
            <img 
              src="/assets/generated/two-curious-doges.dim_400x300.png" 
              alt="Two curious doges" 
              className="w-full max-w-sm h-auto rounded-2xl"
            />
          </div>

          {/* Description */}
          <div className="space-y-4 text-center">
            <p className="text-base text-muted-foreground leading-relaxed">
              Understanding each other's love language helps you express love in ways that truly resonate. 
              Take this quick quiz together to discover what makes each of you feel most cherished.
            </p>
            
            <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                <Sparkles className="w-5 h-5" />
                <span>What to Expect</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✨ 5–7 minutes to complete</li>
                <li>💕 Both partners answer separately</li>
                <li>🔄 Results sync instantly</li>
                <li>💖 Personalized insights for your relationship</li>
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            className="w-full rounded-2xl h-14 text-lg font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-primary hover:bg-primary/90"
            onClick={handleStartQuiz}
          >
            <Heart className="w-5 h-5 mr-2" />
            Start the Quiz (5–7 min)
          </Button>

          {/* Supporting Note */}
          <p className="text-sm text-muted-foreground text-center">
            Both partners answer separately → results sync instantly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
