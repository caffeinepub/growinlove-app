import { useState, useEffect } from 'react';
import { Heart, Copy, Share2, Check, Loader2, Sparkles, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { 
  useGetCallerUserProfile, 
  useGetUserProfile,
  useCreatePairingCode, 
  useCompletePairing 
} from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';

export function Us() {
  const [pairingCode, setPairingCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: partnerProfile } = useGetUserProfile(userProfile?.partnerId || null);
  const createCode = useCreatePairingCode();
  const completePairing = useCompletePairing();

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;

  // Generate initial code on mount if not paired
  useEffect(() => {
    if (isAuthenticated && !isPaired && !pairingCode && !createCode.isPending) {
      handleGenerateCode();
    }
  }, [isAuthenticated, isPaired]);

  const handleGenerateCode = async () => {
    try {
      setError('');
      const code = await createCode.mutateAsync();
      setPairingCode(code.toString().padStart(6, '0'));
    } catch (err) {
      console.error('Failed to generate code:', err);
      setError('Failed to generate pairing code. Please try again.');
    }
  };

  const handleCopyCode = () => {
    if (pairingCode) {
      navigator.clipboard.writeText(pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLink = () => {
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
          setTimeout(() => setCopied(false), 2000);
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleConnect = async () => {
    if (!enteredCode || enteredCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setError('');
      const codeNum = BigInt(enteredCode);
      await completePairing.mutateAsync(codeNum);
      
      // Show celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } catch (err: any) {
      console.error('Failed to complete pairing:', err);
      if (err.message?.includes('Invalid or expired')) {
        setError('Invalid or expired pairing code. Please check and try again.');
      } else if (err.message?.includes('Already paired')) {
        setError('You are already paired with a partner.');
      } else if (err.message?.includes('Cannot pair with yourself')) {
        setError('You cannot pair with yourself. Please use your partner\'s code.');
      } else if (err.message?.includes('Partner is already paired')) {
        setError('This code belongs to someone who is already paired.');
      } else {
        setError('Failed to connect. Please try again.');
      }
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

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Already Paired State
  if (isPaired && partnerProfile) {
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
                >
                  <Share2 className="w-4 h-4" />
                  Share Link
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full rounded-xl"
                onClick={handleGenerateCode}
                disabled={createCode.isPending}
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
              disabled={createCode.isPending}
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
            disabled={enteredCode.length !== 6 || completePairing.isPending}
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
