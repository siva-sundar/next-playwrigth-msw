import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server for Node.js environment (to intercept server-side requests during SSR)
export const server = setupServer(...handlers);

