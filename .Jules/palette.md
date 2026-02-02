## 2025-10-26 - Interactive Div Pattern
**Learning:** Many interactive elements (buttons, radios) are implemented as `div`s with `onClick` and `onKeyPress` (Enter only). They lack support for the Space key, which is critical for keyboard accessibility.
**Action:** When touching these components, systematically replace `onKeyPress` with `onKeyDown`, add Space key support (with `preventDefault`), and ensure correct ARIA roles are present.
