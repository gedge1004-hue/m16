import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0150 Event Log - Carrier Install', async ({ page }) => {
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
    await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();

    try {
        await mapView.installCarrier(73, 340);
        await common.expectEventLog(/Carrier detected in Zone \d+ reason\[0\]/);
        await common.expectEventLog(/Read RFID in Zone \d+ reason\[0\]/);
    } finally {
        await common.deleteAllTasks();
    }

    await common.alarmAllClear();
});
