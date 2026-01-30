## 2024-05-22 - Keyboard Accessibility for Interactive Divs
**Learning:** Interactive elements implemented as `div`s (like custom cards or buttons) must use `onKeyDown` instead of `onKeyPress` (which is deprecated). Crucially, they must explicitly handle both 'Enter' and 'Space' keys. For 'Space', `e.preventDefault()` is required to prevent page scrolling.
**Action:** When auditing or creating custom interactive components, always check for `onKeyDown` and ensure both activation keys are handled correctly.
