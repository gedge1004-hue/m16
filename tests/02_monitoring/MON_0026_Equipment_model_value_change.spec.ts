import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { Equipment } from '@equipment';

test('MON_0026 Equipment model value change', async ({ page }) => {

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
    const defaultModelValue = await equipValueLocator.first().textContent();

    // Equipment model 값 변경
    await equipment.equipState('model', 'test_model', 'ok');
    const changedModelValue = page.locator('.value-box').first();
    // 변경된 model 값 확인
    expect(await changedModelValue.textContent()).toBe('test_model');

    // default 값으로 복원
    await equipment.equipState('model', defaultModelValue ?? 'T302', 'ok');
    // 복원된 model 값 확인
    const restoredModelValue = page.locator('.value-box').first();    
    expect(await restoredModelValue.textContent()).toBe(defaultModelValue);

});
