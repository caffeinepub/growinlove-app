import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export function LoveLanguages() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isPaired = !!userProfile?.partnerId;

  if (!isAuthenticated) {
    return (
      <div className="min-h-full flex items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <Heart className="w-16 h-16 text-primary fill-primary mx-auto" />
            <h2 className="text-2xl font-bold text-primary">Welcome to GrowInLove</h2>
            <p className="text-muted-foreground">
              Please log in to discover your love languages
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
                To discover your love languages together, please connect with your partner in the <span className="font-semibold text-primary">Us</span> tab
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

  return (
    <div className="min-h-full px-6 py-8 space-y-8 stagger-entrance">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-primary tracking-tight">
          Our Love Languages
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Discover how you both feel most loved
        </p>
      </div>

      {/* Central Content Card */}
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-card via-card to-secondary/10 overflow-hidden relative max-w-2xl mx-auto">
        {/* Decorative floating hearts */}
        <div className="absolute top-4 right-4 text-primary/20 float-heart">
          <Heart className="w-6 h-6" fill="currentColor" />
        </div>
        <div className="absolute bottom-8 left-6 text-primary/15 float-heart-delayed">
          <Heart className="w-5 h-5" fill="currentColor" />
        </div>

        <CardContent className="p-8 space-y-6">
          {/* Illustration */}
          <div className="flex justify-center">
            <img 
              src="/assets/generated/two-curious-doges.dim_400x300.png" 
              alt="Two curious doges" 
              className="w-full max-w-sm h-auto rounded-2xl"
            />
          </div>

          {/* Description */}
          <div className="space-y-4 text-center">
            <p className="text-base text-muted-foreground leading-relaxed">
              Understanding each other's love language helps you express love in ways that truly resonate. 
              Take this quick quiz together to discover what makes each of you feel most cherished.
            </p>
            
            <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                <Sparkles className="w-5 h-5" />
                <span>What to Expect</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✨ 5–7 minutes to complete</li>
                <li>💕 Both partners answer separately</li>
                <li>🔄 Results sync instantly</li>
                <li>💖 Personalized insights for your relationship</li>
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            className="w-full rounded-2xl h-14 text-lg font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-primary hover:bg-primary/90"
            disabled
          >
            <Heart className="w-5 h-5 mr-2" />
            Start the Quiz (Coming Soon)
          </Button>

          {/* Supporting Note */}
          <p className="text-sm text-muted-foreground text-center">
            Both partners answer separately → results sync instantly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
