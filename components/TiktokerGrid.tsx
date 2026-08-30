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
      <section className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-2 space-y-3">
        {/* 1. Leader Card Skeleton */}
        <div className="w-full rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 bg-white border border-slate-200/90 shadow-2xs animate-pulse">
          {/* Header pill skeletons */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="h-6 w-24 rounded-full bg-slate-200" />
            <div className="h-5 w-20 rounded-full bg-slate-200" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-center">
            {/* Portrait skeleton */}
            <div className="w-full sm:w-44 aspect-[16/10] sm:aspect-square rounded-2xl bg-slate-200 shrink-0" />

            {/* Info & action skeleton */}
            <div className="flex-1 w-full flex flex-col justify-between">
              <div>
                <div className="h-3.5 w-24 rounded bg-slate-200 mb-2" />
                <div className="h-6 w-48 sm:w-56 rounded-lg bg-slate-200 mb-2.5" />
                <div className="h-3.5 w-full rounded bg-slate-200 mb-1.5" />
                <div className="h-3.5 w-3/4 rounded bg-slate-200 mb-4" />
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="h-9 w-28 rounded-xl bg-slate-200 shrink-0" />
                <div className="h-10 w-36 rounded-xl bg-slate-200" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Nominees List Header Skeleton */}
        <div className="flex items-center justify-between px-1 pt-2">
          <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
        </div>

        {/* 3. Nominee Item Skeletons */}
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-full rounded-2xl p-2.5 sm:p-3.5 bg-white border border-slate-200/90 shadow-2xs animate-pulse flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                {/* Rank number placeholder */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-slate-200 shrink-0" />
                {/* Avatar placeholder */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-slate-200 shrink-0" />
                {/* Name & handle */}
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-28 sm:w-40 rounded bg-slate-200 mb-1.5" />
                  <div className="h-3 w-16 sm:w-24 rounded bg-slate-200" />
                </div>
              </div>

              {/* Vote count & button placeholders */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-16 sm:w-20 rounded-xl bg-slate-200 hidden xs:block" />
                <div className="h-8 sm:h-9 w-20 sm:w-24 rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
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
