import { Heart, Smile, Image, Mic, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';
import { useGetDailyRitual, useSubmitRitualResponse, useGetCallerUserProfile, useUploadPhoto, useGetRitualHistory, useGetRitualStatus, useGetInsightsData, useGetPhoto } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoveLanguage, RitualEntryView } from '../backend';
import { CompletionAnimation } from '../components/CompletionAnimation';
import { ExternalBlob } from '../backend';
import { HarmonyHomeEcho } from '../components/HarmonyHomeEcho';

// Map backend enum to UI display
const mapLoveLanguageToDisplay = (language: LoveLanguage | undefined): { name: string; emoji: string; color: string } => {
  if (!language) return { name: 'Connection', emoji: '💞', color: 'from-primary/20 to-accent/20' };
  
  const mapping: Record<LoveLanguage, { name: string; emoji: string; color: string }> = {
    [LoveLanguage.wordsOfAffirmation]: { name: 'Words of Affirmation', emoji: '💬', color: 'from-blue-500/20 to-cyan-500/20' },
    [LoveLanguage.qualityTime]: { name: 'Quality Time', emoji: '⏰', color: 'from-purple-500/20 to-pink-500/20' },
    [LoveLanguage.receivingGifts]: { name: 'Receiving Gifts', emoji: '🎁', color: 'from-amber-500/20 to-orange-500/20' },
    [LoveLanguage.actsOfService]: { name: 'Acts of Service', emoji: '🤝', color: 'from-green-500/20 to-emerald-500/20' },
    [LoveLanguage.physicalTouch]: { name: 'Physical Touch', emoji: '🤗', color: 'from-rose-500/20 to-red-500/20' },
  };
  
  return mapping[language];
};

// Format date to human-readable format
const formatDate = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) / 1_000_000);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Truncate text to first line or max length
const truncateText = (text: string | undefined, maxLength: number = 60): string => {
  if (!text) return '';
  const firstLine = text.split('\n')[0];
  if (firstLine.length <= maxLength) return firstLine;
  return firstLine.substring(0, maxLength) + '...';
};

// Step 2A: Helper to check if an entry is from today
const isToday = (timestamp: bigint): boolean => {
  const entryDate = new Date(Number(timestamp) / 1_000_000);
  const now = new Date();
  return (
    entryDate.getFullYear() === now.getFullYear() &&
    entryDate.getMonth() === now.getMonth() &&
    entryDate.getDate() === now.getDate()
  );
};

// Ritual History Entry Component
function RitualHistoryEntry({ entry, currentUserId }: { entry: RitualEntryView; currentUserId: string | undefined }) {
  const [showModal, setShowModal] = useState(false);
  
  const loveLanguageFocus = mapLoveLanguageToDisplay(entry.loveLanguageFocus);
  
  const handleToggle = () => {
    setShowModal(true);
  };
  
  return (
    <>
      <div 
        className="p-4 rounded-xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/10 hover:border-primary/20 transition-all cursor-pointer group"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Date and Love Language Focus */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-primary">
                {formatDate(entry.date)}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <span className="text-sm">{loveLanguageFocus.emoji}</span>
                <span className="text-xs text-muted-foreground">{loveLanguageFocus.name}</span>
              </div>
            </div>
            
            {/* Prompt Preview */}
            <p className="text-sm text-foreground/80 leading-relaxed">
              {truncateText(entry.prompt.text, 80)}
            </p>
            
            {/* Responses Preview */}
            <div className="flex items-center gap-2 flex-wrap">
              {entry.responses.map((response, idx) => (
                <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/30 border border-primary/10">
                  {response.emoji && <span className="text-sm">{response.emoji}</span>}
                  <span className="text-xs text-muted-foreground">
                    {truncateText(response.text, 20)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Expand Icon */}
          <div className="flex-shrink-0">
            <Heart className="w-4 h-4 text-primary fill-primary opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
      
      {/* Modal for Full Details */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{loveLanguageFocus.emoji}</span>
              <span>{formatDate(entry.date)}</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {loveLanguageFocus.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {/* Full Prompt */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <p className="text-sm font-semibold text-primary mb-2">Ritual Prompt</p>
              <p className="text-base text-foreground leading-relaxed">{entry.prompt.text}</p>
            </div>
            
            {/* Full Responses */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-primary">Responses</p>
              {entry.responses.map((response, idx) => (
                <ResponseWithPhoto
                  key={idx}
                  response={response}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Response with Photo Component
function ResponseWithPhoto({ response, currentUserId }: { response: any; currentUserId: string | undefined }) {
  const { data: photo, isLoading: photoLoading } = useGetPhoto(response.photoId || null);
  
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-primary/10 space-y-2">
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
        <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">{response.text}</p>
      )}
      {response.photoId && (
        <div className="mt-2">
          {photoLoading ? (
            <div className="w-full h-48 rounded-xl bg-secondary/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : photo ? (
            <img 
              src={photo.blob.getDirectURL()} 
              alt="Ritual photo" 
              className="w-full h-auto max-h-96 object-cover rounded-xl border border-primary/10"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

export function Home({ onNavigateToInsights }: { onNavigateToInsights?: () => void }) {
  const [ritualText, setRitualText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadedPhotoId, setUploadedPhotoId] = useState<string | undefined>(undefined);
  const [showCompletion, setShowCompletion] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: ritualPrompt, isLoading, error } = useGetDailyRitual();
  const { data: ritualStatus } = useGetRitualStatus();
  const { data: insightsData } = useGetInsightsData();
  const { data: ritualHistory, isLoading: historyLoading } = useGetRitualHistory(7);
  const submitResponse = useSubmitRitualResponse();
  const uploadPhoto = useUploadPhoto();

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;
  const currentUserId = identity?.getPrincipal().toString();

  // Get Love Language focus for today
  const loveLanguageFocus = mapLoveLanguageToDisplay(ritualPrompt?.loveLanguage);

  // Phase 1B: Canonical ritual completion attribution
  // Compare caller principal with canonical partnerA/partnerB from backend
  const callerPrincipal = identity?.getPrincipal().toString();
  const callerComplete = ritualStatus
    ? (ritualStatus.partnerA.toString() === callerPrincipal ? ritualStatus.partnerAComplete : ritualStatus.partnerBComplete)
    : false;
  const partnerComplete = ritualStatus
    ? (ritualStatus.partnerA.toString() === callerPrincipal ? ritualStatus.partnerBComplete : ritualStatus.partnerAComplete)
    : false;

  const hasSubmitted = callerComplete;
  const isComplete = callerComplete && partnerComplete;
  const isWaiting = hasSubmitted && !isComplete;

  // Trigger completion animation when status changes to complete
  useEffect(() => {
    if (isComplete && !showCompletion) {
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 3000);
    }
  }, [isComplete]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploadedPhotoId(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!ritualText.trim() && !selectedEmoji && !photoFile) return;

    try {
      // Upload photo first if present
      let photoId: string | undefined = uploadedPhotoId;
      if (photoFile && !uploadedPhotoId) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array);
        photoId = await uploadPhoto.mutateAsync({
          blob,
          name: photoFile.name,
        });
        setUploadedPhotoId(photoId);
      }

      // Submit ritual response with photoId
      await submitResponse.mutateAsync({
        text: ritualText.trim() || undefined,
        emoji: selectedEmoji || undefined,
        photoId: photoId,
      });

      // Clear form
      setRitualText('');
      setSelectedEmoji('');
      handleRemovePhoto();
    } catch (error) {
      console.error('Failed to submit ritual response:', error);
    }
  };

  const handleEmojiClick = () => {
    const emojis = ['❤️', '😊', '🥰', '💕', '✨', '🌟', '💖', '😍', '🤗', '💝'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setSelectedEmoji(randomEmoji);
  };

  const handleNavigateToInsights = () => {
    sessionStorage.setItem('scrollToHarmony', 'true');
    if (onNavigateToInsights) {
      onNavigateToInsights();
    }
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

  const streakCount = insightsData ? Number(insightsData.currentStreak) : 0;
  const harmonyMeter = insightsData ? Math.round(insightsData.averageHarmony * 100) : 50;
  
  // Phase 3: Extract harmony data for Home echo
  const currentHarmony = insightsData?.currentHarmony ?? 0;
  const harmonyTrend = insightsData?.harmonyTrend ?? [];

  // Step 2A: Prefer today's entry when showing "Both completed!" state
  // ritualHistory is already sorted newest-first by useGetRitualHistory
  const todayEntry = ritualHistory?.find(entry => isToday(entry.date));
  const latestEntry = ritualHistory && ritualHistory.length > 0 ? ritualHistory[0] : null;
  const displayEntry = isComplete ? (todayEntry || latestEntry) : null;

  return (
    <div className="min-h-full px-6 py-8 space-y-8 stagger-entrance">
      {/* Today's Ritual Card - Hero Section with Dynamic Love Language Focus */}
      <Card className={`border-2 border-primary/20 shadow-lg bg-gradient-to-br from-card via-card ${loveLanguageFocus.color} overflow-hidden relative transition-all duration-700`}>
        {showCompletion && <CompletionAnimation />}
        
        {/* Decorative floating hearts */}
        <div className="absolute top-4 right-4 text-primary/20 float-heart">
          <Heart className="w-6 h-6" fill="currentColor" />
        </div>
        <div className="absolute bottom-8 left-6 text-primary/15 float-heart-delayed">
          <Heart className="w-5 h-5" fill="currentColor" />
        </div>
        
        <CardContent className="p-6 space-y-6">
          {/* Love Language Focus Header */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <span className="text-2xl">{loveLanguageFocus.emoji}</span>
            <p className="text-sm font-semibold text-primary">
              Today's focus: <span className="text-accent">{loveLanguageFocus.name}</span> 💞
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              Today's Ritual
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {ritualPrompt?.text || 'Loading prompt...'}
            </p>
          </div>

          {/* Completion State - Show both responses from today's entry (or latest if today not found) */}
          {isComplete && displayEntry && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Sparkles className="w-5 h-5" />
                <span>Both completed! 🎉</span>
              </div>
              {displayEntry.responses.map((response, idx) => (
                <ResponseWithPhoto
                  key={idx}
                  response={response}
                  currentUserId={currentUserId}
                />
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

                {photoPreview && (
                  <div className="relative rounded-xl overflow-hidden border-2 border-primary/10">
                    <img 
                      src={photoPreview} 
                      alt="Selected photo" 
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full w-8 h-8"
                      onClick={handleRemovePhoto}
                    >
                      <X className="w-4 h-4" />
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
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="w-4 h-4" />
                    <span className="text-sm">Photo</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
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
                disabled={(!ritualText.trim() && !selectedEmoji && !photoFile) || submitResponse.isPending || uploadPhoto.isPending}
              >
                {submitResponse.isPending || uploadPhoto.isPending ? (
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

      {/* Phase 3: Harmony Home Echo */}
      {isPaired && insightsData && (
        <HarmonyHomeEcho
          currentHarmony={currentHarmony}
          harmonyTrend={harmonyTrend}
          onNavigateToInsights={handleNavigateToInsights}
        />
      )}

      {/* Ritual History Section - Step 2A: Now supports multi-day entries */}
      <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-card via-card to-cream/10 backdrop-blur-sm overflow-hidden relative">
        {/* Decorative floating heart */}
        <div className="absolute top-4 right-4 text-primary/10 float-heart">
          <Heart className="w-5 h-5" fill="currentColor" />
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-primary">Ritual History</h3>
            <span className="text-xl">💞</span>
          </div>
          
          {historyLoading && (
            <div className="text-center py-8 space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading your love story...💫</p>
            </div>
          )}
          
          {!historyLoading && ritualHistory && ritualHistory.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <div className="glow-pulse inline-block">
                <Heart className="w-12 h-12 text-primary/40 fill-primary/40" />
              </div>
              <p className="text-base text-muted-foreground">
                No rituals yet — your story begins today 💞
              </p>
            </div>
          )}
          
          {!historyLoading && ritualHistory && ritualHistory.length > 0 && (
            <div className="space-y-3">
              {ritualHistory.map((entry, idx) => (
                <RitualHistoryEntry 
                  key={`${entry.date}-${idx}`} 
                  entry={entry} 
                  currentUserId={currentUserId}
                />
              ))}
            </div>
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
