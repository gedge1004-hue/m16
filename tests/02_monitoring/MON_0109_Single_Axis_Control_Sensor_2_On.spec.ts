import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0109 Single Axis Control - Sensor 2 On', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    const singleAxisControl = new SingleAxisControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();

    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone('Zone_2012002 LD');

    const sensor2 = page.getByRole('tabpanel', { name: 'Single Axis Control' })
        .getByText('Sensor 2', { exact: true }).locator('..');
    await expect(sensor2).toHaveText(/Sensor 2OFF/);

    try {
        await mapView.installCarrier(160, 340);
        await expect(sensor2).toHaveText(/Sensor 2ON/);
    } finally {
        await common.deleteAllTasks();
    }

    await expect(sensor2).toHaveText(/Sensor 2OFF/);
});
