'use client';

import React from 'react';
import { HelpCircle, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenStatusCheck: () => void;
  onOpenRules: () => void;
}

export function Navbar({ onOpenStatusCheck, onOpenRules }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all shadow-xs">
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 overflow-hidden">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/orbit-electronics-logo.png"
            alt="Orbit Electronics"
            className="h-7 sm:h-8.5 w-auto max-w-[140px] sm:max-w-[180px] object-contain shrink-0"
          />

          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[9px] font-extrabold text-emerald-600 border border-emerald-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE
          </span>
        </div>

        {/* Action Buttons for Mobile / Desktop */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Rules icon button */}
          <button
            type="button"
            onClick={onOpenRules}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="Voting Rules"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {/* Check Status Button */}
          <button
            type="button"
            onClick={onOpenStatusCheck}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Status</span>
          </button>
        </div>
      </div>
    </header>
  );
}
