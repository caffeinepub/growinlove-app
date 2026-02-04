import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Lock, CheckCircle2, Clock, Gift, HandHeart, MessageCircle, Users, Sparkles, Crown } from 'lucide-react';
import { LoveLanguage } from '../backend';
import type { LoveLanguagesQuizResult } from '../backend';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface UnlockPacksProps {
  bothCompletedQuiz: boolean;
  currentStreak: number;
  combinedQuizState?: {
    callerResults?: LoveLanguagesQuizResult;
    partnerResults?: LoveLanguagesQuizResult;
  } | null;
  isAdmin?: boolean;
}

interface Pack {
  id: string;
  name: string;
  language: LoveLanguage;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  unlockRequirement: number; // streak days required
  activities: string[];
}

const packs: Pack[] = [
  {
    id: 'quality-time',
    name: 'Quality Time Pack',
    language: LoveLanguage.qualityTime,
    icon: <Users className="w-6 h-6" />,
    color: 'oklch(0.75 0.15 280)',
    bgColor: 'oklch(0.75 0.15 280 / 0.15)',
    unlockRequirement: 0, // Always unlocked
    activities: [
      'Plan a cozy movie night together',
      'Cook a meal together from scratch',
      'Take a sunset walk and share your day',
      'Play a board game or card game',
      'Have a deep conversation over coffee',
      'Create a shared playlist of your favorite songs',
    ],
  },
  {
    id: 'words-affirmation',
    name: 'Words of Affirmation Pack',
    language: LoveLanguage.wordsOfAffirmation,
    icon: <MessageCircle className="w-6 h-6" />,
    color: 'oklch(0.70 0.18 45)',
    bgColor: 'oklch(0.70 0.18 45 / 0.15)',
    unlockRequirement: 3,
    activities: [
      'Write a heartfelt letter to your partner',
      'Share 3 things you appreciate about them',
      'Leave surprise love notes around the house',
      'Send a thoughtful text during the day',
      'Compliment something specific they did today',
      'Record a voice message expressing your love',
    ],
  },
  {
    id: 'physical-touch',
    name: 'Physical Touch Pack',
    language: LoveLanguage.physicalTouch,
    icon: <Heart className="w-6 h-6" />,
    color: 'oklch(0.65 0.20 15)',
    bgColor: 'oklch(0.65 0.20 15 / 0.15)',
    unlockRequirement: 7,
    activities: [
      'Give your partner a relaxing massage',
      'Hold hands during a walk',
      'Cuddle while watching something together',
      'Dance together to your favorite song',
      'Give a warm, long hug for no reason',
      'Sit close together and enjoy the moment',
    ],
  },
  {
    id: 'acts-service',
    name: 'Acts of Service Pack',
    language: LoveLanguage.actsOfService,
    icon: <HandHeart className="w-6 h-6" />,
    color: 'oklch(0.68 0.16 150)',
    bgColor: 'oklch(0.68 0.16 150 / 0.15)',
    unlockRequirement: 14,
    activities: [
      'Do a chore your partner usually handles',
      'Prepare their favorite meal or snack',
      'Run an errand to help them out',
      'Organize something they\'ve been meaning to',
      'Make their morning coffee or tea',
      'Take care of a task they\'ve been dreading',
    ],
  },
  {
    id: 'receiving-gifts',
    name: 'Receiving Gifts Pack',
    language: LoveLanguage.receivingGifts,
    icon: <Gift className="w-6 h-6" />,
    color: 'oklch(0.72 0.17 340)',
    bgColor: 'oklch(0.72 0.17 340 / 0.15)',
    unlockRequirement: 21,
    activities: [
      'Pick up their favorite treat on your way home',
      'Create a handmade gift or card',
      'Surprise them with flowers or a plant',
      'Get them a book or item they mentioned wanting',
      'Frame a special photo of you together',
      'Plan a surprise date or experience',
    ],
  },
];

export function UnlockPacks({ bothCompletedQuiz, currentStreak, combinedQuizState, isAdmin = false }: UnlockPacksProps) {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  const isPackUnlocked = (pack: Pack) => {
    // Admin override: all packs unlocked
    if (isAdmin) return true;
    return currentStreak >= pack.unlockRequirement;
  };

  const getProgressToUnlock = (pack: Pack) => {
    if (isPackUnlocked(pack)) return 100;
    return Math.min(100, (currentStreak / pack.unlockRequirement) * 100);
  };

  // Get shared love languages for highlighting
  const getSharedLanguages = (): LoveLanguage[] => {
    if (!bothCompletedQuiz || !combinedQuizState?.callerResults || !combinedQuizState?.partnerResults) {
      return [];
    }

    const callerTop3 = combinedQuizState.callerResults.rankings.slice(0, 3).map(r => r.language);
    const partnerTop3 = combinedQuizState.partnerResults.rankings.slice(0, 3).map(r => r.language);

    return callerTop3.filter(lang => partnerTop3.includes(lang));
  };

  const sharedLanguages = getSharedLanguages();

  return (
    <div className="space-y-6">
      <Card className="border border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            Love Language Activity Packs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Unlock themed activity packs by maintaining your daily ritual streak! Each pack contains curated activities for different love languages.
          </p>

          {isAdmin && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Admin Access: All activity packs are unlocked for you
              </p>
            </div>
          )}

          {/* Pack Grid */}
          <div className="grid gap-4">
            {packs.map((pack) => {
              const unlocked = isPackUnlocked(pack);
              const progress = getProgressToUnlock(pack);
              const isShared = sharedLanguages.includes(pack.language);

              return (
                <div
                  key={pack.id}
                  className={`relative p-4 rounded-2xl border-2 transition-all ${
                    unlocked
                      ? 'border-opacity-30 shadow-md hover:shadow-lg cursor-pointer'
                      : 'border-border/30 opacity-60'
                  } ${isShared ? 'ring-2 ring-purple-500/30' : ''}`}
                  style={{
                    backgroundColor: unlocked ? pack.bgColor : 'oklch(var(--secondary) / 0.3)',
                    borderColor: unlocked ? pack.color : 'oklch(var(--border))',
                  }}
                  onClick={() => unlocked && setSelectedPack(pack)}
                >
                  {isShared && (
                    <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-current" />
                      Shared
                    </div>
                  )}

                  {isAdmin && !unlocked && (
                    <div className="absolute -top-2 -left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Admin
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: unlocked ? pack.color : 'oklch(var(--muted))' }}
                    >
                      {unlocked ? (
                        <div className="text-white">{pack.icon}</div>
                      ) : (
                        <Lock className="w-5 h-5 text-white" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">{pack.name}</h3>
                        {unlocked && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>

                      {!unlocked && !isAdmin && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              {pack.unlockRequirement - currentStreak} more days to unlock
                            </span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      )}

                      {unlocked && (
                        <p className="text-xs text-muted-foreground">
                          {pack.activities.length} activities • Tap to explore
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!bothCompletedQuiz && !isAdmin && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                💡 Complete the Love Languages quiz to see which packs match your shared preferences!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Pack Modal/Detail View */}
      {selectedPack && (
        <Card className="border-2 shadow-lg gentle-entrance" style={{ borderColor: selectedPack.color }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: selectedPack.color }}
                >
                  <div className="text-white">{selectedPack.icon}</div>
                </div>
                {selectedPack.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPack(null)}
                className="rounded-full"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Try these activities to strengthen your connection through {selectedPack.name.replace(' Pack', '')}:
            </p>

            <div className="space-y-3">
              {selectedPack.activities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                    style={{ backgroundColor: selectedPack.color }}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-sm text-foreground flex-1 pt-1">{activity}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
              <p className="text-sm text-foreground">
                💕 These activities are designed to help you express love in ways that resonate most with your partner!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
