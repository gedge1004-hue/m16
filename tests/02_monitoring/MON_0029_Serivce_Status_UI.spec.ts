import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { Equipment } from '@equipment';

test('MON_0029 Service status UI verification', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const equipment = new Equipment(page);

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');
    // Service status 영역
    const targetArea = page.locator('.el-splitter-panel').nth(2);
    // 해당 영역만 크롭(Crop)하여 이미지 대조 확인
    await expect(targetArea).toHaveScreenshot('service_status_area.png', { timeout: 8000 });
});
