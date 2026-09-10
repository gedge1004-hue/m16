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
        const testFileName = path.basename(testFileFilepath); 
    
        // 닫힌 상태를 기준으로 대조하기 위해 파일명 조립 (map-mini-map-close.png)
        const snapshotPath = path.join(
            testFileDir,
            'snapshots',
            `${testFileName}-snapshots`,
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
}