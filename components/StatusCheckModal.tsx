'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateEthiopianPhone, maskPhoneNumber } from '@/lib/phone';
import { PhoneStatusResponse } from '@/lib/types';
import { formatSecondsToTime } from '@/lib/security';

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionLoaded?: (status: PhoneStatusResponse) => void;
}

export function StatusCheckModal({ isOpen, onClose, onSessionLoaded }: StatusCheckModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<PhoneStatusResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateEthiopianPhone(phoneNumber);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid Ethiopian phone number.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/vote/check-status?phone=${encodeURIComponent(validation.normalized)}`);
      const data: PhoneStatusResponse = await res.json();

      if (!res.ok) {
        setErrorMessage('Could not retrieve status for this number.');
        return;
      }

      setStatusResult(data);

      if (onSessionLoaded && !data.can_vote) {
        onSessionLoaded(data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while checking status.');
    } finally {
      setIsLoading(false);
    }
  };

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
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 bg-white border border-slate-200 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 text-slate-900 max-h-[90vh] overflow-y-auto"
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

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Check Voting Status</h3>
            <p className="text-xs text-slate-500">Verify your 24-hour voting eligibility</p>
          </div>
        </div>

        {(() => {
          const validation = validateEthiopianPhone(phoneNumber);
          const isPhoneValid = validation.isValid;
          const cleanedDigits = phoneNumber.replace(/\D/g, '');

          return (
            <form onSubmit={handleCheckStatus} className="space-y-4 mb-5">
              <div>
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Phone Number
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
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+\s\-()]/g, ''))}
                  placeholder="09XXXXXXXX or 07XXXXXXXX"
                  maxLength={15}
                  className={`w-full px-4 py-3 rounded-xl bg-white border font-mono text-sm placeholder-slate-400 focus:outline-none transition-all shadow-sm ${
                    isPhoneValid
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900'
                      : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !isPhoneValid}
                className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                  isPhoneValid && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer'
                    : 'bg-slate-200 border border-slate-300 text-slate-400 opacity-70 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Checking...' : 'Check Status'}
              </button>
            </form>
          );
        })()}

        {statusResult && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs text-slate-500">Phone</span>
              <span className="text-xs font-mono font-bold text-slate-900">{maskPhoneNumber(statusResult.phone_number)}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs text-slate-500">Voting Status</span>
              {statusResult.can_vote ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ELIGIBLE TO VOTE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> IN 24H COOLDOWN
                </span>
              )}
            </div>

            {statusResult.last_voted_tiktoker_name && (
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs text-slate-500">Last Voted For</span>
                <span className="text-xs font-bold text-blue-700">{statusResult.last_voted_tiktoker_name}</span>
              </div>
            )}

            {!statusResult.can_vote && statusResult.cooldown_remaining_seconds > 0 && (
              <div className="pt-1 text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Cooldown Remaining</span>
                <div className="text-xl font-black font-mono text-slate-900 mt-0.5">
                  {formatSecondsToTime(statusResult.cooldown_remaining_seconds).formatted}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
