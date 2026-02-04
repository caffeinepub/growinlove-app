# GrowInLove QA Acceptance Checklist

This document provides step-by-step manual verification steps for the GrowInLove application. Use this checklist to verify core functionality, data integrity, partner synchronization, and the combined pre-launch polish (UX copy, loading/empty/error states, and performance).

---

## 1. Authentication & Profile Setup

### Test Case 1.1: Login Flow
**Steps:**
1. Open the application
2. Click "Login" button
3. Complete Internet Identity authentication
4. Verify successful login

**Expected Outcome:**
- User is authenticated successfully
- Profile setup modal appears if first-time user
- No errors or blank screens

### Test Case 1.2: Profile Setup
**Steps:**
1. After first login, enter your name in the profile setup modal
2. Click "Save"
3. Verify success animation and automatic navigation

**Expected Outcome:**
- Profile is saved successfully
- Success checkmark animation plays
- User is automatically navigated to main app
- Profile name is displayed throughout the app

### Test Case 1.3: Logout and Re-login
**Steps:**
1. Click "Logout" button
2. Verify logout success
3. Click "Login" again
4. Verify profile is remembered (no setup modal)

**Expected Outcome:**
- Logout clears all cached data
- Re-login loads existing profile
- No profile setup modal on subsequent logins

---

## 2. Pairing Flow

### Test Case 2.1: Generate Pairing Code
**Steps:**
1. Log in as User A
2. Navigate to the "Us" tab
3. Verify pairing code is automatically generated
4. Verify a 6-digit code is displayed

**Expected Outcome:**
- A unique 6-digit pairing code is generated and displayed
- Code remains visible until pairing is completed
- Copy and Share buttons are functional

### Test Case 2.2: Complete Pairing
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
- One-time highlight animation triggers on Love Languages card

### Test Case 2.3: Verify Mutual Partnership
**Steps:**
1. As User A, navigate to the "Home" tab
2. Verify you can see the daily ritual prompt
3. As User B, navigate to the "Home" tab
4. Verify you can see the same daily ritual prompt

**Expected Outcome:**
- Both users see the same ritual prompt for the current day
- Both users can submit responses
- No errors or blank screens

---

## 3. Daily Ritual Submission & Loading States

### Test Case 3.1: Text-Only Submission with Loading State
**Steps:**
1. Log in as User A
2. Navigate to "Home" tab
3. Type a text response in the textarea
4. Click "Submit"
5. Observe loading state on submit button
6. Verify submission success

**Expected Outcome:**
- Submit button shows "Submitting..." with spinner during submission
- After submission, UI shows "Waiting for Partner..." state with clear messaging
- Text response is saved and visible in Ritual History
- No blank or confusing states

### Test Case 3.2: Photo Upload with Progress Indication
**Steps:**
1. Log in as User B
2. Navigate to "Home" tab
3. Click "Photo" button
4. Select an image file
5. Observe photo preview
6. Click "Submit"
7. Observe upload progress

**Expected Outcome:**
- Photo preview displays immediately
- Submit button shows "Submitting..." during upload
- Upload completes successfully
- Photo appears in ritual response
- No blank screens during upload

### Test Case 3.3: Ritual History Loading State
**Steps:**
1. Navigate to "Home" tab
2. Scroll to "Ritual History" section
3. Observe loading state while history loads
4. Verify history displays after loading

**Expected Outcome:**
- Loading spinner with "Loading your love story...💫" message appears
- History loads and displays correctly
- No flash of empty content before loading

### Test Case 3.4: Empty Ritual History State
**Steps:**
1. Create a new couple (no rituals completed)
2. Navigate to "Home" tab
3. Scroll to "Ritual History" section
4. Verify empty state message

**Expected Outcome:**
- Clear empty state message: "No rituals yet — your story begins today 💞"
- Helpful guidance for next steps
- No confusing blank areas

---

## 4. Insights Tab: Loading, Empty, and Error States

### Test Case 4.1: Insights Loading State
**Steps:**
1. Log in as User A
2. Navigate to "Insights" tab
3. Observe loading states for metrics and badges
4. Verify data loads correctly

**Expected Outcome:**
- Consistent loading indicators for all data sections
- No flash of zero values before real data loads
- Smooth transition from loading to loaded state

### Test Case 4.2: Insights Empty State (New Couple)
**Steps:**
1. Create a new couple (no rituals completed)
2. Navigate to "Insights" tab
3. Verify empty state messaging for badges and history

**Expected Outcome:**
- Clear messaging: "Start your journey to unlock milestone badges!"
- Empty history shows helpful guidance
- No misleading zero values presented as real data

### Test Case 4.3: Insights Error Recovery
**Steps:**
1. Simulate network error (disconnect internet)
2. Navigate to "Insights" tab
3. Observe error state
4. Reconnect internet
5. Click retry button
6. Verify data loads successfully

**Expected Outcome:**
- Clear error message explaining the issue
- Retry button is functional
- Data loads successfully after retry
- No stuck loading states

---

## 5. Memories Tab: Loading and Empty States

### Test Case 5.1: Memories Loading State
**Steps:**
1. Navigate to "Memories" tab
2. Observe loading state while history loads
3. Verify memories display after loading

**Expected Outcome:**
- Loading spinner with "Loading your memories..." message
- Memories load and display correctly
- No blank content flash

### Test Case 5.2: Empty Memories State
**Steps:**
1. Create a new couple (no rituals completed)
2. Navigate to "Memories" tab
3. Verify empty state message

**Expected Outcome:**
- Clear empty state: "No Memories Yet"
- Helpful description: "Start completing daily rituals together to build your love story..."
- No confusing blank areas

### Test Case 5.3: Load More with Loading Indicator
**Steps:**
1. Complete 15+ rituals
2. Navigate to "Memories" tab
3. Scroll to bottom
4. Click "Load More Memories"
5. Observe loading state on button

**Expected Outcome:**
- Button shows "Loading..." with spinner
- Additional memories load correctly
- No duplicate entries

---

## 6. Activities Tab: Gated States and Clear Messaging

### Test Case 6.1: Unpaired User Access
**Steps:**
1. Log in as unpaired user
2. Navigate to "Activities" tab
3. Verify gating message

**Expected Outcome:**
- Clear message: "Connect to Explore Activities"
- Guidance to visit Us tab for pairing
- No confusing disabled UI

### Test Case 6.2: Quiz Incomplete Gating
**Steps:**
1. Log in as paired user (quiz not completed)
2. Navigate to "Activities" tab
3. Verify spin wheel and unlock packs show clear gating

**Expected Outcome:**
- Clear messaging explaining quiz requirement
- No ambiguous disabled states
- Helpful next-step guidance

---

## 7. Us Tab: Pairing and Love Languages Card States

### Test Case 7.1: Unpaired State with Clear Guidance
**Steps:**
1. Log in as unpaired user
2. Navigate to "Us" tab
3. Verify pairing interface is clear

**Expected Outcome:**
- Clear instructions for generating/entering code
- No confusing blank areas
- Profile requirement warning if profile not set up

### Test Case 7.2: Love Languages Card Loading State
**Steps:**
1. Log in as paired user
2. Navigate to "Us" tab
3. Observe Love Languages card while quiz state loads
4. Verify card displays safe fallback

**Expected Outcome:**
- Card shows "Check your quiz status" while loading
- No blank or broken content
- Smooth transition to actual state

### Test Case 7.3: Love Languages Card Status States
**Steps:**
1. Verify card shows correct status for:
   - None completed: "Not started yet"
   - One completed: "Waiting for your partner"
   - Both completed: "Both completed"
2. Verify button labels match state

**Expected Outcome:**
- All states display clear, understandable copy
- Button labels are action-oriented
- No confusing terminology

---

## 8. Love Languages Quiz: Loading and Error States

### Test Case 8.1: Quiz Results Loading
**Steps:**
1. Complete quiz
2. Observe loading state while results save
3. Verify results display correctly

**Expected Outcome:**
- Button shows "Saving..." during save
- Results display after successful save
- No stuck loading states

### Test Case 8.2: Quiz Sync Error Recovery
**Steps:**
1. Complete quiz
2. Simulate sync error (disconnect internet during save)
3. Observe error banner
4. Reconnect internet
5. Click "Retry Sync"
6. Verify sync succeeds

**Expected Outcome:**
- Clear error banner: "Sync Issue Detected"
- Explanation that data is saved but sync delayed
- Retry button works correctly
- Success message after retry

### Test Case 8.3: Waiting for Partner State
**Steps:**
1. Complete quiz as User A
2. Log in as User B (quiz not completed)
3. Verify waiting state is clear

**Expected Outcome:**
- Clear message: "⏳ Waiting for your partner to complete the quiz..."
- No confusing blank areas
- User B can still complete their quiz

---

## 9. Error Handling and Recovery

### Test Case 9.1: Failed Ritual Submission Recovery
**Steps:**
1. Navigate to "Home" tab
2. Enter ritual response
3. Simulate network error
4. Click "Submit"
5. Observe error handling
6. Reconnect network
7. Retry submission

**Expected Outcome:**
- Clear error message displayed
- Form remains usable (not cleared)
- Retry succeeds after reconnection
- No data loss

### Test Case 9.2: Failed Photo Upload Recovery
**Steps:**
1. Navigate to "Home" tab
2. Select photo
3. Simulate network error
4. Click "Submit"
5. Observe error handling
6. Reconnect network
7. Retry submission

**Expected Outcome:**
- Clear error message
- Photo preview remains visible
- Retry succeeds without re-selecting photo
- No stuck loading states

### Test Case 9.3: Pairing Error Handling
**Steps:**
1. Navigate to "Us" tab
2. Enter invalid pairing code
3. Click "Connect"
4. Observe error message
5. Enter valid code
6. Verify successful pairing

**Expected Outcome:**
- Clear error message for invalid code
- Error clears when entering new code
- Successful pairing after valid code
- No stuck error states

---

## 10. Performance and Responsiveness

### Test Case 10.1: Tab Navigation Responsiveness
**Steps:**
1. Navigate between all tabs (Home, Insights, Memories, Activities, Us)
2. Observe navigation speed and smoothness
3. Verify no janky animations or scroll issues

**Expected Outcome:**
- Tab switches are instant (< 100ms)
- No scroll jank during navigation
- Smooth transitions between tabs

### Test Case 10.2: List Rendering Performance
**Steps:**
1. Complete 20+ rituals
2. Navigate to "Memories" tab
3. Scroll through list
4. Observe scroll performance

**Expected Outcome:**
- Smooth scrolling with no jank
- List items render quickly
- No performance degradation with many items

### Test Case 10.3: Insights Page Performance
**Steps:**
1. Navigate to "Insights" tab
2. Scroll through all sections
3. Observe animation performance
4. Verify no layout thrashing

**Expected Outcome:**
- Smooth scrolling and animations
- Progress rings animate smoothly
- No janky badge animations
- Reduced motion respected if enabled

### Test Case 10.4: Completion Animation Performance
**Steps:**
1. Complete daily ritual (both partners)
2. Observe completion animation
3. Verify animation is smooth

**Expected Outcome:**
- Floating hearts animate smoothly
- No frame drops or stuttering
- Animation respects reduced motion preference

---

## 11. Accessibility and Reduced Motion

### Test Case 11.1: Reduced Motion Support
**Steps:**
1. Enable "Reduce Motion" in OS settings
2. Navigate through all tabs
3. Verify animations are minimal or disabled

**Expected Outcome:**
- All animations are significantly reduced or disabled
- App remains fully functional
- No jarring motion

### Test Case 11.2: Keyboard Navigation
**Steps:**
1. Navigate app using only keyboard (Tab, Enter, Arrow keys)
2. Verify all interactive elements are reachable
3. Verify focus indicators are visible

**Expected Outcome:**
- All buttons and links are keyboard accessible
- Focus indicators are clear and visible
- No keyboard traps

---

## 12. Cross-Device and Reload Verification

### Test Case 12.1: Reload Verification (All Tabs)
**Steps:**
1. Navigate to each tab (Home, Insights, Memories, Activities, Us)
2. Hard reload page (Ctrl+Shift+R)
3. Verify data persists and displays correctly

**Expected Outcome:**
- All data persists across reloads
- No data loss or reset
- Loading states display correctly on reload

### Test Case 12.2: Second-Device Synchronization
**Steps:**
1. Log in as User A on Device 1
2. Complete a ritual
3. Log in as User A on Device 2
4. Verify ritual completion is reflected

**Expected Outcome:**
- Data syncs across devices
- Both devices show identical state
- No data divergence

---

## 13. Edge Cases and Boundary Conditions

### Test Case 13.1: Very Long Text Input
**Steps:**
1. Navigate to "Home" tab
2. Enter very long text (500+ characters) in ritual response
3. Submit
4. Verify handling

**Expected Outcome:**
- Long text is accepted and saved
- Text displays correctly in history
- No truncation or errors

### Test Case 13.2: Large Photo Upload
**Steps:**
1. Navigate to "Home" tab
2. Attempt to upload very large image (>10MB)
3. Observe handling

**Expected Outcome:**
- If upload fails, clear error message is shown
- Form remains usable
- User can retry with smaller image

### Test Case 13.3: Rapid Tab Switching
**Steps:**
1. Rapidly switch between tabs multiple times
2. Verify no errors or stuck states

**Expected Outcome:**
- App handles rapid navigation gracefully
- No errors or crashes
- Data loads correctly for each tab

---

## 14. UX Copy Consistency

### Test Case 14.1: Consistent Terminology Across Tabs
**Steps:**
1. Navigate through all tabs
2. Note terminology used for:
   - Partner (not "user", "other person", etc.)
   - Rituals (not "tasks", "activities", etc.)
   - Completion states
3. Verify consistency

**Expected Outcome:**
- Terminology is consistent across all tabs
- English is clear and understandable
- No confusing or ambiguous terms

### Test Case 14.2: Empty State Messaging Consistency
**Steps:**
1. Verify empty state messages across:
   - Home (no rituals)
   - Insights (no data)
   - Memories (no memories)
   - Activities (not paired/quiz incomplete)
2. Verify all messages provide clear next steps

**Expected Outcome:**
- All empty states have clear, helpful messaging
- Next-step guidance is provided
- Tone is consistent and encouraging

### Test Case 14.3: Error Message Clarity
**Steps:**
1. Trigger various errors (network, invalid input, etc.)
2. Verify error messages are clear and actionable
3. Verify technical details are optional

**Expected Outcome:**
- Error messages explain what happened
- Clear guidance on how to recover
- Technical details available but not prominent

---

## 15. Summary Checklist

Use this summary to quickly verify all critical areas:

**Authentication & Profile:**
- [ ] Login flow works correctly
- [ ] Profile setup saves and persists
- [ ] Logout clears data correctly

**Pairing:**
- [ ] Pairing code generation works
- [ ] Pairing completion succeeds
- [ ] Both partners can access rituals after pairing

**Daily Rituals:**
- [ ] Text submission works with loading states
- [ ] Photo upload works with progress indication
- [ ] Ritual history shows loading/empty states correctly
- [ ] Completion animation is smooth

**Insights:**
- [ ] Loading states display correctly
- [ ] Empty states have clear messaging
- [ ] Error recovery works
- [ ] Badge animations are smooth

**Memories:**
- [ ] Loading states display correctly
- [ ] Empty states have clear messaging
- [ ] Load More works with loading indicator

**Activities:**
- [ ] Gated states have clear messaging
- [ ] Quiz requirement is explained clearly

**Us Tab:**
- [ ] Pairing interface is clear
- [ ] Love Languages card shows correct states
- [ ] Loading states are handled gracefully

**Love Languages Quiz:**
- [ ] Quiz saves with loading indication
- [ ] Sync errors are handled with retry
- [ ] Waiting for partner state is clear

**Error Handling:**
- [ ] Failed submissions can be retried
- [ ] Failed uploads can be retried
- [ ] Pairing errors are clear and recoverable

**Performance:**
- [ ] Tab navigation is responsive
- [ ] List scrolling is smooth
- [ ] Insights animations are smooth
- [ ] Completion animation is smooth

**Accessibility:**
- [ ] Reduced motion is respected
- [ ] Keyboard navigation works

**Cross-Device:**
- [ ] Data persists across reloads
- [ ] Data syncs across devices

**Edge Cases:**
- [ ] Long text is handled correctly
- [ ] Large photos are handled gracefully
- [ ] Rapid navigation works correctly

**UX Copy:**
- [ ] Terminology is consistent
- [ ] Empty states are clear and helpful
- [ ] Error messages are clear and actionable

---

## Notes

- **Loading States:** All data-fetching operations should show clear loading indicators (spinners, skeletons, or loading messages).
- **Empty States:** All empty data scenarios should show helpful messaging with next-step guidance.
- **Error States:** All errors should be recoverable with clear messaging and retry actions.
- **Performance:** Animations should be smooth and respect reduced motion preferences.
- **UX Copy:** All user-facing text should be clear, consistent, and in English.
- **No Blank Screens:** The app should never show confusing blank areas; always provide context and guidance.

---

**Last Updated:** February 4, 2026 (Combined Pre-Launch Polish - Steps 3+4+5)
