import { useState } from 'react';
import { landingScreenshots } from '../content/landingScreenshots';

export function LandingHeroScreenshotShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      {/* Phone mockup container */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
        
        {/* Screen */}
        <div className="relative bg-white dark:bg-gray-950 rounded-[2rem] overflow-hidden aspect-[390/844]">
          <img
            src={landingScreenshots[currentIndex].image}
            alt={landingScreenshots[currentIndex].caption}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {landingScreenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-romantic-primary w-6'
                : 'bg-romantic-primary/30 hover:bg-romantic-primary/50'
            }`}
            aria-label={`View screenshot ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
