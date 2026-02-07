import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const screenshots = [
  {
    src: '/assets/generated/landing-screenshot-1.dim_390x844.png',
    alt: 'Daily Ritual',
    caption: 'Daily Ritual',
  },
  {
    src: '/assets/generated/landing-screenshot-2.dim_390x844.png',
    alt: 'Insights & Harmony',
    caption: 'Insights & Harmony',
  },
  {
    src: '/assets/generated/landing-screenshot-3.dim_390x844.png',
    alt: 'Love Languages',
    caption: 'Love Languages',
  },
];

export function LandingScreenshotCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart === null) return;
    setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!touchStart || !touchEnd) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative max-w-md mx-auto">
      {/* Carousel Container */}
      <div
        className="relative overflow-hidden rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => {
          setTouchStart(null);
          setTouchEnd(null);
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {screenshots.map((screenshot, index) => (
            <div key={index} className="min-w-full flex flex-col items-center p-8">
              <img
                src={screenshot.src}
                alt={screenshot.alt}
                className="w-full max-w-xs object-contain rounded-2xl shadow-2xl"
                draggable={false}
              />
              <p className="mt-6 text-lg font-semibold text-foreground">
                {screenshot.caption}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Navigation Buttons */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between px-4 pointer-events-none">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="pointer-events-auto rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          aria-label="Previous screenshot"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="pointer-events-auto rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          aria-label="Next screenshot"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-8'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to screenshot ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
