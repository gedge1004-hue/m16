import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';

test('MON_0060 Map View - Detail popup', async ({ page }) => {

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

    await common.deleteAllTasks();

    await mapView.installCarrier(73, 340);

    // Carrier 클릭
    await page.mouse.dblclick(73, 340);

    await page.waitForTimeout(4000); // 클릭 후 동작 대기

    // current zone detail 팝업 전체 레이아웃이 화면에 완전히 나타날 때까지 대기
    const dialogModal = page.locator('.el-dialog').first();
    await dialogModal.waitFor({ state: 'visible', timeout: 5000 });

    // 💡 애니메이션(Fade-in) 마무리를 위한 안정성 유예 시간 부여
    await page.waitForTimeout(500);

    // [헤더 영역] 스크린샷 캡처 및 이미지 비교 
    // (타이틀 'Current Zone Detail'과 닫기 X 버튼 영역)
    const modalHeader = dialogModal.locator('.el-dialog__header.show-close');
    await expect(modalHeader).toHaveScreenshot('current_zone_detail_header.png', {
        maxDiffPixelRatio: 0.02 // 미세한 폰트 안티앨리어싱 오차 무시 옵션
    });

    // [바디 영역] 스크린샷 캡처 및 이미지 비교
    // (탭 메뉴들과 하단 센서 On/Off 활성화 상태 영역)
    const modalBody = dialogModal.locator('.el-dialog__body');
    await expect(modalBody).toHaveScreenshot('current_zone_detail_sensor_on.png', {
        maxDiffPixelRatio: 0.02
    });

    await page.mouse.click(10, 10); // 팝업 닫기
    await page.waitForTimeout(1000); // 클릭 후 동작 대기

    // Carrier 클릭
    await page.mouse.dblclick(200, 340);

    await page.waitForTimeout(4000); // 클릭 후 동작 대기

    // [바디 영역] 스크린샷 캡처 및 이미지 비교
    // (탭 메뉴들과 하단 센서 On/Off 활성화 상태 영역)
    await expect(modalBody).toHaveScreenshot('current_zone_detail_sensor_off.png', {
        maxDiffPixelRatio: 0.02
    });

    await common.deleteAllTasks();
});
