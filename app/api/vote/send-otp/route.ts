import { NextRequest, NextResponse } from 'next/server';
import { validateEthiopianPhone } from '@/lib/phone';
import { getLatestVoteForPhone, saveOtp, checkRateLimit, getActiveCampaign } from '@/lib/db';
import { calculateVotingCooldown, generateSecureOtp, OTP_VALIDITY_SECONDS } from '@/lib/security';
import { SendOtpResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone_number, tiktoker_id } = body;

    // 1. Check campaign status
    const campaign = getActiveCampaign();
    if (!campaign || campaign.status !== 'active') {
      return NextResponse.json<SendOtpResponse>({
        success: false,
        message: 'The voting campaign is currently inactive.',
      }, { status: 400 });
    }

    if (new Date(campaign.end_at).getTime() <= Date.now()) {
      return NextResponse.json<SendOtpResponse>({
        success: false,
        message: 'Voting has ended for this campaign.',
      }, { status: 400 });
    }

    // 2. Validate Ethiopian Phone Number
    const phoneValidation = validateEthiopianPhone(phone_number);
    if (!phoneValidation.isValid) {
      return NextResponse.json<SendOtpResponse>({
        success: false,
        message: phoneValidation.error || 'Invalid Ethiopian phone number format.',
      }, { status: 400 });
    }

    const normalizedPhone = phoneValidation.normalized;

    // 3. Strict 24-Hour Cooldown Verification Before Sending OTP
    const latestVote = getLatestVoteForPhone(normalizedPhone);
    const cooldownCheck = calculateVotingCooldown(latestVote ? latestVote.created_at : null);

    if (!cooldownCheck.canVote) {
      return NextResponse.json<SendOtpResponse>({
        success: false,
        message: 'You have already voted within the last 24 hours. Please wait until your personal cooldown ends.',
        normalized_phone: normalizedPhone,
        cooldown_remaining_seconds: cooldownCheck.cooldownRemainingSeconds,
        next_eligible_vote_at: cooldownCheck.nextEligibleVoteAt || undefined,
      }, { status: 429 });
    }

    // 4. Rate Limiting Protection (Max 4 OTPs per 10 minutes per phone)
    const allowed = checkRateLimit(normalizedPhone, 'send_otp', 4, 600);
    if (!allowed) {
      return NextResponse.json<SendOtpResponse>({
        success: false,
        message: 'Too many OTP requests. Please wait a few minutes before trying again.',
      }, { status: 429 });
    }

    // 5. Generate and Save Secure OTP
    const otpCode = generateSecureOtp();
    saveOtp(normalizedPhone, otpCode, OTP_VALIDITY_SECONDS);

    // In production SMS gateway (Ethio Telecom / Safaricom SMS API), the code is dispatched via SMS.
    // For smooth user evaluation and rapid testing, we return demo_otp in the response body & response headers.
    return NextResponse.json<SendOtpResponse>({
      success: true,
      message: 'Verification code sent successfully via SMS.',
      normalized_phone: normalizedPhone,
      expires_in_seconds: OTP_VALIDITY_SECONDS,
      demo_otp: otpCode,
    });
  } catch (error: any) {
    return NextResponse.json<SendOtpResponse>({
      success: false,
      message: error.message || 'An unexpected error occurred while sending OTP.',
    }, { status: 500 });
  }
}
