import { test, expect } from '@playwright/test';
import { Common } from '@common';
import { LoginPage } from '@login';
import { MenuPage } from '@menuPage';

test('MON_0043 Map View - Out Port', async ({ page }) => {

    const common = new Common(page);
    const loginPage = new LoginPage(page);
    const menuPage = new MenuPage(page);
    
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

      // 원하는 만큼 지도를 크게 쓸어 넘기기 위해 2~3회 반복 실행
    for (let i = 0; i < 2; i++) {
        const box = await mapCanvas.boundingBox();
        if (!box) break;

        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;

        // 수치를 300~400px 정도로 크게 늘려 원하는 구역을 화면 안으로 확 당김
        // (원하는 목적지 방향에 따라 부호 -/+ 를 조절)
        const targetX = startX - 330;
        const targetY = startY - 110;

        // 루프 대신 Playwright 내장 steps 옵션만 사용하여 한 줄로 부드럽게 이동
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(targetX, targetY, { steps: 10 }); // 💡 10단계만으로 충분히 드래그 인식 가능
        await page.mouse.up();

        // 다음 드래그 전 라이브러리가 위치를 연산할 수 있도록 미세 대기
        await page.waitForTimeout(300);
    }

    // 💡전체 캔버스에서 초록색 사각형(좌상단 구석)만 쏙 잘라내기
    await expect(page).toHaveScreenshot('map_output_zone.png', {
        clip: {
            x: 70,      // 캔버스 왼쪽 끝 시작점
            y: 320,     // 상단 카메라 아이콘 아래부터 시작하도록 Y축 조정
            width: 70,  // 초록색 사각형 가로 크기만큼 (픽셀)
            height: 70  // 초록색 사각형 세로 크기만큼 (픽셀)
        },
        maxDiffPixels: 50, // 미세한 렌더링 오차 방지
        threshold: 0.2
    });
});
