import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0174 Task List - No Data', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');

    const taskList = page.getByRole('table').last();
    const taskRows = taskList.locator('.el-table-v2__row.task-info-table__row');
    const commandPicker = page.locator('.el-dialog').filter({ hasText: /Task \d+ Command Picker/ });

    while (await taskRows.count() > 0) {
        const rowCount = await taskRows.count();
        if (!(await commandPicker.isVisible())) {
            await taskRows.first().dblclick();
        }
        await expect(commandPicker).toBeVisible();
        await commandPicker.getByRole('button', { name: 'Abort', exact: true }).click();
        await expect.poll(() => taskRows.count(), { timeout: 30000 }).toBeLessThan(rowCount);
    }

    await expect(page.getByText('No Data', { exact: true }).last()).toBeVisible();
    await expect(taskRows).toHaveCount(0);
});
