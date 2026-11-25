import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { SingleAxisControl } from '@singleAxisControl';
import { TransferControl } from '@transferControl';

test('MON_0092 Single Axis Control - Reset Releases Reserved Zone', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    const singleAxisControl = new SingleAxisControl(page);
    const transferControl = new TransferControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();

    await mapView.installCarrier(73, 340);
    await page.mouse.click(73, 340, { button: 'left' });
    await page.mouse.click(520, 385, { button: 'left' });
    await transferControl.forceReserve('Y');

    const reservedTask = page.getByText(/^Reserved Task:/);
    await expect(reservedTask).not.toHaveText('Reserved Task: None');

    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone('Zone_2012017 LD');
    await singleAxisControl.reset('Y');

    await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();
    await expect(reservedTask).toHaveText('Reserved Task: None');

    await common.deleteAllTasks();
});
