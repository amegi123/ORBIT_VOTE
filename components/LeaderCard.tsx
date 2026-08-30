'use client';

import React, { useState } from 'react';
import { Flame, CheckCircle, Heart, Clock } from 'lucide-react';
import { TikToker } from '@/lib/types';
import { formatVoteCount } from '@/lib/utils';
import { formatSecondsToTime } from '@/lib/security';

interface LeaderCardProps {
  tiktoker: TikToker;
  userCooldownRemainingSeconds?: number;
  isCampaignClosed?: boolean;
  onVoteClick: (tiktoker: TikToker) => void;
}

export function LeaderCard({
  tiktoker,
  userCooldownRemainingSeconds = 0,
  isCampaignClosed = false,
  onVoteClick,
}: LeaderCardProps) {
  const [imageError, setImageError] = useState(false);

  const isInCooldown = userCooldownRemainingSeconds > 0;
  const { formatted: cooldownFormatted } = formatSecondsToTime(userCooldownRemainingSeconds);

  const initials = tiktoker.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="relative w-full max-w-full overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-gradient-to-b from-blue-50/90 via-white to-blue-50/40 border-2 border-blue-500/90 shadow-md shadow-blue-500/15 transition-all">
      {/* Brand Header Pill */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black text-xs shadow-xs shadow-blue-600/20">
          <span>#1 LEADER</span>
        </div>

        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100/80 border border-blue-300 text-blue-900 text-[10px] sm:text-[11px] font-bold">
          <span>Grand Finalist</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-center">
        {/* Creator Portrait (Centered on mobile, left on desktop) */}
        <div className="relative w-full sm:w-44 aspect-[16/10] sm:aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-blue-400 bg-slate-100 shrink-0">
          {!imageError ? (
            <img
              src={tiktoker.profile_image}
              alt={tiktoker.full_name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 text-blue-900 p-4 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-200 text-blue-900 flex items-center justify-center text-lg font-black mb-1">
                {initials}
              </div>
              <span className="text-xs font-bold">{tiktoker.full_name}</span>
            </div>
          )}

          {/* Verified nominee check badge */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border border-blue-200 text-slate-900 text-[10px] font-bold shadow-xs">
            <CheckCircle className="w-3 h-3 text-blue-600 fill-blue-600" />
            <span>Verified</span>
          </div>
        </div>

        {/* Info & Action section */}
        <div className="flex-1 w-full min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-semibold text-blue-600">{tiktoker.username}</span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1 truncate">
              {tiktoker.full_name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 mb-3 leading-relaxed">
              {tiktoker.bio}
            </p>
          </div>

          {/* Mobile-First Stats Bar & Vote Button */}
          <div className="pt-2.5 border-t border-blue-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 w-full">
            {/* Live Vote Count Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-blue-200 shadow-2xs shrink-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
              </div>
              <div>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-wider block leading-none">
                  Total Votes
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 font-mono leading-none mt-0.5 block">
                  {formatVoteCount(tiktoker.vote_count)}
                </span>
              </div>
            </div>

            {/* Large Vote Action Button */}
            <div className="w-full sm:w-auto sm:min-w-[160px]">
              {isCampaignClosed ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider cursor-not-allowed text-center"
                >
                  Voting Closed
                </button>
              ) : isInCooldown ? (
                <div
                  className="w-full py-2 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 text-blue-800">
                    <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse shrink-0" />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Vote again in</span>
                  </div>
                  <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded-md bg-white border border-blue-200 shadow-2xs text-blue-950">
                    {cooldownFormatted}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onVoteClick(tiktoker)}
                  className="w-full py-2.5 sm:py-3 px-5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-1.5 shadow-md bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-600/30 active:scale-95 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                  <span>VOTE FOR #1</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
