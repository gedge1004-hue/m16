import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0096 Single Axis Control - QS Move Home', async ({ page }) => {
    test.setTimeout(90000);

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const singleAxisControl = new SingleAxisControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();

    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone('Zone_2012019 QS');

    const mapCanvas = page.locator('.canvas-wrapper canvas');
    const searchZoneInput = page.locator('.el-input__inner').first();
    await searchZoneInput.fill('2012019');
    await page.locator('.el-button.is-circle').click();
    await page.waitForTimeout(1000);

    const mapBox = await mapCanvas.boundingBox();
    if (!mapBox) {
        throw new Error('Map canvas is not available');
    }
    const targetZoneClip = {
        x: Math.round(mapBox.x + mapBox.width / 2 - 35),
        y: Math.round(mapBox.y + mapBox.height / 2 - 35),
        width: 70,
        height: 70,
    };
    const captureTargetZone = () => page.screenshot({ clip: targetZoneClip });

    await singleAxisControl.home('Y');
    const homeDirectionMap = await captureTargetZone();
    let homeDirectionRestored = false;

    try {
        await singleAxisControl.moveQs('N90', 'Y');
        await expect.poll(async () => (await captureTargetZone()).equals(homeDirectionMap)).toBe(false);

        await singleAxisControl.moveQs('Home', 'Y');
        await expect.poll(
            async () => (await captureTargetZone()).equals(homeDirectionMap),
            { timeout: 20000 },
        ).toBe(true);
        homeDirectionRestored = true;
    } finally {
        if (!homeDirectionRestored) {
            await singleAxisControl.home('Y');
        }
    }
});
