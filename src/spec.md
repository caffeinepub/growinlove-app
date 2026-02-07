# Specification

## Summary
**Goal:** Refresh the marketing landing page by swapping in the 4 uploaded app screenshots, aligning landing branding to the tree-and-hearts logo style, updating the favicon, and fixing the theme toggle behavior.

**Planned changes:**
- Replace the landing screenshot carousel images with the 4 uploaded screenshots (IMG_1297.jpeg, IMG_1298.jpeg, IMG_1299.jpeg, IMG_1300.jpeg), removing all existing carousel images and ensuring 4-slide navigation (swipe, next/prev, dots).
- Redesign the landing hero section to feature the 4 uploaded screenshots in a clean device-frame style carousel/presentation, replacing the current hero illustration while keeping the existing hero headline, subheadline, and CTA.
- Ensure the uploaded screenshots are only referenced by landing-related components and not used elsewhere in the app.
- Update landing branding imagery so the header logo, footer logo, and any other landing brand marks use consistent artwork aligned to the tree-and-hearts inspiration.
- Update the browser favicon/app icon to match the landing logo style and reference it from the static frontend HTML.
- Fix the landing light/dark mode toggle so theme changes apply immediately and persist across refresh, including landing gradients and card backgrounds.
- Store the 4 screenshots as static frontend assets and load them via direct `/assets/...` URLs (no backend changes).

**User-visible outcome:** The landing page shows a polished hero and carousel featuring the 4 new screenshots, consistent tree-and-hearts branding (including favicon), and a working theme toggle that persists across refresh.
