import { NextRequest, NextResponse } from 'next/server';
import { createSubservice } from '@/lib/db';
import { validateEditKey, getEditKeyFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const key = getEditKeyFromRequest(request);

  if (!validateEditKey(key)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { service_id, name, tooltip, color, weight, sort_order } = body;

    if (!service_id || !name || !color) {
      return NextResponse.json({ error: 'service_id, name, and color are required' }, { status: 400 });
    }

    const subservice = createSubservice({
      service_id,
      name,
      tooltip: tooltip || null,
      color,
      weight: weight ?? 10,
      sort_order: sort_order ?? 0
    });

    return NextResponse.json(subservice);
  } catch (error) {
    console.error('Error creating subservice:', error);
    return NextResponse.json({ error: 'Failed to create subservice' }, { status: 500 });
  }
}
