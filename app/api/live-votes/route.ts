import { NextResponse } from 'next/server';
import { getActiveCampaign, getAllTikTokers } from '@/lib/db';
import { LiveVotesResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const campaign = getActiveCampaign();
    if (!campaign) {
      return NextResponse.json({ error: 'No active campaign found' }, { status: 404 });
    }

    const tiktokers = getAllTikTokers();
    const total_votes = tiktokers.reduce((acc, curr) => acc + curr.vote_count, 0);

    const response: LiveVotesResponse = {
      campaign,
      tiktokers,
      total_votes,
      server_time: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Live update failed' }, { status: 500 });
  }
}
