import { NextRequest, NextResponse } from 'next/server';
import { createService, getAllServices } from '@/lib/db';
import { validateEditKey, getEditKeyFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const services = getAllServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const key = getEditKeyFromRequest(request);

  if (!validateEditKey(key)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, tooltip, description, color, sort_order } = body;

    if (!name || !color) {
      return NextResponse.json({ error: 'Name and color are required' }, { status: 400 });
    }

    const service = createService({
      name,
      tooltip: tooltip || null,
      description: description || null,
      color,
      sort_order: sort_order ?? 0
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
