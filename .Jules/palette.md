## 2026-01-21 - Interactive Div Pattern
**Learning:** The application frequently uses `div` elements for interactive components (buttons, radio options) instead of semantic HTML elements.
**Action:** When modifying these components, prioritize adding proper ARIA roles (`button`, `radio`, `radiogroup`), `tabIndex`, and keyboard handlers (`onKeyDown` with Enter/Space support).
