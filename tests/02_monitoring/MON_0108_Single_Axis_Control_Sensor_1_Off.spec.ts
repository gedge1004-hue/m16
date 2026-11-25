import { test } from '@playwright/test';
import {
    abortCarrier,
    expectSensorStatus,
    installCarrierForSensor,
    setupSensorTest,
} from '@sensorTestUtils';

test('MON_0108 Single Axis Control - Sensor 1 Off', async ({ page }) => {
    const { mapView } = await setupSensorTest(page);
    await expectSensorStatus(page, 1, 'OFF');

    try {
        await installCarrierForSensor(mapView, 1);
        await expectSensorStatus(page, 1, 'ON');
        await abortCarrier(page);
        await expectSensorStatus(page, 1, 'OFF');
    } finally {
        const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
        while (await taskRows.count()) {
            await abortCarrier(page);
        }
    }
});
