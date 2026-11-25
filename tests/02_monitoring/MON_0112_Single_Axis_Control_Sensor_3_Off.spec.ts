import { test } from '@playwright/test';
import {
    abortCarrier,
    expectSensorStatus,
    installCarrierForSensor,
    setupSensorTest,
} from '@sensorTestUtils';

test('MON_0112 Single Axis Control - Sensor 3 Off', async ({ page }) => {
    const { mapView } = await setupSensorTest(page);
    await expectSensorStatus(page, 3, 'OFF');

    try {
        await installCarrierForSensor(mapView, 3);
        await expectSensorStatus(page, 3, 'ON');
        await abortCarrier(page);
        await expectSensorStatus(page, 3, 'OFF');
    } finally {
        const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
        while (await taskRows.count()) {
            await abortCarrier(page);
        }
    }
});
