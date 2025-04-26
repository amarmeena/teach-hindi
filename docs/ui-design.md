# UI Design Requirements

## Theme & Color
- Light mode and dark mode support with a toggle in the top right corner.
- Theme toggle uses a sun icon for light mode and a moon icon for dark mode.
- Theme toggle always overrides system/browser settings.
- Background and foreground colors use CSS variables for easy theming.
- High readability: light backgrounds (#f7f7fa) and deep foregrounds (#18181b) for light mode; soft dark backgrounds (#23272f) and light foregrounds (#f3f4f6) for dark mode.

## Accessibility
- All interactive elements (buttons, toggles) have accessible labels (e.g., `aria-label`).
- Sufficient color contrast for text and UI elements.
- Keyboard navigation supported for all major actions (lesson navigation, toggles, etc.).
- Responsive font sizes and layouts.

## Navigation
- Sidebar for lesson/chapter navigation, visible on desktop and togglable on mobile.
- Progress indicator for current lesson/chapter.
- Navigation buttons for "Previous" and "Next" lessons.

## Responsiveness
- Fully responsive design for mobile, tablet, and desktop.
- Sidebar collapses into a mobile menu with a toggle button.
- Main content adapts to screen size, maintaining readability and usability.

## UI Components
- Reusable Button component for consistent actions.
- Card-style containers for lessons and practice sections.
- Grid layout for vocabulary pairs.
- Section headers for clear separation (Vocabulary, Practice, etc.).

## User Experience
- Loading state for course content fetch.
- Immediate feedback on theme toggle.
- No flash of incorrect theme on load (theme is set before React renders).
- Progress and navigation are always visible and easy to use.

## Future Considerations
- Support for custom themes or color schemes.
- Animation for transitions (e.g., Framer Motion).
- Enhanced accessibility (screen reader support, focus outlines). 