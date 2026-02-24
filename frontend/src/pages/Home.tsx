import { Heart, Smile, Image, Mic, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';
import { useGetDailyRitual, useSubmitRitualResponse, useGetCallerUserProfile, useUploadPhoto, useGetRitualHistory, useGetRitualStatus, useGetInsightsData, useGetPhoto } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoveLanguage } from '../backend';
import type { RitualEntryView } from '../hooks/useQueries';
import { CompletionAnimation } from '../components/CompletionAnimation';
import { ExternalBlob } from '../backend';

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
      
      {/* Modal for Full Details - REQ-5: Force opaque background */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-card border-2 border-border shadow-2xl">
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
      {response.photoId && photoLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      {response.photoId && photo && (
        <div className="rounded-lg overflow-hidden border border-primary/10">
          <img 
            src={photo.blob.getDirectURL()} 
            alt="Ritual photo" 
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}

export function Home() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: dailyRitual } = useGetDailyRitual();
  const { data: ritualStatus } = useGetRitualStatus();
  const { data: insightsData } = useGetInsightsData();
  const { data: ritualHistory = [] } = useGetRitualHistory(5);
  const submitResponse = useSubmitRitualResponse();
  const uploadPhoto = useUploadPhoto();

  const [responseText, setResponseText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;
  const currentUserId = identity?.getPrincipal().toString();

  // Filter out today's entry from history
  const historyWithoutToday = ritualHistory.filter(entry => !isToday(entry.date));

  const emojis = ['❤️', '😊', '🥰', '💕', '✨', '🌟', '💖', '🎉'];

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji === selectedEmoji ? '' : emoji);
  };

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!responseText.trim() && !selectedEmoji && !photoFile) return;

    setIsSubmitting(true);

    try {
      let photoId: string | undefined;

      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array);
        photoId = await uploadPhoto.mutateAsync({ blob, name: photoFile.name });
      }

      await submitResponse.mutateAsync({
        text: responseText.trim() || undefined,
        emoji: selectedEmoji || undefined,
        photoId,
      });

      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2500);

      setResponseText('');
      setSelectedEmoji('');
      setPhotoFile(null);
      setPhotoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to submit ritual response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStreak = insightsData ? Number(insightsData.currentStreak) : 0;

  if (!isAuthenticated || !isPaired) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <Heart className="w-20 h-20 text-primary mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Welcome to GrowInLove</h2>
              <p className="text-muted-foreground">
                {!isAuthenticated
                  ? 'Please log in to start your daily ritual'
                  : 'Connect with your partner in the Us tab to begin'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-full px-6 py-8 space-y-6 relative">
      {showAnimation && <CompletionAnimation />}

      {/* Daily Ritual Card */}
      <Card className="border-2 border-primary/20 shadow-lg gentle-entrance">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-primary">Today's Ritual</h2>
            <p className="text-muted-foreground">Share your thoughts with your partner</p>
          </div>

          {dailyRitual && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <p className="text-lg text-foreground leading-relaxed text-center">
                {dailyRitual.text}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
            />

            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-primary/20 scale-110'
                      : 'bg-secondary/30 hover:bg-secondary/50'
                  }`}
                  disabled={isSubmitting}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {photoPreview && (
              <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
                <img src={photoPreview} alt="Preview" className="w-full h-auto" />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
                disabled={isSubmitting}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="flex-1"
              >
                <Image className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || (!responseText.trim() && !selectedEmoji && !photoFile)}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>

          {ritualStatus && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-semibold text-primary">
                  {ritualStatus.partnerAComplete && ritualStatus.partnerBComplete
                    ? 'Both Complete ✓'
                    : 'Waiting for partner...'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent History */}
      {historyWithoutToday.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-primary">Recent Rituals</h3>
          <div className="space-y-2">
            {historyWithoutToday.map((entry, idx) => (
              <RitualHistoryEntry key={idx} entry={entry} currentUserId={currentUserId} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
