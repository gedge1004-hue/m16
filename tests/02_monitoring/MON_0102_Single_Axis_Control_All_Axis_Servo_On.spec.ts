import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { SingleAxisControl } from '@singleAxisControl';

test('MON_0102 Single Axis Control - All Axis Servo On', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const singleAxisControl = new SingleAxisControl(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();

    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    await singleAxisControl.selectZone('Zone_2012002 LD');

    const singleAxisTab = page.getByRole('tabpanel', { name: 'Single Axis Control' });
    let servoOnRestored = false;
    try {
        await singleAxisControl.allAxisControl('Servo Off', 'Y');
        await expect(singleAxisTab.getByText('DISABLE', { exact: true })).toBeVisible();

        await singleAxisControl.allAxisControl('Servo On', 'Y');
        await expect(singleAxisTab.getByText('IN_SERVICE', { exact: true })).toBeVisible();
        await expect(singleAxisTab.getByText('STAND_STILL', { exact: true })).toBeVisible();
        servoOnRestored = true;
    } finally {
        if (!servoOnRestored) {
            await singleAxisControl.allAxisControl('Servo On', 'Y');
        }
    }
});
