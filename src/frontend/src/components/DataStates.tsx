import { Loader2, AlertCircle, Heart, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Loading State Component
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16';
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';
  
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className={`${iconSize} text-primary animate-spin`} />
      <p className={`${textSize} text-muted-foreground`}>{message}</p>
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 space-y-4 text-center">
      <div className="glow-pulse inline-block">
        {icon || <Heart className="w-16 h-16 text-primary/40 fill-primary/40" />}
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-4 rounded-2xl"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Error State Component
interface ErrorStateProps {
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message, 
  details,
  onRetry,
  retryLabel = 'Try Again'
}: ErrorStateProps) {
  return (
    <Card className="border-2 border-destructive/30 bg-destructive/5">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
            {details && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">Technical details</summary>
                <p className="mt-2 p-2 rounded bg-secondary/30 font-mono">{details}</p>
              </details>
            )}
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-2"
                onClick={onRetry}
              >
                <RefreshCw className="w-4 h-4" />
                {retryLabel}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Section Header Component
interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-bold text-primary tracking-tight">{title}</h2>
      </div>
      {description && (
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}

// Inline Loading Indicator (for lists/panels)
export function InlineLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <Loader2 className="w-5 h-5 text-primary animate-spin" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}

// Inline Empty State (for lists/panels)
interface InlineEmptyProps {
  message: string;
  icon?: React.ReactNode;
}

export function InlineEmpty({ message, icon }: InlineEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      {icon || <Heart className="w-10 h-10 text-primary/30 fill-primary/30" />}
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  );
}
