import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Recording...
});await page.goto('http://192.168.0.223:22001/#/login');
await page.getByRole('textbox', { name: 'ID' }).click();
await page.getByRole('textbox', { name: 'ID' }).fill('tester');
await page.getByRole('textbox', { name: 'ID' }).press('Tab');
await page.getByRole('textbox', { name: 'Password' }).fill('tester');
await page.getByRole('textbox', { name: 'Password' }).press('Enter');
await page.getByRole('menuitem', { name: 'monitoring' }).click();
await page.locator('canvas').first().click({
    position: {
      x: 311,
      y: 182
    }
  });