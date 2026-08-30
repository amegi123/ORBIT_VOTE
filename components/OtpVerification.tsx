'use client';

import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { maskPhoneNumber } from '@/lib/phone';

interface OtpVerificationProps {
  phoneNumber: string;
  demoOtp?: string;
  onVerify: (code: string) => void;
  onResendOtp: () => void;
  onBack: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
  expiresInSeconds?: number;
}

export function OtpVerification({
  phoneNumber,
  demoOtp,
  onVerify,
  onResendOtp,
  onBack,
  isLoading,
  errorMessage,
  expiresInSeconds = 300,
}: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState<number>(expiresInSeconds);
  const [resendCooldown, setResendCooldown] = useState<number>(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => Math.max(0, prev - 1));
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const lastChar = cleanVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      onVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);

      const focusIdx = Math.min(5, pastedData.length);
      inputRefs.current[focusIdx]?.focus();

      if (pastedData.length === 6) {
        onVerify(pastedData);
      }
    }
  };

  const handleFillDemoCode = () => {
    if (!demoOtp) return;
    const split = demoOtp.split('').slice(0, 6);
    setDigits(split);
    inputRefs.current[5]?.focus();
    onVerify(demoOtp);
  };

  const isComplete = digits.join('').length === 6 && !digits.includes('');

  return (
    <div className="flex flex-col text-center">
      {/* Icon */}
      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto mb-3 shadow-xs">
        <KeyRound className="w-6 h-6" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1">
        Verify Your Phone Number
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 mb-5">
        We sent a 6-digit verification code to{' '}
        <strong className="text-blue-700 font-mono">{maskPhoneNumber(phoneNumber)}</strong>
      </p>

      {/* Demo / Sandbox SMS Banner */}
      {demoOtp && (
        <div className="mb-5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg shrink-0">📱</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                <span>Orbit SMS Simulator</span>
              </div>
              <p className="text-xs text-slate-800 font-mono truncate">
                Code: <strong className="text-amber-800 font-bold tracking-widest text-sm">{demoOtp}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillDemoCode}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors shrink-0 shadow-xs active:scale-95"
          >
            Auto-Fill
          </button>
        </div>
      )}

      {/* 6-Digit OTP Inputs (Mobile-First responsive sizing) */}
      <div className="flex justify-center gap-1.5 sm:gap-2.5 mb-5" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-9 sm:w-12 h-11 sm:h-14 text-center text-lg sm:text-2xl font-black font-mono rounded-xl bg-white border transition-all ${
              digit
                ? 'border-blue-600 text-blue-700 shadow-sm'
                : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
            }`}
          />
        ))}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 text-left">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Expiry Countdown & Resend Section */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-5 px-1">
        <div className="flex items-center gap-1.5">
          <span>Expires in:</span>
          <span className={`font-mono font-bold ${timerSeconds < 60 ? 'text-rose-600' : 'text-slate-800'}`}>
            {formatTimer(timerSeconds)}
          </span>
        </div>

        <button
          type="button"
          disabled={resendCooldown > 0 || isLoading}
          onClick={onResendOtp}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:text-slate-400 disabled:cursor-not-allowed font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={isLoading || !isComplete || timerSeconds <= 0}
          onClick={() => onVerify(digits.join(''))}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-wider shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>VERIFY & SUBMIT VOTE</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors"
        >
          Change Phone Number
        </button>
      </div>
    </div>
  );
}
