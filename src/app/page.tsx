import ClientComponent from './components/ClientComponent';

interface ApiResponse {
  message: string;
  timestamp: string;
  data: {
    id: number;
    name: string;
    description: string;
  };
}

export default async function Home() {
  // Server-Side Rendering: Fetch data on the server
  let serverData: ApiResponse | null = null;
  let serverError: string | null = null;

  try {
    // Server-side fetch: use absolute URL for SSR to work with MSW in tests
    // In Next.js App Router, server components can use absolute URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/server`, {
      cache: 'no-store', // Ensure fresh data on each request
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch server data');
    }
    
    serverData = await response.json();
  } catch (error) {
    serverError = error instanceof Error ? error.message : 'Unknown error occurred';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-16 px-8 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">
            Next.js SSR + CSR Example
          </h1>
          
          <div className="space-y-6 mb-8">
            <div className="p-4 border rounded-lg bg-purple-50">
              <h2 className="text-xl font-semibold mb-2">Server-Side Rendered Data</h2>
              {serverError ? (
                <div className="text-red-600">Error: {serverError}</div>
              ) : serverData ? (
                <>
                  <p className="text-sm text-gray-600 mb-2">{serverData.message}</p>
                  <div className="mt-2">
                    <p><strong>ID:</strong> {serverData.data.id}</p>
                    <p><strong>Name:</strong> {serverData.data.name}</p>
                    <p><strong>Description:</strong> {serverData.data.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Fetched at: {serverData.timestamp}</p>
                  </div>
                </>
              ) : (
                <div>No data available</div>
              )}
            </div>

            <ClientComponent />
          </div>
        </div>
      </main>
    </div>
  );
}
