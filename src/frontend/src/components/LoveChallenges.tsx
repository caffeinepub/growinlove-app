import { Heart, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LoveChallenges() {
  return (
    <Card className="border-2 border-primary/20 shadow-lg gentle-entrance">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-primary">
          <Heart className="w-6 h-6" fill="currentColor" />
          💞 Love Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8 space-y-2">
          <Sparkles className="w-12 h-12 text-accent mx-auto glow-pulse" />
          <p className="text-muted-foreground">New challenges coming soon! 💞</p>
          <p className="text-sm text-muted-foreground/70">
            We're preparing exciting love challenges for you and your partner
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
