# Specification

## Summary
**Goal:** Ship a pre-launch backend fix bundle to make prompts, pairing, streaks, insights, badges, and storage maintenance behavior correct, deterministic, and secure.

**Planned changes:**
- Ensure prompt data is always initialized before returning from prompt-read endpoints (including fetchPrompts() and getPromptsByLoveLanguage()).
- Enforce pairing-code expiration (TTL) in both checkPairingCode(code) and completePairing(code), while keeping used codes invalidated as before.
- Compute current streak and longest streak from real couple ritual history (a day counts only when both partners submitted) with deterministic resets on missed days.
- Update streak state deterministically during ritual submission so streak/insights update when a day transitions to “both completed” and don’t double-count re-submissions.
- Replace placeholder getInsightsData() analytics with real computed metrics and deterministic trend series derived from couple ritual history and quiz data.
- Implement real badge milestone logic in getBadgeMilestones() using computed metrics, with monotonic “flip-to-true” unlock behavior (7/30/100 streak, Harmony Elite).
- Add admin-only authorization to _caffeineStorageUpdateGatewayPrincipals.
- Harden storage env-var and cycles refill logic by supporting both cashier principal env var spellings and preventing Nat.sub underflow in Storage.refillCashier.

**User-visible outcome:** Insights and badges display real, consistent progress based on actual couple activity; streaks update correctly when both partners complete a day; pairing codes can expire; and storage maintenance/admin operations are properly secured and more robust.
