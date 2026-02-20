# Specification

## Summary
**Goal:** Fix Activities tab badge filtering, add challenge persistence, implement Love Wheel spin physics, and add real-time data sync.

**Planned changes:**
- Fix badge display logic in Activities tab to show only unlocked badges that meet streak conditions
- Add backend persistence for Love Challenges completion tracking in stable storage
- Connect frontend Love Challenges to use backend persistence instead of local state
- Implement Spin the Love Wheel with smooth deceleration physics (ease-out cubic, 3-5 second duration, randomized stopping angle with offset to avoid landing on dividing lines)
- Add real-time polling mechanism for Activities tab to auto-refresh badges, streaks, and challenge data
- Add visual feedback showing progress toward next badge unlock (e.g., "3 days until next badge!")

**User-visible outcome:** Users will see only their unlocked badges in Activities, completed Love Challenges will persist across sessions, the Love Wheel will spin smoothly with realistic physics, Activities data will automatically sync when their partner completes rituals, and they'll see how close they are to unlocking the next badge.
