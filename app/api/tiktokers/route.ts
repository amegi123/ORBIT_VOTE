import { NextResponse } from 'next/server';
import { getAllTikTokers } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tiktokers = getAllTikTokers();
    return NextResponse.json({ tiktokers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch tiktokers' }, { status: 500 });
  }
}
