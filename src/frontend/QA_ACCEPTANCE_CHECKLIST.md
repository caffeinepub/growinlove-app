# GrowInLove QA Acceptance Checklist

This document provides step-by-step manual verification steps for the GrowInLove application. Use this checklist to verify core functionality, data integrity, and partner synchronization.

---

## 1. Pairing Flow

### Test Case 1.1: Generate Pairing Code
**Steps:**
1. Log in as User A
2. Navigate to the "Us" tab
3. Click "Generate Pairing Code"
4. Verify a 6-digit code is displayed

**Expected Outcome:**
- A unique 6-digit pairing code is generated and displayed
- Code remains visible until pairing is completed

### Test Case 1.2: Complete Pairing
**Steps:**
1. Log in as User B (different browser/device)
2. Navigate to the "Us" tab
3. Enter the pairing code from User A
4. Click "Connect"
5. Verify success message appears

**Expected Outcome:**
- User B successfully pairs with User A
- Both users see "Connected" status in the Us tab
- Both users can now access daily rituals

### Test Case 1.3: Verify Mutual Partnership
**Steps:**
1. As User A, navigate to the "Home" tab
2. Verify you can see the daily ritual prompt
3. As User B, navigate to the "Home" tab
4. Verify you can see the same daily ritual prompt

**Expected Outcome:**
- Both users see the same ritual prompt for the current day
- Both users can submit responses

---

## 2. Daily Ritual Submission

### Test Case 2.1: Text-Only Submission
**Steps:**
1. Log in as User A
2. Navigate to "Home" tab
3. Type a text response in the textarea (e.g., "I love spending time with you")
4. Click "Submit"
5. Verify submission success

**Expected Outcome:**
- Submit button shows loading state during submission
- After submission, UI shows "Waiting for Partner..." state
- Text response is saved and visible in Ritual History

### Test Case 2.2: Emoji-Only Submission
**Steps:**
1. Log in as User B
2. Navigate to "Home" tab
3. Click the "Emoji" button
4. Verify a random emoji is selected
5. Click "Submit"
6. Verify submission success

**Expected Outcome:**
- Random emoji is displayed in the form
- After submission, both users see "Both completed! 🎉" message
- Emoji response is visible in today's completed ritual

### Test Case 2.3: Photo Upload + Submission
**Steps:**
1. Log in as User A (new day)
2. Navigate to "Home" tab
3. Click "Photo" button
4. Select an image file from your device
5. Verify photo preview appears
6. Optionally add text
7. Click "Submit"
8. Wait for upload and submission to complete

**Expected Outcome:**
- Photo preview displays correctly before submission
- Submit button shows "Submitting..." during upload
- After submission, photo is linked to the ritual response
- Photo appears in Ritual History when viewing the entry

### Test Case 2.4: Photo Linkage in Ritual History
**Steps:**
1. After completing Test Case 2.3, navigate to "Home" tab
2. Scroll to "Ritual History" section
3. Click on the ritual entry that includes a photo
4. Verify the modal opens
5. Verify the photo is displayed inline with the response

**Expected Outcome:**
- Modal displays the ritual prompt, responses, and photo
- Photo loads correctly and is visible
- Photo is associated with the correct user's response

---

## 3. Ritual History

### Test Case 3.1: View Ritual History
**Steps:**
1. Log in as User A
2. Navigate to "Home" tab
3. Scroll to "Ritual History" section
4. Verify past ritual entries are displayed

**Expected Outcome:**
- Ritual entries are displayed in reverse chronological order (newest first)
- Each entry shows date, love language focus, prompt preview, and response previews

### Test Case 3.2: Expand Ritual Entry
**Steps:**
1. In Ritual History, click on any ritual entry
2. Verify modal opens with full details
3. Verify prompt text is fully displayed
4. Verify both partners' responses are shown (if both completed)

**Expected Outcome:**
- Modal displays complete ritual details
- Responses are labeled "You" or "Your Partner"
- Text, emoji, and photos (if present) are all visible

### Test Case 3.3: Ritual History Without Photos
**Steps:**
1. View a ritual entry that has no photos (text/emoji only)
2. Verify modal displays correctly without errors

**Expected Outcome:**
- Modal renders without blank or broken image placeholders
- Only text and emoji responses are shown

### Test Case 3.4: Multi-Day Ritual History (Step 2A)
**Steps:**
1. Complete rituals for at least 3 different calendar days (both partners)
2. Log in as User A
3. Navigate to "Home" tab
4. Scroll to "Ritual History" section
5. Verify multiple distinct date entries are displayed
6. Verify entries are sorted newest-first
7. Click on each entry to verify correct date and responses

**Expected Outcome:**
- Multiple ritual entries are displayed, one per day
- Entries are sorted newest-first (today at top, older entries below)
- Each entry shows the correct date and responses for that day
- No entries are overwritten or missing

### Test Case 3.5: Load More in Memories (Step 2A)
**Steps:**
1. Complete rituals for at least 15 different calendar days (both partners)
2. Log in as User A
3. Navigate to "Memories" tab
4. Verify initial 10 entries are displayed
5. Click "Load More Memories" button
6. Verify additional older entries are loaded
7. Verify entries remain sorted newest-first

**Expected Outcome:**
- Initial load shows 10 most recent entries
- "Load More" button fetches next 10 older entries
- All entries remain sorted newest-first
- No duplicate entries appear

---

## 4. Streak & Harmony Stability

### Test Case 4.1: Verify Current Streak
**Steps:**
1. Log in as User A
2. Navigate to "Home" tab
3. Note the "Shared Streak" count
4. Navigate to "Insights" tab
5. Note the "Current Streak" value

**Expected Outcome:**
- Streak count is consistent across Home and Insights tabs
- Streak count reflects the actual number of consecutive days both partners completed rituals

### Test Case 4.2: Verify Harmony Values (Both Partners)
**Steps:**
1. Log in as User A
2. Navigate to "Insights" tab
3. Note the "Current Harmony" percentage
4. Log in as User B (different browser/device)
5. Navigate to "Insights" tab
6. Note the "Current Harmony" percentage

**Expected Outcome:**
- Both partners see **identical** harmony values
- Harmony percentage is the same across both accounts

### Test Case 4.3: Harmony Stability Across Reloads
**Steps:**
1. Log in as User A
2. Navigate to "Insights" tab
3. Note the "Current Harmony" value
4. Refresh the page (hard reload)
5. Navigate back to "Insights" tab
6. Verify harmony value is unchanged

**Expected Outcome:**
- Harmony value remains stable after reload
- No drift or random changes in harmony percentage

### Test Case 4.4: Harmony Trend Consistency
**Steps:**
1. Log in as User A
2. Navigate to "Insights" tab
3. View the 7-day harmony trend sparkline
4. Log in as User B
5. Navigate to "Insights" tab
6. View the 7-day harmony trend sparkline

**Expected Outcome:**
- Both partners see the same trend line
- Trend reflects recent ritual completion behavior

---

## 5. Badge Persistence

### Test Case 5.1: Verify Badge Unlock (7-Day Streak)
**Steps:**
1. Complete rituals for 7 consecutive days (both partners)
2. Log in as User A
3. Navigate to "Insights" tab
4. Verify "7-Day Streak" badge is unlocked
5. Log in as User B
6. Navigate to "Insights" tab
7. Verify "7-Day Streak" badge is unlocked

**Expected Outcome:**
- Badge unlocks for both partners simultaneously
- Badge remains unlocked after reload

### Test Case 5.2: Badge Persistence Across Reloads
**Steps:**
1. After unlocking a badge, refresh the page
2. Navigate to "Insights" tab
3. Verify badge is still unlocked

**Expected Outcome:**
- Badge unlock state persists across reloads
- No re-locking or reset of badge progress

### Test Case 5.3: Badge Synchronization (Both Partners)
**Steps:**
1. Log in as User A
2. Navigate to "Insights" tab
3. Note which badges are unlocked
4. Log in as User B
5. Navigate to "Insights" tab
6. Verify the same badges are unlocked

**Expected Outcome:**
- Both partners see identical badge unlock states
- No divergence in badge progress between partners

---

## 6. Couple-Scoped Data Isolation

### Test Case 6.1: Per-Partner Completion Attribution (Canonical)
**Steps:**
1. Log in as User A (Couple 1)
2. Submit a ritual response for today
3. Log in as User B (Couple 1, different device)
4. Verify User A's completion is reflected (status shows "Waiting for Partner")
5. Verify User B can still submit their own response
6. Submit User B's response
7. Verify both users see "Both completed! 🎉"
8. **Phase 1B:** Verify that both users see the same completion state regardless of who is partnerA or partnerB in the backend

**Expected Outcome:**
- User A's submission updates the correct partner completion flag based on canonical ordering
- User B's submission updates the correct partner completion flag based on canonical ordering
- Completion status is accurate for each partner independently
- **Phase 1B:** Both users see identical "Waiting for Partner..." or "Both completed! 🎉" states within the polling interval (5 seconds)
- **Phase 1B:** The completion attribution is consistent with backend canonical partner ordering (not dependent on userProfile.isFirstUser)

### Test Case 6.2: Couple Isolation (No Cross-Couple Data Mixing)
**Steps:**
1. Create a second couple (User C + User D)
2. Log in as User C
3. Submit a ritual response for today
4. Log in as User A (Couple 1)
5. Navigate to "Insights" tab
6. Verify User A's streak/harmony is unaffected by User C's submission
7. Log in as User D
8. Submit a ritual response for today
9. Log in as User B (Couple 1)
10. Verify User B's streak/harmony is unaffected by Couple 2's submissions

**Expected Outcome:**
- Couple 1's completion records are isolated from Couple 2
- Couple 1's streak/harmony does not change when Couple 2 submits rituals
- No cross-couple data mixing or collisions

### Test Case 6.3: Consecutive-Day Streak Behavior
**Steps:**
1. Log in as User A (Couple 1)
2. Complete rituals for 3 consecutive days (both partners)
3. Verify currentStreak = 3
4. Skip one day (do not submit on day 4)
5. On day 5, complete rituals for both partners
6. Verify currentStreak resets to 1 (not 4)

**Expected Outcome:**
- Streak increments only when both partners complete on consecutive dayNumbers
- Streak resets to 0 if a gap day is present
- longestStreak persists as the max consecutive streak ever achieved

### Test Case 6.4: Badge Unlock Persistence (7-Day Milestone)
**Steps:**
1. Complete rituals for 7 consecutive days (both partners)
2. Verify "7-Day Streak" badge unlocks
3. Log in as User A
4. Navigate to "Insights" tab
5. Verify badge is unlocked
6. Log in as User B
7. Navigate to "Insights" tab
8. Verify badge is unlocked
9. Refresh both browsers
10. Verify badge remains unlocked for both partners

**Expected Outcome:**
- Badge unlocks when currentStreak reaches 7
- Badge unlock state is synchronized for both partners
- Badge unlock persists across reloads

---

## 7. Reload & Second-Device Verification

### Test Case 7.1: Reload Verification (User A)
**Steps:**
1. Log in as User A
2. Complete a ritual
3. Note streak count, harmony value, and badge states
4. Refresh the page (hard reload)
5. Verify all values remain consistent

**Expected Outcome:**
- Streak count unchanged
- Harmony value unchanged
- Badge states unchanged

### Test Case 7.2: Second-Device Verification (User B)
**Steps:**
1. Log in as User B on a different device/browser
2. Verify streak count matches User A
3. Verify harmony value matches User A
4. Verify badge states match User A

**Expected Outcome:**
- All values are identical across devices
- No data divergence between partners

### Test Case 7.3: Cross-Device Ritual Completion
**Steps:**
1. Log in as User A on Device 1
2. Submit a ritual response
3. Log in as User B on Device 2
4. Verify User A's submission is reflected (status shows "Waiting for Partner")
5. Submit User B's ritual response
6. Verify both devices show "Both completed! 🎉"

**Expected Outcome:**
- Real-time synchronization works across devices
- Both partners see completion status update within 5 seconds

---

## 8. Edge Cases & Error Handling

### Test Case 8.1: Unpaired User Access
**Steps:**
1. Log in as a new user (not paired)
2. Navigate to "Home" tab
3. Verify appropriate message is displayed

**Expected Outcome:**
- User sees "Connect with Your Partner" message
- No ritual prompt is displayed
- User is directed to the "Us" tab to complete pairing

### Test Case 8.2: Partial Quiz Completion
**Steps:**
1. Log in as User A
2. Navigate to "Love Languages" tab
3. Complete the quiz
4. Log in as User B (do not complete quiz)
5. Navigate to "Home" tab
6. Verify ritual prompt is still accessible

**Expected Outcome:**
- Ritual prompt is accessible even if only one partner completed the quiz
- No errors or blank screens

### Test Case 8.3: Photo Upload Failure
**Steps:**
1. Log in as User A
2. Navigate to "Home" tab
3. Attempt to upload a very large image (>10MB)
4. Verify error handling

**Expected Outcome:**
- If upload fails, user sees an error message
- Form remains usable (no crash or blank screen)
- User can retry or submit without photo

---

## 9. Insights Data Truth Verification

### Test Case 9.1: 7-Day History Determinism
**Steps:**
1. Log in as User A
2. Navigate to "Insights" tab
3. View the "7-Day History" section
4. Note the completion status and harmony values for each day
5. Refresh the page
6. Verify the same values are displayed

**Expected Outcome:**
- 7-Day History is derived from backend trend data (last14DayTrend, harmonyTrend)
- No random or simulated values
- Values remain consistent across reloads

### Test Case 9.2: Harmony Breakdown Components
**Steps:**
1. Log in as User A
2. Navigate to "Insights" tab
3. View the "Harmony Breakdown & Trend Card"
4. Note the "Quiz Alignment" and "Recent Ritual Consistency" percentages
5. Log in as User B
6. Navigate to "Insights" tab
7. Verify the same percentages are displayed

**Expected Outcome:**
- Quiz Alignment and Recent Ritual Consistency are backend-computed
- Both partners see identical values
- Values are deterministic and do not change on reload

### Test Case 9.3: Insights Update After Ritual Submission
**Steps:**
1. Log in as User A
2. Navigate to "Insights" tab
3. Note the current streak and harmony values
4. Navigate to "Home" tab
5. Submit a ritual response (both partners complete)
6. Navigate back to "Insights" tab
7. Verify streak and harmony values update within 10 seconds

**Expected Outcome:**
- Insights data refetches after ritual submission
- Streak increments if consecutive day
- Harmony updates based on new completion data
- No hard refresh required

---

## 10. Us Tab: Relationship Foundations & Love Languages Card

### Test Case 10.1: Paired User Sees Relationship Foundations Section
**Steps:**
1. Log in as User A (already paired with User B)
2. Navigate to "Us" tab
3. Verify "Relationship Foundations" section label is visible
4. Verify "Our Love Languages" card is displayed below the label

**Expected Outcome:**
- "Relationship Foundations" label is visible above the Love Languages card
- Card is prominently displayed in the paired state

### Test Case 10.2: Love Languages Card Status States (None Completed)
**Steps:**
1. Log in as User A (paired, neither partner completed quiz)
2. Navigate to "Us" tab
3. View the "Our Love Languages" card
4. Verify subtitle reads "Discover how you give and receive love"
5. Verify status line reads "Not started yet"
6. Verify primary button label reads "Start Quiz"

**Expected Outcome:**
- Card displays correct subtitle, status line, and button label for none-completed state

### Test Case 10.3: Love Languages Card Status States (One Completed)
**Steps:**
1. Log in as User A (paired)
2. Navigate to "Love Languages" tab and complete the quiz
3. Navigate back to "Us" tab
4. Verify subtitle reads "Your partner hasn't completed the quiz yet"
5. Verify status line reads "Waiting for your partner"
6. Verify primary button label reads "View Your Results"

**Expected Outcome:**
- Card displays correct subtitle, status line, and button label for one-completed state

### Test Case 10.4: Love Languages Card Status States (Both Completed)
**Steps:**
1. Log in as User B (paired)
2. Navigate to "Love Languages" tab and complete the quiz
3. Navigate back to "Us" tab
4. Verify subtitle reads "See your match & strengths"
5. Verify status line reads "Both completed"
6. Verify primary button label reads "View Results"

**Expected Outcome:**
- Card displays correct subtitle, status line, and button label for both-completed state

### Test Case 10.5: One-Time Highlight After Pairing
**Steps:**
1. Log in as User A (unpaired)
2. Navigate to "Us" tab
3. Generate a pairing code
4. Log in as User B (unpaired, different browser)
5. Navigate to "Us" tab
6. Enter User A's pairing code and click "Connect"
7. Verify success message appears
8. Immediately verify "Our Love Languages" card has a subtle glow/pulse animation
9. Wait 3 seconds
10. Verify the highlight animation stops
11. Refresh the page
12. Verify the highlight animation does NOT re-trigger

**Expected Outcome:**
- Immediately after successful pairing, the Love Languages card highlights once with a subtle glow/pulse
- Highlight animation stops after ~3 seconds
- Highlight does NOT re-trigger on page reload

### Test Case 10.6: Navigate from Us to Love Languages Tab
**Steps:**
1. Log in as User A (paired)
2. Navigate to "Us" tab
3. Click on the "Our Love Languages" card or its primary button
4. Verify the app navigates to the "Love Languages" tab
5. Verify no full page reload occurs (SPA navigation)

**Expected Outcome:**
- Clicking the card or button switches the active tab to "Love Languages"
- Navigation is instant (no page reload)

### Test Case 10.7: Navigate from Us to Insights Tab via Shortcut
**Steps:**
1. Log in as User A (paired)
2. Navigate to "Us" tab
3. Click the secondary link "See how this shows up in your Insights →"
4. Verify the app navigates to the "Insights" tab
5. Verify the Insights page auto-scrolls to the harmony section

**Expected Outcome:**
- Clicking the shortcut link switches the active tab to "Insights"
- Insights page smoothly scrolls to the harmony section
- Navigation is instant (no page reload)

### Test Case 10.8: Love Languages Card Loading State
**Steps:**
1. Log in as User A (paired)
2. Navigate to "Us" tab
3. Observe the "Our Love Languages" card while combined quiz state is loading
4. Verify the card shows a neutral fallback state (e.g., "Check your quiz status")
5. Verify the card does not crash or show blank content

**Expected Outcome:**
- Card displays a safe fallback state while loading
- No errors or blank screens

---

## 11. Love Languages Quiz Persistence & Partner Sync

### Test Case 11.1: Partner A Completes Quiz → Refresh → Still Completed
**Steps:**
1. Log in as User A (paired with User B)
2. Navigate to "Love Languages" tab
3. Complete the entire quiz (answer all 7 questions)
4. Verify results screen displays with rankings
5. Refresh the page (hard reload)
6. Navigate back to "Love Languages" tab
7. Verify results screen still displays (quiz is not reset)

**Expected Outcome:**
- Quiz results persist after page refresh
- User A sees their completed results without retaking the quiz
- No data loss or reset to initial state

### Test Case 11.2: Partner B Sees Partner A Completion via Combined State
**Steps:**
1. After User A completes the quiz (Test Case 11.1), log in as User B (different browser/device)
2. Navigate to "Love Languages" tab
3. Verify the page shows "Waiting for your partner to complete the quiz" message or similar
4. Navigate to "Us" tab
5. Verify "Our Love Languages" card shows "Waiting for your partner" status
6. Verify the card indicates User A has completed

**Expected Outcome:**
- User B sees that User A has completed the quiz
- Combined quiz state reflects partnerCompleted=true for User A
- User B is prompted to complete their own quiz

### Test Case 11.3: Both Complete → Both See Synced Status and Partner Rankings
**Steps:**
1. Log in as User B (paired with User A, User A already completed)
2. Navigate to "Love Languages" tab
3. Complete the entire quiz
4. Verify results screen displays with User B's rankings
5. Verify "Partner's Rankings" section displays User A's results
6. Verify "Harmony Score" section displays overlap percentage
7. Log in as User A (different browser/device)
8. Navigate to "Love Languages" tab
9. Verify User A sees their own rankings
10. Verify User A sees User B's rankings in "Partner's Rankings" section
11. Verify both users see the same Harmony Score

**Expected Outcome:**
- Both partners see their own results and their partner's results
- Harmony Score is identical for both partners
- Combined state shows callerCompleted=true and partnerCompleted=true for both
- Results sync automatically via polling (within 5 seconds)

### Test Case 11.4: Retake/Reset Affects Only Caller
**Steps:**
1. Log in as User A (both partners have completed quiz)
2. Navigate to "Love Languages" tab
3. Click "Re-take Quiz" button
4. Confirm retake in the dialog
5. Verify User A's results are cleared
6. Verify User A is returned to the initial quiz welcome screen
7. Log in as User B (different browser/device)
8. Navigate to "Love Languages" tab
9. Verify User B's results are still displayed
10. Verify "Partner's Rankings" section no longer shows User A's results (or shows "Waiting for partner")
11. Verify Harmony Score is no longer displayed (since only one partner has results)

**Expected Outcome:**
- Retake/reset clears only the caller's quiz results
- Partner's results remain unchanged
- Combined state updates to reflect callerCompleted=false for the resetting user
- Partner sees updated status indicating the other partner needs to retake

### Test Case 11.5: Quiz Results Persist After Upgrade
**Steps:**
1. Complete the quiz for both partners (User A and User B)
2. Note the quiz results and Harmony Score
3. Simulate a canister upgrade (if possible in test environment)
4. Log in as User A
5. Navigate to "Love Languages" tab
6. Verify quiz results are still displayed
7. Log in as User B
8. Navigate to "Love Languages" tab
9. Verify quiz results are still displayed
10. Verify Harmony Score is unchanged

**Expected Outcome:**
- Quiz results persist across canister upgrades
- No data loss or reset after upgrade
- Combined state remains consistent

### Test Case 11.6: Fresh Install / No Quiz Data
**Steps:**
1. Deploy a fresh canister (or use a new couple that has never taken the quiz)
2. Log in as User A (paired with User B)
3. Navigate to "Love Languages" tab
4. Verify the initial welcome screen is displayed
5. Verify no errors or traps occur
6. Verify "Start the Quiz" button is functional

**Expected Outcome:**
- App handles missing quiz data gracefully
- No backend traps or errors
- Users can start the quiz from a clean state

---

## 12. Phase 1B: Canonical Ritual Completion Attribution

### Test Case 12.1: Same Completion State Across Both Partners
**Steps:**
1. Log in as User A (Couple 1)
2. Submit a ritual response for today
3. Note the completion state on User A's Home page (should show "Waiting for Partner...")
4. Log in as User B (Couple 1, different browser/device)
5. Navigate to "Home" tab
6. Verify User B sees the same "Waiting for Partner..." state
7. Verify the state updates within the polling interval (5 seconds)

**Expected Outcome:**
- Both User A and User B see identical completion states
- The state is based on canonical backend attribution (partnerA/partnerB principals)
- No dependency on userProfile.isFirstUser for interpreting completion status

### Test Case 12.2: Both Complete → Identical "Both completed! 🎉" State
**Steps:**
1. Log in as User A (Couple 1)
2. Submit a ritual response for today
3. Log in as User B (Couple 1, different browser/device)
4. Submit a ritual response for today
5. Verify both User A and User B see "Both completed! 🎉" message
6. Refresh both browsers
7. Verify both still see "Both completed! 🎉" message

**Expected Outcome:**
- Both partners see identical "Both completed! 🎉" state
- No mismatch between devices or after reload
- Completion state is consistent with backend canonical partner ordering

### Test Case 12.3: Canonical Attribution Independent of isFirstUser
**Steps:**
1. Log in as User A (Couple 1, isFirstUser=true)
2. Submit a ritual response for today
3. Log in as User B (Couple 1, isFirstUser=false, different browser/device)
4. Navigate to "Home" tab
5. Verify User B sees "Waiting for Partner..." (indicating User A has submitted)
6. Submit User B's ritual response
7. Verify both users see "Both completed! 🎉"
8. **Verify that the completion attribution is based on comparing caller principal with ritualStatus.partnerA/partnerB, NOT on userProfile.isFirstUser**

**Expected Outcome:**
- Completion attribution is determined by comparing the authenticated caller principal with the canonical partnerA/partnerB principals returned by backend
- userProfile.isFirstUser is NOT used to interpret getRitualStatus() results
- Both partners see consistent completion states regardless of who is partnerA or partnerB

---

## 13. Step 2A: Multi-Day Ritual History Verification

### Test Case 13.1: Multiple Days Create Distinct Entries
**Steps:**
1. Log in as User A (Couple 1)
2. Complete a ritual for Day 1 (both partners)
3. Wait until Day 2 (or simulate by advancing system time)
4. Complete a ritual for Day 2 (both partners)
5. Wait until Day 3
6. Complete a ritual for Day 3 (both partners)
7. Navigate to "Home" tab
8. Scroll to "Ritual History" section
9. Verify three distinct entries are displayed
10. Verify each entry shows the correct date (Day 3, Day 2, Day 1 in that order)

**Expected Outcome:**
- Three distinct ritual entries are stored and displayed
- Each entry corresponds to a different calendar day
- Entries are sorted newest-first (Day 3 at top)
- No entries are overwritten

### Test Case 13.2: Same-Day Multiple Submissions Merge Correctly
**Steps:**
1. Log in as User A (Couple 1)
2. Submit a ritual response for today
3. Log in as User B (Couple 1, different browser/device)
4. Submit a ritual response for today
5. Navigate to "Home" tab
6. Scroll to "Ritual History" section
7. Click on today's entry
8. Verify both User A and User B responses are shown in the same entry

**Expected Outcome:**
- Both responses appear in the same day's entry
- No duplicate entries for the same day
- Responses are correctly attributed to each user

### Test Case 13.3: getRitualHistory Returns Newest-First
**Steps:**
1. Complete rituals for at least 5 different calendar days (both partners)
2. Log in as User A
3. Navigate to "Home" tab
4. Scroll to "Ritual History" section
5. Verify entries are displayed newest-first (most recent day at top)
6. Navigate to "Memories" tab
7. Verify entries are displayed newest-first

**Expected Outcome:**
- All ritual history displays are sorted newest-first
- Most recent day appears at the top
- Older entries appear below

### Test Case 13.4: Load More Fetches Older Entries
**Steps:**
1. Complete rituals for at least 15 different calendar days (both partners)
2. Log in as User A
3. Navigate to "Memories" tab
4. Verify initial 10 entries are displayed (newest-first)
5. Click "Load More Memories" button
6. Verify next 5 older entries are loaded
7. Verify all 15 entries are now visible
8. Verify entries remain sorted newest-first

**Expected Outcome:**
- Initial load shows 10 most recent entries
- "Load More" fetches the next batch of older entries
- All entries remain sorted newest-first
- No duplicate entries appear

### Test Case 13.5: Today's Entry Preferred for "Both completed!" Display
**Steps:**
1. Complete rituals for at least 2 different calendar days (both partners)
2. Log in as User A
3. Navigate to "Home" tab
4. Verify "Both completed! 🎉" section shows today's responses
5. Verify the responses match today's submissions (not yesterday's)

**Expected Outcome:**
- When both partners complete today's ritual, the "Both completed!" section shows today's responses
- If today's entry exists, it is preferred over the latest entry
- Responses are correctly attributed to today's date

---

## 14. Summary Checklist

Use this summary to quickly verify all critical areas:

- [ ] Pairing flow works for both partners
- [ ] Text-only ritual submission works
- [ ] Emoji-only ritual submission works
- [ ] Photo upload + submission works
- [ ] Photo linkage appears in Ritual History
- [ ] Ritual History displays correctly with and without photos
- [ ] **Step 2A: Multiple days create distinct ritual entries**
- [ ] **Step 2A: Same-day submissions merge correctly into one entry**
- [ ] **Step 2A: Ritual history displays newest-first**
- [ ] **Step 2A: Load More fetches older entries correctly**
- [ ] **Step 2A: Today's entry preferred for "Both completed!" display**
- [ ] Streak count is consistent across Home and Insights
- [ ] Harmony values are identical for both partners
- [ ] Harmony values remain stable across reloads
- [ ] Badges unlock correctly and persist across reloads
- [ ] Badge states are synchronized for both partners
- [ ] **Phase 1B: Per-partner completion attribution is canonical (not dependent on isFirstUser)**
- [ ] **Phase 1B: Both partners see identical "Waiting for Partner..." or "Both completed! 🎉" states**
- [ ] **Phase 1B: Completion state updates within polling interval (5 seconds) for both partners**
- [ ] Couple isolation verified (no cross-couple data mixing)
- [ ] Consecutive-day streak behavior is correct
- [ ] Badge unlock persistence verified (7-day milestone)
- [ ] Reload verification passes for both partners
- [ ] Second-device verification passes
- [ ] Cross-device ritual completion works
- [ ] Unpaired user sees appropriate message
- [ ] Partial quiz completion does not block rituals
- [ ] Photo upload failure is handled gracefully
- [ ] 7-Day History is deterministic (no random values)
- [ ] Harmony Breakdown components are backend-driven
- [ ] Insights update after ritual submission
- [ ] **Paired user sees "Relationship Foundations" label in Us tab**
- [ ] **"Our Love Languages" card displays in Us tab for paired users**
- [ ] **Love Languages card shows correct status for none/one/both completed states**
- [ ] **One-time highlight animation triggers immediately after successful pairing**
- [ ] **Highlight animation does NOT re-trigger on page reload**
- [ ] **Clicking Love Languages card navigates to Love Languages tab (no page reload)**
- [ ] **Clicking Insights shortcut navigates to Insights tab and auto-scrolls to harmony section**
- [ ] **Love Languages card shows safe fallback state when loading**
- [ ] **Partner A completes quiz → refresh → still completed**
- [ ] **Partner B sees Partner A completion via combined state**
- [ ] **Both complete → both see synced status and partner rankings**
- [ ] **Retake/reset affects only the caller**
- [ ] **Quiz results persist after canister upgrade**
- [ ] **Fresh install / no quiz data handled gracefully**

---

## Notes

- **Expected Behavior:** All values (streaks, harmony, badges) should be deterministic and identical for both partners.
- **Reload Safety:** No data should drift or change unexpectedly after page reload.
- **Partner Sync:** Both partners should always see the same state for shared data (streaks, harmony, badges).
- **Couple Isolation:** One couple's submissions should never affect another couple's data.
- **Error Handling:** The app should never crash or show blank screens; all errors should be handled gracefully with user-friendly messages.
- **One-Time Highlight:** The Love Languages card highlight should only trigger once immediately after pairing, and should not re-trigger on reload.
- **Navigation:** All tab navigation from Us should be instant (SPA-style) with no full page reloads.
- **Quiz Persistence:** Quiz results must persist across page refreshes, device switches, and canister upgrades.
- **Quiz Sync:** When one partner completes the quiz, the other partner should see the updated status within 5 seconds (via polling).
- **Retake Isolation:** Retaking the quiz should only clear the caller's results, not the partner's results.
- **Phase 1B Canonical Attribution:** Ritual completion status is determined by comparing the authenticated caller principal with the canonical partnerA/partnerB principals returned by the backend. The userProfile.isFirstUser flag is NOT used to interpret getRitualStatus() results. Both partners see identical completion states within the polling interval.
- **Step 2A Multi-Day History:** The backend now stores one ritual entry per day per couple. Multiple days create distinct entries. Same-day submissions from both partners merge into one entry. History is always sorted newest-first. Load More fetches older entries correctly.

---

**Last Updated:** February 4, 2026 (Step 2A)
