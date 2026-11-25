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
    await common.deleteAllTasks();
    await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();

    const transferPanel = page.getByRole('tabpanel', { name: 'Transfer Control' }).first();
    await expect(transferPanel.getByText('No Data', { exact: true })).toBeVisible();
    await expect(transferPanel.locator('.el-table-v2__row.task-info-table__row')).toHaveCount(0);
});
