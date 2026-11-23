import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import { MapView } from '@mapView';
import { TransferControl } from '@transferControl';

test('MON_0070 Transfer Control - Abort', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const mapView = new MapView(page);
    const menuPage = new MenuPage(page);
    const transferControl = new TransferControl(page);
    
    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');

    await mapView.miniMapOnOff('N');
    
    await common.deleteAllTasks();
    
    await mapView.installCarrier(73, 340);

    // Carrier 클릭
    await page.mouse.click(73, 340, { button: 'left' });

    const taskRows = page.locator('.el-table-v2__row.task-info-table__row');
    const taskRow = taskRows.first();
    const taskState = taskRow.locator('.el-table-v2__cell-text').nth(6);
    await expect(taskState).toHaveText('READY');

    await mapView.addJunction(520, 385);

    // Chage Destination 버튼 클릭 후 팝업에서 OK 버튼 클릭
    await transferControl.changeDestination('Y');

    await expect(taskState).toHaveText('TRANSFERRING');

    // Pause All 실행 후 Task State 확인
    await transferControl.pauseAll('Y');
    await expect(taskState).toHaveText('PAUSED');

    // Task 상세 팝업에서 Abort 실행
    await taskRow.dblclick();
    const abortButton = page.getByRole('button', { name: 'Abort', exact: true });
    await abortButton.waitFor({ state: 'visible' });
    await abortButton.click();

    // Abort 완료 상태 및 Task List 삭제 확인
    await expect(taskState).toHaveText('COMPLETE', { timeout: 10000 });
    await expect(taskRows).toHaveCount(0, { timeout: 30000 });
    
});
