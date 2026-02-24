import { Heart, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OurLoveLanguagesCardProps {
  subtitle: string;
  statusLine: string;
  primaryButtonLabel: string;
  onPrimaryAction: () => void;
  onInsightsShortcut: () => void;
  highlightOnce?: boolean;
  isLoading?: boolean;
}

export function OurLoveLanguagesCard({
  subtitle,
  statusLine,
  primaryButtonLabel,
  onPrimaryAction,
  onInsightsShortcut,
  highlightOnce = false,
  isLoading = false,
}: OurLoveLanguagesCardProps) {
  return (
    <Card 
      className={`border-2 border-primary/30 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 cursor-pointer transition-all hover:shadow-xl hover:border-primary/50 ${
        highlightOnce ? 'animate-love-languages-highlight' : ''
      }`}
      onClick={onPrimaryAction}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Heart className="w-5 h-5 text-primary fill-primary" />
          Our Love Languages
        </CardTitle>
        <CardDescription className="text-base">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status line */}
        <div className="bg-secondary/30 rounded-lg px-4 py-2">
          <p className="text-sm font-medium text-muted-foreground text-center">
            {statusLine}
          </p>
        </div>

        {/* Primary action button */}
        <Button
          className="w-full rounded-xl h-12 gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onPrimaryAction();
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              {primaryButtonLabel}
            </>
          )}
        </Button>

        {/* Secondary link to Insights */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInsightsShortcut();
          }}
          className="w-full text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 py-2"
        >
          See how this shows up in your Insights
          <ArrowRight className="w-4 h-4" />
        </button>
      </CardContent>
    </Card>
  );
}
