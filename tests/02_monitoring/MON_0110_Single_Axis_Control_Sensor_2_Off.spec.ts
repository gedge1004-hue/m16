import { test } from '@playwright/test';
import {
    abortCarrier,
    expectSensorStatus,
    installCarrierForSensor,
    setupSensorTest,
} from '@sensorTestUtils';

test('MON_0110 Single Axis Control - Sensor 2 Off', async ({ page }) => {
    const { mapView } = await setupSensorTest(page);
    await expectSensorStatus(page, 2, 'OFF');

    try {
        await installCarrierForSensor(mapView, 2);
        await expectSensorStatus(page, 2, 'ON');
        await abortCarrier(page);
        await expectSensorStatus(page, 2, 'OFF');
    } finally {
        const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
        while (await taskRows.count()) {
            await abortCarrier(page);
        }
    }
});
