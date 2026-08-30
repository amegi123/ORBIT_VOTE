import { NextRequest, NextResponse } from 'next/server';
import { validateEthiopianPhone } from '@/lib/phone';
import { executeVoteTransaction } from '@/lib/db';
import { VerifyAndVoteResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone_number, otp_code, tiktoker_id } = body;

    if (!phone_number || !otp_code || !tiktoker_id) {
      return NextResponse.json<VerifyAndVoteResponse>({
        success: false,
        message: 'Phone number, verification code, and creator selection are required.',
      }, { status: 400 });
    }

    // 1. Validate Phone Number
    const phoneValidation = validateEthiopianPhone(phone_number);
    if (!phoneValidation.isValid) {
      return NextResponse.json<VerifyAndVoteResponse>({
        success: false,
        message: phoneValidation.error || 'Invalid Ethiopian phone number.',
      }, { status: 400 });
    }

    // 2. Validate OTP format (6 digits)
    const cleanedOtp = otp_code.toString().trim();
    if (!/^\d{6}$/.test(cleanedOtp)) {
      return NextResponse.json<VerifyAndVoteResponse>({
        success: false,
        message: 'Verification code must be exactly 6 digits.',
      }, { status: 400 });
    }

    // Get IP address from headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // 3. Execute Atomic Database Transaction
    const result = executeVoteTransaction({
      phoneNumber: phoneValidation.normalized,
      otpCode: cleanedOtp,
      tiktokerId: tiktoker_id,
      ipAddress,
    });

    if (!result.success) {
      const isCooldown = result.cooldownSeconds && result.cooldownSeconds > 0;
      return NextResponse.json<VerifyAndVoteResponse>({
        success: false,
        message: result.error || 'Vote submission failed.',
        next_eligible_vote_at: result.nextEligibleVoteAt,
        cooldown_seconds: result.cooldownSeconds,
      }, { status: isCooldown ? 429 : 400 });
    }

    return NextResponse.json<VerifyAndVoteResponse>({
      success: true,
      message: 'Vote registered successfully! Your vote has been verified and counted.',
      vote_id: result.voteId,
      tiktoker: result.tiktoker,
      next_eligible_vote_at: result.nextEligibleVoteAt,
      cooldown_seconds: result.cooldownSeconds,
      new_total_votes: result.newTotalVotes,
      ranking: result.ranking,
    });
  } catch (error: any) {
    return NextResponse.json<VerifyAndVoteResponse>({
      success: false,
      message: error.message || 'An error occurred during vote verification.',
    }, { status: 500 });
  }
}
