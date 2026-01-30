# GrowInLove App

## Overview
GrowInLove is a relationship-focused mobile web application with a soft, romantic design aesthetic featuring a blush-pink color scheme and rounded interface elements.

## Visual Design System
- Global soft blush-pink background with warm peach and cream accent tones
- Rounded corners throughout the interface
- Typography: Rounded sans-serif font family with large headings and 18-20pt body text
- Gentle fade transitions between screens and component entrances
- Soft highlight effects for active elements
- Subtle floating hearts and glow pulse animations

## Authentication & Profile Setup Flow
### Initial User Experience
- After Internet Identity login, check if user has an initialized profile
- If `getCallerUserProfile()` returns null, display ProfileSetup modal immediately
- Modal prevents access to main app until profile is initialized

### ProfileSetup Modal
- Overlay modal with soft blush-pink styling and rounded design elements
- Heart icon decoration consistent with app theme
- Input field for user name with rounded styling and soft glow focus effect
- "Get Started" button with soft hover animation and loading state
- Clear error handling with gentle feedback messages
- Success state with brief confirmation before transitioning

### Profile Initialization Process
- On form submission, call `initializeUserProfile(name, null)` backend function
- Display loading state during backend call
- On success, refresh user profile data and automatically navigate to Us tab
- On error, display clear feedback message and allow retry

## Navigation Structure
The app features a fixed bottom navigation bar with 5 main sections:

1. **Home** - Heart icon, main daily ritual screen
2. **Insights** - Lightbulb icon, relationship insights section (placeholder)
3. **Our Love Languages** - Two hearts icon, love languages quiz section
4. **Activities** - Sparkle icon, relationship activities section (placeholder)
5. **Us** - Silhouettes/settings icon, profile and couple pairing area

## Navigation Behavior
- Bottom navigation remains fixed at the bottom of the screen
- Large tap zones for mobile-friendly interaction
- Active tabs display with soft highlight glow or tint
- Inactive tabs use soft, muted tones
- Smooth fade transitions when switching between tabs

## Home Screen
### Top Bar
- Logo placeholder on the left
- Notification icon placeholder on the right

### Today's Ritual Card
- Large card occupying approximately 60% of the screen
- Daily ritual prompt retrieved from backend
- Input area for partner responses with text placeholder
- Interactive elements:
  - Emoji picker button
  - Image upload button (placeholder functionality)
  - Voice note button (placeholder functionality)
- Large rounded "Submit" button with soft hover animation

### Ritual Submission States
- **Both partners not submitted**: Show input form with submit button
- **One partner submitted**: Display "Waiting for Partner..." state with gentle pulsing animation
- **Both partners submitted**: Show completion animation with floating hearts and glow effects, then display both responses

### Visual Elements Below Ritual Card
- Shared streak counter with glowing chain effect linking two lazy doge avatar placeholders, updates dynamically based on consecutive completed rituals
- "Harmony Meter" heart-shaped progress bar that fills based on ritual completion frequency

### Pairing Requirement
- If user is not paired with a partner, display a gentle message directing them to the "Us" tab to complete pairing before accessing rituals

## Our Love Languages Screen
### Header Section
- Main title: "Our Love Languages"
- Subtitle: "Discover how you both feel most loved"

### Central Content
- Welcoming card with cute illustration placeholder of two curious doges
- Description text encouraging users to take the quiz
- Prominent soft pink button: "Start the Quiz (5–7 min)"
- Supporting note: "Both partners answer separately → results sync instantly"

### Pairing Requirement
- If user is not paired with a partner, display a gentle message directing them to the "Us" tab to complete pairing before accessing the quiz

## Us Screen - Couple Pairing
### Header Section
- Main title: "Connect with Your Partner"
- Subtitle: "Link your accounts to start your journey together"

### Pairing Interface (Unpaired Users)
#### Generate Code Section
- Card with title "Share Your Code"
- Large display of generated 6-digit pairing code
- "Generate New Code" button with soft pink styling
- "Copy Code" button with confirmation feedback
- "Share Link" button to share pairing link

#### Enter Code Section
- Card with title "Enter Partner's Code"
- Input field for 6-digit code with validation
- "Connect" button with soft hover animation
- Clear error messages for invalid or expired codes

### Pairing Success State
- Display both partners' names
- Pairing confirmation message: "You're connected! 💕"
- Subtle celebratory animation with small floating hearts
- Glowing connection chain visual element
- "Start Your Journey" button leading to Home screen

### Already Paired State
- Display both partners' names
- Connection status with glowing heart icon
- Pairing date information
- Settings and profile management options (placeholder)

## Placeholder Screens
- **Insights**: Styled placeholder maintaining design consistency
- **Activities**: Styled placeholder maintaining design consistency

## Screen Layout
- Mobile-first responsive design optimized for portrait view
- Generous spacing and padding throughout
- Top bar area for logos and icons
- Main content area with centered screen titles
- Fixed bottom navigation optimized for mobile interaction
- Rounded elements and soft transitions throughout

## Technical Requirements
- Mobile-first responsive design
- Smooth animations and transitions including floating hearts and glow pulses
- Touch-friendly interface elements with large tap zones
- English language content throughout
- Component entrance animations with gentle fade effects
- Frontend state management to track pairing status and disable ritual access until pairing is complete
- Profile initialization check on app load with conditional modal display
- Query hook for profile initialization with proper error handling and loading states

## Backend Requirements
### Data Storage
- Store user profiles with names and partner relationships
- Store and manage 6-digit pairing codes with expiration in persistent `codeToPrincipal` mapping
- Store daily ritual entries with partner responses (text, emoji selections)
- Link ritual entries to couple profiles
- Track ritual completion status for both partners
- Calculate and store streak counter data
- Calculate and store harmony meter progress
- Maintain secure, private data storage on-chain tied to paired users

### Core Operations
- Initialize user profiles with `initializeUserProfile(name, null)` function
- Retrieve user profile data with `getCallerUserProfile()` function
- Generate unique 6-digit pairing codes and persist them reliably in `codeToPrincipal` mapping
- Validate and process pairing code entries through `checkPairingCode` function that correctly retrieves existing mapping entries
- Initialize user profiles with names and partner IDs
- Complete pairing process through `completePairing` function that forms two-way partner relationships using `assignPartner`
- Only remove codes from `codeToPrincipal` after pairing is confirmed complete
- Include validation to prevent premature deletion of codes and ensure codes remain valid until completion
- Retrieve daily ritual prompts
- Save individual partner responses to daily rituals
- Check completion status for both partners
- Update streak counter when both partners complete a ritual
- Update harmony meter based on ritual completion frequency
- Retrieve historical ritual data and responses
- Verify pairing status for ritual access control

### Pairing Logic Requirements
- `createPairingCode` function must persist codes reliably in `codeToPrincipal` until successfully used
- `checkPairingCode` function must correctly retrieve existing mapping entries and return appropriate partner principal
- `completePairing` function must successfully form two-way partner relationship and only remove code after pairing completion
- Include necessary validation to prevent premature code deletion
- Ensure codes remain valid throughout the entire pairing process
- Profile initialization must be completed before pairing functions can execute
