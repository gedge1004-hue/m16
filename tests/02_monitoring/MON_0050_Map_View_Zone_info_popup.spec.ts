import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0050 Map View - Zone Info Popup', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    
    //마우스 트래커
    await common.initializeMouseTracker();

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');

    // Canvas 요소 지정 및 대기
    const mapCanvas = page.locator('.canvas-wrapper canvas');
    await mapCanvas.waitFor({ state: 'visible' });

    // 마우스 이동 후 zone info popup 확인
    await page.mouse.move(311, 330);
    
    await page.waitForTimeout(2000);
    
    // 해당 지도 Canvas 영역만 정확하게 스크린샷 촬영
    await expect(mapCanvas).toHaveScreenshot('map_zone_info.png', {
        maxDiffPixelRatio: 0.05, // 지도의 미세한 렌더링 오차 방지 (5% 허용)
        threshold: 0.2
    });

    await common.deleteAllTasks();
});
