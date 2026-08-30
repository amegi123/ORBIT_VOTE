import { NextRequest, NextResponse } from 'next/server';
import { resetDemoVoting } from '@/lib/db';
import { validateEthiopianPhone } from '@/lib/phone';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPhone = body?.phone_number;

    let normalizedPhone: string | undefined = undefined;
    if (rawPhone) {
      const validation = validateEthiopianPhone(rawPhone);
      if (validation.isValid) normalizedPhone = validation.normalized;
    }

    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const result = resetDemoVoting(normalizedPhone, clientIp);

    return NextResponse.json({
      success: true,
      message: 'This feature is only for demo',
      cleared_votes_count: result.clearedVotesCount,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error?.message || 'Demo reset failed',
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
