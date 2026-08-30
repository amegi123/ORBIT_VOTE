import crypto from 'crypto';

export const COOLDOWN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const OTP_VALIDITY_SECONDS = 300; // 5 minutes
export const MAX_OTP_ATTEMPTS = 5;

/**
 * Calculates remaining 24-hour voting cooldown
 */
export function calculateVotingCooldown(lastVotedAt: string | null): {
  canVote: boolean;
  cooldownRemainingSeconds: number;
  nextEligibleVoteAt: string | null;
} {
  if (!lastVotedAt) {
    return {
      canVote: true,
      cooldownRemainingSeconds: 0,
      nextEligibleVoteAt: null,
    };
  }

  const lastVoteTime = new Date(lastVotedAt).getTime();
  const now = Date.now();
  const diff = now - lastVoteTime;

  if (diff >= COOLDOWN_DURATION_MS) {
    return {
      canVote: true,
      cooldownRemainingSeconds: 0,
      nextEligibleVoteAt: null,
    };
  }

  const remainingMs = COOLDOWN_DURATION_MS - diff;
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const nextEligibleVoteAt = new Date(lastVoteTime + COOLDOWN_DURATION_MS).toISOString();

  return {
    canVote: false,
    cooldownRemainingSeconds: remainingSeconds,
    nextEligibleVoteAt,
  };
}

/**
 * Generates a secure 6-digit numeric OTP
 */
export function generateSecureOtp(): string {
  // Generates 100000 to 999999
  const randomValue = crypto.randomInt(100000, 1000000);
  return randomValue.toString();
}

/**
 * Formats seconds into HH:MM:SS or Dd HH:MM:SS
 */
export function formatSecondsToTime(totalSeconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
  formatted: string;
} {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const hours = h.toString().padStart(2, '0');
  const minutes = m.toString().padStart(2, '0');
  const seconds = s.toString().padStart(2, '0');

  return {
    hours,
    minutes,
    seconds,
    formatted: `${hours}:${minutes}:${seconds}`,
  };
}
