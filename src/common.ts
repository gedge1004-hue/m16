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
}