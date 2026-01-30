import { Heart, Smile, Image, Mic, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { useGetDailyRitualWithStats, useSubmitRitualResponse, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { EntryStatus } from '../backend';
import { CompletionAnimation } from '../components/CompletionAnimation';

export function Home() {
  const [ritualText, setRitualText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: ritualData, isLoading, error } = useGetDailyRitualWithStats();
  const submitResponse = useSubmitRitualResponse();

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;
  const currentUserId = identity?.getPrincipal().toString();

  // Check if current user has already submitted
  const hasSubmitted = ritualData?.responses.some(
    (r) => r.userId.toString() === currentUserId
  ) || false;

  const isComplete = ritualData?.status === EntryStatus.complete;
  const isWaiting = hasSubmitted && !isComplete;

  // Trigger completion animation when status changes to complete
  useEffect(() => {
    if (isComplete && !showCompletion) {
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 3000);
    }
  }, [isComplete]);

  const handleSubmit = async () => {
    if (!ritualText.trim() && !selectedEmoji) return;

    try {
      await submitResponse.mutateAsync({
        text: ritualText.trim() || undefined,
        emoji: selectedEmoji || undefined,
      });
      setRitualText('');
      setSelectedEmoji('');
    } catch (error) {
      console.error('Failed to submit ritual response:', error);
    }
  };

  const handleEmojiClick = () => {
    const emojis = ['❤️', '😊', '🥰', '💕', '✨', '🌟', '💖', '😍', '🤗', '💝'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setSelectedEmoji(randomEmoji);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="w-16 h-16 text-primary fill-primary mx-auto" />
            <h2 className="text-2xl font-bold text-primary">Welcome to GrowInLove</h2>
            <p className="text-muted-foreground">
              Please log in to start your daily ritual journey together
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show pairing required message if not paired
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
                To start your daily rituals, please connect with your partner in the <span className="font-semibold text-primary">Us</span> tab
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

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your ritual...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-destructive/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-destructive font-semibold">
              {error instanceof Error ? error.message : 'Failed to load ritual'}
            </p>
            <p className="text-sm text-muted-foreground">
              Please make sure you have a partner assigned
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const streakCount = Number(ritualData?.streakCount || 0);
  const harmonyMeter = Math.round((ritualData?.harmonyMeter || 0.5) * 100);

  return (
    <div className="min-h-full px-6 py-8 space-y-8 stagger-entrance">
      {/* Today's Ritual Card - Hero Section */}
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-card via-card to-secondary/10 overflow-hidden relative">
        {showCompletion && <CompletionAnimation />}
        
        {/* Decorative floating hearts */}
        <div className="absolute top-4 right-4 text-primary/20 float-heart">
          <Heart className="w-6 h-6" fill="currentColor" />
        </div>
        <div className="absolute bottom-8 left-6 text-primary/15 float-heart-delayed">
          <Heart className="w-5 h-5" fill="currentColor" />
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              Today's Ritual
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {ritualData?.prompt.text || 'Loading prompt...'}
            </p>
          </div>

          {/* Completion State - Show both responses */}
          {isComplete && ritualData?.responses && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Sparkles className="w-5 h-5" />
                <span>Both completed! 🎉</span>
              </div>
              {ritualData.responses.map((response, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-secondary/30 border border-primary/10 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-primary fill-primary" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {response.userId.toString() === currentUserId ? 'You' : 'Your Partner'}
                    </span>
                  </div>
                  {response.emoji && (
                    <div className="text-3xl">{response.emoji}</div>
                  )}
                  {response.text && (
                    <p className="text-base text-foreground">{response.text}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Waiting State */}
          {isWaiting && (
            <div className="text-center py-8 space-y-4">
              <div className="glow-pulse inline-block">
                <Heart className="w-16 h-16 text-primary fill-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-primary">
                  Waiting for Partner...
                </p>
                <p className="text-sm text-muted-foreground">
                  Your response has been submitted. Waiting for your partner to complete their ritual.
                </p>
              </div>
            </div>
          )}

          {/* Input State - Not yet submitted */}
          {!hasSubmitted && !isComplete && (
            <>
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your thoughts here..."
                  value={ritualText}
                  onChange={(e) => setRitualText(e.target.value)}
                  className="min-h-[120px] resize-none text-base rounded-2xl border-2 border-border/50 focus:border-primary/50 bg-background/50"
                />

                {selectedEmoji && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-primary/10">
                    <span className="text-2xl">{selectedEmoji}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEmoji('')}
                      className="ml-auto"
                    >
                      Remove
                    </Button>
                  </div>
                )}

                {/* Interactive Buttons Row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-2 hover:bg-accent/20 hover:border-accent"
                    onClick={handleEmojiClick}
                  >
                    <Smile className="w-4 h-4" />
                    <span className="text-sm">Emoji</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-2 hover:bg-accent/20 hover:border-accent"
                    disabled
                  >
                    <Image className="w-4 h-4" />
                    <span className="text-sm">Photo</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-2 hover:bg-accent/20 hover:border-accent"
                    disabled
                  >
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">Voice</span>
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full rounded-2xl h-14 text-lg font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-primary hover:bg-primary/90"
                onClick={handleSubmit}
                disabled={(!ritualText.trim() && !selectedEmoji) || submitResponse.isPending}
              >
                {submitResponse.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Shared Streak Counter */}
      <Card className="border border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                <span className="text-xl">🐕</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Shared Streak</span>
                <span className="text-2xl font-bold text-primary">
                  {streakCount} {streakCount === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
            
            <div className="glow-pulse">
              <Heart className="w-8 h-8 text-primary fill-primary" strokeWidth={2.5} />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground">Together</span>
                <span className="text-2xl font-bold text-primary">Growing</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                <span className="text-xl">🐕</span>
              </div>
            </div>
          </div>
          
          {/* Chain visualization */}
          <div className="mt-4 relative">
            <img 
              src="/assets/generated/doge-avatars-chain.dim_300x150.png" 
              alt="Connected avatars" 
              className="w-full h-auto opacity-60 mix-blend-multiply dark:mix-blend-lighten"
            />
          </div>
        </CardContent>
      </Card>

      {/* Harmony Meter */}
      <Card className="border border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-primary" />
                Harmony Meter
              </h3>
              <p className="text-sm text-muted-foreground">
                Your relationship harmony this week
              </p>
            </div>
            <div className="text-3xl font-bold text-primary">
              {harmonyMeter}%
            </div>
          </div>
          
          {/* Heart-shaped progress visualization */}
          <div className="space-y-2">
            <Progress value={harmonyMeter} className="h-3 bg-secondary" />
            <p className="text-xs text-muted-foreground text-center">
              Keep nurturing your connection! 💕
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
