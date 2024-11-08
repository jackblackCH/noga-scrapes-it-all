import { NextResponse } from 'next/server';

// This is a mock implementation - replace with your actual data fetching logic
interface Company {
  id: string;
  name: string;
  lastUpdated: string;
  status: 'active' | 'inactive';
  logo?: string;
}

export async function GET() {
  // Mock data - replace with actual database query
  const companies: Company[] = [
    {
      id: '1',
      name: 'Acme Corp',
      lastUpdated: '2024-03-20T10:00:00Z',
      status: 'active',
    },
    {
      id: '2',
      name: 'Beta Inc',
      lastUpdated: '2024-03-20T10:00:00Z',
      status: 'inactive',
    },
    {
      id: '3',
      name: 'Gamma Ltd',
      lastUpdated: '2024-03-20T10:00:00Z',
      status: 'active',
    },
    {
      id: '4',
      name: 'Delta Corp',
      lastUpdated: '2024-03-20T10:00:00Z',
      status: 'active',
    },
    {
      id: '5',
      name: 'Epsilon Inc',
      lastUpdated: '2024-03-20T10:00:00Z',
      status: 'inactive',
    },
    // Add more mock companies as needed
  ];

  return NextResponse.json(companies.slice(0, 10));
}
