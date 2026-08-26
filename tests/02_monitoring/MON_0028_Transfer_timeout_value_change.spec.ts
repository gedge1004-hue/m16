import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { Equipment } from '@equipment';

test('MON_0028 Transfer timeout value change', async ({ page }) => {

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
    // Equipment 각 값 원복을 위한 미리 가져오기
    const equipValueLocator = page.locator('.value-box');
    const defaultTimeoutValue = await equipValueLocator.nth(2).textContent();

    // Equipment timeout 값 변경
    await equipment.equipState('timeout', '100000', 'y');
    const changedTimeoutValue = page.locator('.value-box').nth(2);
    // 변경된 timeout 값 확인
    expect(await changedTimeoutValue.textContent()).toBe('100000');

    // default 값으로 복원
    await equipment.equipState('timeout', defaultTimeoutValue ?? '6000', 'y');
    // 복원된 timeout 값 확인
    const restoredTimeoutValue = page.locator('.value-box').nth(2);    
    expect(await restoredTimeoutValue.textContent()).toBe(defaultTimeoutValue);

});
