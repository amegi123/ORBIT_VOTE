'use client';

// Orbit Ethiopian TikToker Voting Platform
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Campaign, TikToker, PhoneStatusResponse } from '@/lib/types';
import { Preloader } from '@/components/Preloader';
import { Navbar } from '@/components/Navbar';
import { PersonalVoteCountdown } from '@/components/PersonalVoteCountdown';
import { SearchBar } from '@/components/SearchBar';
import { TiktokerGrid } from '@/components/TiktokerGrid';
import { VoteModal } from '@/components/VoteModal';
import { StatusCheckModal } from '@/components/StatusCheckModal';
import { RulesModal } from '@/components/RulesModal';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tiktokers, setTiktokers] = useState<TikToker[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedTiktokerForVote, setSelectedTiktokerForVote] = useState<TikToker | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState<boolean>(false);
  const [isStatusCheckModalOpen, setIsStatusCheckModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);

  // Active user phone session & 24h cooldown
  const [activePhoneSession, setActivePhoneSession] = useState<{
    phoneNumber: string;
    nextEligibleAt: string;
    cooldownSeconds: number;
    lastVotedCreatorName?: string;
  } | null>(null);

  const [cooldownSecondsRemaining, setCooldownSecondsRemaining] = useState<number>(0);

  // Live second-by-second cooldown timer
  useEffect(() => {
    if (!activePhoneSession?.nextEligibleAt) {
      setCooldownSecondsRemaining(0);
      return;
    }

    const updateTicker = () => {
      const targetTime = new Date(activePhoneSession.nextEligibleAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((targetTime - now) / 1000));
      setCooldownSecondsRemaining(diff);

      if (diff <= 0) {
        setActivePhoneSession(null);
        localStorage.removeItem('orbit_voting_phone');
      }
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);
    return () => clearInterval(interval);
  }, [activePhoneSession?.nextEligibleAt]);

  // Fetch live votes & campaign status
  const fetchLiveVotes = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      const res = await fetch('/api/live-votes', { cache: 'no-store' });
      if (!res.ok) return;

      const data = await res.json();
      setCampaign(data.campaign);
      setTiktokers(data.tiktokers);
      setTotalVotes(data.total_votes);
    } catch (err) {
      console.error('Error fetching live votes:', err);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, []);

  // Check saved phone status from backend on mount
  const checkSavedPhoneStatus = useCallback(async () => {
    try {
      const savedPhone = localStorage.getItem('orbit_voting_phone');
      if (!savedPhone) return;

      const res = await fetch(`/api/vote/check-status?phone=${encodeURIComponent(savedPhone)}`);
      if (!res.ok) return;

      const data: PhoneStatusResponse = await res.json();
      if (!data.can_vote && data.next_eligible_vote_at && data.cooldown_remaining_seconds > 0) {
        setActivePhoneSession({
          phoneNumber: data.phone_number,
          nextEligibleAt: data.next_eligible_vote_at,
          cooldownSeconds: data.cooldown_remaining_seconds,
          lastVotedCreatorName: data.last_voted_tiktoker_name || undefined,
        });
      } else {
        setActivePhoneSession(null);
      }
    } catch (err) {
      console.error('Error checking saved phone status:', err);
    }
  }, []);

  useEffect(() => {
    fetchLiveVotes(true);
    checkSavedPhoneStatus();

    const interval = setInterval(() => {
      fetchLiveVotes(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchLiveVotes, checkSavedPhoneStatus]);

  // Filtered tiktokers
  const filteredTiktokers = useMemo(() => {
    if (!searchQuery.trim()) return tiktokers;
    const q = searchQuery.toLowerCase().trim();
    return tiktokers.filter((t) =>
      t.full_name.toLowerCase().includes(q) ||
      t.username.toLowerCase().includes(q)
    );
  }, [tiktokers, searchQuery]);

  const handleVoteClick = (tiktoker: TikToker) => {
    setSelectedTiktokerForVote(tiktoker);
    setIsVoteModalOpen(true);
  };

  const handleVoteSuccess = (data: {
    phoneNumber: string;
    nextEligibleAt: string;
    cooldownSeconds: number;
    tiktoker: TikToker;
  }) => {
    localStorage.setItem('orbit_voting_phone', data.phoneNumber);
    setActivePhoneSession({
      phoneNumber: data.phoneNumber,
      nextEligibleAt: data.nextEligibleAt,
      cooldownSeconds: data.cooldownSeconds,
      lastVotedCreatorName: data.tiktoker.full_name,
    });

    fetchLiveVotes(false);
  };

  const handleClearSession = () => {
    localStorage.removeItem('orbit_voting_phone');
    setActivePhoneSession(null);
  };

  const isCampaignClosed = campaign ? new Date(campaign.end_at).getTime() <= Date.now() : false;

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 0. Branded Initial Preloader */}
      <Preloader isLoading={isLoading} />

      {/* 1. Mobile-First Sticky Header */}
      <Navbar
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenStatusCheck={() => setIsStatusCheckModalOpen(true)}
      />

      {/* 2. Personal 24-Hour Cooldown Banner (if active) */}
      {activePhoneSession && (
        <PersonalVoteCountdown
          phoneNumber={activePhoneSession.phoneNumber}
          nextEligibleAt={activePhoneSession.nextEligibleAt}
          initialCooldownSeconds={activePhoneSession.cooldownSeconds}
          lastVotedCreatorName={activePhoneSession.lastVotedCreatorName}
          onClearSession={handleClearSession}
        />
      )}

      {/* 3. Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalResults={filteredTiktokers.length}
        totalNominees={tiktokers.length}
      />

      {/* 4. Creator Voting Cards */}
      <TiktokerGrid
        tiktokers={filteredTiktokers}
        isLoading={isLoading}
        totalVotesAllCreators={totalVotes}
        userCooldownRemainingSeconds={cooldownSecondsRemaining}
        isCampaignClosed={isCampaignClosed}
        onVoteClick={handleVoteClick}
        onResetSearch={() => setSearchQuery('')}
      />

      {/* 5. Footer */}
      <Footer
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenStatusCheck={() => setIsStatusCheckModalOpen(true)}
      />

      {/* 7. Voting Modal (Phone + OTP + Success) */}
      <VoteModal
        isOpen={isVoteModalOpen}
        tiktoker={selectedTiktokerForVote}
        onClose={() => setIsVoteModalOpen(false)}
        onVoteSuccess={handleVoteSuccess}
      />

      {/* 8. Status Check Modal */}
      <StatusCheckModal
        isOpen={isStatusCheckModalOpen}
        onClose={() => setIsStatusCheckModalOpen(false)}
        onSessionLoaded={(status) => {
          if (!status.can_vote && status.next_eligible_vote_at) {
            localStorage.setItem('orbit_voting_phone', status.phone_number);
            setActivePhoneSession({
              phoneNumber: status.phone_number,
              nextEligibleAt: status.next_eligible_vote_at,
              cooldownSeconds: status.cooldown_remaining_seconds,
              lastVotedCreatorName: status.last_voted_tiktoker_name || undefined,
            });
          }
        }}
      />

      {/* 9. Rules Modal */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </main>
  );
}
