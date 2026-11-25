import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0171 Warning Popup - Detail', async ({ page }) => {
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

        const warningRows = warningDialog.locator('.el-dialog__body li');
        await expect(warningRows.first()).toBeVisible();
        await warningRows.first().click();

        for (const field of [
            'AlarmCode',
            'AlarmName',
            'ReasonCode',
            'ReasonName',
            'Situation',
            'Description',
            'Solution',
        ]) {
            await expect(warningDialog).toContainText(new RegExp(field, 'i'));
        }
    } finally {
        await common.popupClose();
        await common.deleteAllTasks();
        await common.alarmAllClear();
    }
});
