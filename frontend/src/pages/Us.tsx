import { useState, useEffect } from 'react';
import { Heart, Copy, Share2, Check, Loader2, Sparkles, Link as LinkIcon, AlertCircle, Crown, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { 
  useGetCallerUserProfile, 
  useGetUserProfile,
  useCreatePairingCode, 
  useCompletePairing,
  useIsCallerAdmin,
  useArePromptsInitialized,
  useGetCombinedQuizResultState
} from '../hooks/useQueries';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { OurLoveLanguagesCard } from '../components/OurLoveLanguagesCard';

interface UsProps {
  onNavigate?: (tab: 'love-languages' | 'insights') => void;
}

export function Us({ onNavigate }: UsProps) {
  const [pairingCode, setPairingCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: partnerProfile } = useGetUserProfile(userProfile?.partnerId || null);
  const { data: isAdmin, isLoading: isAdminLoading, isFetched: isAdminFetched } = useIsCallerAdmin();
  const { data: promptsInitialized, isLoading: promptsLoading } = useArePromptsInitialized();
  const { data: combinedQuizState, isLoading: quizStateLoading } = useGetCombinedQuizResultState();
  const createCode = useCreatePairingCode();
  const completePairing = useCompletePairing();

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;
  const hasProfile = profileFetched && userProfile !== null;

  // Check for one-time highlight flag
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    if (isPaired) {
      const highlightFlag = localStorage.getItem('growinlove_just_paired');
      if (highlightFlag === 'true') {
        setShowHighlight(true);
        // Clear the flag after a short delay
        setTimeout(() => {
          localStorage.removeItem('growinlove_just_paired');
          setShowHighlight(false);
        }, 3000);
      }
    }
  }, [isPaired]);

  // Generate initial code on mount if not paired and has profile
  useEffect(() => {
    if (isAuthenticated && !isPaired && !pairingCode && !createCode.isPending && hasProfile) {
      handleGenerateCode();
    }
  }, [isAuthenticated, isPaired, hasProfile]);

  const handleGenerateCode = async () => {
    // Check if profile exists before generating code
    if (!hasProfile) {
      toast.error('Please complete your profile setup before pairing', {
        description: 'You need to set up your profile first',
      });
      return;
    }

    try {
      setError('');
      const code = await createCode.mutateAsync();
      setPairingCode(code.toString().padStart(6, '0'));
      toast.success('Pairing code generated!', {
        description: 'Share this code with your partner',
      });
    } catch (err: any) {
      console.error('Failed to generate code:', err);
      if (err.message?.includes('Profile not initialized')) {
        setError('Please complete your profile setup before pairing');
        toast.error('Profile setup required', {
          description: 'Complete your profile before generating a pairing code',
        });
      } else {
        setError('Failed to generate pairing code. Please try again.');
        toast.error('Failed to generate code', {
          description: 'Please try again',
        });
      }
    }
  };

  const handleCopyCode = () => {
    if (!hasProfile) {
      toast.error('Please complete your profile setup before pairing');
      return;
    }

    if (pairingCode) {
      navigator.clipboard.writeText(pairingCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLink = () => {
    if (!hasProfile) {
      toast.error('Please complete your profile setup before pairing');
      return;
    }

    if (pairingCode) {
      const shareUrl = `${window.location.origin}?code=${pairingCode}`;
      if (navigator.share) {
        navigator.share({
          title: 'Join me on GrowInLove',
          text: `Use code ${pairingCode} to connect with me on GrowInLove!`,
          url: shareUrl,
        }).catch(() => {
          // Fallback to copy
          navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          toast.success('Link copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleConnect = async () => {
    // Check if profile exists before connecting
    if (!hasProfile) {
      toast.error('Please complete your profile setup before pairing', {
        description: 'You need to set up your profile first',
      });
      return;
    }

    if (!enteredCode || enteredCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setError('');
      const codeNum = BigInt(enteredCode);
      await completePairing.mutateAsync(codeNum);
      
      // Set localStorage flag for one-time highlight
      localStorage.setItem('growinlove_just_paired', 'true');
      
      // Show celebration
      setShowCelebration(true);
      toast.success('Successfully connected!', {
        description: 'You are now paired with your partner 💕',
      });
      setTimeout(() => setShowCelebration(false), 3000);
    } catch (err: any) {
      console.error('Failed to complete pairing:', err);
      if (err.message?.includes('Profile not initialized')) {
        setError('Please complete your profile setup before pairing');
        toast.error('Profile setup required', {
          description: 'Complete your profile before connecting with a partner',
        });
      } else if (err.message?.includes('Invalid or expired')) {
        setError('Invalid or expired pairing code. Please check and try again.');
        toast.error('Invalid code', {
          description: 'The code you entered is invalid or expired',
        });
      } else if (err.message?.includes('Already paired')) {
        setError('You are already paired with a partner.');
        toast.error('Already paired', {
          description: 'You are already connected with a partner',
        });
      } else if (err.message?.includes('Cannot pair with yourself')) {
        setError('You cannot pair with yourself. Please use your partner\'s code.');
        toast.error('Invalid pairing', {
          description: 'You cannot pair with yourself',
        });
      } else if (err.message?.includes('Partner is already paired')) {
        setError('This code belongs to someone who is already paired.');
        toast.error('Partner unavailable', {
          description: 'This person is already paired with someone else',
        });
      } else {
        setError('Failed to connect. Please try again.');
        toast.error('Connection failed', {
          description: 'Please try again',
        });
      }
    }
  };

  // Derive Love Languages card state from combined quiz state
  const getLoveLanguagesCardState = () => {
    if (!combinedQuizState || quizStateLoading) {
      return {
        subtitle: 'Check your quiz status',
        statusLine: 'Loading...',
        primaryButtonLabel: 'View Quiz',
      };
    }

    const { callerCompleted, partnerCompleted } = combinedQuizState;

    if (!callerCompleted && !partnerCompleted) {
      return {
        subtitle: 'Discover how you give and receive love',
        statusLine: 'Not started yet',
        primaryButtonLabel: 'Start Quiz',
      };
    }

    if (callerCompleted && !partnerCompleted) {
      return {
        subtitle: 'Your partner hasn\'t completed the quiz yet',
        statusLine: 'Waiting for your partner',
        primaryButtonLabel: 'View Your Results',
      };
    }

    if (!callerCompleted && partnerCompleted) {
      return {
        subtitle: 'Complete the quiz to see your match',
        statusLine: 'Your partner is waiting',
        primaryButtonLabel: 'Take Quiz',
      };
    }

    // Both completed
    return {
      subtitle: 'See your match & strengths',
      statusLine: 'Both completed',
      primaryButtonLabel: 'View Results',
    };
  };

  const handleNavigateToLoveLanguages = () => {
    if (onNavigate) {
      onNavigate('love-languages');
    }
  };

  const handleNavigateToInsights = () => {
    // Set sessionStorage flag for Insights auto-scroll
    sessionStorage.setItem('scrollToHarmony', 'true');
    if (onNavigate) {
      onNavigate('insights');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="w-16 h-16 text-primary fill-primary mx-auto" />
            <h2 className="text-2xl font-bold text-primary">Welcome to GrowInLove</h2>
            <p className="text-muted-foreground">
              Please log in to connect with your partner
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading || isAdminLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Admin Badge Component (reusable for both paired and unpaired states)
  const AdminBadgeSection = () => {
    if (!isAdminFetched || !isAdmin) return null;

    return (
      <Card className="border-4 border-amber-500 shadow-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100 dark:from-amber-900/60 dark:via-amber-800/40 dark:to-yellow-900/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-center gap-3 text-amber-800 dark:text-amber-200">
            <Crown className="w-8 h-8 fill-amber-600 dark:fill-amber-400 drop-shadow-md" />
            <span className="text-2xl font-extrabold tracking-tight">You are the Admin</span>
            <Crown className="w-8 h-8 fill-amber-600 dark:fill-amber-400 drop-shadow-md" />
          </div>

          {promptsInitialized && (
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="bg-green-100 dark:bg-green-950/60 border-green-500 text-green-800 dark:text-green-300 font-semibold px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                Prompts Active
              </Badge>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-center text-amber-900 dark:text-amber-100 font-semibold">
              Daily ritual prompts are automatically initialized
            </p>
            
            <div className="bg-green-50 dark:bg-green-950/50 border-2 border-green-500 dark:border-green-600 rounded-lg p-3 flex items-center gap-2 shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                System is ready for all users
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Paired State
  if (isPaired) {
    const loveLanguagesCardState = getLoveLanguagesCardState();

    return (
      <div className="min-h-full px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Heart className="w-8 h-8 fill-primary" />
            Us
          </h1>
          <p className="text-muted-foreground">Your relationship foundation</p>
        </div>

        {/* Admin Badge Section */}
        <AdminBadgeSection />

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="max-w-md mx-4 border-4 border-primary shadow-2xl animate-in zoom-in duration-500">
              <CardContent className="p-8 text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                  <Heart className="w-20 h-20 text-primary fill-primary mx-auto relative animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-primary">Connected! 💕</h3>
                  <p className="text-muted-foreground">
                    You're now paired with {partnerProfile?.name || 'your partner'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Start your journey together</span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Partner Info Card */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              Connected With
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-foreground">
                  {partnerProfile?.name || 'Your Partner'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {partnerProfile?.partnerId ? 'Paired' : 'Loading...'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary fill-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Relationship Foundations Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary">Relationship Foundations</h2>
          
          {/* Our Love Languages Card */}
          <OurLoveLanguagesCard
            subtitle={loveLanguagesCardState.subtitle}
            statusLine={loveLanguagesCardState.statusLine}
            primaryButtonLabel={loveLanguagesCardState.primaryButtonLabel}
            onPrimaryAction={handleNavigateToLoveLanguages}
            onInsightsShortcut={handleNavigateToInsights}
            highlightOnce={showHighlight}
          />
        </div>
      </div>
    );
  }

  // Unpaired State
  return (
    <div className="min-h-full px-6 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Heart className="w-8 h-8 fill-primary" />
          Connect With Your Partner
        </h1>
        <p className="text-muted-foreground">Share your code or enter theirs to get started</p>
      </div>

      {/* Admin Badge Section */}
      <AdminBadgeSection />

      {/* Your Code Card */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Your Pairing Code</CardTitle>
          <CardDescription>Share this code with your partner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pairingCode ? (
            <>
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 text-center">
                <p className="text-4xl font-bold text-primary tracking-widest font-mono">
                  {pairingCode}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  className="flex-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleShareLink}
                  variant="outline"
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={handleGenerateCode}
              disabled={createCode.isPending || !hasProfile}
              className="w-full"
            >
              {createCode.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Generate Code
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Enter Code Card */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Have a Code?</CardTitle>
          <CardDescription>Enter your partner's code to connect</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Partner's Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="000000"
              value={enteredCode}
              onChange={(e) => {
                setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              maxLength={6}
              className="text-center text-2xl font-mono tracking-widest"
              disabled={completePairing.isPending || !hasProfile}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            onClick={handleConnect}
            disabled={enteredCode.length !== 6 || completePairing.isPending || !hasProfile}
            className="w-full"
          >
            {completePairing.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2 fill-current" />
                Connect
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
