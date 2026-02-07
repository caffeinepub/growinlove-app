# Specification

## Summary
**Goal:** Add a public, blush-themed marketing landing page for GrowInLove that replaces the unauthenticated login-only screen, while keeping the authenticated in-app experience unchanged.

**Planned changes:**
- Render a new single-page marketing landing page for unauthenticated visitors; keep the existing tab-based app shell unchanged for authenticated users.
- Implement landing page sections per approved wireframe: header (new logo/wordmark + light/dark toggle), hero (tree-inspired branding), benefit trio, product screenshot carousel, founder story, privacy reassurance, optional feature deep-dives, final CTA, and footer (no testimonials/social proof).
- Add a primary CTA that deterministically enters the app experience (same deployment) without adding a router, plus a secondary sign-in CTA that triggers existing Internet Identity login behavior.
- Apply a consistent blush/cream romantic aesthetic that works in both light and dark modes using the existing theme system.
- Add a footer with labeled links: About, Contact, Terms, Privacy, and “Interested in supporting our growth?”, each navigating to an on-page section or opening a simple on-page modal/sheet (no dead links).
- Build a static, responsive product screenshot carousel using bundled frontend assets with swipe on mobile and next/prev controls on desktop.
- Generate and use new landing-page-only branding assets (inspired by the uploaded tree-and-hearts image) for the header and hero; do not change in-app logo usage.

**User-visible outcome:** Unauthenticated visitors see a complete, responsive marketing landing page with clear CTAs, a screenshot carousel, and footer navigation; authenticated users continue to see the existing in-app UI unchanged.
