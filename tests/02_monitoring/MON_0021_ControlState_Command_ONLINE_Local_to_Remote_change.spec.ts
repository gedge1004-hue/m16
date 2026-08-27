import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { Equipment } from '@equipment';

test('MON_0021 Control state - ON-LINE Local to Remote change', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const equipment = new Equipment(page);

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');
    // Control online local 클릭
    await equipment.conState('onLocal', 'ok'); 
    // Control state 값 영역
    const stateValueBox = page.locator('.state-row').nth(1).locator('.state-value');
    // Control online local 및 배경까지 이미지 비교
    await expect(stateValueBox).toHaveScreenshot('control_online_local.png');
    // Control online remote 클릭
    await equipment.conState('onRemote', 'ok');
    // Control online remote 및 배경까지 이미지 비교
    await expect(stateValueBox).toHaveScreenshot('control_online_remote.png');

});
