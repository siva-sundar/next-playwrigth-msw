import { test as base, expect as baseExpect } from '@playwright/test';
import { createNetworkFixture } from '@msw/playwright';
import { handlers } from '../mocks/handlers';

// Use @msw/playwright for client-side requests (CSR)
// Server-side SSR requests are intercepted by MSW for Node.js (set up in instrumentation.ts)
export const test = base.extend({
  network: createNetworkFixture({
    initialHandlers: handlers,
  }),
});

export { baseExpect as expect };

