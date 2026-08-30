'use client';

import React, { useState } from 'react';
import { Flame, CheckCircle, Heart } from 'lucide-react';
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

  const rankBadgeContent = () => {
    if (rank === 2) {
      return (
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800 font-black text-[11px] sm:text-xs flex items-center justify-center shrink-0 border border-slate-300 shadow-2xs">
          #2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-b from-amber-600 to-amber-700 text-white font-black text-[11px] sm:text-xs flex items-center justify-center shrink-0 border border-amber-800 shadow-2xs">
          #3
        </div>
      );
    }
    return (
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 text-slate-600 font-extrabold text-[11px] sm:text-xs flex items-center justify-center shrink-0 border border-slate-200">
        #{rank}
      </div>
    );
  };

  const initials = tiktoker.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="group relative w-full max-w-full overflow-hidden rounded-2xl p-2.5 sm:p-3.5 bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all duration-150 flex items-center justify-between gap-2 active:scale-[0.99]">
      {/* Left side: Rank + Avatar + Creator Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Rank Badge */}
        {rankBadgeContent()}

        {/* Thumbnail Image */}
        <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          {!imageError ? (
            <img
              src={tiktoker.profile_image}
              alt={tiktoker.full_name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-700 text-xs font-bold">
              {initials}
            </div>
          )}
          <div className="absolute bottom-0 right-0 p-0.5 bg-white/95 rounded-tl-md">
            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 fill-blue-600" />
          </div>
        </div>

        {/* Creator Name & Username */}
        <div className="min-w-0 flex-1">
          <h4 className="font-extrabold text-xs sm:text-base text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
            {tiktoker.full_name}
          </h4>

          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 font-medium truncate mt-0.5">
            <span className="font-semibold">{tiktoker.username}</span>
          </div>
        </div>
      </div>

      {/* Right side: Votes & Action Button */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Vote Count */}
        <div className="text-right px-1.5 sm:px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0">
          <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase flex items-center justify-end gap-0.5">
            <Heart className="w-2 h-2 text-rose-500 fill-rose-500" />
            <span className="hidden sm:inline">Votes</span>
          </span>
          <span className="text-xs sm:text-sm font-black text-slate-900 font-mono leading-none block mt-0.5">
            {formatVoteCount(tiktoker.vote_count)}
          </span>
        </div>

        {/* Action Button */}
        <div className="w-[68px] sm:w-[96px] shrink-0">
          {isCampaignClosed ? (
            <button
              type="button"
              disabled
              className="w-full py-1.5 sm:py-2 px-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-bold uppercase cursor-not-allowed text-center"
            >
              Closed
            </button>
          ) : isInCooldown ? (
            <div
              className="w-full py-1 sm:py-1.5 px-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-center shadow-2xs"
            >
              <span className="text-[7px] sm:text-[8px] uppercase text-amber-700 block leading-none font-bold">Wait</span>
              <span className="font-mono text-[9px] sm:text-[10px] font-black leading-tight truncate block text-amber-950 mt-0.5">{cooldownFormatted}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onVoteClick(tiktoker)}
              className="w-full py-1.5 sm:py-2 px-2 rounded-xl font-black text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-1 shadow-xs bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95 cursor-pointer"
            >
              <Flame className="w-3 h-3 fill-white text-white shrink-0" />
              <span>VOTE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
