// Shared landing screenshot configuration for both hero and carousel
export interface LandingScreenshot {
  image: string;
  caption: string;
}

// Hero screenshot (first entry is used by LandingHeroScreenshotShowcase)
export const heroScreenshot: LandingScreenshot = {
  image: '/assets/generated/hero-daily-ritual.dim_375x667.png',
  caption: 'Daily Ritual',
};

// Carousel screenshots (used by LandingScreenshotCarousel)
export const carouselScreenshots: LandingScreenshot[] = [
  {
    image: '/assets/generated/carousel-shared-insights.dim_375x667.png',
    caption: 'Shared Insights',
  },
  {
    image: '/assets/generated/carousel-love-story.dim_375x667.png',
    caption: 'Love Story',
  },
  {
    image: '/assets/generated/carousel-daily-ritual.dim_375x667.png',
    caption: 'Daily Ritual',
  },
  {
    image: '/assets/generated/carousel-growing-together.dim_375x667.png',
    caption: 'Growing Together',
  },
];

// Legacy export for backward compatibility
export const landingScreenshots: LandingScreenshot[] = [
  heroScreenshot,
  ...carouselScreenshots,
];
