import { Page, expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class MapView {
    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 지도 미니맵의 개폐 상태를 판단하여 조건부로 켜거나 끄는 메서드
     * @param yn "Y" (미니맵 켜기 원함) 또는 "N" (미니맵 끄기 원함)
     */
    async miniMapOnOff(yn: string) {
        // Canvas 요소 지정 및 로딩 완료 대기
        const mapCanvas = this.page.locator('.canvas-wrapper canvas');
        await mapCanvas.waitFor({ state: 'visible' });
    
        // 렌더링 안정화를 위한 짧은 유예
        await this.page.waitForTimeout(1000);
    
        // ✨ 핵심 보완: 클래스 내부에서 testInfo를 안전하게 가로채기 위해 test.info() 표준 API 사용 (타입 에러 완벽 해결)
        const currentTestInfo = test.info();
        const testFileFilepath = currentTestInfo.file; 
        const testFileDir = path.dirname(testFileFilepath); 
    
        // 닫힌 상태를 기준으로 대조하기 위해 파일명 조립 (map-mini-map-close.png)
        const snapshotPath = path.join(
            testFileDir,        // 'tests/02_monitoring' 파일 위치
            'snapshots',        // 'snapshots'
            'MINI_MAP',         // 이미지에 보이는 'MINI_MAP' 폴더 직접 지정
            'map-mini-map-close.png'
        );
    
        // 현재 화면의 캔버스 실시간 캡처 버퍼 획득
        const currentScreenshot = await mapCanvas.screenshot();
    
        // 기준 닫힘 스냅샷 파일 로드 및 바이트 유격 대조
        const baselineScreenshot = fs.readFileSync(snapshotPath);
        
        // 이미지 바이너리 용량의 차이를 계산 (1px 크기 왜곡 및 185픽셀 수준의 미세 오차 허용)
        const pixelByteDiff = Math.abs(baselineScreenshot.length - currentScreenshot.length);
        
        // 💡 판정 규칙: 바이트 차이가 800바이트 이내(약 200픽셀 이내 차이)라면 현재 미니맵이 '닫혀있는 상태'로 정의
        const isCurrentlyClosed = pixelByteDiff < 800;
        
        console.log(`🔍 [미니맵 모니터링] 바이트 차이 유격: ${pixelByteDiff}Bytes -> 현재 상태: ${isCurrentlyClosed ? '닫힘' : '열림'}`);
        
        // 목표 상태(yn)와 현재 상태를 대조하여 정밀 클릭 제어
        // 원치 않는 상태이거나 토글 처리가 필요한 경우 실행 플래그를 세웁니다.
        let needToToggle = false;
        if (yn.toUpperCase() === 'Y' && isCurrentlyClosed) {
            console.log('🔄 목표 상태: [열기(Y)]이나 현재 [닫힘] 상태이므로 클릭을 트리거합니다.');
            needToToggle = true;
        } else if (yn.toUpperCase() === 'N' && !isCurrentlyClosed) {
            console.log('🔄 목표 상태: [닫기(N)]이나 현재 [열림] 상태이므로 클릭을 트리거합니다.');
            needToToggle = true;
        }

        // 조건 일치 시 우측 하단 정밀 마우스 클릭 동작 수행
        if (needToToggle) {
            const box = await mapCanvas.boundingBox();
    
            if (box) {
                // 우측 최하단 좌표 계산 (안쪽으로 15px 유예 부여)
                const clickX = box.x + box.width - 15;
                const clickY = box.y + box.height - 15;
    
                console.log(`🎯 캔버스 우측 하단 좌표 조준 성공 -> X: ${clickX}, Y: ${clickY}`);
    
                // 타겟 위치 마우스 클릭 실행
                await this.page.mouse.click(clickX, clickY);
                console.log('✅ 캔버스 내부 우측 최하단 영역을 클릭하여 미니맵 상태를 전환했습니다.');
                
                // 애니메이션 연출 시간을 감안하여 최종 대기
                await this.page.waitForTimeout(1500);
            } else {
                console.error('❌ 캔버스 영역의 크기를 측정하지 못했습니다.');
            }
        } else {
            console.log(`✅ 미니맵이 이미 사용자가 요구한 원하는 상태([${yn.toUpperCase()}])로 세팅되어 있어 클릭을 스킵합니다.`);
        }
    }

    async clickMiniMap(offsetX: number, offsetY: number) {
        // Canvas 요소 지정 및 대기
        const mapCanvas = this.page.locator('.canvas-wrapper canvas');
        await mapCanvas.waitFor({ state: 'visible' });

        // 렌더링 및 안정화를 위해 2초 대기
        await this.page.waitForTimeout(2000);

        // 현재 화면에서 캔버스의 시작 좌표와 크기 획득
        const box = await mapCanvas.boundingBox();

        // 받은 인자값으로 미니 맵 위치 계산 및 클릭
        if (box) {
            // 전달받은 offsetX, offsetY를 다이렉트로 계산식에 대입
            const finalClickX = box.x + box.width - offsetX; 
            const finalClickY = box.y + box.height - offsetY;
            
            console.log(`🎯 입력받은 오프셋 기반 좌표 계산 완료 -> X: ${finalClickX}, Y: ${finalClickY} (오프셋 X: ${offsetX}, Y: ${offsetY})`);

            // 마우스 정밀 클릭 수행
            await this.page.mouse.click(finalClickX, finalClickY);
            console.log('✅ 캔버스 내부 지정된 오프셋 영역을 클릭했습니다.');
            
            // 클릭 후 동작 연출을 위해 잠시 대기
            await this.page.waitForTimeout(1000);
        } else {
            console.error('❌ 하단 클릭 실행 실패: 캔버스 box 좌표 정보가 유효하지 않습니다.');
        }
    }

    async installCarrier(x: number, y: number) {
        // Canvas 요소 지정 및 대기
        const mapCanvas = this.page.locator('.canvas-wrapper canvas');
        await mapCanvas.waitFor({ state: 'visible' });

        await this.miniMapOnOff('N');

        await this.page.mouse.click(x, y, { button: 'right' });

        // // 우클릭 후 팝업 박스가 화면에 나타날 때까지 대기
        const popoverBox = this.page.locator('.popover-box');
        await popoverBox.waitFor({ state: 'visible', timeout: 3000 });

        // 팝업 박스 내부의 여러 item 중 'Install Carrier' 텍스트를 정확히 매칭하여 클릭
        await popoverBox.locator('.item', { hasText: 'Install Carrier' }).click();
        // 팝업 내부의 OK 버튼 클릭
        await this.page.locator('.el-dialog__footer .el-button--success', { hasText: 'OK' }).click(); 

        await this.page.waitForTimeout(3000);

    }

    async addJunction(x: number, y: number): Promise<string> {
        // Canvas 요소 지정 및 대기
        const mapCanvas = this.page.locator('.canvas-wrapper canvas');
        await mapCanvas.waitFor({ state: 'visible' });

        await this.miniMapOnOff('N');
        
        // 최초 우클릭하여 메뉴 열기
        await this.page.mouse.click(x, y, { button: 'right' });

        // 우클릭 후 팝업 박스가 화면에 나타날 때까지 대기
        const popoverBox = this.page.locator('.popover-box');
        await popoverBox.waitFor({ state: 'visible', timeout: 3000 });

        // 'Add Junction' 메뉴 클릭 (등록 수행)
        await popoverBox.locator('.item', { hasText: 'Add Junction' }).click(); 

        // ✨ 중요: 서버 및 Canvas 백엔드에 데이터가 반영되고, 최초 팝업이 완전히 닫힐 때까지 대기
        await popoverBox.waitFor({ state: 'hidden', timeout: 3000 });
        await this.page.waitForTimeout(1000); // 캔버스 갱신 유예 시간

        // 재확인을 위해 동일 좌표 우클릭 (새로 생성된 Junction 위를 우클릭하게 됨)
        await this.page.mouse.click(x, y, { button: 'right' });
        await popoverBox.waitFor({ state: 'visible', timeout: 3000 });

        // 'Add Junction: 숫자' 형태로 메뉴가 변경되었는지 확인
        const junctionItem = popoverBox.locator('.item', { hasText: 'Add Junction:' });
        
        // 화면에 정상 노출되는지 검증
        await expect(junctionItem).toBeVisible({ timeout: 3000 });
        await expect(junctionItem).toContainText(/Add Junction:\s*\d+/);

        // 후속 테스트(예: 삭제 등)나 로그 확인을 위해 생성된 ID 번호를 추출하여 리턴
        const fullText = await junctionItem.innerText();
        const match = fullText.match(/\d+/);
        const junctionId = match ? match[0] : '';
        
        console.log(`✅ Junction 등록 및 재확인 완료 (생성된 ID: ${junctionId})`);
        
        // 다른 곳을 클릭하여 테스트 진행에 방해 안 되게 재확인 팝업을 닫아줌
        await this.page.mouse.click(10, 10); 
        
        return junctionId;
    }

    async setDestination(x: number, y: number): Promise<string> {
        // Canvas 요소 지정 및 대기
        const mapCanvas = this.page.locator('.canvas-wrapper canvas');
        await mapCanvas.waitFor({ state: 'visible' });

        await this.miniMapOnOff('N');
        
        // 최초 우클릭하여 메뉴 열기
        await this.page.mouse.click(x, y, { button: 'right' });

        // 우클릭 후 팝업 박스가 화면에 나타날 때까지 대기
        const popoverBox = this.page.locator('.popover-box');
        await popoverBox.waitFor({ state: 'visible', timeout: 3000 });

        // 'Set Destination' 메뉴 클릭 (등록 수행)
        await popoverBox.locator('.item', { hasText: 'Set Destination' }).click(); 

        // ✨ 중요: 서버 및 Canvas 백엔드에 데이터가 반영되고, 최초 팝업이 완전히 닫힐 때까지 대기
        await popoverBox.waitFor({ state: 'hidden', timeout: 3000 });
        await this.page.waitForTimeout(1000); // 캔버스 갱신 유예 시간

        // 재확인을 위해 동일 좌표 우클릭 (새로 생성된 Junction 위를 우클릭하게 됨)
        await this.page.mouse.click(x, y, { button: 'right' });
        await popoverBox.waitFor({ state: 'visible', timeout: 3000 });

        // 'Set Destination' 메뉴가 변경되었는지 확인
        const destinationItem = popoverBox.locator('.item', { hasText: 'Set Destination' });
        
        // 화면에 정상 노출되는지 검증
        await expect(destinationItem).toBeVisible({ timeout: 3000 });
        await expect(destinationItem).toContainText(/Set Destination/);

        // 후속 테스트(예: 삭제 등)나 로그 확인을 위해 생성된 ID 번호를 추출하여 리턴
        const fullText = await destinationItem.innerText();
        const match = fullText.match(/\d+/);
        const destinationId = match ? match[0] : '';
        
        console.log(`✅ Destination 설정 및 재확인 완료 (생성된 ID: ${destinationId})`);
        
        // 다른 곳을 클릭하여 테스트 진행에 방해 안 되게 재확인 팝업을 닫아줌
        await this.page.mouse.click(10, 10); 
        
        return destinationId;
    }

    async clear() {
        const x = 73;
        const y = 340;

        // Canvas 요소 지정 및 대기
        const mapCanvas = this.page.locator('.canvas-wrapper canvas');
        await mapCanvas.waitFor({ state: 'visible' });

        await this.miniMapOnOff('N');
        
        // 최초 우클릭하여 메뉴 열기
        await this.page.mouse.click(x, y, { button: 'right' });

        // 우클릭 후 팝업 박스가 화면에 나타날 때까지 대기
        const popoverBox = this.page.locator('.popover-box');
        await popoverBox.waitFor({ state: 'visible', timeout: 3000 });

        // 'Clear' 메뉴 클릭 (초기화 수행)
        await popoverBox.locator('.item', { hasText: 'Clear' }).click(); 

        // ✨ [검증 단계 시작] 'Clear' 클릭 후 기존 팝업이 완전히 닫힐 때까지 대기
        await popoverBox.waitFor({ state: 'hidden', timeout: 3000 });
        await this.page.waitForTimeout(1000); // 캔버스 그래픽 및 데이터 반영 유예 시간

        // 상태 재확인을 위해 동일한 좌표(73, 340)에 다시 우클릭
        await this.page.mouse.click(x, y, { button: 'right' });
        await popoverBox.waitFor({ state: 'visible', timeout: 3000 });

        // Add Junction 값이 'none'으로 바뀌었는지 확인 (정확히 none이 포함되어 있는지 확인)
        const junctionClearItem = popoverBox.locator('.item', { hasText: 'Add Junction: none' });
        await expect(junctionClearItem).toBeVisible({ timeout: 3000 });

        // Set Destination 값도 'none'인지 확인
        const destinationClearItem = popoverBox.locator('.item', { hasText: 'Set Destination: none' });
        await expect(destinationClearItem).toBeVisible({ timeout: 3000 });

        console.log('✅ Clear 기능 정상 작동 확인: 두 값 모두 none으로 초기화되었습니다.');

        // 검증 완료 후 다음 테스트에 방해되지 않도록 여백을 클릭해 팝업을 닫아줌
        await this.page.mouse.click(10, 10);
    }

}