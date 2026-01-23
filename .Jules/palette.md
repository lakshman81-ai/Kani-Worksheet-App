# Palette's Journal - Critical UX/A11y Learnings

This journal documents CRITICAL accessibility and UX learnings discovered while working on this project.
It is NOT a changelog. Only add entries that provide reusable insights or highlight project-specific patterns.

## Format
`## YYYY-MM-DD - [Title]`
`**Learning:** [UX/a11y insight]`
`**Action:** [How to apply next time]`

## 2024-05-23 - Interactive Divs vs Semantic Buttons
**Learning:** The project frequently uses `div` elements for interactive components (Mascot cards, Topic cards, Answers) with `role="radio"` or `role="button"`. A common oversight was implementing `onKeyPress` (deprecated) for 'Enter' but missing `onKeyDown` for 'Space'. This excludes keyboard users who expect Spacebar activation for buttons and radios.
**Action:** When auditing components, specifically check any non-semantic interactive element for BOTH 'Enter' and 'Space' support in `onKeyDown`. Ideally, refactor to use `<button>` or `<input type="radio">` where possible, but if `div` is preserved, ensure full keyboard emulation.
