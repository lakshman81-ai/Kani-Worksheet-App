## 2026-02-04 - Hybrid Data Loading Logic

**Learning:** In applications supporting both local file and remote API data sources, the configuration resolution logic must robustly handle defaults. We observed that the `worksheetSettings` state (user preferences) could mask the default `worksheetNumber` defined in the static topic configuration, causing the app to skip checking for local files and fail when attempting to fetch from a placeholder remote URL.

**Action:** Ensure that data loading functions explicitly fallback to static configuration defaults (e.g., `topic.worksheetNumber`) if user-specific overrides are undefined, before determining the data source strategy.
