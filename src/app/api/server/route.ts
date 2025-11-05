import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return NextResponse.json({
    message: 'Hello from Server API',
    timestamp: new Date().toISOString(),
    data: {
      id: 1,
      name: 'Server Data',
      description: 'This is data fetched on the server side'
    }
  });
}

