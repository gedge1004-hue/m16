import { test, expect, Locator, Page } from "@playwright/test";


export class TransferControl {

    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    async changeDestination(yn: string) {
        // 선택한 Task의 id 가져오기
        const selectedTaskId = await this.page.locator('.el-table-v2__cell-text').first().innerText();

        // 'Change Destination'과 글자가 정확히 일치하는 요소를 지정
        const changeDestinationButton = this.page.getByText('Change Destination', { exact: true });
        await changeDestinationButton.click();
        if (yn === 'Y') {
            // 팝업 내부의 "Select Task: xxxxxxxxxxxx" 텍스트 요소 찾기
            // 텍스트가 포함된 요소를 selector로 지정하세요 (예: .el-text.description 또는 요소를 특정할 수 있는 class)
            const popupTaskLocator = this.page.locator('.el-text.description');
            
            // 팝업 텍스트가 화면에 나타날 때까지 기다린 후 텍스트 가져오기
            const popupFullText = await popupTaskLocator.innerText();
            // popupFullText 값 예시: "Select Task: 201000067116"

            // 정규식을 사용하여 팝업 텍스트에서 숫자만 추출
            const popupTaskNumber = popupFullText.match(/\d+/)?.[0];

            // 두 값이 일치하는지 검증 (Assertion)
            console.log(`원본 번호: ${selectedTaskId} | 팝업 번호: ${popupTaskNumber}`);
            expect(popupTaskNumber).toBe(selectedTaskId);

            // "OK" 버튼 클릭
            const okButton = this.page.getByRole('button', { name: 'OK' });
            await okButton.click();
        } else if (yn === 'N') {
            // "Cancel" 버튼 클릭
            const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
            await cancelButton.click();
        } else {
            throw new Error(`Invalid argument for yn: ${yn}. Expected 'Y' or 'N'.`);
        }
    }

    async forceReserve(yn: string) {
        // 선택한 Task의 id 가져오기
        const selectedTaskId = await this.page.locator('.el-table-v2__cell-text').first().innerText();

        // 'Change Destination'과 글자가 정확히 일치하는 요소를 지정
        const forceReserveButton = this.page.getByText('Force Reserve', { exact: true });
        await forceReserveButton.click();
        if (yn === 'Y') {
            // 팝업 내부의 "Select Task: xxxxxxxxxxxx" 텍스트 요소 찾기
            // 텍스트가 포함된 요소를 selector로 지정하세요 (예: .el-text.description 또는 요소를 특정할 수 있는 class)
            const popupTaskLocator = this.page.locator('.el-text.description');
            
            // 팝업 텍스트가 화면에 나타날 때까지 기다린 후 텍스트 가져오기
            const popupFullText = await popupTaskLocator.innerText();
            // popupFullText 값 예시: "Select Task: 201000067116"

            // 정규식을 사용하여 팝업 텍스트에서 숫자만 추출
            const popupTaskNumber = popupFullText.match(/\d+/)?.[0];

            // 두 값이 일치하는지 검증 (Assertion)
            console.log(`원본 번호: ${selectedTaskId} | 팝업 번호: ${popupTaskNumber}`);
            expect(popupTaskNumber).toBe(selectedTaskId);

            // "OK" 버튼 클릭
            const okButton = this.page.getByRole('button', { name: 'OK' });
            await okButton.click();
        } else if (yn === 'N') {
            // "Cancel" 버튼 클릭
            const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
            await cancelButton.click();
        } else {
            throw new Error(`Invalid argument for yn: ${yn}. Expected 'Y' or 'N'.`);
        }
    }
}