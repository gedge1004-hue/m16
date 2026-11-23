import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';

test('MON_0078 Transfer Control - Reserved Task Without Selection', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    const transferControl = new TransferControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');

    const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
    await common.deleteAllTasks();
    await mapView.installCarrier(73, 340);
    await page.mouse.click(73, 340, { button: 'left' });

    const taskRow = taskRows.first();
    await expect(taskRow).toBeVisible();
    await mapView.addJunction(520, 385);
    await transferControl.changeDestination('Y');
    await expect(taskRow.locator('.el-table-v2__cell-text').nth(6)).toHaveText('TRANSFERRING');

    await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();
    const reservedTask = page.getByText(/^Reserved Task:/);
    await expect(reservedTask).toHaveText('Reserved Task: None');

    await common.deleteAllTasks();
});
