import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0042 Map View - In Port', async ({ page }) => {

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

    await page.waitForTimeout(2000); // 캔버스 그래픽 렌더링 안정화 대기

    // 💡전체 캔버스에서 초록색 사각형(좌상단 구석)만 쏙 잘라내기
    await expect(page).toHaveScreenshot('map_input_zone.png', {
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
