import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0085 Single Axis Control - Zone State After Alarm', async ({ page }) => {
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

    await mapView.installCarrier(73, 340);
    await page.mouse.click(73, 340, { button: 'left' });
    const junctionId = await mapView.addJunction(520, 385);
    await transferControl.reverseChangeDestination('Y');

    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone(`Zone_${junctionId} LD`);

    const singleAxisTab = page.getByRole('tabpanel', { name: 'Single Axis Control' });
    await expect(singleAxisTab.getByText('ALARM', { exact: true })).toBeVisible();

    await singleAxisControl.reset('Y');
    await expect(singleAxisTab.getByText('NORMAL', { exact: true })).toBeVisible();
    await common.deleteAllTasks();
});
