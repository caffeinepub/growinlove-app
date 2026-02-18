# Specification

## Summary
**Goal:** Persist XP values and badges in backend stable storage for data retention across canister upgrades.

**Planned changes:**
- Add stable storage for XP values in backend/main.mo with query and update methods
- Add stable storage for badges in backend/main.mo with query and update methods
- Ensure both XP and badges persist across canister upgrades

**User-visible outcome:** Users' XP progress and unlocked badges are preserved across system upgrades, ensuring no data loss.
