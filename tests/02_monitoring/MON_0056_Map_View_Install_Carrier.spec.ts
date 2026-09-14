import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';

test('MON_0056 Map View - Install Carrier', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const mapView = new MapView(page);
    const menuPage = new MenuPage(page);
    
    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');

    await mapView.installCarrier(73, 340);

    // 전체 캔버스에서 초록색 사각형(좌상단 구석)만 쏙 잘라내기
    await expect(page).toHaveScreenshot('map_install_carrier_zone.png', {
        clip: {
            x: 70,      // 캔버스 왼쪽 끝 시작점
            y: 320,     // Y축 조정
            width: 70,  // 초록색 사각형 가로 크기만큼 (픽셀)
            height: 70  // 초록색 사각형 세로 크기만큼 (픽셀)
        },
        maxDiffPixels: 50, // 미세한 렌더링 오차 방지
        threshold: 0.2
    });

    await common.deleteAllTasks();
});
