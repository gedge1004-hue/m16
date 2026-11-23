import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';

test('MON_0068 Transfer Control - Reverse Change Destination', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const mapView = new MapView(page);
    const menuPage = new MenuPage(page);
    const transferControl = new TransferControl(page);
    
    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');

    await mapView.miniMapOnOff('N');
    
    await common.deleteAllTasks();
    
    await mapView.installCarrier(73, 340);

    // Carrier 클릭
    await page.mouse.click(73, 340, { button: 'left' });

    // Task State 기존 확인
    const taskState = page.locator('.el-table-v2__cell-text').nth(6);
    await expect(taskState).toHaveText('READY');

    await mapView.addJunction(520, 385);

    // Chage Destination 버튼 클릭 후 팝업에서 OK 버튼 클릭
    await transferControl.changeDestination('Y');

    // Task State 변경 확인
    await expect(taskState).toHaveText('TRANSFERRING');

    await page.waitForTimeout(10000);

    const mapCanvas = page.locator('.canvas-wrapper canvas');

    // 해당 지도 Canvas 영역만 정확하게 스크린샷 촬영
    await expect(mapCanvas).toHaveScreenshot('before_reverse.png');

    await mapView.addJunction(73, 340);

    // Reverse Change Destination 버튼 클릭 후 팝업에서 OK 버튼 클릭
    await transferControl.reverseChangeDestination('Y');

    await page.waitForTimeout(10000);

    // 해당 지도 Canvas 영역만 정확하게 스크린샷 촬영
    await expect(mapCanvas).toHaveScreenshot('after_reverse.png');

    await common.deleteAllTasks();
    
});
