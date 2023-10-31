import { test, expect } from '@playwright/test';

test('injects script in name variable', async ({ page }) => {

    // Hack message
    const hack_message = 'owned';
    const xss = `<script>alert('${hack_message}')</script>`;
    var alert = '';

    //https://playwright.dev/docs/dialogs
    page.on('dialog', async dialog => {
        console.log(dialog.message());

        alert = dialog.message();       

        dialog.accept();
    });

    // Go to http://www.domxss.com/domxss/01_Basics/00_simple_noHead.html?name= with xss in name variable
    await page.goto(`http://www.domxss.com/domxss/01_Basics/00_simple_noHead.html?name=${xss}`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Expect alert to be xss
    await expect(alert).not.toBe(hack_message);

});