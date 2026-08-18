import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig<TestOptions>({
  testDir: './tests',
  timeout: 40000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://playground.bondaracademy.com/',
    globalsQaURL: '',

    trace: 'on-first-retry',
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 }
    }
  },

  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        baseURL: 'https://playground.bondaracademy.com/'
      },
    },

    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },

    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },

  ],
});
