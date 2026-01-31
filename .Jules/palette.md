## 2026-01-31 - Keyboard Accessibility in Interactive Divs
**Learning:** `div` elements used as interactive components (like cards or buttons) must use `onKeyDown` instead of `onKeyPress` (which is deprecated). Crucially, they must handle both 'Enter' and 'Space' keys to be fully accessible. The 'Space' key needs `e.preventDefault()` to stop the page from scrolling.
**Action:** When auditing or building custom interactive components, always check for `onKeyDown` and explicit 'Space' key handling with scroll prevention.
