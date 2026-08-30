import { NextResponse } from 'next/server';
import { getActiveCampaign } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const campaign = getActiveCampaign();
    if (!campaign) {
      return NextResponse.json({ error: 'No active campaign found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
