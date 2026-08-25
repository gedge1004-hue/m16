import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0004 Server state - connect', async ({ page }) => {

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
    // Server 연결 확인
    await expect(page.getByText('Connected', { exact: true })).toBeVisible();
});
