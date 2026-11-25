import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { SingleAxisControl } from '@singleAxisControl';
import { MapView } from '@mapView';

test('MON_0091 Single Axis Control - Restore QS Home Direction', async ({ page }) => {
    test.setTimeout(90000);

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
    await page.waitForTimeout(1000);
    const homeDirectionMap = await captureTargetZone();
    expect(homeDirectionMap).toMatchSnapshot('qs-home-direction.png');
    let homeDirectionRestored = false;

    try {
        await singleAxisControl.moveQs('N90', 'Y');
        await expect.poll(
            async () => (await captureTargetZone()).equals(homeDirectionMap),
            { timeout: 10000 },
        ).toBe(false);

        await singleAxisControl.home('Y');
        await expect(singleAxisTab.locator('.el-select')).toContainText('Zone_2012019 QS');
        await expect.poll(
            async () => (await captureTargetZone()).equals(homeDirectionMap),
            { timeout: 20000 },
        ).toBe(true);
        homeDirectionRestored = true;
    } finally {
        if (!homeDirectionRestored) {
            const qsMoveCommand = page.getByRole('dialog', { name: 'QS Move Command', exact: true });
            if (await qsMoveCommand.isVisible()) {
                await qsMoveCommand.getByRole('button', { name: 'Cancel', exact: true }).click({ timeout: 3000 });
            }
            await singleAxisTab.getByRole('button', { name: 'Stop', exact: true }).click({ timeout: 3000 });
        }
    }
});
