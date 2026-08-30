'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenRules: () => void;
  onOpenStatusCheck: () => void;
}

export function Footer({ onOpenRules, onOpenStatusCheck }: FooterProps) {
  return (
    <footer className="w-full max-w-4xl mx-auto px-3 sm:px-4 mt-6 sm:mt-8 mb-8">
      <div className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <img
            src="/orbit-electronics-logo.png"
            alt="Orbit Electronics"
            className="h-5 sm:h-6 w-auto max-w-[130px] object-contain"
          />
          <p className="text-[10px] sm:text-[11px] text-slate-500">
            Orbit Creative Challenge 2026. Addis Ababa, Ethiopia.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={onOpenRules}
            className="hover:text-blue-600 transition-colors py-0.5 cursor-pointer"
          >
            Competition Rules
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={onOpenStatusCheck}
            className="hover:text-blue-600 transition-colors py-0.5 cursor-pointer"
          >
            Check Status
          </button>
        </div>

        {/* Security */}
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Verified 24-Hour Protocol</span>
        </div>
      </div>
    </footer>
  );
}
