import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';

test('MON_0059 Map View - Clear', async ({ page }) => {

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

    await mapView.installCarrier(73, 340);

    // // Carrier 클릭
    await page.mouse.click(73, 340, { button: 'left' });

    await mapView.addJunction(520, 385);

    await mapView.setDestination(520, 385);

    await mapView.clear();

    await common.deleteAllTasks();
});
