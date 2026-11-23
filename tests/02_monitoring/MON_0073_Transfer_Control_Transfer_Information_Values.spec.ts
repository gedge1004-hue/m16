import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MapView } from '@mapView';
import { MenuPage } from '@menuPage';

test('MON_0073 Transfer Control - Transfer Information Values', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const mapView = new MapView(page);
    const menuPage = new MenuPage(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');

    await common.deleteAllTasks();
    await mapView.installCarrier(73, 340);
    await page.mouse.click(73, 340, { button: 'left' });
    await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();

    const transferPanel = page.getByRole('tabpanel', { name: 'Transfer Control' }).first();
    const transferList = transferPanel.getByRole('table');
    const taskRow = transferPanel.locator('.el-table-v2__row.task-info-table__row').first();
    await expect(taskRow).toBeVisible();

    const columnNames = (await transferList.getByRole('columnheader').allInnerTexts())
        .map((name) => name.trim());
    const rowCells = taskRow.getByRole('cell');
    const rowCellCount = await rowCells.count();
    const getValue = async (columnName: string) => {
        const index = columnNames.indexOf(columnName);
        expect(index, `Missing Transfer List column: ${columnName}`).toBeGreaterThanOrEqual(0);
        expect(index, `No row cell for Transfer List column: ${columnName}`).toBeLessThan(rowCellCount);
        return (await rowCells.nth(index).innerText()).trim();
    };

    await page.mouse.move(73, 340);
    await page.waitForTimeout(1000);

    const taskId = await getValue('Task ID');
    const carrierId = await getValue('Carrier ID');
    const zoneIdFrom = await getValue('Zone ID From');
    const zoneIdTo = await getValue('Zone ID To');
    const zoneIdJunctions = await getValue('Zone ID Junctions');
    const taskState = await getValue('Task State');
    const currentLocation = await getValue('Current Location');
    const installTime = await getValue('Install Time');

    if (taskId) {
        expect(taskId).toMatch(/^\d+$/);
    }
    if (carrierId) {
        expect(carrierId.trim()).not.toBe('');
    }
    expect(zoneIdFrom).toMatch(/^\d+$/);
    for (const zoneId of [zoneIdTo, zoneIdJunctions, currentLocation]) {
        if (zoneId) {
            expect(zoneId).toMatch(/^\d+$/);
        }
    }
    if (taskState) {
        expect(taskState).toBe('READY');
    }
    if (installTime) {
        expect(Number.isNaN(Date.parse(installTime))).toBe(false);
    }
    if (currentLocation) {
        expect(currentLocation).toBe(zoneIdFrom);
    }

    await common.deleteAllTasks();
});
