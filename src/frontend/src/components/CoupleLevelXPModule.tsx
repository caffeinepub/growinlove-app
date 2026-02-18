import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp } from 'lucide-react';
import { useGetInsightsData } from '../hooks/useQueries';
import { calculateCoupleLevel, getLevelLabel } from '../utils/coupleLevel';
import { LoadingState } from './DataStates';

export function CoupleLevelXPModule() {
  const { data: insightsData, isLoading } = useGetInsightsData();

  const levelData = calculateCoupleLevel(insightsData);
  const levelLabel = getLevelLabel(levelData.level);

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-4">
          <LoadingState message="Loading couple level..." size="sm" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-transparent gentle-entrance">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <Heart className="w-5 h-5 fill-primary" />
              Couple Level
            </h3>
            <p className="text-sm text-muted-foreground">{levelLabel}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{levelData.level}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={levelData.progressPercent} className="h-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {levelData.currentXP} / {levelData.nextLevelXP} XP
            </span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{levelData.nextLevelXP - levelData.currentXP} XP to Level {levelData.level + 1}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
