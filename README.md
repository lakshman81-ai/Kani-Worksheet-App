<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zzzuD136K25Z8zTG3xfpFHTzjy24Q1FQ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   `npm run dev`

## Adding New Worksheets

This app supports local "Worksheet Packages". To add a new worksheet:

1.  Create a folder `public/Worksheet X` (where X is a number).
2.  Add your questions in a `questions.csv` file inside that folder.
3.  Run the index updater:
    `npm run update-index`
4.  Restart the app or refresh the page.
