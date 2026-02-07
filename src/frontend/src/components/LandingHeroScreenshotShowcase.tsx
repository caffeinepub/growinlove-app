import { useState, useEffect } from 'react';

const screenshots = [
  '/assets/generated/landing-screenshot-1.dim_390x844.jpg',
  '/assets/generated/landing-screenshot-2.dim_390x844.jpg',
  '/assets/generated/landing-screenshot-3.dim_390x844.jpg',
  '/assets/generated/landing-screenshot-4.dim_390x844.jpg',
];

export function LandingHeroScreenshotShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Phone frame mockup */}
      <div className="relative aspect-[390/844] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Screen bezel */}
        <div className="relative w-full h-full bg-black rounded-[2.5rem] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
          
          {/* Screenshot carousel */}
          <div className="relative w-full h-full">
            {screenshots.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`App screenshot ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Carousel dots */}
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
