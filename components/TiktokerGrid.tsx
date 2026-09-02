'use client';

import React from 'react';
import { TikToker } from '@/lib/types';
import { LeaderCard } from './LeaderCard';
import { TiktokerListItem } from './TiktokerListItem';
import { SearchX } from 'lucide-react';

interface TiktokerGridProps {
  tiktokers: TikToker[];
  searchQuery?: string;
  isLoading: boolean;
  totalVotesAllCreators: number;
  userCooldownRemainingSeconds?: number;
  isCampaignClosed?: boolean;
  onVoteClick: (tiktoker: TikToker) => void;
  onResetSearch?: () => void;
}

export function TiktokerGrid({
  tiktokers,
  searchQuery = '',
  isLoading,
  userCooldownRemainingSeconds = 0,
  isCampaignClosed = false,
  onVoteClick,
  onResetSearch,
}: TiktokerGridProps) {
  const isSearchActive = searchQuery.trim().length > 0;

  // 1. Loading State
  if (isLoading) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-5" aria-label="Loading nominees">
        {/* Leader Card Skeleton */}
        <div className="w-full rounded-2xl p-4 sm:p-6 bg-white border border-slate-200/90 animate-pulse">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-4 w-28 rounded bg-slate-200" />
          </div>

          <div className="h-[290px] sm:h-[320px] rounded-xl bg-slate-200 mb-4" />

          <div className="h-3 w-28 rounded bg-slate-200 mb-2" />
          <div className="h-7 w-48 sm:w-60 rounded bg-slate-200 mb-2" />
          <div className="h-3.5 w-3/4 rounded bg-slate-200 mb-4" />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="h-9 w-24 rounded bg-slate-200" />
            <div className="h-11 w-36 rounded-xl bg-slate-200" />
          </div>
        </div>

        {/* Nominees List Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 animate-pulse space-y-4">
          <div className="h-4 w-28 rounded bg-slate-200 mb-2" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-5 h-4 rounded bg-slate-200" />
                <div className="w-11 h-11 rounded-lg bg-slate-200" />
                <div>
                  <div className="h-4 w-32 rounded bg-slate-200 mb-1.5" />
                  <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-14 rounded bg-slate-200" />
                <div className="h-8 w-18 rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 2. Empty Search Results State
  if (tiktokers.length === 0) {
    return (
      <section className="max-w-md mx-auto px-4 py-12 text-center" aria-label="No results">
        <div className="p-8 rounded-2xl bg-white border border-slate-200/90 flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
            <SearchX className="w-5 h-5" />
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1">
            No Creators Found
          </h3>

          <p className="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
            {isSearchActive
              ? `We couldn't find any creator matching "${searchQuery}". Try searching for another name or @handle.`
              : `No creators available at this time.`}
          </p>

          {onResetSearch && isSearchActive && (
            <button
              type="button"
              onClick={onResetSearch}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              Show All Creators
            </button>
          )}
        </div>
      </section>
    );
  }

  // 3. Search Mode: Exactly 1 Match
  if (isSearchActive && tiktokers.length === 1) {
    const matchedCreator = tiktokers[0];
    return (
      <section id="creator-search-result" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-5">
        <LeaderCard
          tiktoker={matchedCreator}
          isSearchMode={true}
          leadVotes={0}
          userCooldownRemainingSeconds={userCooldownRemainingSeconds}
          isCampaignClosed={isCampaignClosed}
          onVoteClick={onVoteClick}
        />
      </section>
    );
  }

  // 4. Search Mode: Multiple Matches (> 1 match)
  if (isSearchActive && tiktokers.length > 1) {
    return (
      <section id="creator-search-results" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-1 border-b border-slate-200/70">
            <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase">
              Search Results
            </h3>

            <span className="text-xs text-slate-500 font-medium">
              {tiktokers.length} Creators found
            </span>
          </div>

          {/* Results List with Original Ranks Preserved */}
          <div role="list" aria-label="Search results list">
            {tiktokers.map((tiktoker) => (
              <TiktokerListItem
                key={tiktoker.id}
                tiktoker={tiktoker}
                rank={tiktoker.rank || 1}
                userCooldownRemainingSeconds={userCooldownRemainingSeconds}
                isCampaignClosed={isCampaignClosed}
                onVoteClick={onVoteClick}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 5. Default State (No Search Active)
  // Find genuine current #1 leader and #2 creator to calculate dynamic lead
  const leader = tiktokers.find((t) => (t.rank || 1) === 1) || tiktokers[0];
  const secondPlace = tiktokers.find((t) => (t.rank || 2) === 2) || (tiktokers.length > 1 ? tiktokers[1] : null);
  const otherNominees = tiktokers.filter((t) => t.id !== leader?.id);

  const leadVotes = leader && secondPlace ? Math.max(0, leader.vote_count - secondPlace.vote_count) : 0;

  return (
    <section id="creator-leaderboard" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-5">
      {/* 1. Real #1 Leader Hero Spotlight */}
      {leader && (
        <div className="mb-6 sm:mb-8 w-full max-w-full">
          <LeaderCard
            tiktoker={leader}
            leadVotes={leadVotes}
            isSearchMode={false}
            userCooldownRemainingSeconds={userCooldownRemainingSeconds}
            isCampaignClosed={isCampaignClosed}
            onVoteClick={onVoteClick}
          />
        </div>
      )}

      {/* 2. Nominees Leaderboard Ranking List (#2 to #11) */}
      {otherNominees.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-3 mb-1 border-b border-slate-200/70">
            <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase">
              Leaderboard
            </h3>

            <span className="text-xs text-slate-400 font-medium">
              Ranks #2 – #{tiktokers[tiktokers.length - 1]?.rank || tiktokers.length}
            </span>
          </div>

          {/* Clean Ranking List */}
          <div role="list" aria-label="Nominees leaderboard">
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
