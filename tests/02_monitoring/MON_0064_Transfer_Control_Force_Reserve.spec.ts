import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';

test('MON_0064 Transfer Control - Force Reserve', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const mapView = new MapView(page);
    const menuPage = new MenuPage(page);
    const transferControl = new TransferControl(page);
    
    // await common.initializeMouseTracker();
    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');

    await mapView.installCarrier(73, 340);

    // Carrier 클릭
    await page.mouse.click(73, 340, { button: 'left' });
    
    // 다른 Zone 클릭
    await page.mouse.click(520, 385, { button: 'left' });

    // Force Reserve 버튼 클릭 후 팝업에서 OK 버튼 클릭
    await transferControl.forceReserve('Y');
    
    const mapCanvas = page.locator('.canvas-wrapper canvas');
    // 맵뷰에서 force reserve 상태 확인 가능하게 다른 곳 클릭
    await mapCanvas.click({ position: { x: 50, y: 100 } });

    await page.waitForTimeout(1000); // 1초 대기 (필요에 따라 조정 가능)

    // 해당 지도 Canvas 영역만 정확하게 스크린샷 촬영
    await expect(mapCanvas).toHaveScreenshot('map_force_reserve_on.png');

    await common.deleteAllTasks();
    
});
