import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { Equipment } from '@equipment';
import { SingleAxisControl } from '@singleAxisControl';


test('test', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    const equipment = new Equipment(page);
    const singleAxisControl = new SingleAxisControl(page);
    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');
    // await page.getByRole('tab', { name: 'Single Axis Control', exact: true }).click();
    // await singleAxisControl.selectZone('Zone_2012019 QS');
    // await singleAxisControl.moveQs('N90', 'Y');

    // Alarm 탭 선택
    await page.getByRole('tab', { name: 'Alarm' }).click();

    // Alarm 탭 패널 및 내부 요소 로케이터 정의
    const alarmPane = page.locator('#pane-1');
    const alarmRows = alarmPane.locator('.el-table__body tbody tr.el-table__row');
    const allClearBtn = alarmPane.getByRole('button', { name: 'All Clear' });

    // 테이블 데이터가 로드될 시간 확보 (네트워크 요청이 있다면 waitForLoadState 등 활용)
    await page.waitForTimeout(500); // 필요에 따라 API 응답 대기로 대체 권장

    // Alarm 데이터 행이 1개 이상 존재하면 All Clear 버튼 클릭
    if ((await alarmRows.count()) > 0) {
        await allClearBtn.click();
    
        // (선택 사항) 클릭 후 모든 행이 사라졌는지 검증
        await expect(alarmRows).toHaveCount(0);
    }
});
