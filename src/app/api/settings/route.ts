import { NextRequest, NextResponse } from 'next/server';
import { initDb, getWheelSettings, saveWheelSettings } from '@/lib/db';
import type { WheelSettings } from '@/lib/types';

// Initialize database
initDb();

export async function GET() {
  try {
    const settings = getWheelSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const editKey = request.headers.get('x-edit-key');
    const validKey = process.env.EDIT_KEY || 'demo-key';

    if (editKey !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings: WheelSettings = await request.json();
    saveWheelSettings(settings);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
