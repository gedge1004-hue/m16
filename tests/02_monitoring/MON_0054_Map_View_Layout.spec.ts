import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';

test('MON_0054 Map View - Layout', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const mapView = new MapView(page);
    
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

    // Canvas의 중심부 좌표 구하기
    const box = await mapCanvas.boundingBox();
    if (!box) throw new Error('지도 Canvas 영역을 찾을 수 없습니다.');
   
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // 지도 중심 위치로 마우스 이동 후 포커스를 위해 '클릭'
    // 캔버스 기반 지도는 마우스 클릭이 한 번 들어가야 휠 이벤트를 정확히 인식
    await page.mouse.move(centerX, centerY);
    await page.mouse.click(centerX, centerY);

    // 마우스 휠을 뒤로 굴려 줌아웃 (양수가 축소)
    // 한 번에 축소를 많이 하고 싶다면 500~1000 등으로 수치를 키워기
    await page.mouse.wheel(0, 1000);

    // 지도 애니메이션 및 추가 그래픽 렌더링 대기
    // 캔버스 내부 그래픽이 안정화될 수 있도록 최소 1.5초~2초 대기
    await page.waitForTimeout(2000);

    // 해당 지도 Canvas 영역만 정확하게 스크린샷 촬영
    await expect(mapCanvas).toHaveScreenshot('map_layout.png');

    await common.deleteAllTasks();
});
