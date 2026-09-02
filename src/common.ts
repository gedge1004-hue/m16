import { expect, Locator, Page } from "@playwright/test";

export class Common {

    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 로그인 페이지 이동 
     */
    async goto() {
        await this.page.goto('http://192.168.0.223:22001/#/');
        await this.page.waitForLoadState();
    }

    /**
     * 언어 변경 
     */
    async changeLanguage(lang: 'kr' | 'us' | 'cn' | 'jp') {
        // 지구본 클릭
        await this.page.locator('span.language-trigger').click();

        // 입력받은 축약어를 화면에 보이는 실제 라벨 텍스트와 맵핑
        const labelMap = {
            kr: '한국어',
            us: 'English',
            cn: '简体中文',
            jp: '日本語'
        };

        const targetLabel = labelMap[lang];

        // 언어 클릭
        await this.page.locator('.el-dropdown-menu__item').filter({ has: this.page.locator('.language-label', { hasText: targetLabel }) }).click();
    }

    async deleteAllTasks() {
        // 데이터 행 셀렉터 정의
        const rowLocator = this.page.locator('.el-table-v2__row.task-info-table__row');
        
        // 첫 번째 행이 화면에 완벽히 로드되어 보일 때까지 최대 5초 강제 대기
        await rowLocator.first().waitFor({ state: 'visible', timeout: 5000 });

        // evaluateAll을 사용하여 각 행의 'rowkey' 속성 값을 배열로 추출
        const rowKeys = await rowLocator.evaluateAll(elements => 
            elements
                .map(el => el.getAttribute('rowkey'))
                .filter((key): key is string => key !== null && key.trim() !== '')
        );

        console.log('가져온 모든 rowkey 목록:', rowKeys);

        // 가져온 rowkey들을 순차적으로 반복하며 셀 더블 클릭 및 삭제 진행
        for (const rowKey of rowKeys) {
            // ✨ 핵심 수정: 중복 렌더링에 대비해 무조건 첫 번째 매칭 요소를 바라보도록 .first() 추가
            const targetCell = this.page.locator(`.el-table-v2__cell-text[title="${rowKey}"]`).first();

            // 화면에 셀이 표시되는지 안전하게 확인
            const isVisible = await targetCell.isVisible({ timeout: 2000 }).catch(() => false);
            
            if (isVisible) {
                console.log(`🔄 대상 ID [${rowKey}] 셀을 더블 클릭합니다. (Pause 단계)`);
                
                // [Pause 단계] 첫 번째 더블 클릭
                await targetCell.dblclick();

                // Pause 버튼 대기 후 클릭
                const pauseButton = this.page.getByRole('button', { name: 'Pause', exact: true });
                await pauseButton.waitFor({ state: 'visible', timeout: 2000 });
                await pauseButton.click();
                
                // 상태 반영 및 모달 애니메이션 처리를 위해 잠시 대기
                await this.page.waitForTimeout(1000);
                
                // [Abort 단계] 두 번째 더블 클릭 (.first()가 적용되어 있어 에러가 나지 않습니다)
                console.log(`🔄 대상 ID [${rowKey}] 셀을 다시 더블 클릭합니다. (Abort 단계)`);
                await targetCell.dblclick();

                // Abort 버튼 대기 후 클릭
                const abortButton = this.page.getByRole('button', { name: 'Abort', exact: true });
                await abortButton.waitFor({ state: 'visible', timeout: 2000 });
                await abortButton.click();
                
                console.log(`✅ ID [${rowKey}] 항목의 연관 작업 완료`);

                // 데이터가 지워지고 가상 스크롤이 재정렬될 수 있도록 유예 시간 부여
                await this.page.waitForTimeout(1500);
            } else {
                console.log(`⏩ ID [${rowKey}] 항목이 이미 화면에 없어 건너뜁니다.`);
            }
        }

        console.log('🎉 수집된 모든 ID 항목의 처리가 완료되었습니다.');
    }
}