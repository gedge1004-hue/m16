import { test, expect } from '@playwright/test';
import {
    abortCarrier,
    expectSensorStatus,
    installCarrierForSensor,
    sensorRow,
    setupSensorTest,
} from '@sensorTestUtils';

test('MON_0117 Single Axis Control - Sensor Status Color and Text', async ({ page }) => {
    const { mapView } = await setupSensorTest(page);
    await expectSensorStatus(page, 1, 'OFF');

    try {
        await installCarrierForSensor(mapView, 1);
        await expectSensorStatus(page, 1, 'ON');
        const onColor = await sensorRow(page, 1).locator('.sensor-tag')
            .evaluate(element => getComputedStyle(element).backgroundColor);

        await abortCarrier(page);
        await expectSensorStatus(page, 1, 'OFF');
        const offColor = await sensorRow(page, 1).locator('.sensor-tag')
            .evaluate(element => getComputedStyle(element).backgroundColor);

        expect(onColor).not.toBe(offColor);
    } finally {
        const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
        while (await taskRows.count()) {
            await abortCarrier(page);
        }
    }
});
