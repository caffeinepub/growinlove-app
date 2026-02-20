import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { carouselScreenshots } from '@/content/landingScreenshots';

export function LandingScreenshotCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselScreenshots.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselScreenshots.length) % carouselScreenshots.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselScreenshots.length);
  };

  return (
    <div className="relative max-w-md mx-auto">
      {/* Phone mockup frame */}
      <div className="relative w-64 md:w-80 lg:w-96 mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
        
        {/* Screen */}
        <div className="relative bg-white dark:bg-gray-950 rounded-[2rem] overflow-hidden aspect-[9/19.5] flex items-center justify-center">
          <img
            src={carouselScreenshots[currentIndex].image}
            alt={carouselScreenshots[currentIndex].caption}
            className="w-full h-full object-contain transition-opacity duration-500"
          />
        </div>
      </div>

      {/* Caption */}
      <div className="text-center mt-6">
        <p className="text-sm font-medium text-muted-foreground">
          {carouselScreenshots[currentIndex].caption}
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="pointer-events-auto rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="pointer-events-auto rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {carouselScreenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-romantic-primary w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to screenshot ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
