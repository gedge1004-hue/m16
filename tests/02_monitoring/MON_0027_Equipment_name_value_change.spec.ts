import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { Equipment } from '@equipment';

test('MON_0027 Equipment name value change', async ({ page }) => {

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
    const defaultNameValue = await equipValueLocator.nth(1).textContent();

    // Equipment name 값 변경
    await equipment.equipState('name', 'test_name', 'ok');
    const changedNameValue = page.locator('.value-box').nth(1);
    // 변경된 name 값 확인
    expect(await changedNameValue.textContent()).toBe('test_name');

    // default 값으로 복원
    await equipment.equipState('name', defaultNameValue ?? '6ACNVB01', 'ok');
    // 복원된 name 값 확인
    const restoredNameValue = page.locator('.value-box').nth(1);    
    expect(await restoredNameValue.textContent()).toBe(defaultNameValue);

});
