'use client';

import React, { useState } from 'react';
import { Phone, ArrowRight, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TikToker } from '@/lib/types';
import { validateEthiopianPhone, cleanPhoneNumber } from '@/lib/phone';

interface PhoneVerificationProps {
  tiktoker: TikToker;
  phoneNumber: string;
  onPhoneChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function PhoneVerification({
  tiktoker,
  phoneNumber,
  onPhoneChange,
  onSubmit,
  isLoading,
  errorMessage,
}: PhoneVerificationProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const validation = validateEthiopianPhone(phoneNumber);
  const isPhoneValid = validation.isValid;
  const cleanedDigits = cleanPhoneNumber(phoneNumber).replace(/\D/g, '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and + sign
    const val = e.target.value.replace(/[^0-9+\s\-()]/g, '');
    onPhoneChange(val);
    if (localError) setLocalError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) {
      setLocalError(validation.error || 'Please enter a complete 10-digit Ethiopian phone number (e.g. 09XXXXXXXX or 07XXXXXXXX).');
      return;
    }
    setLocalError(null);
    onSubmit();
  };

  return (
    <div className="flex flex-col">
      {/* Creator Preview Banner inside Modal */}
      <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 mb-5">
        <img
          src={tiktoker.profile_image}
          alt={tiktoker.full_name}
          className="w-12 h-12 rounded-xl object-cover border border-blue-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
            You are voting for
          </span>
          <h4 className="text-base font-bold text-slate-900 truncate leading-tight">
            {tiktoker.full_name}
          </h4>
          <span className="text-xs text-blue-600 font-semibold">{tiktoker.username}</span>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <label htmlFor="ethio-phone-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Enter Your Mobile Number
            </label>
            <span className="text-[11px] font-mono font-bold text-slate-500">
              {isPhoneValid ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              ) : cleanedDigits.length > 0 ? (
                <span className="text-blue-600 font-bold">{cleanedDigits.length}/10 digits</span>
              ) : (
                '10 digits'
              )}
            </span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-500 pointer-events-none flex items-center gap-1.5">
              <span className="text-sm">🇪🇹</span>
              <Phone className="w-4 h-4 text-slate-400" />
            </div>

            <input
              id="ethio-phone-input"
              type="tel"
              value={phoneNumber}
              onChange={handleInputChange}
              placeholder="09XXXXXXXX or 07XXXXXXXX"
              maxLength={15}
              autoFocus
              className={`w-full pl-16 pr-10 py-3.5 rounded-xl bg-white border font-mono text-base placeholder-slate-400 focus:outline-none transition-all shadow-sm ${
                isPhoneValid
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900'
                  : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
              }`}
            />

            {isPhoneValid && (
              <div className="absolute right-3.5 text-emerald-600">
                <CheckCircle2 className="w-5 h-5 fill-emerald-100 text-emerald-600" />
              </div>
            )}
          </div>

          {/* Input Format Helper */}
          <div className="text-[11px] text-slate-500 mt-1.5 px-1 flex items-center justify-between">
            <span>Supports Ethio Telecom (09...) & Safaricom (07...)</span>
          </div>
        </div>

        {/* Error message */}
        {(localError || errorMessage) && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{localError || errorMessage}</span>
          </div>
        )}

        {/* Anti-Abuse Guarantee Pill */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Strict rule: Each phone number can vote once every 24 hours.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isPhoneValid}
          className={`mt-1 w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
            isPhoneValid && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer'
              : 'bg-slate-200 border border-slate-300 text-slate-400 opacity-70 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>SEND VERIFICATION CODE (OTP)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
