import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0089 Single Axis Control - Servo Off', async ({ page }) => {
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
    await singleAxisControl.servoOn('Servo On', 'Y');

    const singleAxisTab = page.getByRole('tabpanel', { name: 'Single Axis Control' });
    const mapCanvas = page.locator('.canvas-wrapper canvas');
    const servoOnMap = await mapCanvas.screenshot();

    await singleAxisControl.servoOn('Servo Off', 'Y');
    try {
        await expect(singleAxisTab.getByText('OUT_OF_SERVICE', { exact: true })).toBeVisible();
        await expect(singleAxisTab.getByText('DISABLE', { exact: true })).toBeVisible();
        await expect(mapCanvas).toBeVisible();
        await expect.poll(async () => (await mapCanvas.screenshot()).equals(servoOnMap)).toBe(false);
    } finally {
        await singleAxisControl.servoOn('Servo On', 'Y');
    }
});
