import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';

test('MON_0177 Task List - Pause Transfer', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    const transferControl = new TransferControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');

    await common.deleteAllTasks();

    const taskList = page.getByRole('table').last();
    const taskRows = taskList.locator('.el-table-v2__row.task-info-table__row');
    const commandPicker = page.locator('.el-dialog').filter({ hasText: /Task \d+ Command Picker/ });

    try {
        await mapView.installCarrier(73, 340);
        await page.mouse.click(73, 340, { button: 'left' });

        await expect(taskRows).toHaveCount(1);
        const taskRow = taskRows.first();
        const taskState = taskRow.locator('.el-table-v2__cell-text').nth(6);
        await expect(taskState).toHaveText('READY');

        await mapView.addJunction(520, 385);
        await transferControl.changeDestination('Y');
        await expect(taskState).toHaveText('TRANSFERRING');

        await page.waitForTimeout(2000);

        await taskRow.dblclick();
        await expect(commandPicker).toBeVisible();
        await commandPicker.getByRole('button', { name: 'Pause', exact: true }).click();
        await expect(taskState).toHaveText('PAUSED');
    } finally {
        await common.deleteAllTasks();
        await common.popupClose();
        await common.alarmAllClear();
    }
});
