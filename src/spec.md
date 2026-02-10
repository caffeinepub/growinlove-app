# Specification

## Summary
**Goal:** Apply a small, landing-only set of UI corrections to improve mobile spacing, fix brand/logo rendering in header/footer, ensure landing screenshots fit correctly, add “Read more/less” to the Our Story section, and tidy/polish features accordion and footer behavior.

**Planned changes:**
- Fix header and footer brand/logo rendering so the GrowInLove tree logo never shows a broken-image placeholder; keep the brand block aligned across mobile/desktop and provide a text fallback if the asset fails to load.
- Reduce excessive vertical spacing on mobile across key landing sections (hero, benefits, carousel header, story, privacy, final CTA, footer) while preserving readability and avoiding horizontal overflow.
- Adjust hero phone showcase and screenshot carousel to preserve screenshot aspect ratios and prevent noticeable cropping of important UI; keep mockups centered and balanced on mobile/desktop.
- Update “Our Story” to show a truncated preview by default with accessible “Read more” / “Read less” expand/collapse behavior.
- Polish the “Explore the features” accordion to clearly indicate open/closed state (e.g., chevron rotation), keep spacing compact on mobile, and avoid jumpy/overflowing transitions.
- Clean up footer layout on mobile, remove any duplicated/misaligned branding, and implement a working Contact action that exposes a functional mailto email link.
- Keep changes limited to landing-related files/components only; no backend changes or unrelated dependencies.

**User-visible outcome:** The landing page looks tighter and more consistent on mobile, logos reliably render (with fallback text), screenshots display without awkward cropping/stretching, “Our Story” can be expanded/collapsed, the features accordion feels polished, and the footer has a working email contact link.
