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
  useGetLoveLanguageQuizResult, 
  useGetCombinedQuizResultState,
  useSaveLoveLanguageQuizResults,
  useClearLoveLanguagesQuizResults
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
  const { data: savedResults, isLoading: loadingResults, error: resultsError, refetch: refetchResults } = useGetLoveLanguageQuizResult();
  const { data: combinedState, isLoading: loadingCombined, error: combinedError, refetch: refetchCombined } = useGetCombinedQuizResultState();
  const saveQuizMutation = useSaveLoveLanguageQuizResults();
  const resetQuizMutation = useClearLoveLanguagesQuizResults();

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
      
      // Reset local state
      setQuizStarted(false);
      setCurrentQuestion(0);
      setAnswers({});
      setQuizCompleted(false);
      setResults([]);
      setSyncError(false);
      
      // Refetch to ensure clean state
      await refetchResults();
      await refetchCombined();
      
      toast.success('Quiz reset successfully', {
        description: 'You can now retake the quiz.',
      });
    } catch (error) {
      console.error('Failed to reset quiz:', error);
      toast.error('Failed to reset quiz', {
        description: 'Please try again or refresh the page.',
      });
    }
  };

  const handleRetrySave = async () => {
    try {
      setSyncError(false);
      
      const backendRankings: LoveLanguageRanking[] = results.map(result => ({
        language: mapToBackendLanguage(result.language),
        score: result.percentage,
      }));

      const quizResult: LoveLanguagesQuizResult = {
        userId: identity!.getPrincipal(),
        rankings: backendRankings,
        completionTime: BigInt(Date.now() * 1000000),
      };

      await saveQuizMutation.mutateAsync(quizResult);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refetchCombined();
      
      toast.success('Results saved successfully!');
    } catch (error) {
      console.error('Retry save failed:', error);
      setSyncError(true);
      toast.error('Save failed again', {
        description: 'Please check your connection and try again.',
      });
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQuestionData = quizQuestions[currentQuestion];
  const hasAnsweredCurrent = answers[currentQuestion] !== undefined;

  // Loading state
  if (loadingResults || loadingCombined) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-lg text-muted-foreground">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="border-2 border-romantic-primary/30">
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="w-16 h-16 text-romantic-primary mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Login Required</h2>
            <p className="text-muted-foreground">
              Please log in to take the Love Languages quiz and discover how you and your partner express love.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not paired
  if (!isPaired) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="border-2 border-romantic-accent/30">
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="w-16 h-16 text-romantic-accent mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Partner Required</h2>
            <p className="text-muted-foreground">
              The Love Languages quiz is designed for couples. Please pair with your partner in the "Us" tab first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sync error banner
  const syncErrorBanner = syncError && (
    <div className="mb-6 bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold text-foreground">Sync Error</p>
          <p className="text-sm text-muted-foreground">
            We couldn't save or sync your results. Please check your connection and try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetrySave}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Save
          </Button>
        </div>
      </div>
    </div>
  );

  // Sync success banner
  const syncSuccessBanner = showSyncBanner && (
    <div className="mb-6 bg-romantic-primary/10 border-2 border-romantic-primary/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-start gap-3">
        <Check className="w-5 h-5 text-romantic-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Synced! 🎉</p>
          <p className="text-sm text-muted-foreground">
            Both you and your partner have completed the quiz. Your results are now synchronized!
          </p>
        </div>
      </div>
    </div>
  );

  // Quiz not started - show intro
  if (!quizStarted && !quizCompleted) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {syncErrorBanner}
        <Card className="border-2 border-romantic-primary/30 overflow-hidden">
          <div className="bg-gradient-to-br from-romantic-primary/10 via-romantic-accent/10 to-romantic-deep/10 p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-romantic-primary/20 flex items-center justify-center glow-pulse">
                <Heart className="w-10 h-10 text-romantic-primary fill-romantic-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-deep bg-clip-text text-transparent">
              Discover Your Love Languages
            </h1>
            <p className="text-center text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Understanding how you and your partner express and receive love can transform your relationship. 
              Take this quiz to unlock personalized insights and activities.
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-romantic-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">7 thoughtful questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Each question helps us understand your unique love language preferences.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-romantic-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Personalized results</h3>
                  <p className="text-sm text-muted-foreground">
                    See your top love languages ranked by importance to you.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Share2 className="w-5 h-5 text-romantic-deep flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Sync with your partner</h3>
                  <p className="text-sm text-muted-foreground">
                    Once both of you complete the quiz, you'll unlock shared insights and activities.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                onClick={handleStartQuiz}
                className="w-full rounded-2xl text-lg py-6 bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-deep hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                Start Quiz
              </Button>
            </div>

            {combinedState && (
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your progress:</span>
                  <span className="font-semibold text-foreground">
                    {combinedState.callerCompleted ? 'Completed ✓' : 'Not started'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Partner's progress:</span>
                  <span className="font-semibold text-foreground">
                    {combinedState.partnerCompleted ? 'Completed ✓' : 'Not started'}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz in progress
  if (quizStarted && !quizCompleted) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <Card className="border-2 border-romantic-primary/30">
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Love Languages Quiz</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground leading-relaxed">
                {currentQuestionData.question}
              </h2>

              <RadioGroup
                value={answers[currentQuestion] || ''}
                onValueChange={(value) => handleAnswer(value as LoveLanguageUI)}
                className="space-y-3"
              >
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-romantic-primary/50 hover:bg-romantic-primary/5 ${
                      answers[currentQuestion] === option.language
                        ? 'border-romantic-primary bg-romantic-primary/10'
                        : 'border-border/50'
                    }`}
                    onClick={() => handleAnswer(option.language)}
                  >
                    <RadioGroupItem value={option.language} id={`option-${index}`} className="mt-0.5" />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-sm leading-relaxed"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
                className="gap-2 bg-gradient-to-r from-romantic-primary to-romantic-accent hover:opacity-90"
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz completed - show results
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {syncSuccessBanner}
      {syncErrorBanner}

      <Card className="border-2 border-romantic-primary/30 overflow-hidden">
        <div className="bg-gradient-to-br from-romantic-primary/10 via-romantic-accent/10 to-romantic-deep/10 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-romantic-primary/20 flex items-center justify-center glow-pulse">
              <Heart className="w-10 h-10 text-romantic-primary fill-romantic-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-deep bg-clip-text text-transparent">
            Your Love Languages
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Here's how you prefer to give and receive love. Share these results with your partner to deepen your connection.
          </p>
        </div>

        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={result.language}
                className={`p-5 rounded-xl border-2 transition-all ${
                  index === 0
                    ? 'border-romantic-primary bg-romantic-primary/10'
                    : 'border-border/50 bg-card'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <div className="w-8 h-8 rounded-full bg-romantic-primary/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-romantic-primary" />
                      </div>
                    )}
                    <h3 className="font-semibold text-foreground">{result.language}</h3>
                  </div>
                  <span className="text-lg font-bold text-romantic-primary">{result.percentage}%</span>
                </div>
                <Progress value={result.percentage} className="h-2" />
                {index === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    This is your primary love language!
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-border/50 space-y-4">
            <div className="bg-muted/50 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-romantic-accent" />
                What's next?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-romantic-primary mt-0.5">•</span>
                  <span>Share your results with your partner and discuss what they mean to you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-romantic-primary mt-0.5">•</span>
                  <span>Encourage your partner to take the quiz if they haven't already</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-romantic-primary mt-0.5">•</span>
                  <span>Once both of you complete it, you'll unlock personalized activities and insights</span>
                </li>
              </ul>
            </div>

            {combinedState && (
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h3 className="font-semibold text-foreground mb-3">Completion Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">You:</span>
                    <span className="font-semibold text-romantic-primary flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Partner:</span>
                    <span className={`font-semibold ${combinedState.partnerCompleted ? 'text-romantic-primary' : 'text-muted-foreground'}`}>
                      {combinedState.partnerCompleted ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Completed
                        </span>
                      ) : (
                        'Waiting...'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleRetakeClick}
              className="w-full gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Retake Confirmation Dialog */}
      <AlertDialog open={showRetakeConfirm} onOpenChange={setShowRetakeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retake the quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear your current results and allow you to retake the quiz. 
              Your partner's results will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRetakeConfirmed}>
              Yes, retake quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
