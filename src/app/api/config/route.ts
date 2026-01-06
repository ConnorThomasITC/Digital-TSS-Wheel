import { NextRequest, NextResponse } from 'next/server';
import { getFullConfig, replaceAllData, initDb } from '@/lib/db';
import { validateEditKey, getEditKeyFromRequest } from '@/lib/auth';

// Initialize DB on first request
initDb();

export async function GET() {
  try {
    const config = getFullConfig();
    return NextResponse.json({
      services: config,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const key = getEditKeyFromRequest(request);

  if (!validateEditKey(key)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { services } = body;

    if (!Array.isArray(services)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    replaceAllData(services);

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
