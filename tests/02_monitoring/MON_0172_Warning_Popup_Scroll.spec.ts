import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';

test('MON_0172 Warning Popup - Scroll', async ({ page }) => {
    test.setTimeout(300000);

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    const transferControl = new TransferControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();

    try {
        const carrierLocations = [
            { x: 73, y: 340 },
            { x: 160, y: 340 },
            { x: 247, y: 340 },
            { x: 334, y: 340 },
            { x: 421, y: 340 },
            { x: 508, y: 340 },
        ];

        for (let index = 0; index < carrierLocations.length; index++) {
            const { x, y } = carrierLocations[index];
            await mapView.installCarrier(x, y, index === 0);
            await common.popupClose();
        }

        const taskRows = page.getByRole('table').last().locator('.el-table-v2__row.task-info-table__row');
        await expect(taskRows).toHaveCount(carrierLocations.length);
        const sourceZones = await taskRows.evaluateAll(rows =>
            rows.map(row => row.querySelectorAll('.el-table-v2__cell-text')[3]?.textContent?.trim()),
        );
        expect(new Set(sourceZones).size).toBeGreaterThan(1);

        await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
        const singleAxisTab = page.getByRole('tabpanel', { name: 'Single Axis Control' });
        await singleAxisTab.locator('.el-select').click();
        const zoneOptions = await page.getByRole('option').allTextContents();
        await page.keyboard.press('Escape');

        const installedZoneIds = new Set(sourceZones);
        const junctionZoneIds = [...new Set(zoneOptions
            .map(option => option.match(/Zone_(\d+)\b/)?.[1])
            .filter((zoneId): zoneId is string => Boolean(zoneId)))]
            .filter(zoneId => !installedZoneIds.has(zoneId));
        expect(junctionZoneIds.length).toBeGreaterThanOrEqual(carrierLocations.length);

        const warningHeader = page.locator('header.el-dialog__header', { hasText: 'Warning' });
        const warningDialog = page.locator('.el-dialog').filter({ has: warningHeader });
        const mapCanvas = page.locator('.canvas-wrapper canvas');
        const searchZoneInput = page.locator('.el-input__inner').first();
        const transferPanel = page.getByRole('tabpanel', { name: 'Transfer Control' });

        for (let index = 0; index < carrierLocations.length; index++) {
            await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();
            await taskRows.nth(index).click();

            await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
            await searchZoneInput.fill(junctionZoneIds[index]);
            await page.locator('.el-button.is-circle').click();
            await page.waitForTimeout(2000);

            const mapBox = await mapCanvas.boundingBox();
            if (!mapBox) {
                throw new Error('Map canvas is not available after searching for a Junction zone');
            }
            const junctionX = Math.round(mapBox.x + mapBox.width / 2);
            const junctionY = Math.round(mapBox.y + mapBox.height / 2);
            await mapView.addJunction(junctionX, junctionY, false);
            const mapContextMenu = page.locator('.popover-box');
            if (await mapContextMenu.isVisible()) {
                await page.mouse.click(Math.round(mapBox.x + 20), Math.round(mapBox.y + 20));
            }
            await expect(mapContextMenu).toBeHidden();

            await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();
            await transferControl.reverseChangeDestination('Y');
            await expect(warningDialog).toBeVisible({ timeout: 10000 });

            if (index === 0) {
                const dialogBox = await warningDialog.boundingBox();
                const headerBox = await warningHeader.boundingBox();
                const panelBox = await transferPanel.boundingBox();
                if (!dialogBox || !headerBox || !panelBox || !mapBox) {
                    throw new Error('Warning popup geometry is unavailable');
                }

                const targetX = panelBox.x + panelBox.width - dialogBox.width - 20;
                const targetY = panelBox.y + panelBox.height - dialogBox.height - 20;
                const startX = headerBox.x + headerBox.width / 2;
                const startY = headerBox.y + headerBox.height / 2;
                await page.mouse.move(startX, startY);
                await page.mouse.down();
                await page.mouse.move(
                    startX + targetX - dialogBox.x,
                    startY + targetY - dialogBox.y,
                    { steps: 20 },
                );
                await page.mouse.up();

                await expect.poll(async () => {
                    const movedDialog = await warningDialog.boundingBox();
                    return movedDialog ? movedDialog.x > mapBox.x + mapBox.width : false;
                }).toBe(true);
            }
        }

        const warningRows = warningDialog.locator('.el-dialog__body li');
        await expect.poll(() => warningRows.count()).toBeGreaterThanOrEqual(carrierLocations.length);

        const popupBody = warningDialog.locator('.el-scrollbar__wrap');
        await expect.poll(
            () => popupBody.evaluate(element => element.scrollHeight > element.clientHeight),
        ).toBe(true);

        await popupBody.evaluate(element => element.scrollTo(0, element.scrollHeight));
        await expect.poll(() => popupBody.evaluate(element => element.scrollTop))
            .toBeGreaterThan(0);

        await popupBody.evaluate(element => element.scrollTo(0, 0));
        await expect.poll(() => popupBody.evaluate(element => element.scrollTop))
            .toBe(0);
    } finally {
        await common.popupClose();
        await common.deleteAllTasks();
        await common.alarmAllClear();
    }
});
