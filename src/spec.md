# Specification

## Summary
**Goal:** Fix theme state/icon desynchronization by centralizing theme handling in a single global provider, and improve readability of the Home → Ritual History entry dialog by making its content surface opaque.

**Planned changes:**
- Add a single global ThemeProvider/ThemeContext that stores `theme` (`light`|`dark`|`system`) and `effectiveTheme` (`light`|`dark`) and is the only place that mutates `document.documentElement` theme classes.
- Refactor the existing theme hook API to consume the context without DOM reads during render, and ensure only one system theme `matchMedia` listener exists (active only when `theme === 'system'`).
- Update ThemeToggle to render and toggle using ThemeContext values (icon state + aria-label) to prevent desync.
- Restrict theme persistence so `localStorage` is written only when the user explicitly changes theme (set/toggle), and restore the saved preference on reload.
- Make the Home → Ritual History entry dialog content surface fully opaque (optionally with subtle backdrop blur) via call-site `className` overrides, without modifying any files under `frontend/src/components/ui`.

**User-visible outcome:** Theme toggling and system-theme syncing work reliably with correctly matched toggle icon/label, and Ritual History entry dialogs are clearly readable in both light and dark modes.
