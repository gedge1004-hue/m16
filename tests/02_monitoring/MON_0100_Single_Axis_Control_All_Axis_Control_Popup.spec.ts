import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0100 Single Axis Control - All Axis Control Popup', async ({ page }) => {
    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    await common.goto();
    await common.changeLanguage('us');
    await loginPage.login('tester', 'tester');
    await menuPage.navigateTo('monitoring');
    await common.deleteAllTasks();

    await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    const singleAxisTab = page.getByRole('tabpanel', { name: 'Single Axis Control' });
    await singleAxisTab.getByRole('button', { name: 'All Axis Control', exact: true }).click();

    const dialog = page.getByRole('dialog').last();
    for (const command of ['Servo On', 'Servo Off', 'Homing', 'Clear Motor Error', 'Stop']) {
        await expect(dialog.getByRole('button', { name: command, exact: true })).toBeVisible();
    }
    await dialog.getByRole('button', { name: 'Close this dialog' }).click();
});
