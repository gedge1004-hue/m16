import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0008 Communication state - Command popup cancel', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // 로그인 성공 문구 확인
    await expect(page.getByText('Welcome to Conveyor Control System', { exact: true })).toBeVisible({ timeout: 5000 });
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');
    // Communication State 클릭하여 command 팝업 띄우기
    const commState = page.locator('.state-row').first();
    await commState.click();
    // command 팝업 확인
    await expect(page.getByRole('heading', { name: 'Communication State Command', exact: true })).toBeVisible({ timeout: 5000 });
    // command 팝업 cancel
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
});
