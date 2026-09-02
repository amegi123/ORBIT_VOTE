'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { maskPhoneNumber } from '@/lib/phone';
import { formatSecondsToTime } from '@/lib/security';

interface PersonalVoteCountdownProps {
  phoneNumber: string;
  nextEligibleAt: string;
  initialCooldownSeconds: number;
  lastVotedCreatorName?: string;
  onClearSession: () => void;
}

export function PersonalVoteCountdown({
  phoneNumber,
  nextEligibleAt,
  initialCooldownSeconds,
  lastVotedCreatorName,
  onClearSession,
}: PersonalVoteCountdownProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialCooldownSeconds);

  useEffect(() => {
    const updateCountdown = () => {
      const targetTime = new Date(nextEligibleAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((targetTime - now) / 1000));
      setSecondsRemaining(diff);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextEligibleAt]);

  const { formatted: cooldownFormatted } = formatSecondsToTime(secondsRemaining);
  const isCooldownOver = secondsRemaining <= 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-3 pb-1">
      <div className="rounded-xl p-3 sm:p-3.5 bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left message */}
        <div className="flex items-center gap-2 text-left w-full sm:w-auto min-w-0">
          <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-800">
              {isCooldownOver ? 'Eligible to vote' : '24-Hour Cooldown Active'}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-mono">
              ({maskPhoneNumber(phoneNumber)})
            </span>
            {lastVotedCreatorName && (
              <span className="text-xs text-slate-500 block sm:inline sm:ml-2">
                • Voted for <strong className="text-slate-700">{lastVotedCreatorName}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Right timer & action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
          {!isCooldownOver ? (
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900">
              <span className="text-slate-400 font-sans font-normal text-[11px]">Unlocks in:</span>
              <span>{cooldownFormatted}</span>
            </div>
          ) : (
            <span className="text-xs font-bold text-emerald-700">Ready to vote</span>
          )}

          <button
            type="button"
            onClick={onClearSession}
            title="Check another phone number"
            aria-label="Check another phone number"
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
