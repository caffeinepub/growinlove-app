// Shared landing screenshot configuration for both hero and carousel
export interface LandingScreenshot {
  image: string;
  caption: string;
}

export const landingScreenshots: LandingScreenshot[] = [
  {
    image: '/assets/generated/landing-screenshot-1.dim_390x844.png',
    caption: 'Your Love Story',
  },
  {
    image: '/assets/generated/landing-screenshot-2.dim_390x844.png',
    caption: 'Daily Rituals',
  },
  {
    image: '/assets/generated/landing-screenshot-3.dim_390x844.png',
    caption: 'Shared Insights',
  },
  {
    image: '/assets/generated/landing-screenshot-4.dim_390x844.jpg',
    caption: 'Growing Together',
  },
];
