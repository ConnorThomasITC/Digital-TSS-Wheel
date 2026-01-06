import { NextRequest, NextResponse } from 'next/server';
import { getFullConfig } from '@/lib/db';
import { validateEditKey, getEditKeyFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const key = getEditKeyFromRequest(request);

  if (!validateEditKey(key)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = getFullConfig();
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      services: config
    };

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="tss-wheel-backup-${Date.now()}.json"`,
      }
    });
  } catch (error) {
    console.error('Error exporting config:', error);
    return NextResponse.json({ error: 'Failed to export config' }, { status: 500 });
  }
}
