import { test } from '@playwright/test';
import {
    abortCarrier,
    expectSensorStatus,
    installCarrierForSensor,
    setupSensorTest,
} from '@sensorTestUtils';

test('MON_0116 Single Axis Control - Sensor Realtime Reflection', async ({ page }) => {
    const { mapView } = await setupSensorTest(page);
    await expectSensorStatus(page, 1, 'OFF');

    try {
        await installCarrierForSensor(mapView, 1);
        await expectSensorStatus(page, 1, 'ON', 2000);
        await abortCarrier(page);
        await expectSensorStatus(page, 1, 'OFF', 2000);
    } finally {
        const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
        while (await taskRows.count()) {
            await abortCarrier(page);
        }
    }
});
