import { useState, useEffect } from 'react';
import { Heart, CheckCircle2, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetCompletedChallengeIds, useMarkChallengeComplete } from '../hooks/useQueries';
import { LoadingState } from './DataStates';
import { LoveLanguage } from '../backend';

interface LoveChallenge {
  id: number;
  title: string;
  description: string;
  loveLanguage: LoveLanguage;
}

const challengeTemplates: LoveChallenge[] = [
  { id: 1, title: 'Daily Affirmation', description: 'Share three things you appreciate about your partner today', loveLanguage: LoveLanguage.wordsOfAffirmation },
  { id: 2, title: 'Love Letter', description: 'Write a heartfelt note expressing your feelings', loveLanguage: LoveLanguage.wordsOfAffirmation },
  { id: 3, title: 'Compliment Challenge', description: 'Give your partner five genuine compliments throughout the day', loveLanguage: LoveLanguage.wordsOfAffirmation },
  { id: 4, title: 'Uninterrupted Time', description: 'Spend 30 minutes together without phones or distractions', loveLanguage: LoveLanguage.qualityTime },
  { id: 5, title: 'Shared Activity', description: 'Plan and do a fun activity together that you both enjoy', loveLanguage: LoveLanguage.qualityTime },
  { id: 6, title: 'Deep Conversation', description: 'Have a meaningful conversation about your dreams and goals', loveLanguage: LoveLanguage.qualityTime },
  { id: 7, title: 'Cuddle Time', description: 'Spend 15 minutes cuddling and being close', loveLanguage: LoveLanguage.physicalTouch },
  { id: 8, title: 'Massage Exchange', description: 'Give each other relaxing shoulder or foot massages', loveLanguage: LoveLanguage.physicalTouch },
  { id: 9, title: 'Hand Holding', description: 'Hold hands during a walk or while watching something together', loveLanguage: LoveLanguage.physicalTouch },
  { id: 10, title: 'Helpful Gesture', description: 'Do a chore or task your partner usually handles', loveLanguage: LoveLanguage.actsOfService },
  { id: 11, title: 'Surprise Help', description: 'Complete something on your partner\'s to-do list without being asked', loveLanguage: LoveLanguage.actsOfService },
  { id: 12, title: 'Breakfast in Bed', description: 'Prepare a special meal or treat for your partner', loveLanguage: LoveLanguage.actsOfService },
  { id: 13, title: 'Thoughtful Surprise', description: 'Give your partner a small, meaningful gift', loveLanguage: LoveLanguage.receivingGifts },
  { id: 14, title: 'Love Token', description: 'Create or find something that represents your relationship', loveLanguage: LoveLanguage.receivingGifts },
  { id: 15, title: 'Favorite Treat', description: 'Surprise your partner with their favorite snack or item', loveLanguage: LoveLanguage.receivingGifts },
];

const loveLanguageColors: Record<LoveLanguage, { bg: string; text: string; border: string }> = {
  [LoveLanguage.wordsOfAffirmation]: { bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/20' },
  [LoveLanguage.qualityTime]: { bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500/20' },
  [LoveLanguage.physicalTouch]: { bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-500/20' },
  [LoveLanguage.actsOfService]: { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', border: 'border-green-500/20' },
  [LoveLanguage.receivingGifts]: { bg: 'bg-pink-500/10', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-500/20' },
};

const loveLanguageLabels: Record<LoveLanguage, string> = {
  [LoveLanguage.wordsOfAffirmation]: 'Words of Affirmation',
  [LoveLanguage.qualityTime]: 'Quality Time',
  [LoveLanguage.physicalTouch]: 'Physical Touch',
  [LoveLanguage.actsOfService]: 'Acts of Service',
  [LoveLanguage.receivingGifts]: 'Receiving Gifts',
};

export function LoveChallenges() {
  const { data: completedIds, isLoading } = useGetCompletedChallengeIds();
  const markComplete = useMarkChallengeComplete();
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  const completedSet = new Set(completedIds?.map(id => Number(id)) || []);

  const handleComplete = async (challengeId: number) => {
    try {
      setAnimatingId(challengeId);
      await markComplete.mutateAsync(challengeId);
      setTimeout(() => setAnimatingId(null), 1500);
    } catch (err) {
      console.error('Failed to mark challenge complete:', err);
      setAnimatingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <LoadingState message="Loading love challenges..." size="sm" />
        </CardContent>
      </Card>
    );
  }

  const completedCount = completedSet.size;
  const totalCount = challengeTemplates.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <Card className="border-2 border-primary/20 shadow-lg gentle-entrance">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-primary">
          <Heart className="w-6 h-6" fill="currentColor" />
          💞 Love Challenges
        </CardTitle>
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-primary">
              {completedCount} / {totalCount}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground pb-2">
          Complete these challenges to strengthen your bond and explore different love languages together!
        </p>

        <div className="space-y-2">
          {challengeTemplates.map((challenge) => {
            const isCompleted = completedSet.has(challenge.id);
            const isAnimating = animatingId === challenge.id;
            const colors = loveLanguageColors[challenge.loveLanguage];

            return (
              <div
                key={challenge.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary/5 border-primary/20 opacity-75'
                    : `${colors.bg} ${colors.border}`
                } ${isAnimating ? 'scale-105 shadow-lg' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-foreground">
                        {challenge.title}
                      </h3>
                      <Badge variant="outline" className={`text-xs ${colors.text} ${colors.border}`}>
                        {loveLanguageLabels[challenge.loveLanguage]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  {isCompleted ? (
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleComplete(challenge.id)}
                      disabled={markComplete.isPending}
                      className="flex-shrink-0 bg-accent hover:bg-accent/90"
                    >
                      {markComplete.isPending && animatingId === challenge.id ? (
                        <Sparkles className="w-4 h-4 animate-spin" />
                      ) : (
                        <Target className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>

                {isAnimating && (
                  <div className="mt-2 text-center">
                    <span className="text-xs font-semibold text-primary animate-pulse">
                      ✨ Challenge completed! ✨
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {completedCount === totalCount && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-primary/30 text-center">
            <p className="text-sm font-semibold text-primary flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Amazing! You've completed all love challenges!
              <Sparkles className="w-4 h-4" />
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
