import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0094 Single Axis Control - LD Move Backward', async ({ page }) => {
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
    await singleAxisControl.selectZone('Zone_2012002 LD');

    const singleAxisTab = page.getByRole('tabpanel', { name: 'Single Axis Control' });
    const mapCanvas = page.locator('.canvas-wrapper canvas');
    const mapBeforeMove = await mapCanvas.screenshot();

    await singleAxisControl.move('Backward', 'Y');
    try {
        await expect(singleAxisTab.locator('.el-select')).toContainText('Zone_2012002 LD');
        await expect(singleAxisTab.getByText('MOVING', { exact: true })).toBeVisible({ timeout: 15000 });
        await expect.poll(async () => (await mapCanvas.screenshot()).equals(mapBeforeMove)).toBe(false);
    } finally {
        await singleAxisControl.stop();
    }
});
