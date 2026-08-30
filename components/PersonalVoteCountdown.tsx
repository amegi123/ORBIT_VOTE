'use client';

import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, RefreshCw } from 'lucide-react';
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

  const { hours, minutes, seconds } = formatSecondsToTime(secondsRemaining);
  const isCooldownOver = secondsRemaining <= 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-2 pb-1 overflow-hidden">
      <div className="rounded-2xl p-3 sm:p-4 bg-blue-50/90 border border-blue-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          {/* Left info */}
          <div className="flex items-center gap-2.5 text-left w-full sm:w-auto min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/10 border border-blue-200 flex items-center justify-center shrink-0">
              {isCooldownOver ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-blue-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 justify-start flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-blue-800">
                  {isCooldownOver ? 'Eligible to Vote' : '24h Cooldown Active'}
                </span>
                <span className="text-[10px] font-mono text-slate-700 px-1.5 py-0.2 rounded bg-white border border-slate-200">
                  {maskPhoneNumber(phoneNumber)}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                {isCooldownOver ? (
                  <span className="text-emerald-700 font-semibold">Ready to vote now!</span>
                ) : (
                  <span>
                    {lastVotedCreatorName ? `Voted for ` : `Next vote unlocks in `}
                    {lastVotedCreatorName && <strong className="text-slate-900">{lastVotedCreatorName}</strong>}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right timer & action */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-blue-200/60">
            {!isCooldownOver ? (
              <div className="flex items-center gap-1 font-mono text-xs sm:text-base font-black text-slate-900">
                <span className="px-1.5 py-0.5 bg-white rounded-lg border border-slate-200 shadow-2xs">{hours}</span>
                <span>:</span>
                <span className="px-1.5 py-0.5 bg-white rounded-lg border border-slate-200 shadow-2xs">{minutes}</span>
                <span>:</span>
                <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded-lg shadow-2xs">{seconds}</span>
              </div>
            ) : (
              <div className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                Vote Now
              </div>
            )}

            <button
              type="button"
              onClick={onClearSession}
              title="Check another phone number"
              className="p-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors shadow-2xs active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
