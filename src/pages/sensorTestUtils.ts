import { Page, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { SingleAxisControl } from '@singleAxisControl';

export type SensorNumber = 1 | 2 | 3;
export type SensorStatus = 'ON' | 'OFF';

const carrierLocations: Record<SensorNumber, [number, number]> = {
    1: [73, 340],
    2: [160, 340],
    3: [247, 340],
};

export async function setupSensorTest(page: Page) {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    const singleAxisControl = new SingleAxisControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
    while (await taskRows.count()) {
        await abortCarrier(page);
    }
    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone('Zone_2012002 LD');

    return { common, mapView, singleAxisControl };
}

export function sensorRow(page: Page, sensor: SensorNumber) {
    return page.getByRole('tabpanel', { name: 'Single Axis Control' })
        .getByText(`Sensor ${sensor}`, { exact: true }).locator('..');
}

export async function expectSensorStatus(
    page: Page,
    sensor: SensorNumber,
    status: SensorStatus,
    timeout?: number,
) {
    await expect(sensorRow(page, sensor)).toHaveText(new RegExp(`Sensor ${sensor}${status}`), { timeout });
}

export async function installCarrierForSensor(
    mapView: MapView,
    sensor: SensorNumber,
    ensureMiniMapClosed = true,
) {
    const [x, y] = carrierLocations[sensor];
    await mapView.installCarrier(x, y, ensureMiniMapClosed);
}

export async function abortCarrier(page: Page) {
    const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
    const countBefore = await taskRows.count();
    const taskRow = taskRows.first();
    const taskState = taskRow.locator('.el-table-v2__cell-text').nth(6);

    await expect(taskRow).toBeVisible();
    await taskRow.dblclick();
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    await expect(taskState).toHaveText('PAUSED');

    await taskRow.dblclick();
    await page.getByRole('button', { name: 'Abort', exact: true }).click();
    await expect.poll(async () => taskRows.count(), { timeout: 30000 }).toBe(countBefore - 1);
}
