import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0043 Map View area', async ({ page }) => {

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
    // 맵뷰 확인
    const canvasArea = page.locator('.canvas-wrapper canvas').first();
    // 완전히 데이터 렌더링이 끝난 깨끗한 246 맵 이미지를 캡처하여 비교합니다.
    await expect(canvasArea).toHaveScreenshot('map_area.png', { 
        maxDiffPixelRatio: 0.1, // 실시간 데이터 미세 오차 허용
        timeout: 8000 
    });
});
