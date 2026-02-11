import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    image: '/assets/IMG_1322.png',
    caption: 'Your Love Story',
  },
  {
    image: '/assets/IMG_1323.png',
    caption: 'Daily Rituals',
  },
  {
    image: '/assets/IMG_1324.png',
    caption: 'Shared Insights',
  },
];

export function LandingScreenshotCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-4">
        {/* Previous button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="shrink-0 hover:bg-romantic-primary/10 text-foreground"
          aria-label="Previous screenshot"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Phone mockup with screenshot */}
        <div className="relative w-full max-w-[280px]">
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
            
            {/* Screen */}
            <div className="relative bg-white dark:bg-gray-950 rounded-[2rem] overflow-hidden aspect-[390/844]">
              <img
                src={slides[currentIndex].image}
                alt={slides[currentIndex].caption}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Caption */}
          <p className="text-center mt-3 text-sm font-medium text-foreground">
            {slides[currentIndex].caption}
          </p>
        </div>

        {/* Next button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="shrink-0 hover:bg-romantic-primary/10 text-foreground"
          aria-label="Next screenshot"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-romantic-primary w-6'
                : 'bg-romantic-primary/30 hover:bg-romantic-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
