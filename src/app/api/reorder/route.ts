import { NextRequest, NextResponse } from 'next/server';
import { reorderServices, reorderSubservices } from '@/lib/db';
import { validateEditKey, getEditKeyFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const key = getEditKeyFromRequest(request);

  if (!validateEditKey(key)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, ids } = body;

    if (!type || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    if (type === 'services') {
      reorderServices(ids);
    } else if (type === 'subservices') {
      reorderSubservices(ids);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering:', error);
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}
