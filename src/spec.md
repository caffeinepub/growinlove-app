# Specification

## Summary
**Goal:** Fix the landing-page hero phone mockup to show the correct GrowInLove screenshot, and prevent the app from getting stuck on an infinite loading spinner after Internet Identity login.

**Planned changes:**
- Update the landing hero phone mockup (frontend/src/components/LandingHeroScreenshotShowcase.tsx) to use the user-selected GrowInLove screenshot instead of the FunnAI Game Nest screen, matching the carousel’s crop/fit behavior for consistent presentation.
- Fix the post–Internet Identity login initialization/profile-loading flow so the app transitions into a usable state; if profile loading fails, show an English error state with a “Retry” action instead of an infinite spinner (frontend/src/App.tsx).

**User-visible outcome:** The landing hero phone mockup shows the correct GrowInLove screen, and after logging in with Internet Identity (from either login entry point) the app opens normally or shows a clear retryable error rather than spinning forever.
