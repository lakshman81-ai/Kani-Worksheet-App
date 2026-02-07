# 🚀 True/False Question Support

## Pull Request Details

**Branch:** `jules/true-false-feature` → `main`

---

## ✅ What This PR Includes

### 1. True/False Question Type
- **New Component:** `TrueFalseQuestion.tsx` for rendering True/False cards.
- **Logic:** Updated `googleSheetsService.ts` to parse `Type: TF` or `Type: True/False` from CSVs.
- **Integration:** Updated `QuestionScreen.tsx` to render and handle the new question type.
- **Feedback:** "Review" modal now correctly displays the user's answer and the correct answer for True/False questions.

### 2. Bug Fixes & Improvements
- **Submission Logic:** Fixed a bug in `QuestionScreen.tsx` where the submit button logic didn't account for `selectedAnswer` (used by TF/MCQ) vs `typedAnswer` (used by FIB), ensuring reliable submission for all types.
- **Visuals:** Added "True" and "False" specific card styling with proper selection states.

### 3. Verification
- **Unit Tests:** Added `components/__tests__/QuestionScreen_TF.test.tsx` to verify the rendering and submission flow.
- **E2E Verification:** Verified end-to-end user flow (Select Topic -> Answer -> Submit -> Next) using Playwright.

---

## 🛠️ Technical Changes

### Files Modified:
- `components/worksheet/TrueFalseQuestion.tsx` (New)
- `components/QuestionScreen.tsx` (Updated render & submit logic)
- `services/googleSheetsService.ts` (Updated CSV parsing)
- `types.ts` (Updated Question interface)
- `styles/QuestionScreen.module.css` (Added TF styles)

### How to Test:
1.  Add a question with `Type` column set to `TF` in your Google Sheet or local CSV.
2.  Set `Answer` to `True` or `False`.
3.  Open the app, select the topic, and verify the question appears as two large cards.
4.  Select an option and click "Submit".
