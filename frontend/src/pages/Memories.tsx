import { useState } from 'react';
import { Heart, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetRitualHistory, useGetCallerUserProfile, useGetPhoto } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoveLanguage } from '../backend';
import type { RitualEntryView } from '../hooks/useQueries';

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
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Memory Entry Component
function MemoryEntry({ entry, currentUserId }: { entry: RitualEntryView; currentUserId: string | undefined }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const loveLanguageFocus = mapLoveLanguageToDisplay(entry.loveLanguageFocus);
  
  return (
    <Card className="border-2 border-primary/10 hover:border-primary/20 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{loveLanguageFocus.emoji}</span>
              <span>{formatDate(entry.date)}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{loveLanguageFocus.name}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Prompt */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-sm font-semibold text-primary mb-1">Prompt</p>
          <p className="text-sm text-foreground leading-relaxed">{entry.prompt.text}</p>
        </div>
        
        {/* Responses */}
        {isExpanded && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm font-semibold text-primary">Responses</p>
            {entry.responses.map((response, idx) => (
              <ResponseWithPhoto
                key={idx}
                response={response}
                currentUserId={currentUserId}
              />
            ))}
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
    <div className="p-4 rounded-lg bg-secondary/30 border border-primary/10 space-y-2">
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
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{response.text}</p>
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
            alt="Memory photo" 
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}

export function Memories() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const [limit, setLimit] = useState(10);
  const { data: ritualHistory = [], isLoading } = useGetRitualHistory(limit);

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;
  const currentUserId = identity?.getPrincipal().toString();

  const handleLoadMore = () => {
    setLimit(prev => prev + 10);
  };

  if (!isAuthenticated || !isPaired) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <Calendar className="w-20 h-20 text-primary mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Your Love Story</h2>
              <p className="text-muted-foreground">
                {!isAuthenticated
                  ? 'Please log in to view your memories'
                  : 'Connect with your partner to start creating memories'}
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
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Calendar className="w-8 h-8" />
          Your Love Story
        </h1>
        <p className="text-muted-foreground">Relive your special moments together</p>
      </div>

      {/* Memories List */}
      {isLoading && ritualHistory.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : ritualHistory.length === 0 ? (
        <Card className="border-2 border-primary/20">
          <CardContent className="p-12 text-center space-y-4">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">No Memories Yet</h3>
              <p className="text-muted-foreground">
                Start completing daily rituals to create your love story
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ritualHistory.map((entry, idx) => (
            <MemoryEntry key={idx} entry={entry} currentUserId={currentUserId} />
          ))}
          
          {ritualHistory.length >= limit && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
