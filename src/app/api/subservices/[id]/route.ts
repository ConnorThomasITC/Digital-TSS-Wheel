import { NextRequest, NextResponse } from 'next/server';
import { updateSubservice, deleteSubservice, getSubserviceById } from '@/lib/db';
import { validateEditKey, getEditKeyFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const subservice = getSubserviceById(id);

    if (!subservice) {
      return NextResponse.json({ error: 'Subservice not found' }, { status: 404 });
    }

    return NextResponse.json(subservice);
  } catch (error) {
    console.error('Error fetching subservice:', error);
    return NextResponse.json({ error: 'Failed to fetch subservice' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const key = getEditKeyFromRequest(request);

  if (!validateEditKey(key)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const subservice = updateSubservice(id, body);

    if (!subservice) {
      return NextResponse.json({ error: 'Subservice not found' }, { status: 404 });
    }

    return NextResponse.json(subservice);
  } catch (error) {
    console.error('Error updating subservice:', error);
    return NextResponse.json({ error: 'Failed to update subservice' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const key = getEditKeyFromRequest(request);

  if (!validateEditKey(key)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    deleteSubservice(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subservice:', error);
    return NextResponse.json({ error: 'Failed to delete subservice' }, { status: 500 });
  }
}
