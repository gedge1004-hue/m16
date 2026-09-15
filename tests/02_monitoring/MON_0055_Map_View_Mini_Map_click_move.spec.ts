import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';

test('MON_0055 Map View - Mini Map Click Move', async ({ page }, testInfo) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    
    //마우스 트래커
    // await common.initializeMouseTracker();

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');

    await mapView.miniMapOnOff('Y');

    // Canvas 요소 지정 및 대기
    const mapCanvas = page.locator('.canvas-wrapper canvas');
    await mapCanvas.waitFor({ state: 'visible' });

    await page.waitForTimeout(2000);

    // 미니맵 클릭 이동
    await mapView.clickMiniMap(100, 15);

    // 해당 지도 Canvas 영역만 정확하게 스크린샷 촬영
    await expect(mapCanvas).toHaveScreenshot('map_mini_map_click_move.png');

    await common.deleteAllTasks();
});
