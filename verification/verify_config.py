from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Capture console
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        # Navigate
        page.goto("http://localhost:3006/Kani-Worksheet-App/")

        # Login
        page.fill('input[placeholder="Enter your name..."]', "Jules Config Tester")
        page.click('button:has-text("Start Adventure")')
        page.wait_for_selector('text=Verbs', timeout=10000)

        # Go to Settings
        print("Navigating to Settings...")
        page.click('button[aria-label="Settings"]')

        # Handle Password Modal
        page.wait_for_selector('input[type="password"]', timeout=5000)
        page.fill('input[type="password"]', "Superdad")
        page.click('button:has-text("Unlock")')

        page.wait_for_selector('text=Workbook Tiles', timeout=10000)

        # Hide Tile 1
        print("Hiding Tile 1...")
        page.select_option('select >> nth=0', "")

        # Screenshot settings to confirm
        page.screenshot(path="verification/settings_change.png")

        # Go back
        page.click('button:has-text("Back")')

        # Check if Verbs is gone
        time.sleep(2)
        page.screenshot(path="verification/landing_after_hide.png")

        if page.get_by_text("Verbs").count() == 0:
            print("SUCCESS: Verbs tile hidden.")
        else:
            print(f"FAILURE: Verbs tile still present. Count: {page.get_by_text('Verbs').count()}")

        browser.close()

if __name__ == "__main__":
    run()
