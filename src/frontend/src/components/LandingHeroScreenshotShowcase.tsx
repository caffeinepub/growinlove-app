import { heroScreenshot } from '@/content/landingScreenshots';

export function LandingHeroScreenshotShowcase() {
  return (
    <div className="relative w-64 md:w-80 lg:w-96 mx-auto">
      {/* Phone mockup frame */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
        
        {/* Screen */}
        <div className="relative bg-white dark:bg-gray-950 rounded-[2rem] overflow-hidden aspect-[9/19.5] flex items-center justify-center">
          <img
            src={heroScreenshot.image}
            alt={heroScreenshot.caption}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
