import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0087 Single Axis Control - Service Offline', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const singleAxisControl = new SingleAxisControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');

    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone('Zone_2012002 LD');
    await singleAxisControl.online('Online', 'Y');

    const singleAxisTab = page.getByRole('tabpanel', { name: 'Single Axis Control' });
    const mapCanvas = page.locator('.canvas-wrapper canvas');
    const onlineMap = await mapCanvas.screenshot();

    await singleAxisControl.online('Offline', 'Y');
    try {
        await expect(singleAxisTab.getByText('OFFLINE', { exact: true })).toBeVisible();
        await expect(mapCanvas).toBeVisible();
        await expect.poll(async () => (await mapCanvas.screenshot()).equals(onlineMap)).toBe(false);
    } finally {
        await singleAxisControl.online('Online', 'Y');
    }
});
