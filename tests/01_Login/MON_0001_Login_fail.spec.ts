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
    // ID 입력
    await page.getByPlaceholder('ID').fill('123');
    // Password 입력
    await page.getByPlaceholder('Password').fill('123');
    // login 버튼 클릭
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    // 로그인 실패 문구 확인
    const errorMessage = page.locator('.el-message__content', { hasText: 'Failed Login' });
    await errorMessage.waitFor({ state: 'visible', timeout: 3000 });
});
