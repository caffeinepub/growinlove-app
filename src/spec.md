# Specification

## Summary
**Goal:** Fix ritual-history persistence and replace placeholder Insights + milestone badge data with real backend-driven computations based on stored couple activity and quiz results.

**Planned changes:**
- Implement backend computation for `getInsightsData()` so it returns deterministic, non-placeholder values derived from stored ritual history (including `currentStreak`, `last14DayTrend`, `last30DayTrend`, and aligned `harmonyTrend`).
- Fix streak/trend calculations to be couple-based and order-stable: a day counts as complete only when both partners submit for that day; completing later the same day updates the existing day entry.
- Compute and expose harmony metrics from stored data (quiz alignment + recent ritual consistency) via `quizOverlapScore`, `recentCompletionRate`, `currentHarmony`, and `averageHarmony`, with safe fallback when quiz data is missing.
- Replace default `getBadgeMilestones()` logic with real computed milestone progress (7/30/100-day streak and harmony elite) derived from the same underlying computations as Insights, preserving existing auth behavior and fallback for unpaired/unauthorized callers.
- Ensure ritual submission maintains canonical daily history used consistently by Home, Ritual History, and Insights.
- Add lightweight diagnostic logging around ritual submission and daily completion resolution (no sensitive content; no API shape changes).
- Update frontend data expectations only as needed so Insights and milestone badges reflect the new backend values and refresh after ritual submission without a hard reload.

**User-visible outcome:** Insights no longer shows all-zero/placeholder harmony and history; after both partners complete today’s ritual, streaks, daily trends, harmony metrics, and milestone badge unlocks update correctly and consistently across the app.
