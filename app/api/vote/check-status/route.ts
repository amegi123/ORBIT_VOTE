import { NextRequest, NextResponse } from 'next/server';
import { validateEthiopianPhone } from '@/lib/phone';
import { getLatestVoteForPhone, getTikTokerById } from '@/lib/db';
import { calculateVotingCooldown } from '@/lib/security';
import { PhoneStatusResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPhone = searchParams.get('phone');

    if (!rawPhone) {
      return NextResponse.json({ error: 'Phone parameter is required' }, { status: 400 });
    }

    const phoneValidation = validateEthiopianPhone(rawPhone);
    if (!phoneValidation.isValid) {
      return NextResponse.json({ error: phoneValidation.error || 'Invalid Ethiopian phone number' }, { status: 400 });
    }

    const normalized = phoneValidation.normalized;
    const latestVote = getLatestVoteForPhone(normalized);

    let lastVotedTiktokerName: string | null = null;
    if (latestVote) {
      const creator = getTikTokerById(latestVote.tiktoker_id);
      if (creator) {
        lastVotedTiktokerName = creator.full_name;
      }
    }

    const cooldown = calculateVotingCooldown(latestVote ? latestVote.created_at : null);

    const response: PhoneStatusResponse = {
      phone_number: normalized,
      can_vote: cooldown.canVote,
      last_voted_at: latestVote ? latestVote.created_at : null,
      last_voted_tiktoker_name: lastVotedTiktokerName,
      next_eligible_vote_at: cooldown.nextEligibleVoteAt,
      cooldown_remaining_seconds: cooldown.cooldownRemainingSeconds,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Status check failed' }, { status: 500 });
  }
}
