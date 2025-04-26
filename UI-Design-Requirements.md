# Teach Hindi – UI/UX Design Requirements

**Based on Apple's Human Interface Guidelines (HIG) for Web**

## 1. General Principles

- **Clarity:** All UI elements must be easy to read and understand. Use clear labels, concise instructions, and intuitive navigation.
- **Deference:** The interface should never overshadow the content. Use subtle backgrounds, clear hierarchy, and avoid unnecessary decoration.
- **Depth:** Use layering, transitions, and visual hierarchy to communicate relationships and guide users.

## 2. Layout & Structure

- **Responsive Design:** The app must look and function well on all screen sizes (desktop, tablet, mobile).
- **Consistent Spacing:** Use consistent padding and margins. Follow an 8pt or 4pt grid for spacing.
- **Sidebar Navigation:**  
  - Always visible on desktop, collapsible on mobile.
  - Clearly highlights the current lesson.
  - Uses clear, large touch targets for navigation.
- **Main Content Area:**  
  - Focuses on the current lesson.
  - Uses cards or panels for grouping related content (e.g., vocabulary, practice).
  - Avoids unnecessary scroll within cards.

## 3. Typography

- **Font:** Use a clean, legible sans-serif font (e.g., system font stack, San Francisco, or Inter).
- **Hierarchy:**  
  - Large, bold headings for lesson titles.
  - Medium-weight subheadings for sections.
  - Body text is regular weight, 16–18px.
- **Contrast:** Ensure sufficient contrast between text and background for accessibility.

## 4. Color & Theming

- **Light & Dark Mode:**  
  - Support both modes, following system preferences.
  - Use neutral backgrounds (white, off-white, or dark gray).
  - Accent color (e.g., blue) for primary actions and highlights.
- **Feedback Colors:**  
  - Use green for success, red for errors, yellow for warnings.
  - Avoid using color as the only means of conveying information.

## 5. Components

- **Buttons:**  
  - Rounded corners, subtle shadows.
  - Clear labels, large touch targets (min 44x44px).
  - Primary (filled), secondary (outline), and ghost (minimal) styles.
- **Cards/Panels:**  
  - Softly rounded corners, subtle drop shadow.
  - Group related content (e.g., vocabulary, practice).
- **Progress Sidebar:**  
  - Shows all lessons, highlights current.
  - Step indicator (numbered circles or progress bar).
- **Practice Interactions:**  
  - "Show Answer" reveals answer inline, with smooth animation.
  - Use clear feedback for correct/incorrect answers (if applicable).

## 6. Accessibility

- **Keyboard Navigation:** All interactive elements must be accessible via keyboard.
- **Screen Reader Support:** Use semantic HTML and ARIA labels where needed.
- **Contrast & Font Size:** Meet WCAG AA standards for contrast and allow font scaling.

## 7. Motion & Animation

- **Subtle Transitions:** Use smooth, subtle transitions for navigation, showing/hiding answers, and sidebar toggling.
- **Avoid Distraction:** Animations should enhance, not distract from, learning.

## 8. Icons & Imagery

- **Minimal Use:** Use icons only to clarify meaning (e.g., navigation, feedback).
- **Consistent Style:** Use a consistent icon set (e.g., SF Symbols, Heroicons).
- **Imagery:** Use only if it adds value to the lesson (e.g., cultural context).

## 9. Error Handling & Feedback

- **Clear Error Messages:** Use plain language, explain how to fix issues.
- **Success Feedback:** Confirm actions (e.g., lesson completed, answer revealed).

## 10. Branding

- **Subtle Branding:** App name and logo in the header, not overpowering.
- **Consistent Style:** All UI elements should feel cohesive and professional.

---

### References
- [Apple Human Interface Guidelines – Web](https://developer.apple.com/design/human-interface-guidelines/web/overview/introduction/)
- [Apple HIG – Layout](https://developer.apple.com/design/human-interface-guidelines/web/layout/)
- [Apple HIG – Controls](https://developer.apple.com/design/human-interface-guidelines/web/controls/)

---

**This document should be referenced by all designers and developers working on Teach Hindi to ensure a consistent, high-quality user experience.** 