// @polsia:user-owned
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    browserName: 'chromium',
    headless: true,
  },
});
