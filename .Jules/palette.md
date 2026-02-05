## 2026-02-04 - Hybrid Data Loading Logic

**Learning:** In applications supporting both local file and remote API data sources, the configuration resolution logic must robustly handle defaults. We observed that the `worksheetSettings` state (user preferences) could mask the default `worksheetNumber` defined in the static topic configuration, causing the app to skip checking for local files and fail when attempting to fetch from a placeholder remote URL.

**Action:** Ensure that data loading functions explicitly fallback to static configuration defaults (e.g., `topic.worksheetNumber`) if user-specific overrides are undefined, before determining the data source strategy.

## 2026-02-04 - Dynamic Asset Generation for Math Content

**Learning:** Mathematical concepts like fractions require accurate visual representation. Using placeholders or static generic images for dynamic questions (e.g., random numerators/denominators) degrades the learning experience.

**Action:** Implement programmatic generation of assets (SVGs) when creating content batches. For pie charts, use `path` elements with arc commands (`A`) rather than simple shapes to correctly render fractions.

## 2026-02-04 - Configurable UI with Dynamic Fallbacks

**Learning:** Implementing a user-configurable dashboard (e.g., "10 Configurable Tiles") requires careful state initialization and fallback logic. When a user configuration is partial or missing, the UI should gracefully fallback to a safe default set (e.g., pre-packaged topics) rather than rendering empty or broken slots. Additionally, verification of such features requires checking the *absence* of elements, which can lead to false positives in automated tests if substring matching is used (e.g., "Verbs" matching "Adverbs").

**Action:** Initialize user configuration state with robust defaults. Use strict equality checks or unique IDs in verification scripts. Ensure the UI filters out empty/hidden slots cleanly.

## 2026-02-04 - TypeScript in Legacy/Hybrid Projects

**Learning:** When auditing a React/Vite project with TypeScript, explicitly checking for missing type definitions (like `@types/react`) is crucial even if the project builds via Vite (which may skip type checking). Vite's `build` command does not always run `tsc`.

**Action:** Always run `npx tsc --noEmit` as part of the audit process. Ensure `env.d.ts` exists for CSS modules and `vite/client` types.

## 2026-02-04 - Keyboard Interaction Patterns for Interactive Divs

**Learning:** The application uses many interactive `div` elements (like Mascot cards and Topic tiles) that originally relied on `onKeyPress` (deprecated) and only listened for 'Enter'. This excludes users who navigate via keyboard and expect 'Space' to trigger selection, and `onKeyPress` is not reliably fired for non-character keys.

**Action:** Replace `onKeyPress` with `onKeyDown` for all interactive non-button elements. Explicitly handle both `Enter` and `Space` keys, and call `e.preventDefault()` for `Space` to prevent page scrolling during interaction.
