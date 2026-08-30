'use client';

import React from 'react';
import { TikToker } from '@/lib/types';
import { LeaderCard } from './LeaderCard';
import { TiktokerListItem } from './TiktokerListItem';
import { SearchX, ListOrdered } from 'lucide-react';

interface TiktokerGridProps {
  tiktokers: TikToker[];
  isLoading: boolean;
  totalVotesAllCreators: number;
  userCooldownRemainingSeconds?: number;
  isCampaignClosed?: boolean;
  onVoteClick: (tiktoker: TikToker) => void;
  onResetSearch?: () => void;
}

export function TiktokerGrid({
  tiktokers,
  isLoading,
  userCooldownRemainingSeconds = 0,
  isCampaignClosed = false,
  onVoteClick,
  onResetSearch,
}: TiktokerGridProps) {
  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-4 space-y-3">
        {/* Leader Skeleton */}
        <div className="w-full h-56 rounded-3xl bg-white border border-slate-200 animate-pulse p-4" />
        {/* List Skeleton */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-full h-16 rounded-2xl bg-white border border-slate-200 animate-pulse"
          />
        ))}
      </section>
    );
  }

  if (tiktokers.length === 0) {
    return (
      <section className="max-w-md mx-auto px-4 py-8 text-center">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2.5">
            <SearchX className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No Creators Found
          </h3>

          <p className="text-xs text-slate-500 max-w-xs mb-4">
            We couldn't find any creator matching your search. Try searching for another name or @handle.
          </p>

          {onResetSearch && (
            <button
              type="button"
              onClick={onResetSearch}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              Show All Nominees
            </button>
          )}
        </div>
      </section>
    );
  }

  // Find current #1 leader if present in list
  const leader = tiktokers.find((t) => (t.rank || 1) === 1);
  const otherNominees = tiktokers.filter((t) => (t.rank || 1) !== 1);

  return (
    <section id="creator-leaderboard" className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-4 overflow-hidden">
      {/* 1. Leader Spotlight Frame (#1 Rank) */}
      {leader && (
        <div className="mb-4 sm:mb-6 w-full max-w-full">
          <LeaderCard
            tiktoker={leader}
            userCooldownRemainingSeconds={userCooldownRemainingSeconds}
            isCampaignClosed={isCampaignClosed}
            onVoteClick={onVoteClick}
          />
        </div>
      )}

      {/* 2. Nominees Item List (#2 to #10) */}
      {otherNominees.length > 0 && (
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm sm:text-base">
              <ListOrdered className="w-4 h-4 text-blue-600" />
              <span>Leaderboard Nominees</span>
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              Ranks #2 – #{otherNominees[otherNominees.length - 1]?.rank || 10}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:gap-2.5">
            {otherNominees.map((tiktoker) => (
              <TiktokerListItem
                key={tiktoker.id}
                tiktoker={tiktoker}
                rank={tiktoker.rank || 2}
                userCooldownRemainingSeconds={userCooldownRemainingSeconds}
                isCampaignClosed={isCampaignClosed}
                onVoteClick={onVoteClick}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
