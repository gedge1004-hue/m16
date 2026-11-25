import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';

test('MON_0175 Task List - Information', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);

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

    try {
        await mapView.installCarrier(73, 340);
        await common.popupClose();
        await page.mouse.click(73, 340, { button: 'left' });

        await expect(taskRows).toHaveCount(1);
        const taskRow = taskRows.first();
        await expect(taskRow).toBeVisible();

        const columnNames = (await taskList.getByRole('columnheader').allInnerTexts())
            .map((name) => name.trim());
        const rowCells = taskRow.locator('.el-table-v2__cell-text');
        const rowCellCount = await rowCells.count();
        const getValue = async (columnName: string) => {
            const index = columnNames.indexOf(columnName);
            expect(index, `Missing Task List column: ${columnName}`).toBeGreaterThanOrEqual(0);
            expect(index, `No Task List value for column: ${columnName}`).toBeLessThan(rowCellCount);
            return (await rowCells.nth(index).innerText()).trim();
        };

        const taskId = await getValue('Task ID');
        const carrierId = await getValue('Carrier ID');
        const zoneIdFrom = await getValue('Zone ID From');
        const zoneIdTo = await getValue('Zone ID To');
        const junctionZoneId = await getValue('Zone ID Junctions');
        const taskState = await getValue('Task State');
        const currentLocation = await getValue('Current Location');
        const installTime = await getValue('Install Time');

        expect(taskId).toMatch(/^\d+$/);
        expect(carrierId).not.toBe('');
        expect(zoneIdFrom).toMatch(/^\d+$/);
        expect(taskState).toBe('READY');
        expect(currentLocation).toBe(zoneIdFrom);
        expect(Number.isNaN(Date.parse(installTime))).toBe(false);

        for (const zoneId of [zoneIdTo, junctionZoneId]) {
            if (zoneId) {
                expect(zoneId).toMatch(/^\d+$/);
            }
        }
    } finally {
        try {
            while (await taskRows.count() > 0) {
                const rowCount = await taskRows.count();
                if (!(await commandPicker.isVisible())) {
                    await taskRows.first().dblclick();
                }
                await expect(commandPicker).toBeVisible();
                await commandPicker.getByRole('button', { name: 'Abort', exact: true }).click();
                await expect.poll(() => taskRows.count(), { timeout: 30000 }).toBeLessThan(rowCount);
            }
        } finally {
            await common.alarmAllClear();
        }
    }
});
