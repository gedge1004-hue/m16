import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0006 Communication state - UI', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');
    // Communication UI 이미지 비교 확인
    const equipmentStateArea = page.locator('.equipment-state');
    await expect(equipmentStateArea).toHaveScreenshot('equipment_state.png', { timeout: 5000 });
});
