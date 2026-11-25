import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0111 Single Axis Control - Sensor 3 On', async ({ page }) => {
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

    const sensor3 = page.getByRole('tabpanel', { name: 'Single Axis Control' })
        .getByText('Sensor 3', { exact: true }).locator('..');
    await expect(sensor3).toHaveText(/Sensor 3OFF/);

    try {
        await mapView.installCarrier(247, 340);
        await expect(sensor3).toHaveText(/Sensor 3ON/);
    } finally {
        await common.deleteAllTasks();
    }

    await expect(sensor3).toHaveText(/Sensor 3OFF/);
});
