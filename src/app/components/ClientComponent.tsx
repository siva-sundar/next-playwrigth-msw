'use client';

import { useState, useEffect } from 'react';

interface ApiResponse {
  message: string;
  timestamp: string;
  data: {
    id: number;
    name: string;
    description: string;
  };
}

export default function ClientComponent() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/client')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4 border rounded-lg bg-blue-50">Loading client-side data...</div>;
  }

  if (error) {
    return <div className="p-4 border rounded-lg bg-red-50 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <h2 className="text-xl font-semibold mb-2">Client-Side Rendered Data</h2>
      <p className="text-sm text-gray-600 mb-2">{data?.message}</p>
      <div className="mt-2">
        <p><strong>ID:</strong> {data?.data.id}</p>
        <p><strong>Name:</strong> {data?.data.name}</p>
        <p><strong>Description:</strong> {data?.data.description}</p>
        <p className="text-xs text-gray-500 mt-2">Fetched at: {data?.timestamp}</p>
      </div>
    </div>
  );
}

