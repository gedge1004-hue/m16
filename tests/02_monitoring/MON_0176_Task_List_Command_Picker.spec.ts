import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';

test('MON_0176 Task List - Command Picker', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);

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
        await common.popupClose();
        await page.mouse.click(73, 340, { button: 'left' });

        await expect(taskRows).toHaveCount(1);
        const taskRow = taskRows.first();
        await expect(taskRow).toBeVisible();
        await expect(taskRow.locator('.el-table-v2__cell-text').nth(6)).toHaveText('READY');
        await taskRow.dblclick();

        await expect(commandPicker).toBeVisible();
        await expect(commandPicker.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
        await expect(commandPicker.getByRole('button', { name: 'Resume', exact: true })).toBeVisible();
        await expect(commandPicker.getByRole('button', { name: 'Abort', exact: true })).toBeVisible();
    } finally {
        await common.deleteAllTasks();
        await common.popupClose();
        await common.alarmAllClear();
    }
});
