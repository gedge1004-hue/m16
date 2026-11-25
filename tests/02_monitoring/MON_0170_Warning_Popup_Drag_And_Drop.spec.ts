import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0170 Warning Popup - Drag and Drop', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    const transferControl = new TransferControl(page);
    const singleAxisControl = new SingleAxisControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();
    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone('Zone_2012017 LD');
    await singleAxisControl.reset('Y');
    await page.getByRole('tab', { name: 'Transfer Control', exact: true }).click();

    try {
        await mapView.installCarrier(73, 340);
        await common.popupClose();
        await page.mouse.click(73, 340, { button: 'left' });
        await mapView.addJunction(520, 385);
        await transferControl.reverseChangeDestination('Y');

        const warningHeader = page.locator('header.el-dialog__header', { hasText: 'Warning' });
        const warningDialog = page.locator('.el-dialog').filter({ has: warningHeader });
        await expect(warningDialog).toBeVisible({ timeout: 10000 });

        const headerBox = await warningHeader.boundingBox();
        const dialogBefore = await warningDialog.boundingBox();
        if (!headerBox || !dialogBefore) {
            throw new Error('Warning popup geometry is unavailable');
        }

        await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + 15);
        await page.mouse.down();
        await page.mouse.move(headerBox.x + headerBox.width / 2 + 120, headerBox.y + 95, { steps: 10 });
        await page.mouse.up();

        await expect.poll(async () => (await warningDialog.boundingBox())?.x ?? -1)
            .toBeGreaterThan(dialogBefore.x + 50);
    } finally {
        await common.popupClose();
        await common.deleteAllTasks();
        await common.alarmAllClear();
    }
});
