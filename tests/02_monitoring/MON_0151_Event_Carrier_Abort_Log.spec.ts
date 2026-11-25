import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';

test('MON_0151 Event Log - Carrier Abort', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();
    
    await mapView.installCarrier(73, 340);
    await page.mouse.click(73, 340, { button: 'left' });

    const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
    const taskListRows = page.getByRole('table').last().locator('.el-table-v2__row.task-info-table__row');
    const taskRow = taskRows.first();
    await expect(taskRow.locator('.el-table-v2__cell-text').nth(6)).toHaveText('READY');

    try {
        await taskRow.dblclick();
        const commandPicker = page.locator('.el-dialog').filter({ hasText: /Task \d+ Command Picker/ });
        await expect(commandPicker).toBeVisible();
        await commandPicker.getByRole('button', { name: 'Abort', exact: true }).click();
        await expect(taskListRows).toHaveCount(0, { timeout: 30000 });

        await common.expectEventLog(/Transfer aborted in Zone \d+ reason\[0\]/);
        await common.expectEventLog(/Carrier\s+removed in Zone \d+ reason\[0\]/);
    } finally {
        await common.deleteAllTasks();
    }
    await common.alarmAllClear();
});