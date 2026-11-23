import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0071 Transfer Control - Transfer Information', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');

    await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();

    const transferList = page
        .getByRole('tabpanel', { name: 'Transfer Control' })
        .first()
        .getByRole('table');

    for (const column of [
        'Task ID',
        'Carrier ID',
        'Zone ID From',
        'Zone ID To',
        'Zone ID Junctions',
        'Task State',
        'Current Location',
        'Install Time',
    ]) {
        await expect(transferList.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }
});
