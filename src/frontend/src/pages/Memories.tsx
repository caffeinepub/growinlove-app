import { useState } from 'react';
import { Heart, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile, useGetRitualHistory, useGetPhoto } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoveLanguage, RitualEntryView } from '../backend';

// Map backend enum to UI display
const mapLoveLanguageToDisplay = (language: LoveLanguage | undefined): { name: string; emoji: string } => {
  if (!language) return { name: 'Connection', emoji: '💞' };
  
  const mapping: Record<LoveLanguage, { name: string; emoji: string }> = {
    [LoveLanguage.wordsOfAffirmation]: { name: 'Words of Affirmation', emoji: '💬' },
    [LoveLanguage.qualityTime]: { name: 'Quality Time', emoji: '⏰' },
    [LoveLanguage.receivingGifts]: { name: 'Receiving Gifts', emoji: '🎁' },
    [LoveLanguage.actsOfService]: { name: 'Acts of Service', emoji: '🤝' },
    [LoveLanguage.physicalTouch]: { name: 'Physical Touch', emoji: '🤗' },
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
  
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Memory Entry Component
function MemoryEntry({ entry, currentUserId }: { entry: RitualEntryView; currentUserId: string | undefined }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const loveLanguageFocus = mapLoveLanguageToDisplay(entry.loveLanguageFocus);
  
  return (
    <Card className="border-2 border-primary/10 hover:border-primary/20 transition-all shadow-sm hover:shadow-md">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-primary">
                {formatDate(entry.date)}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <span className="text-base">{loveLanguageFocus.emoji}</span>
                <span className="text-sm text-muted-foreground">{loveLanguageFocus.name}</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        {/* Prompt */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
          <p className="text-sm font-semibold text-primary mb-2">Ritual Prompt</p>
          <p className="text-base text-foreground leading-relaxed">{entry.prompt.text}</p>
        </div>
        
        {/* Responses - Always visible or expandable */}
        {isExpanded && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm font-semibold text-primary">Your Responses</p>
            {entry.responses.map((response, idx) => (
              <ResponseWithPhoto
                key={idx}
                response={response}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
        
        {!isExpanded && entry.responses.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>{entry.responses.length} {entry.responses.length === 1 ? 'response' : 'responses'}</span>
          </div>
        )}
      </CardContent>
    </Card>
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
              alt="Memory photo" 
              className="w-full h-auto max-h-96 object-cover rounded-xl border border-primary/10"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

export function Memories() {
  const [loadLimit, setLoadLimit] = useState(10);
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: ritualHistory, isLoading: historyLoading } = useGetRitualHistory(loadLimit);

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;
  const currentUserId = identity?.getPrincipal().toString();

  const handleLoadMore = () => {
    setLoadLimit(prev => prev + 10);
  };

  // Calculate if we should show loading state - avoid type narrowing issues
  const historyLength = ritualHistory?.length ?? 0;
  const showLoadingState = historyLoading && historyLength === 0;
  const showEmptyState = !historyLoading && historyLength === 0;
  const showMemoryList = historyLength > 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="w-16 h-16 text-primary fill-primary mx-auto" />
            <h2 className="text-2xl font-bold text-primary">Welcome to Memories</h2>
            <p className="text-muted-foreground">
              Please log in to view your shared memories
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
              <h2 className="text-2xl font-bold text-primary">Connect to Create Memories</h2>
              <p className="text-muted-foreground leading-relaxed">
                To view your shared memories, please connect with your partner in the <span className="font-semibold text-primary">Us</span> tab
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-full px-6 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
          <Heart className="w-16 h-16 text-accent mx-auto relative fill-accent" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Your Love Story
        </h1>
        <p className="text-muted-foreground text-base">
          A collection of your shared moments together
        </p>
      </div>

      {/* Loading State */}
      {showLoadingState && (
        <div className="text-center py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your memories...</p>
        </div>
      )}

      {/* Empty State */}
      {showEmptyState && (
        <div className="text-center py-16 space-y-4">
          <div className="glow-pulse inline-block">
            <Heart className="w-16 h-16 text-primary/40 fill-primary/40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">No Memories Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start completing daily rituals together to build your love story. Each ritual becomes a cherished memory! 💕
            </p>
          </div>
        </div>
      )}

      {/* Memory List - Step 2A: Now supports multi-day entries with newest-first ordering */}
      {showMemoryList && ritualHistory && (
        <div className="space-y-4">
          {ritualHistory.map((entry, idx) => (
            <MemoryEntry 
              key={`${entry.date}-${idx}`} 
              entry={entry} 
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {/* Load More Button - Step 2A: Continues to work with limit-based fetching */}
      {showMemoryList && historyLength >= loadLimit && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={historyLoading}
            className="rounded-full px-8"
          >
            {historyLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Memories'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
