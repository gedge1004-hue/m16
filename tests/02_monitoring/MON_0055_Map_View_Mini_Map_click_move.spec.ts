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
    await common.initializeMouseTracker();

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');

    await mapView.miniMapOnOff('N');

    // Canvas 요소 지정 및 대기
    const mapCanvas = page.locator('.canvas-wrapper canvas');
    await mapCanvas.waitFor({ state: 'visible' });

    await page.waitForTimeout(2000);

    // 현재 화면에서 캔버스의 시작 좌표와 크기 획득
    const box = await mapCanvas.boundingBox();

    // 미니 맵 클릭
    if (box) {
        const finalClickX = box.x + box.width - 100; // 우측 하단에서 100px 왼쪽으로 이동
        const finalClickY = box.y + box.height - 15;
        await page.mouse.click(finalClickX, finalClickY);
    } else {
        console.error('❌ 하단 클릭 실행 실패: 캔버스 box 좌표 정보가 유효하지 않습니다.');
    }

    // 해당 지도 Canvas 영역만 정확하게 스크린샷 촬영
    await expect(mapCanvas).toHaveScreenshot('map_mini_map_click_move.png');

    await common.deleteAllTasks();
});
