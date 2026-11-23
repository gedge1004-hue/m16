import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0080 Single Axis Control - Select Zone Status', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const singleAxisControl = new SingleAxisControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');

    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();

    const changedZone = 'Zone_2012002 LD';
    const comparisonZone = 'Zone_2012003 LD';
    const singleAxisTab = page.getByRole('tabpanel', { name: 'Single Axis Control' });

    await singleAxisControl.selectZone(changedZone);
    await singleAxisControl.online('Offline', 'Y');
    await singleAxisControl.servoOn('Servo Off', 'Y');

    await singleAxisControl.selectZone(comparisonZone);
    await expect(singleAxisTab.getByText('IN_SERVICE', { exact: true })).toBeVisible();
    await expect(singleAxisTab.getByText('STAND_STILL', { exact: true })).toBeVisible();

    await singleAxisControl.selectZone(changedZone);
    await expect(singleAxisTab.getByText('OFFLINE', { exact: true })).toBeVisible();
    await expect(singleAxisTab.getByText('DISABLE', { exact: true })).toBeVisible();

    await singleAxisControl.selectZone(changedZone);
    await singleAxisControl.online('Online', 'Y');
    await singleAxisControl.servoOn('Servo On', 'Y');
});
