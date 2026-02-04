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
      const result = await completePairing.mutateAsync(codeNum);
      
      if (result.__kind__ === 'err') {
        throw new Error(result.err);
      }
      
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
              <p className="text-sm text-green-900 dark:text-green-100 font-semibold">
                Prompts are ready for use
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Already Paired State
  if (isPaired && partnerProfile) {
    const cardState = getLoveLanguagesCardState();

    return (
      <div className="min-h-full px-6 py-8 space-y-6 stagger-entrance">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            Connected with Your Partner
          </h2>
          <p className="text-muted-foreground text-lg">
            Your journey together has begun 💕
          </p>
        </div>

        {/* Admin Badge Section - Prominently displayed at top */}
        <AdminBadgeSection />

        <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-card via-card to-secondary/10 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-primary/20 float-heart">
            <Heart className="w-6 h-6" fill="currentColor" />
          </div>
          <div className="absolute bottom-8 left-6 text-primary/15 float-heart-delayed">
            <Heart className="w-5 h-5" fill="currentColor" />
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Connection visual */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center glow-pulse">
                  <Heart className="w-8 h-8 text-primary fill-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {userProfile?.name || 'You'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-primary/30" />
                <LinkIcon className="w-6 h-6 text-primary" />
                <div className="w-8 h-0.5 bg-primary/30" />
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center glow-pulse">
                  <Heart className="w-8 h-8 text-accent fill-accent" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {partnerProfile.name}
                </span>
              </div>
            </div>

            {/* Success message */}
            <div className="text-center space-y-2 py-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="text-xl font-bold">You're Connected!</span>
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-muted-foreground">
                Start your daily rituals together and grow your love
              </p>
            </div>

            {/* Connection info */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-primary font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Connected
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Relationship Foundations Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            Relationship Foundations
          </h3>

          {/* Our Love Languages Card */}
          <OurLoveLanguagesCard
            subtitle={cardState.subtitle}
            statusLine={cardState.statusLine}
            primaryButtonLabel={cardState.primaryButtonLabel}
            onPrimaryAction={handleNavigateToLoveLanguages}
            onInsightsShortcut={handleNavigateToInsights}
            highlightOnce={showHighlight}
            isLoading={quizStateLoading}
          />
        </div>

        {/* Placeholder for future settings */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Profile & Settings</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              More options coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pairing Interface (Unpaired Users)
  return (
    <div className="min-h-full px-6 py-8 space-y-6 stagger-entrance">
      {/* Celebration animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-float-up">💕</div>
          <div className="text-6xl animate-float-up" style={{ animationDelay: '0.2s' }}>❤️</div>
          <div className="text-6xl animate-float-up" style={{ animationDelay: '0.4s' }}>💖</div>
        </div>
      )}

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary tracking-tight">
          Connect with Your Partner
        </h2>
        <p className="text-muted-foreground text-lg">
          Link your accounts to start your journey together
        </p>
      </div>

      {/* Admin Badge Section - Prominently displayed at top */}
      <AdminBadgeSection />

      {/* Profile requirement warning */}
      {!hasProfile && (
        <Card className="border-2 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Profile Setup Required
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Please complete your profile setup before generating or using pairing codes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Code Section */}
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-card via-card to-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            Share Your Code
          </CardTitle>
          <CardDescription>
            Generate a code and share it with your partner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pairingCode ? (
            <>
              <div className="bg-secondary/30 rounded-xl p-6 text-center space-y-2">
                <Label className="text-sm text-muted-foreground">Your Pairing Code</Label>
                <div className="text-5xl font-bold text-primary tracking-wider font-mono">
                  {pairingCode}
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this code with your partner
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl gap-2"
                  onClick={handleCopyCode}
                  disabled={!hasProfile}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl gap-2"
                  onClick={handleShareLink}
                  disabled={!hasProfile}
                >
                  <Share2 className="w-4 h-4" />
                  Share Link
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full rounded-xl"
                onClick={handleGenerateCode}
                disabled={createCode.isPending || !hasProfile}
              >
                {createCode.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate New Code'
                )}
              </Button>
            </>
          ) : (
            <Button
              className="w-full rounded-xl h-12 gap-2"
              onClick={handleGenerateCode}
              disabled={createCode.isPending || !hasProfile}
            >
              {createCode.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Pairing Code
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground font-semibold">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Enter Code Section */}
      <Card className="border-2 border-accent/20 shadow-lg bg-gradient-to-br from-card via-card to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <LinkIcon className="w-5 h-5 text-accent" />
            Enter Partner's Code
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code your partner shared with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pairing-code">Pairing Code</Label>
            <Input
              id="pairing-code"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={enteredCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setEnteredCode(value);
                setError('');
              }}
              className="text-center text-2xl font-mono tracking-widest h-14 rounded-xl"
              disabled={!hasProfile}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}

          <Button
            className="w-full rounded-xl h-12 gap-2 bg-accent hover:bg-accent/90"
            onClick={handleConnect}
            disabled={enteredCode.length !== 6 || completePairing.isPending || !hasProfile}
          >
            {completePairing.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Connect with Partner
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info card */}
      <Card className="border border-border/50 shadow-sm bg-card/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            💡 Both partners need to create an account and complete this pairing process to start using GrowInLove together
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
