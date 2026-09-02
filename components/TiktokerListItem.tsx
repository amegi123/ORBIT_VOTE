'use client';

import React, { useState } from 'react';
import { TikToker } from '@/lib/types';
import { formatVoteCount } from '@/lib/utils';
import { formatSecondsToTime } from '@/lib/security';

interface TiktokerListItemProps {
  tiktoker: TikToker;
  rank: number;
  userCooldownRemainingSeconds?: number;
  isCampaignClosed?: boolean;
  onVoteClick: (tiktoker: TikToker) => void;
}

export function TiktokerListItem({
  tiktoker,
  rank,
  userCooldownRemainingSeconds = 0,
  isCampaignClosed = false,
  onVoteClick,
}: TiktokerListItemProps) {
  const [imageError, setImageError] = useState(false);

  const isInCooldown = userCooldownRemainingSeconds > 0;
  const { formatted: cooldownFormatted } = formatSecondsToTime(userCooldownRemainingSeconds);

  const rankColor = () => {
    if (rank === 1) return 'text-blue-600 font-black';
    if (rank === 2) return 'text-slate-800 font-black';
    if (rank === 3) return 'text-amber-800 font-black';
    return 'text-slate-400 font-bold';
  };

  const initials = tiktoker.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="py-3 px-1 sm:px-2 flex items-center justify-between gap-3 border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
      {/* Left: Rank + Photo + Creator Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Rank Number */}
        <span className={`text-sm sm:text-base w-6 text-left shrink-0 font-mono ${rankColor()}`}>
          #{rank}
        </span>

        {/* Natural Creator Photograph */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
          {!imageError ? (
            <img
              src={tiktoker.profile_image}
              alt={tiktoker.full_name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-700 text-xs font-bold">
              {initials}
            </div>
          )}
        </div>

        {/* Creator Name & Handle */}
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate leading-tight">
            {tiktoker.full_name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium truncate mt-0.5">
            <span className="text-blue-600 font-medium">{tiktoker.username}</span>
            {tiktoker.category && (
              <>
                <span className="text-slate-300">•</span>
                <span>{tiktoker.category}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Vote Count + Action */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Vote Number */}
        <div className="text-right">
          <span className="text-sm sm:text-base font-black text-slate-900 font-mono leading-none block">
            {formatVoteCount(tiktoker.vote_count)}
          </span>
        </div>

        {/* Vote Action */}
        <div className="w-[68px] sm:w-[80px] shrink-0">
          {isCampaignClosed ? (
            <span className="text-xs text-slate-400 font-bold uppercase block text-center">
              Closed
            </span>
          ) : isInCooldown ? (
            <span className="text-[11px] font-mono font-bold text-slate-500 block text-center">
              {cooldownFormatted}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onVoteClick(tiktoker)}
              className="w-full py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label={`Vote for ${tiktoker.full_name}`}
            >
              VOTE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
