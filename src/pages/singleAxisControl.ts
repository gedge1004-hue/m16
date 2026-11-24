import { Page } from "@playwright/test";

type Confirmation = 'Y' | 'N';
type OnlineOption = 'Online' | 'Offline';
type ServoOption = 'Servo On' | 'Servo Off';
type MoveDirection = 'Forward' | 'Backward';
type AllAxisCommand = 'Servo On' | 'Servo Off' | 'Homing' | 'Clear Motor Error' | 'Stop';

export class SingleAxisControl {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private async clickButton(name: string) {
        const tab = this.page.getByRole('tabpanel', { name: 'Single Axis Control' });
        await tab.getByRole('button', { name, exact: true }).click();
    }

    async selectZone(zoneName: string) {
        const tab = this.page.getByRole('tabpanel', { name: 'Single Axis Control' });
        await tab.locator('.el-select').click();
        await this.page.getByRole('option', { name: zoneName, exact: true }).click();
    }

    private async completeConfirmation(option: string | undefined, confirmation: Confirmation) {
        const buttonName = confirmation === 'Y' ? 'OK' : 'Cancel';
        const dialog = this.page.getByRole('dialog')
            .filter({ has: this.page.getByRole('button', { name: buttonName, exact: true }) })
            .last();
        if (option) {
            await dialog.getByText(option, { exact: true }).click();
        }
        await dialog.getByRole('button', { name: buttonName, exact: true }).click();
    }

    private async clickAndConfirm(button: string, option: string | undefined, confirmation: Confirmation) {
        await this.clickButton(button);
        await this.completeConfirmation(option, confirmation);
    }

    async online(option: OnlineOption, confirmation: Confirmation) {
        await this.clickAndConfirm('Online', option, confirmation);
    }

    async servoOn(option: ServoOption, confirmation: Confirmation) {
        await this.clickAndConfirm('Servo On', option, confirmation);
    }

    async home(confirmation: Confirmation) {
        await this.clickButton('Home');
        await this.completeConfirmation(undefined, confirmation);
    }

    async reset(confirmation: Confirmation) {
        await this.clickButton('Reset');
        await this.completeConfirmation(undefined, confirmation);
    }

    async move(direction: MoveDirection, confirmation: Confirmation) {
        await this.clickAndConfirm('Move', direction, confirmation);
    }

    async stop() {
        await this.clickButton('Stop');
    }

    async allAxisControl(command: AllAxisCommand, confirmation: Confirmation) {
        await this.clickButton('All Axis Control');
        const commandDialog = this.page.getByRole('dialog').last();
        await commandDialog.getByRole('button', { name: command, exact: true }).click();
        await this.completeConfirmation(undefined, confirmation);
        await commandDialog.getByRole('button', { name: 'Close this dialog' }).click();
    }

    async groupOnline(option: OnlineOption, confirmation: Confirmation) {
        await this.clickButton('Group Online');
        await this.completeConfirmation(option, confirmation);
    }
}
