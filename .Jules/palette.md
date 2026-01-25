## 2025-02-20 - Keyboard Accessibility Pattern
**Learning:** This app frequently uses `div` elements as interactive buttons (Mascots, Topics, Answers) but consistently relied on the deprecated `onKeyPress` event and only handled the 'Enter' key, ignoring 'Space'. This excludes users expecting standard button behavior.
**Action:** When implementing or fixing interactive `div`s, always use `onKeyDown` and explicitly handle both 'Enter' and 'Space' keys, ensuring `e.preventDefault()` is called for 'Space' to prevent scrolling.
