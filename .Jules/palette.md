## 2026-01-28 - Keyboard Accessibility for Interactive Divs
**Learning:** React's `onKeyPress` is deprecated and `div` elements with `role="button"` do not natively handle Space key activation like `<button>` elements do.
**Action:** Always replace `onKeyPress` with `onKeyDown` for interactive non-button elements and explicitly handle both `Enter` and `Space` (with `preventDefault` for Space to prevent scrolling).
