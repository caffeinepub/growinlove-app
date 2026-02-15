# QA Acceptance Checklist

## Version 66 Reset Verification

### Draft Build Label Display
- [ ] The draft preview shows "Draft Version 66" label in the app header (authenticated view)
- [ ] The draft preview shows "Draft Version 66" label in the landing page header (unauthenticated view)
- [ ] The label is visible but non-intrusive (small, muted styling)
- [ ] The label does not interfere with existing UI elements or navigation

### Build Stability
- [ ] The app loads without build errors
- [ ] The app loads without runtime errors in the browser console
- [ ] All existing Version 66 functionality works as expected:
  - [ ] Landing page displays correctly
  - [ ] Login/logout flow works
  - [ ] Profile setup works
  - [ ] Daily ritual submission works
  - [ ] Love Languages quiz works
  - [ ] All tabs (Home, Insights, Love Languages, Activities, Us, Memories) are accessible
  - [ ] Theme toggle works (light/dark mode)

### Version 66 Feature Verification
- [ ] No features from Versions 77-79 are present
- [ ] The codebase matches the last live release (Version 66)
- [ ] All Version 66 components render correctly
- [ ] All Version 66 API calls function properly

---

## Previous Version Checklists (for reference)

### Version 76 - Landing Page Global Theme Toggle & Phone Mockup Screenshot Fit

#### Global Theme Toggle Functionality
- [ ] Theme toggle button is visible in the landing page header
- [ ] Clicking the theme toggle switches between light and dark modes
- [ ] Theme preference persists across page reloads
- [ ] Theme toggle icon updates correctly (sun for light mode, moon for dark mode)
- [ ] All landing page sections respect the selected theme
- [ ] No flash of unstyled content (FOUC) on page load

#### Phone Mockup Screenshot Fit
- [ ] Screenshots fit properly within phone mockup on mobile (320px-640px)
- [ ] Screenshots fit properly within phone mockup on tablet (641px-1024px)
- [ ] Screenshots fit properly within phone mockup on desktop (1025px+)
- [ ] No overflow or cropping of screenshot content
- [ ] Aspect ratio is maintained across all breakpoints
- [ ] Phone mockup border/frame is visible and properly styled

#### Cross-browser Testing
- [ ] Theme toggle works in Chrome
- [ ] Theme toggle works in Firefox
- [ ] Theme toggle works in Safari
- [ ] Phone mockup displays correctly in Chrome
- [ ] Phone mockup displays correctly in Firefox
- [ ] Phone mockup displays correctly in Safari

---

### Version 64 - Harmony Breakdown Trend Card Data Availability Guard

#### Data Availability Guard
- [ ] When backend trend data is insufficient, the card displays "Not enough data yet" message
- [ ] When backend trend data is available, the card displays the harmony breakdown with trend indicators
- [ ] The guard prevents displaying misleading or placeholder data
- [ ] The message is clear and user-friendly

#### Harmony Breakdown Display
- [ ] Harmony percentage is displayed correctly
- [ ] Trend direction (up/down/stable) is shown with appropriate icon
- [ ] Trend label matches the backend data
- [ ] All visual elements (colors, icons, spacing) are consistent with the design system

---

### Version 63 - Quiz Alignment Summary Update

#### Quiz Alignment Summary
- [ ] The Quiz Alignment Summary section displays only quiz-derived metrics
- [ ] No claims about measured correlation or behavioral tracking are present
- [ ] The section title and description are accurate and truthful
- [ ] The overlap score is calculated correctly from quiz results
- [ ] The UI clearly indicates this is based on quiz responses, not measured behavior

---

### Version 62 - Love Language Trends Removal

#### Insights Page
- [ ] The Love Language Trends section is completely removed from the Insights page
- [ ] No placeholder or "coming soon" message for Love Language Trends
- [ ] The Insights page layout is clean and well-organized without the removed section
- [ ] All other Insights sections (Streak, Harmony, Badges, Quiz Alignment) display correctly

---

### Version 61 - Harmony Home Echo Indicator

#### Home Page Harmony Echo
- [ ] Harmony echo indicator is visible on the Home page
- [ ] Current harmony percentage is displayed correctly
- [ ] Trend direction (up/down/stable) is shown with appropriate icon
- [ ] Tapping the indicator navigates to the Insights page harmony section
- [ ] The indicator is visually distinct but not intrusive
- [ ] The indicator updates when harmony data changes

---

### Version 60 - Multi-day Ritual History with Opaque Dialog Modal

#### Ritual History Display
- [ ] Multi-day ritual history is displayed in reverse-chronological order (newest first)
- [ ] Each day's ritual entry shows the prompt, date, and both partners' responses
- [ ] Photos are rendered inline using ExternalBlob direct URLs
- [ ] Expand/collapse functionality works for each day's entry

#### Dialog Modal Readability
- [ ] Dialog modal has opaque background (forced bg-card)
- [ ] Dialog modal has visible border (border-2)
- [ ] Text is readable in both light and dark themes
- [ ] No transparency issues that affect readability

---

### Version 59 - Step 2A Limit-based Fetching

#### Memories Page
- [ ] Initial load shows a limited number of ritual entries (e.g., 10)
- [ ] "Load more" button is visible when more entries are available
- [ ] Clicking "Load more" fetches additional entries
- [ ] "Load more" button is hidden when all entries are loaded
- [ ] Progressive loading works smoothly without UI jumps

---

### Version 58 - Enhanced Synchronization

#### Love Languages Quiz Synchronization
- [ ] Animated sync confirmation banner appears after both partners complete the quiz
- [ ] Emergency fallback error handling with retry mechanism works
- [ ] Real-time partner synchronization with polling updates the UI
- [ ] Persistent result storage with automatic loading works
- [ ] Comprehensive synced/waiting state management with visual feedback
- [ ] Proper error detection for sync issues

---

### Version 57 - Admin Override Functionality

#### Activities Page Admin Override
- [ ] Admin users see all packs unlocked regardless of streak progress
- [ ] Admin badges are displayed on unlocked packs for admin users
- [ ] Non-admin users see packs locked/unlocked based on streak progress
- [ ] Admin override does not affect non-admin users' experience

---

### Version 56 - Love Challenges Placeholder

#### Love Challenges Component
- [ ] Love Challenges section displays "coming soon" placeholder message
- [ ] No backend challenge system is called
- [ ] The placeholder is clear and user-friendly

---

### Version 55 - Reward Visuals Placeholder

#### Reward Visuals Component
- [ ] Reward Visuals section displays placeholder state
- [ ] Message indicates backend couple progress tracking is not yet implemented
- [ ] The placeholder is clear and user-friendly

---

### Version 54 - Harmony UI Helper Utilities

#### Harmony Utilities
- [ ] Percent rounding is consistent across all harmony displays
- [ ] 7-day trend normalization works correctly
- [ ] Trend label computation displays correct labels (e.g., "Rising", "Stable", "Declining")
- [ ] Display formatting is consistent with the design system

---

### Version 53 - Spin Wheel Deceleration

#### Spin Wheel Component
- [ ] Deterministic smooth ease-out cubic deceleration works
- [ ] Stable per-spin duration stored in ref
- [ ] Weighted selection based on quiz results with localStorage persistence
- [ ] "Coming soon" note about smoother slow-stop/deceleration polish is visible

---

### Version 52 - Completion Animation Performance

#### Completion Animation
- [ ] Animated floating hearts component renders without performance issues
- [ ] Memoized heart generation avoids unnecessary recalculations
- [ ] Animation is smooth and visually appealing

---

### Version 51 - Profile Setup Success Animation

#### Profile Setup Modal
- [ ] Form submission works correctly
- [ ] Loading states are displayed during submission
- [ ] Success animation with checkmark appears after successful profile initialization
- [ ] Automatic navigation callback to Us tab after successful profile setup

---

### Version 50 - Login Button Query Cache Clearing

#### Login/Logout Flow
- [ ] Login button displays correct state (Login/Logout)
- [ ] Loading states are displayed during login/logout
- [ ] Comprehensive query cache clearing on logout ensures clean state transitions
- [ ] No stale data is displayed after logout

---

### Version 49 - Rounded Sans-serif Font Family

#### Typography
- [ ] Rounded sans-serif font family (Nunito, Quicksand, Comfortaa) is applied
- [ ] Font family is consistent across all pages and components
- [ ] Font rendering is smooth and readable

---

### Version 48 - Fade-in-up Animation

#### Landing Page Animations
- [ ] Fade-in-up animation keyframes are defined
- [ ] Sections animate on scroll with fade-in-up effect
- [ ] Animation respects prefers-reduced-motion preference

---

### Version 47 - Romantic Color Palette

#### Color System
- [ ] Romantic color palette (romantic-primary, romantic-accent, romantic-deep, romantic-light) is applied
- [ ] Peach/cream tones are used for warmth
- [ ] Colors are consistent across light and dark modes
- [ ] OKLCH color system is used for all color tokens

---

### Version 46 - Theme Flash Prevention

#### Theme Initialization
- [ ] Pre-React theme initialization script prevents theme flash on load
- [ ] Only 'dark' class is applied for dark mode (Tailwind-compatible)
- [ ] Light mode is default (no class applied)
- [ ] Theme preference is loaded from localStorage

---

### Version 45 - Our Love Languages Card

#### Us Page
- [ ] Our Love Languages card displays dynamic subtitle
- [ ] Status line shows current state (e.g., "Both completed", "Waiting for partner")
- [ ] Primary action button navigates to Love Languages tab
- [ ] Insights shortcut link navigates to Insights tab
- [ ] Optional one-time highlight animation after pairing

---

### Version 44 - Data States Components

#### Shared UI Building Blocks
- [ ] Loading state component displays correctly
- [ ] Empty state component displays correctly
- [ ] Error state component displays correctly
- [ ] Section headers are consistent across all tabs
- [ ] Inline variants for lists/panels work correctly

---

### Version 43 - Version 64 Build Identifier

#### Main Entry Point
- [ ] Version 64 build identifier is logged to console on app load
- [ ] Console log is visible in browser developer tools

---

### Version 42 - Theme Context

#### Theme Management
- [ ] ThemeProvider wraps the app correctly
- [ ] useTheme hook is available for backward compatibility
- [ ] Theme toggle works correctly
- [ ] Theme preference persists across page reloads

---

### Version 41 - Theme Toggle Component

#### Theme Toggle Button
- [ ] Theme toggle button displays correct icon (sun/moon)
- [ ] Clicking the button toggles between light and dark modes
- [ ] Aria-label is correct and accessible
- [ ] Icon synchronization with theme state works correctly

---

### Version 40 - Landing Page Theme-aware Styling

#### Landing Page
- [ ] All sections use theme-aware styling (bg-background, bg-card, bg-muted, text-foreground, text-muted-foreground)
- [ ] Controlled accordion state with chevron rotation works
- [ ] Compact header/footer brand displays correctly
- [ ] Our Story expand/collapse functionality works
- [ ] Improved screenshot fitting in phone mockups

---

### Version 39 - Landing Screenshot Carousel

#### Screenshot Carousel
- [ ] Responsive screenshot carousel displays correctly
- [ ] Phone mockup is visible and properly styled
- [ ] Navigation buttons work correctly
- [ ] Auto-advance functionality works
- [ ] Dot indicators show current slide

---

### Version 38 - Landing Footer Links Dialog

#### Footer Links Dialog
- [ ] Modal dialog opens when clicking footer links (Contact, Terms, Privacy, Investor)
- [ ] Theme-aware bg-card and border-border styling
- [ ] Functional mailto link using CONTACT_EMAIL constant
- [ ] Dialog closes correctly

---

### Version 37 - Founder Story Content

#### Our Story Section
- [ ] Full founder story text is displayed
- [ ] Text references "GrowInLove" consistently
- [ ] Story is engaging and well-formatted

---

### Version 36 - URL Parameter Utilities

#### URL Parameter Management
- [ ] Hash-based routing support works
- [ ] Session storage persistence works
- [ ] Secret parameter handling works
- [ ] App mode management (landing/app switching) with localStorage persistence
- [ ] Custom event-based change listeners work correctly

---

### Version 35 - Landing Hero Screenshot Showcase

#### Hero Screenshot Showcase
- [ ] Hero screenshot showcase displays correctly
- [ ] Phone mockup is visible and properly styled
- [ ] Dot indicators show current slide
- [ ] Shared landing screenshots from landingScreenshots.ts are used

---

### Version 34 - Prefers Reduced Motion Hook

#### Accessibility
- [ ] usePrefersReducedMotion hook detects user preference
- [ ] Animations respect prefers-reduced-motion preference
- [ ] No animations play when user prefers reduced motion

---

### Version 33 - Section Entrance Hook

#### Landing Page Animations
- [ ] useSectionEntrance hook provides intersection-observer-based entrance animations
- [ ] Automatic reduced-motion support works
- [ ] Sections animate on scroll

---

### Version 32 - Landing Brand Component

#### Landing Brand
- [ ] Resilient landing brand component with image error handling
- [ ] Text-only fallback works when image fails to load
- [ ] Compact/default layout variants for header/footer use

---

### Version 31 - Tree Logo Asset

#### Logo Asset
- [ ] Transparent PNG of the tree logo displays correctly
- [ ] Logo is used in landing header and footer branding
- [ ] Logo is 256x256px and properly sized

---

### Version 30 - Contact Email Constant

#### Contact Information
- [ ] CONTACT_EMAIL constant is exported
- [ ] Contact email is used in landing footer dialog contact section

---

### Version 29 - Landing Our Story Component

#### Our Story Component
- [ ] Landing-only Our Story component displays correctly
- [ ] Truncated preview (first 3 paragraphs) is shown
- [ ] Accessible Read more/Read less toggle button works

---

### Version 28 - Landing Screenshots Configuration

#### Landing Screenshots
- [ ] Shared landing screenshot configuration array is used
- [ ] Both hero and carousel components use consistent GrowInLove app screenshots
- [ ] Screenshots display correctly across all landing page mockups
