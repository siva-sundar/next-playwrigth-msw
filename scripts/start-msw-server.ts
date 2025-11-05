// Standalone MSW Node.js server running on port 3001
// This server uses MSW handlers to mock API requests

import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';
import { createServer, IncomingMessage, ServerResponse } from 'http';

const PORT = 3001;

// Setup MSW server to intercept requests
const server = setupServer(...handlers);
server.listen({ onUnhandledRequest: 'bypass' });

console.log(`✅ MSW server setup complete - intercepting requests`);

// Create HTTP server on port 3001 that proxies to MSW
const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const url = new URL(req.url || '/', `http://localhost:${PORT}`);
    
    console.log(`📥 ${req.method} ${url.pathname}`);
    
    // Create a fetch request that MSW will intercept
    let requestBody: string | undefined;
    if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
      const buffer = await streamToBuffer(req);
      requestBody = buffer.toString('utf-8');
    }
    
    const fetchRequest = new Request(url.href, {
      method: req.method || 'GET',
      headers: req.headers as HeadersInit,
      body: requestBody,
    });

    // Fetch will be intercepted by MSW
    const response = await fetch(fetchRequest);
    
    // Send response back
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    const responseBody = await response.text();
    res.end(responseBody);
  } catch (error) {
    console.error('Error handling request:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

// Helper to convert stream to buffer
function streamToBuffer(stream: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

httpServer.listen(PORT, () => {
  console.log(`✅ MSW HTTP server running on http://localhost:${PORT}`);
  console.log(`   Handlers registered: ${handlers.length}`);
  handlers.forEach((handler, index) => {
    const info = handler.info;
    console.log(`   ${index + 1}. ${info.method} ${info.path}`);
  });
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MSW server...');
  server.close();
  httpServer.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down MSW server...');
  server.close();
  httpServer.close();
  process.exit(0);
});

