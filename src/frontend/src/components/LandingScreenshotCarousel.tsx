import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const screenshots = [
  {
    src: '/assets/generated/landing-screenshot-1.dim_390x844.jpg',
    alt: 'Daily Ritual',
    caption: 'Daily Ritual',
  },
  {
    src: '/assets/generated/landing-screenshot-2.dim_390x844.jpg',
    alt: 'Insights & Harmony',
    caption: 'Insights & Harmony',
  },
  {
    src: '/assets/generated/landing-screenshot-3.dim_390x844.jpg',
    alt: 'Love Languages',
    caption: 'Love Languages',
  },
  {
    src: '/assets/generated/landing-screenshot-4.dim_390x844.jpg',
    alt: 'Memories',
    caption: 'Memories',
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
    <div className="relative max-w-5xl mx-auto">
      {/* Desktop navigation buttons */}
      <div className="hidden md:block">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          aria-label="Previous screenshot"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          aria-label="Next screenshot"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Carousel container */}
      <div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/20 to-peach/20 p-8 md:p-12 cursor-grab active:cursor-grabbing select-none"
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
        <div className="flex justify-center items-center min-h-[500px] md:min-h-[600px]">
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.src}
              className={`absolute transition-all duration-500 ease-in-out ${
                index === currentIndex
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-95 z-0'
              }`}
            >
              <div className="relative">
                {/* Phone frame mockup */}
                <div className="relative aspect-[390/844] w-[280px] md:w-[320px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
                  <div className="relative w-full h-full bg-black rounded-[2rem] overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl z-10" />
                    
                    {/* Screenshot */}
                    <img
                      src={screenshot.src}
                      alt={screenshot.alt}
                      className="w-full h-full object-cover"
                      draggable="false"
                    />
                  </div>
                </div>
                
                {/* Caption */}
                <p className="text-center mt-4 text-lg font-semibold text-foreground">
                  {screenshot.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
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
