'use client';

import React, { useEffect, useState } from 'react';
import { Timer, Lock } from 'lucide-react';
import { calculateTimeRemaining, formatTwoDigits } from '@/lib/utils';

interface VotingCountdownProps {
  endAtIso: string;
  onCampaignExpired?: () => void;
}

export function VotingCountdown({ endAtIso, onCampaignExpired }: VotingCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>(() => {
    if (endAtIso) {
      return calculateTimeRemaining(endAtIso);
    }
    return { days: 5, hours: 17, minutes: 42, seconds: 30, isExpired: false };
  });

  useEffect(() => {
    const updateTimer = () => {
      if (!endAtIso) return;
      const remaining = calculateTimeRemaining(endAtIso);
      setTimeLeft(remaining);

      if (remaining.isExpired && onCampaignExpired) {
        onCampaignExpired();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endAtIso, onCampaignExpired]);

  if (timeLeft.isExpired) {
    return (
      <div className="w-full py-4 px-4">
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>VOTING OFFICIALLY CLOSED</span>
          </div>
          <p className="text-xs text-slate-600">The voting period has ended. Final rankings are permanently locked.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-3 px-4 max-w-6xl mx-auto">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Header Label */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <Timer className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="text-xs sm:text-sm font-black tracking-[0.18em] text-slate-800 uppercase">
            VOTING ENDS IN
          </span>
        </div>

        {/* 4-Box Real-time Countdown Timer in Light Theme */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full">
          {/* Days */}
          <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-md shadow-slate-200/50">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              {formatTwoDigits(timeLeft.days)}
            </span>
            <span className="text-[9px] sm:text-xs font-bold tracking-widest text-slate-500 uppercase mt-1">
              DAYS
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white border border-blue-200 shadow-md shadow-blue-500/5">
            <span className="text-2xl sm:text-4xl font-black text-blue-600 tracking-tight font-mono">
              {formatTwoDigits(timeLeft.hours)}
            </span>
            <span className="text-[9px] sm:text-xs font-bold tracking-widest text-blue-600 uppercase mt-1">
              HOURS
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-md shadow-slate-200/50">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              {formatTwoDigits(timeLeft.minutes)}
            </span>
            <span className="text-[9px] sm:text-xs font-bold tracking-widest text-slate-500 uppercase mt-1">
              MINUTES
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-blue-50/80 border border-blue-300 shadow-md shadow-blue-500/10">
            <span className="text-2xl sm:text-4xl font-black text-blue-700 tracking-tight font-mono">
              {formatTwoDigits(timeLeft.seconds)}
            </span>
            <span className="text-[9px] sm:text-xs font-bold tracking-widest text-blue-700 uppercase mt-1">
              SECONDS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
