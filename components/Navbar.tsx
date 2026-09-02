'use client';

import React from 'react';

interface NavbarProps {
  onOpenStatusCheck: () => void;
  onOpenRules: () => void;
  onDemoReset?: () => void;
}

export function Navbar({ onOpenStatusCheck, onOpenRules }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/95 backdrop-blur-md">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand Logo & Editorial Live Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/orbit-electronics-logo.png"
            alt="Orbit Electronics"
            className="h-6 sm:h-7 w-auto max-w-[130px] sm:max-w-[160px] object-contain shrink-0"
          />

          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>LIVE</span>
          </span>
        </div>

        {/* Secondary Navigation Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenRules}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-2 cursor-pointer focus:outline-none focus:text-slate-900"
            aria-label="View competition rules"
          >
            Rules
          </button>

          <button
            type="button"
            onClick={onOpenStatusCheck}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50/60 transition-colors py-1.5 px-3 rounded-lg border border-blue-200/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Check voting status"
          >
            Check Status
          </button>
        </div>
      </div>
    </header>
  );
}
