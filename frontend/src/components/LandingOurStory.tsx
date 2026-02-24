import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { founderStory } from '@/content/founderStory';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function LandingOurStory() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const paragraphs = founderStory.split('\n\n');
  const previewParagraphs = paragraphs.slice(0, 3);
  const fullParagraphs = paragraphs;

  return (
    <div className="space-y-4">
      <div className="prose prose-lg mx-auto text-muted-foreground space-y-4 text-left">
        {(isExpanded ? fullParagraphs : previewParagraphs).map((paragraph, index) => (
          <p key={index} className="leading-relaxed text-sm md:text-base">
            {paragraph}
          </p>
        ))}
      </div>
      
      <div className="flex justify-center pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-romantic-primary hover:text-romantic-primary/80 hover:bg-romantic-primary/10"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Read less' : 'Read more'}
        >
          {isExpanded ? (
            <>
              Read less <ChevronUp className="ml-2 w-4 h-4" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
