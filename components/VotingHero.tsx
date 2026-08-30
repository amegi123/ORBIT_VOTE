'use client';

import React from 'react';
import { Trophy, Flame, Crown, ShieldCheck, Heart, ArrowDown, PhoneCall } from 'lucide-react';
import { formatVoteCount } from '@/lib/utils';

interface VotingHeroProps {
  totalVotes: number;
  onVoteNowClick: () => void;
  onOpenStatusCheck: () => void;
}

export function VotingHero({ totalVotes, onVoteNowClick, onOpenStatusCheck }: VotingHeroProps) {
  return (
    <section className="relative w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Header & Orbit Brand Info */}
      <div className="flex flex-col items-center text-center mb-6">
        {/* Brand Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-sm mb-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
          <span className="text-xs font-black tracking-wider uppercase text-blue-700">
            ORBIT ELECTRONICS • TIKTOKER OF THE YEAR 2026
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2">
          Vote for Your{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Favorite TikToker
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
          Your vote matters. Vote <span className="font-bold text-blue-700 underline decoration-blue-400 decoration-2 underline-offset-2">once every 24 hours</span> and help your favorite creator reach #1.
        </p>

        {/* Quick Phone Check Helper */}
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenStatusCheck}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-blue-700 shadow-sm transition-all hover:border-blue-300"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>Check My 24h Voting Status</span>
          </button>
        </div>
      </div>

      {/* ONE BANNER IMAGE / VISUAL COMPOSITION */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl shadow-blue-500/10 border border-blue-100 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-10 text-white mb-6">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-indigo-900/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Text & CTA inside Banner */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-bold text-blue-100 mb-3">
              <span>Official 2026 Competition</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              Crown Ethiopia's Next TikTok Icon
            </h2>

            <p className="text-xs sm:text-sm text-blue-100/90 max-w-md mb-6 leading-relaxed">
              Grand Winner receives 500,000 ETB + Orbit Electronics Ambassador Contract. Real-time verified voting.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full">
              <button
                type="button"
                onClick={onVoteNowClick}
                className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>VOTE NOW</span>
                <ArrowDown className="w-4 h-4 text-slate-950" />
              </button>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                <span>{formatVoteCount(totalVotes)} Total Votes</span>
              </div>
            </div>
          </div>

          {/* Right Banner Visual (Trophy & Creator Collage) */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Outer Golden Glow */}
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse-slow" />

              {/* Central Trophy Glass Circle */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 flex flex-col items-center justify-center shadow-2xl animate-float">
                <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-amber-300 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]" />
                <span className="text-[10px] font-extrabold tracking-widest text-amber-200 uppercase mt-1">
                  #1 CHAMPION
                </span>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-2 right-2 px-3 py-1 rounded-full bg-white text-blue-700 font-extrabold text-xs shadow-lg flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Orbit Awards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
