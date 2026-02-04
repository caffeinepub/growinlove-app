# Specification

## Summary
**Goal:** Make ritual history truly multi-day by storing ritual entries per couple per calendar day (append-only), while keeping today’s ritual status and history views correct across backend and frontend.

**Planned changes:**
- Update backend ritual storage so entries are keyed by coupleId + day/date, creating new entries on new days and merging same-day submissions by userId without overwriting other days.
- Update backend endpoints to use per-day storage:
  - getRitualStatus reports completion for the current day only.
  - getRitualHistory(limit) returns multiple days sorted newest-first by entry.date and respects the limit.
- Update frontend React Query hooks and consuming UI to handle multi-entry ritual history, ensuring Home and Memories pages display multiple days correctly and treat ritualHistory[0] as the latest entry.

**User-visible outcome:** Users can see and load ritual history across multiple days without prior days being overwritten, and the app correctly reflects whether today’s ritual is complete for the couple.
