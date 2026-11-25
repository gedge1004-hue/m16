import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0152 Event Log - Carrier Paused', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    const transferControl = new TransferControl(page);
    const singleAxisControl = new SingleAxisControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();
    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone('Zone_2012002 LD');
    await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();
    await mapView.installCarrier(73, 340);
    await common.popupClose();
    await page.mouse.click(73, 340, { button: 'left' });

    const taskRow = page.locator('.el-table-v2__row.task-info-table__row').first();
    const taskState = taskRow.locator('.el-table-v2__cell-text').nth(6);

    try {
        await expect(taskState).toHaveText('READY');
        await mapView.addJunction(520, 385);
        await transferControl.changeDestination('Y');
        await expect(taskState).toHaveText('TRANSFERRING');

        await taskRow.dblclick();
        const commandPicker = page.locator('.el-dialog').filter({ hasText: /Task \d+ Command Picker/ });
        await expect(commandPicker).toBeVisible();
        await commandPicker.getByRole('button', { name: 'Pause', exact: true }).click();
        await expect(taskState).toHaveText('PAUSED');

        await common.expectEventLog(/Transfer paused in Zone \d+ reason\[0\]/i);
    } finally {
        await common.deleteAllTasks();
    }

    await common.alarmAllClear();
});
