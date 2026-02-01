## 2025-02-01 - Interactive Element Accessibility Pattern
**Learning:** Custom interactive elements (like mascot cards acting as radio buttons) were using `onKeyPress` which is deprecated and inconsistent. They also lacked programmatic label association.
**Action:** Always use `onKeyDown` for custom interactive elements and explicitly handle both 'Enter' and 'Space' keys (with preventDefault for Space). Ensure `htmlFor`/`id` association for all inputs.
