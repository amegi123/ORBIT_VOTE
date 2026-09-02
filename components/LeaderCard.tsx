'use client';

import React, { useState } from 'react';
import { TikToker } from '@/lib/types';
import { formatVoteCount } from '@/lib/utils';
import { formatSecondsToTime } from '@/lib/security';

interface LeaderCardProps {
  tiktoker: TikToker;
  leadVotes?: number;
  isSearchMode?: boolean;
  userCooldownRemainingSeconds?: number;
  isCampaignClosed?: boolean;
  onVoteClick: (tiktoker: TikToker) => void;
}

export function LeaderCard({
  tiktoker,
  leadVotes = 0,
  isSearchMode = false,
  userCooldownRemainingSeconds = 0,
  isCampaignClosed = false,
  onVoteClick,
}: LeaderCardProps) {
  const [imageError, setImageError] = useState(false);

  const isActualLeader = (tiktoker.rank || 1) === 1;
  const isInCooldown = userCooldownRemainingSeconds > 0;
  const { formatted: cooldownFormatted } = formatSecondsToTime(userCooldownRemainingSeconds);

  const initials = tiktoker.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <article className="w-full max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 transition-all">
      {/* 1. Header: Editorial Rank & Status */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {isSearchMode && !isActualLeader ? (
            <>
              <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
                SEARCH RESULT
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold font-mono text-slate-600">
                Rank #{tiktoker.rank}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-black tracking-widest text-blue-600 uppercase">
                #1 LEADER
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-medium text-slate-400">
                Grand Finalist
              </span>
            </>
          )}
        </div>

        {isActualLeader && leadVotes > 0 ? (
          <span className="text-xs font-semibold text-emerald-700 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>{leadVotes.toLocaleString()} votes ahead</span>
          </span>
        ) : isSearchMode ? (
          <span className="text-xs text-slate-400 font-medium">
            1 Match
          </span>
        ) : null}
      </div>

      {/* 2. Creator Photograph (Hero Visual) */}
      <div className="relative w-full h-[290px] sm:h-[320px] rounded-xl overflow-hidden bg-slate-100 mb-4">
        {!imageError ? (
          <img
            src={tiktoker.profile_image}
            alt={tiktoker.full_name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-[center_15%]"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xl font-black mb-1.5">
              {initials}
            </div>
            <span className="text-sm font-bold">{tiktoker.full_name}</span>
          </div>
        )}
      </div>

      {/* 3. Creator Metadata & Editorial Typography */}
      <div className="flex flex-col mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span className="text-blue-600 font-semibold">{tiktoker.username}</span>
          {tiktoker.category && (
            <>
              <span className="text-slate-300">•</span>
              <span>{tiktoker.category}</span>
            </>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
          {tiktoker.full_name}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {tiktoker.bio}
        </p>
      </div>

      {/* 4. Statistics & Primary Action */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
        {/* Total Votes Number Display */}
        <div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight leading-none block">
            {formatVoteCount(tiktoker.vote_count)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
            TOTAL VOTES
          </span>
        </div>

        {/* Primary Action Button */}
        <div className="w-full sm:w-auto sm:min-w-[180px]">
          {isCampaignClosed ? (
            <button
              type="button"
              disabled
              className="w-full py-3 px-5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider cursor-not-allowed text-center"
            >
              Voting Closed
            </button>
          ) : isInCooldown ? (
            <div className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-between gap-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vote again in</span>
              <span className="font-mono text-xs font-black text-slate-900">{cooldownFormatted}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onVoteClick(tiktoker)}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-h-[44px]"
              aria-label={`Vote for ${tiktoker.full_name}`}
            >
              {isActualLeader ? 'VOTE FOR #1' : 'VOTE'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
