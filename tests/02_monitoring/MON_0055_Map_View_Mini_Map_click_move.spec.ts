import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';
import fs from 'fs';
import path from 'path';

test('MON_0055 Map View - Mini Map Click Move', async ({ page }, testInfo) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    
    //마우스 트래커
    await common.initializeMouseTracker();

    // GUI 진입
    await common.goto();
    // 언어 변경(US)    
    await common.changeLanguage('us');
    // 로그인 진행
    await loginPage.login('tester', 'tester');
    // Monitoring 페이지 진입
    await menuPage.navigateTo('monitoring');

    // Canvas 요소 지정 및 대기
    const mapCanvas = page.locator('.canvas-wrapper canvas');
    await mapCanvas.waitFor({ state: 'visible' });

    await page.waitForTimeout(2000);

    const testFileFilepath = testInfo.file; // 현재 실행 중인 spec.ts의 전체 절대 경로
    const testFileDir = path.dirname(testFileFilepath); // 파일이 속한 폴더 경로 (02_monitoring)
    const testFileName = path.basename(testFileFilepath); // 파일명 (MON_0054_...spec.ts)

    const snapshotPath = path.join(
        testFileDir,
        'snapshots',
        `${testFileName}-snapshots`,
        'map_mini_map_open.png'
    );

    // 현재 화면의 캔버스 영역만 실시간으로 캡처 (메모리 버퍼로 획득)
    const currentScreenshot = await mapCanvas.screenshot();

    // 기존에 저장된 스냅샷 파일을 읽어와서 실시간 캡처본과 비교
    const baselineScreenshot = fs.readFileSync(snapshotPath);

    // 두 이미지의 데이터가 완벽히 일치하면 0을 반환합니다. (일치하면 true, 다르면 false)
    const isMiniMapOpen = baselineScreenshot.compare(currentScreenshot) === 0;

    // 현재 화면에서 캔버스의 시작 좌표와 크기 획득
    const box = await mapCanvas.boundingBox();

    // 비교 결과에 따른 조건문 (미니맵이 열려있지 않은 경우에만 클릭)
    if (!isMiniMapOpen) {        
        console.log('⚠️ 스크린샷 불일치: 미니맵이 닫혀있는 상태로 판정되어 우측 하단을 클릭합니다.');

        if (box) {
            // 우측 최하단 좌표 계산 (안쪽으로 15px 유예)
            const clickX = box.x + box.width - 15;
            const clickY = box.y + box.height - 15;

            console.log(`🎯 캔버스 우측 하단 좌표 계산 완료 -> X: ${clickX}, Y: ${clickY}`);

            // 해당 절대 좌표 위치를 마우스 클릭하여 미니맵 열기
            await page.mouse.click(clickX, clickY);
            console.log('✅ 캔버스 내부 우측 최하단 영역을 클릭했습니다.');
            
            // 미니맵이 열리는 애니메이션 시간을 고려하여 잠시 대기
            await page.waitForTimeout(1000);

             // 해당 지도 Canvas 영역만 정확하게 스크린샷 촬영
            await expect(mapCanvas).toHaveScreenshot('map_mini_map_open.png', {
                maxDiffPixelRatio: 0.05, // 지도의 미세한 렌더링 오차 방지 (5% 허용)
                threshold: 0.2
            });
        } else {
            console.error('❌ 캔버스 영역의 크기를 측정하지 못했습니다.');
        }

    } else {
        console.log('✅ 스크린샷 일치: 미니맵이 이미 정상적으로 열려 있습니다.');
    }

    // 미니 맵 클릭
    if (box) {
        const finalClickX = box.x + box.width - 100; // 우측 하단에서 100px 왼쪽으로 이동
        const finalClickY = box.y + box.height - 15;
        await page.mouse.click(finalClickX, finalClickY);
    } else {
        console.error('❌ 하단 클릭 실행 실패: 캔버스 box 좌표 정보가 유효하지 않습니다.');
    }

    // 해당 지도 Canvas 영역만 정확하게 스크린샷 촬영
    await expect(mapCanvas).toHaveScreenshot('map_mini_map_click_move.png', {
        maxDiffPixelRatio: 0.05, // 지도의 미세한 렌더링 오차 방지 (5% 허용)
        threshold: 0.2
    });

    await common.deleteAllTasks();
});
