import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { Control } from '@control';

test('MON_0039 Service status TCM ON', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const control = new Control(page);


    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Control 페이지 진입
    await menuPage.navigateTo('control');
    // TCM ON 진행
    await control.controlTCM('TCM_single', 'TCM-201', 'on');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');
    // 'ul' 태그 아래에서 'TCM' 글자를 가진 개별 li 버튼 항목만 명확하게 타겟팅
    const tcmButtonArea = page.locator('ul').locator('li', { hasText: '201' }).first();
    // 화면에 나타날 때까지 대기
    await expect(tcmButtonArea).toBeVisible({ timeout: 5000 });
    // TCM 서비스 버튼 영역만 정확하게 잘라내어 이미지 비교
    await expect(tcmButtonArea).toHaveScreenshot('tcm_on_green_area.png', { timeout: 8000 });
});
