import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0040 Service status TCM Location move', async ({ page }) => {

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
    // 'ul' 태그 아래에서 '246' 글자가 정확히 적힌 내부 div(.flexRow)를 찾기
    const tcmMAPArea = page.locator('ul').locator('div.flexRow', { hasText: '246' }).first();
    // 내부 엘리먼트를 직접 클릭하면 맵뷰 이동
    await page.waitForTimeout(2000);
    await tcmMAPArea.click();
    // TCM 선택 시 해당 TCM 영역 맵 확인
    const canvasArea = page.locator('.canvas-wrapper canvas').first();
    // 완전히 데이터 렌더링이 끝난 깨끗한 246 맵 이미지를 캡처하여 비교합니다.
    await expect(canvasArea).toHaveScreenshot('tcm246_map_area.png', { 
        maxDiffPixelRatio: 0.1, // 실시간 데이터 미세 오차 허용
        timeout: 8000 
    });
});
