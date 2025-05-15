import { test as base } from '@playwright/test';
import { pages } from './src/pages/pages';
import type { Pages } from './src/pages/pages';

type MyFixtures = {
    app: Pages;
};

export const test = base.extend<MyFixtures>({
    app: async ({ page }, use) => {
        const app: Pages = pages(page);
        await use(app);
    },
});
