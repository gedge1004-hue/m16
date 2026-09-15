import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';

test('MON_0061 Transfer Control Buttons', async ({ page }) => {

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

    // current zone detail 팝업 전체 레이아웃이 화면에 완전히 나타날 때까지 대기
    const transferControlButtons = page.locator('.flex-none.flex.flex-wrap.gap-x-2.gap-y-1');
    await transferControlButtons.waitFor({ state: 'visible', timeout: 5000 });

    await expect(transferControlButtons).toHaveScreenshot('transfer_control_buttons.png', {
        maxDiffPixelRatio: 0.02 // 미세한 폰트 안티앨리어싱 오차 무시 옵션
    });

    await common.deleteAllTasks();
    
});
