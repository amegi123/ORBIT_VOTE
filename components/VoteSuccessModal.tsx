'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Clock, PartyPopper } from 'lucide-react';
import { TikToker } from '@/lib/types';
import { formatVoteCount } from '@/lib/utils';
import { formatSecondsToTime } from '@/lib/security';

interface VoteSuccessModalProps {
  tiktoker: TikToker;
  ranking?: number;
  newTotalVotes?: number;
  nextEligibleVoteAt: string;
  onClose: () => void;
}

export function VoteSuccessModal({
  tiktoker,
  newTotalVotes,
  nextEligibleVoteAt,
  onClose,
}: VoteSuccessModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(24 * 3600);

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#f59e0b', '#10b981', '#ffffff'],
      });

      const end = Date.now() + 1.2 * 1000;
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 50,
          origin: { x: 0, y: 0.7 },
          colors: ['#2563eb', '#f59e0b', '#3b82f6'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 50,
          origin: { x: 1, y: 0.7 },
          colors: ['#2563eb', '#f59e0b', '#3b82f6'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (e) {
      // ignore
    }

    const updateTime = () => {
      const target = new Date(nextEligibleVoteAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((target - now) / 1000));
      setSecondsRemaining(diff);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [nextEligibleVoteAt]);

  const { hours, minutes, seconds } = formatSecondsToTime(secondsRemaining);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Celebration Icon */}
      <div className="relative mb-3">
        <div className="w-16 h-16 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center animate-bounce shadow-md shadow-blue-500/10">
          <PartyPopper className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <span className="text-[11px] font-black tracking-widest uppercase text-emerald-600 mb-0.5">
        OFFICIAL VOTE RECORDED
      </span>

      <h2 className="text-2xl font-black text-slate-900 mb-1">
        🎉 Vote Submitted!
      </h2>

      <p className="text-xs sm:text-sm text-slate-600 max-w-sm mb-5">
        Congratulations! Your vote for <strong className="text-blue-700">{tiktoker.full_name}</strong> has been counted.
      </p>

      {/* Creator Verified Badge Card */}
      <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-5 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={tiktoker.profile_image}
            alt={tiktoker.full_name}
            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="text-left min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{tiktoker.full_name}</h4>
            <span className="text-xs text-blue-600 font-semibold">{tiktoker.username}</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[11px] font-bold text-slate-500">Total Votes</div>
          <div className="text-sm sm:text-base font-black text-slate-900 font-mono">
            {formatVoteCount(newTotalVotes || tiktoker.vote_count)}
          </div>
        </div>
      </div>

      {/* 24-Hour Personal Cooldown Timer Display */}
      <div className="w-full p-4 rounded-2xl bg-blue-50 border border-blue-200 mb-5 shadow-xs">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Your Next Vote is Available In</span>
        </div>

        <div className="flex items-center justify-center gap-1 font-mono text-2xl font-black text-slate-900">
          <div className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">
            {hours}
          </div>
          <span>:</span>
          <div className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">
            {minutes}
          </div>
          <span>:</span>
          <div className="px-2.5 py-1 bg-blue-600 text-white rounded-lg shadow-xs">
            {seconds}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 font-medium">
          Strict backend security: 1 vote per phone number every 24 hours.
        </p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wider shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
      >
        Done / Back to Leaderboard
      </button>
    </div>
  );
}
