// Next.js instrumentation file - runs once when the server starts
// This sets up MSW for Node.js to intercept server-side requests
// IMPORTANT: MSW only runs during tests when ENABLE_MSW=true is set by Playwright
// Normal development (npm run dev) will NOT use MSW

// Store server instance globally to prevent garbage collection
let server: ReturnType<typeof import('msw/node').setupServer> | null = null;

export async function register() {
  console.log('🔧 Instrumentation register() called');
  console.log('   NEXT_RUNTIME:', process.env.NEXT_RUNTIME);
  console.log('   ENABLE_MSW:', process.env.ENABLE_MSW);
  
  // Only enable MSW during tests (when ENABLE_MSW is set by Playwright)
  // This ensures MSW is NOT active during normal development
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.ENABLE_MSW === 'true') {
    try {
      const { setupServer } = await import('msw/node');
      const { handlers } = await import('../mocks/handlers');
      
      // Setup MSW server and store it globally
      server = setupServer(...handlers);
      server.listen({ 
        onUnhandledRequest: 'bypass',
      });
      
      console.log('✅ MSW server started (TEST MODE) - intercepting server-side requests');
      console.log('   Handlers registered:', handlers.length);
      console.log('   Server instance:', server ? 'created' : 'failed');
      
      // Verify handlers are registered
      handlers.forEach((handler, index) => {
        console.log(`   Handler ${index + 1}:`, handler.info.header);
      });
    } catch (error) {
      console.error('❌ Failed to start MSW server:', error);
      if (error instanceof Error) {
        console.error('   Error message:', error.message);
        console.error('   Error stack:', error.stack);
      }
    }
  } else {
    console.log('ℹ️  MSW not enabled (ENABLE_MSW not set or not in nodejs runtime)');
  }
}

