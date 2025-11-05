import { http, HttpResponse } from 'msw';

export interface ApiResponse {
  message: string;
  timestamp: string;
  data: {
    id: number;
    name: string;
    description: string;
  };
}

export const handlers = [
  // Mock the server API endpoint (for Node.js MSW - server-side SSR)
  // Handle both relative and absolute URLs
  http.get('/api/server', async () => {
    console.log('🎯 MSW intercepted /api/server request');
    return HttpResponse.json<ApiResponse>({
      message: 'Mocked Server API Response',
      timestamp: new Date().toISOString(),
      data: {
        id: 999,
        name: 'Mocked Server Data',
        description: 'This is mocked server-side data for testing'
      }
    });
  }),
  
  // Also handle absolute URL for server (fallback)
  http.get('http://localhost:3000/api/server', async () => {
    console.log('🎯 MSW intercepted http://localhost:3000/api/server request');
    return HttpResponse.json<ApiResponse>({
      message: 'Mocked Server API Response',
      timestamp: new Date().toISOString(),
      data: {
        id: 999,
        name: 'Mocked Server Data',
        description: 'This is mocked server-side data for testing'
      }
    });
  }),
  
  // Handle any localhost variant
  http.get('*/api/server', async () => {
    console.log('🎯 MSW intercepted */api/server request');
    return HttpResponse.json<ApiResponse>({
      message: 'Mocked Server API Response',
      timestamp: new Date().toISOString(),
      data: {
        id: 999,
        name: 'Mocked Server Data',
        description: 'This is mocked server-side data for testing'
      }
    });
  }),

  // Mock the client API endpoint with latency simulation
  // Supports both relative URLs (for @msw/playwright) and absolute URLs
  http.get('/api/client', async () => {
    // Simulate network latency (5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return HttpResponse.json<ApiResponse>({
      message: 'Mocked Client API Response',
      timestamp: new Date().toISOString(),
      data: {
        id: 888,
        name: 'Mocked Client Data',
        description: 'This is mocked client-side data for testing'
      }
    });
  }),
  
  // Also handle absolute URL for client (fallback)
  http.get('http://localhost:3000/api/client', async () => {
    // Simulate network latency (5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return HttpResponse.json<ApiResponse>({
      message: 'Mocked Client API Response',
      timestamp: new Date().toISOString(),
      data: {
        id: 888,
        name: 'Mocked Client Data',
        description: 'This is mocked client-side data for testing'
      }
    });
  }),
];

