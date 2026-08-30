'use client';

import React, { useState } from 'react';
import { Crown, Trophy, Medal, Flame, CheckCircle, Heart } from 'lucide-react';
import { TikToker } from '@/lib/types';
import { formatVoteCount } from '@/lib/utils';
import { formatSecondsToTime } from '@/lib/security';

interface TiktokerCardProps {
  tiktoker: TikToker;
  rank: number;
  totalVotesAllCreators: number;
  userCooldownRemainingSeconds?: number;
  isCampaignClosed?: boolean;
  onVoteClick: (tiktoker: TikToker) => void;
}

export function TiktokerCard({
  tiktoker,
  rank,
  userCooldownRemainingSeconds = 0,
  isCampaignClosed = false,
  onVoteClick,
}: TiktokerCardProps) {
  const [imageError, setImageError] = useState(false);

  const isInCooldown = userCooldownRemainingSeconds > 0;
  const { formatted: cooldownFormatted } = formatSecondsToTime(userCooldownRemainingSeconds);

  // Top 3 specific border and glow classes for light theme
  const rankStyles = {
    1: 'rank-1-border',
    2: 'rank-2-border',
    3: 'rank-3-border',
  }[rank] || 'light-card light-card-hover';

  const rankBadgeContent = () => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-sm">
          <Crown className="w-3.5 h-3.5 fill-slate-950" />
          <span>#1 LEADER</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 text-slate-800 font-black text-xs shadow-sm">
          <Trophy className="w-3.5 h-3.5 fill-slate-800" />
          <span>#2 SILVER</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-700 text-white font-black text-xs shadow-sm">
          <Medal className="w-3.5 h-3.5 fill-white" />
          <span>#3 BRONZE</span>
        </div>
      );
    }
    return (
      <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs">
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
    <div
      className={`group relative rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ${rankStyles}`}
    >
      {/* Top Header Row with Rank Badge */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        {rankBadgeContent()}
      </div>

      {/* Creator Image */}
      <div className="relative aspect-[4/4.8] w-full rounded-2xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
        {!imageError ? (
          <img
            src={tiktoker.profile_image}
            alt={tiktoker.full_name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-800 p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-black mb-2">
              {initials}
            </div>
            <span className="text-xs text-slate-600 font-medium">{tiktoker.full_name}</span>
          </div>
        )}

        {/* Verified Badge on Image */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-semibold shadow-sm">
          <CheckCircle className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
          <span>Nominee</span>
        </div>
      </div>

      {/* Creator Info */}
      <div className="flex flex-col mb-4 relative z-10">
        <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
          {tiktoker.full_name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-0.5">
          <span>{tiktoker.username}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-normal">TikTok Creator</span>
        </div>

        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {tiktoker.bio}
        </p>

        {/* Clean Vote Count (Milestone stick removed) */}
        <div className="mt-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Total Votes
          </span>
          <span className="text-base font-black text-slate-900 font-mono tracking-tight">
            {formatVoteCount(tiktoker.vote_count)}
          </span>
        </div>
      </div>

      {/* Vote CTA Button */}
      <div className="relative z-10 mt-auto">
        {isCampaignClosed ? (
          <button
            type="button"
            disabled
            className="w-full py-3.5 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider cursor-not-allowed text-center"
          >
            Voting Closed
          </button>
        ) : isInCooldown ? (
          <button
            type="button"
            disabled
            className="w-full py-3 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold cursor-not-allowed flex flex-col items-center justify-center gap-0.5 shadow-sm"
          >
            <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">Vote again in</span>
            <span className="font-mono text-xs text-amber-900 font-extrabold">{cooldownFormatted}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onVoteClick(tiktoker)}
            className="w-full py-3.5 px-4 rounded-xl font-black text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-md bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-white text-white" />
            <span>VOTE NOW</span>
          </button>
        )}
      </div>
    </div>
  );
}
