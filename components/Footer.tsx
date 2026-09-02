'use client';

import React from 'react';

interface FooterProps {
  onOpenRules: () => void;
  onOpenStatusCheck?: () => void;
}

export function Footer({ onOpenRules }: FooterProps) {
  return (
    <footer className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-12 mb-14 border-t border-slate-200/70 pt-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5">
      {/* Brand & Event Details */}
      <div className="flex flex-col items-center sm:items-start gap-0.5">
        <img
          src="/orbit-electronics-logo.png"
          alt="Orbit Electronics"
          className="h-6 w-auto max-w-[130px] object-contain"
        />
        <p className="text-xs text-slate-400 font-medium mt-1">
          Orbit Creative Challenge 2026 • Addis Ababa, Ethiopia.
        </p>
      </div>

      {/* Policies */}
      <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
        <button
          type="button"
          onClick={onOpenRules}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          Competition Rules
        </button>
        <span className="text-slate-300">·</span>
        <button
          type="button"
          onClick={onOpenRules}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          24-Hour Voting Policy
        </button>
      </div>

      {/* Verified Protocol */}
      <div className="text-xs font-semibold text-emerald-700 tracking-wide">
        Verified 24-Hour Protocol
      </div>
    </footer>
  );
}
