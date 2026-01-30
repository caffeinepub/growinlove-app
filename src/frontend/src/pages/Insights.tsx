import { Lightbulb } from 'lucide-react';

export function Insights() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
          <Lightbulb className="w-20 h-20 text-accent relative" strokeWidth={1.5} />
        </div>
        
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          Insights
        </h2>
        
        <p className="text-muted-foreground text-lg leading-relaxed">
          Discover meaningful insights about your relationship
        </p>
      </div>
    </div>
  );
}
