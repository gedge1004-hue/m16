import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { SingleAxisControl } from '@singleAxisControl';
import { MapView } from '@mapView';

test('MON_0103 Single Axis Control - All Axis Homing', async ({ page }) => {
    test.setTimeout(120000);

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const singleAxisControl = new SingleAxisControl(page);
    const mapView = new MapView(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();
    await mapView.miniMapOnOff('N');

    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone('Zone_2012019 QS');

    const singleAxisTab = page.getByRole('tabpanel', { name: 'Single Axis Control' });
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
    const mapBeforeN90 = await captureTargetZone();
    await singleAxisControl.moveQs('N90', 'Y');
    await expect.poll(
        async () => (await captureTargetZone()).equals(mapBeforeN90),
        { timeout: 10000 },
    ).toBe(false);

    const nonHomeDirectionMap = await captureTargetZone();
    await singleAxisControl.allAxisControl('Homing', 'Y');
    await expect(singleAxisTab.getByText('STAND_STILL', { exact: true })).toBeVisible({ timeout: 60000 });
    await expect.poll(
        async () => (await captureTargetZone()).equals(nonHomeDirectionMap),
        { timeout: 30000 },
    ).toBe(false);
});
