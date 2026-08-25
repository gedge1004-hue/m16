import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';

test('MON_0001 로그인 실패', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('123', '123');
    // 로그인 실패 문구 확인
    await expect(page.getByText('Failed Login', { exact: true })).toBeVisible({ timeout: 5000 });
});
