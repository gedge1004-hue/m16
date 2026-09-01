import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0048 Map View - FOUP 미선택', async ({ page }) => {

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

    // Canvas 요소 지정 및 대기
    const mapCanvas = page.locator('.canvas-wrapper canvas');
    await mapCanvas.waitFor({ state: 'visible' });

    await page.mouse.click(73, 340, { button: 'right' });
    // 클릭 후 동작 대기
    await page.waitForTimeout(1500);

    // 우클릭 후 팝업 박스가 화면에 나타날 때까지 대기
    const popoverBox = page.locator('.popover-box');
    await popoverBox.waitFor({ state: 'visible', timeout: 3000 });

    // 팝업 박스 내부의 여러 item 중 'Install Carrier' 텍스트를 정확히 매칭하여 클릭
    await popoverBox.locator('.item', { hasText: 'Install Carrier' }).click();
    // 팝업 내부의 OK 버튼 클릭
    await page.locator('.el-dialog__footer .el-button--success', { hasText: 'OK' }).click();
     // 클릭 후 동작 대기
    await page.waitForTimeout(1500);

    // 전체 캔버스에서 초록색 사각형(좌상단 구석)만 쏙 잘라내기
    await expect(page).toHaveScreenshot('map_foup_미선택_zone.png', {
        clip: {
            x: 70,      // 캔버스 왼쪽 끝 시작점
            y: 320,     // 상단 카메라 아이콘 아래부터 시작하도록 Y축 조정
            width: 70,  // 초록색 사각형 가로 크기만큼 (픽셀)
            height: 70  // 초록색 사각형 세로 크기만큼 (픽셀)
        },
        maxDiffPixels: 50, // 미세한 렌더링 오차 방지
        threshold: 0.2
    });
});
