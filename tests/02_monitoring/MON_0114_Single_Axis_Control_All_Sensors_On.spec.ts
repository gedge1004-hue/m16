import { test } from '@playwright/test';
import {
    abortCarrier,
    expectSensorStatus,
    installCarrierForSensor,
    setupSensorTest,
} from '@sensorTestUtils';

test('MON_0114 Single Axis Control - All Sensors On', async ({ page }) => {
    const { common, mapView } = await setupSensorTest(page);
    const sensors = [1, 2, 3] as const;
    for (const sensor of sensors) {
        await expectSensorStatus(page, sensor, 'OFF');
    }

    try {
        for (const [index, sensor] of sensors.entries()) {
            await installCarrierForSensor(mapView, sensor, index === 0);
            await expectSensorStatus(page, sensor, 'ON');
        }

        for (const sensor of sensors) {
            await expectSensorStatus(page, sensor, 'ON');
        }
    } finally {
        const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
        while (await taskRows.count()) {
            await abortCarrier(page);
        }
    }

    for (const sensor of sensors) {
        await expectSensorStatus(page, sensor, 'OFF');
    }
});
