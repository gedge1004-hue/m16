import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0097 Single Axis Control - QS Move N90', async ({ page }) => {
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
    const mapBeforeMove = await mapCanvas.screenshot();

    try {
        await singleAxisControl.moveQs('N90', 'Y');
        await expect.poll(async () => (await mapCanvas.screenshot()).equals(mapBeforeMove)).toBe(false);
    } finally {
        await singleAxisControl.home('Y');
    }
});
