'use client';

import React from 'react';
import { X, ShieldCheck, Clock, Award, Phone, AlertTriangle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 bg-white border border-slate-200 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 max-h-[90vh] overflow-y-auto text-slate-900"
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">Official Voting Rules</h3>
            <p className="text-xs text-slate-500">Orbit Electronics TikToker Awards 2026</p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
            <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">1 Vote Every 24 Hours</h4>
              <p className="text-slate-500 text-xs">
                Each verified phone number is strictly restricted to one vote per 24-hour cycle. Cooldowns are enforced directly on our secure backend database.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
            <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Ethiopian Mobile Verification</h4>
              <p className="text-slate-500 text-xs">
                Only valid Ethiopian phone numbers (Ethio Telecom 09... and Safaricom 07...) with verified 6-digit OTPs are counted.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Anti-Abuse & Bot Protection</h4>
              <p className="text-slate-500 text-xs">
                Automated voting and duplicate request replays are rejected by rate limiters and transactional locks.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Grand Prize</h4>
              <p className="text-slate-500 text-xs">
                The #1 creator at the official deadline wins 500,000 ETB, Orbit smart electronics package, and a 1-year Orbit Electronics Brand Ambassador contract.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-md shadow-blue-600/20"
        >
          Got It, Let's Vote!
        </button>
      </div>
    </div>
  );
}
