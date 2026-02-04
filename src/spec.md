# Specification

## Summary
**Goal:** Ship a single combined pre-launch frontend polish release (steps 3/4/5) that improves UX clarity, copy consistency, and loading/empty/error states across all main tabs without changing React Query setup or removing legacy code paths.

**Planned changes:**
- Standardize and refine English user-facing copy across Home, Insights, Memories, Activities, and Us for clearer intent and consistent wording.
- Add consistent loading states (e.g., skeletons/spinners + helpful loading copy) for key data-driven surfaces (Insights cards/metrics, ritual history, memories/photos lists, pairing/partner panels, love-language sync panels) without changing React Query provider/client configuration.
- Add/standardize empty-state messaging with next-step guidance when data is legitimately absent (e.g., not paired, no history yet, no photos yet).
- Improve error handling and recovery for failed canister calls by showing clear English error messages and offering safe retry actions where appropriate, ensuring flows don’t get stuck loading and keeping legacy code paths intact (additive/guarded changes only).
- Apply lightweight UI responsiveness/performance tweaks to reduce avoidable jank (e.g., reduce unnecessary re-renders, avoid expensive render-time computations, keep animations from degrading scrolling) without React Query setup changes.
- Perform a final manual QA pass aligned to the existing checklist and update the checklist only for clarity/ordering to reflect the single combined release verification.

**User-visible outcome:** The app’s five tabs feel more polished and consistent: users see clear English text, helpful loading/empty states instead of blank sections, and actionable error messages with retry options—resulting in smoother, more reliable pre-launch UX.
