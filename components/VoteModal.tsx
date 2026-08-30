'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TikToker, SendOtpResponse, VerifyAndVoteResponse } from '@/lib/types';
import { PhoneVerification } from './PhoneVerification';
import { OtpVerification } from './OtpVerification';
import { VoteSuccessModal } from './VoteSuccessModal';
import { useToast } from './ToastContext';

interface VoteModalProps {
  isOpen: boolean;
  tiktoker: TikToker | null;
  onClose: () => void;
  onVoteSuccess: (data: {
    phoneNumber: string;
    nextEligibleAt: string;
    cooldownSeconds: number;
    tiktoker: TikToker;
  }) => void;
}

type ModalStep = 'phone' | 'otp' | 'success';

export function VoteModal({ isOpen, tiktoker, onClose, onVoteSuccess }: VoteModalProps) {
  const { showToast } = useToast();

  const [step, setStep] = useState<ModalStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [normalizedPhone, setNormalizedPhone] = useState<string>('');
  const [demoOtp, setDemoOtp] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [successPayload, setSuccessPayload] = useState<{
    ranking?: number;
    newTotalVotes?: number;
    nextEligibleVoteAt: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setErrorMessage(null);
      setDemoOtp(undefined);
    }
  }, [isOpen, tiktoker?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !tiktoker) return null;

  // STEP 1: SEND OTP
  const handleSendOtp = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/vote/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          tiktoker_id: tiktoker.id,
        }),
      });

      const data: SendOtpResponse = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Failed to send verification code.');
        showToast({
          type: 'error',
          title: 'Verification Failed',
          message: data.message,
        });
        return;
      }

      setNormalizedPhone(data.normalized_phone || phoneNumber);
      setDemoOtp(data.demo_otp);
      setStep('otp');

      showToast({
        type: 'info',
        title: 'SMS Sent',
        message: `Verification code sent to ${data.normalized_phone || phoneNumber}`,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: VERIFY AND VOTE
  const handleVerifyAndVote = async (code: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/vote/verify-and-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: normalizedPhone || phoneNumber,
          otp_code: code,
          tiktoker_id: tiktoker.id,
        }),
      });

      const data: VerifyAndVoteResponse = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Invalid verification code.');
        showToast({
          type: 'error',
          title: 'Vote Submission Failed',
          message: data.message,
        });
        return;
      }

      const nextEligibleAt = data.next_eligible_vote_at || new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      setSuccessPayload({
        ranking: data.ranking,
        newTotalVotes: data.new_total_votes,
        nextEligibleVoteAt: nextEligibleAt,
      });

      setStep('success');

      showToast({
        type: 'success',
        title: 'Vote Counted! 🎉',
        message: `Your vote for ${tiktoker.full_name} is confirmed!`,
      });

      onVoteSuccess({
        phoneNumber: normalizedPhone || phoneNumber,
        nextEligibleAt,
        cooldownSeconds: data.cooldown_seconds || 24 * 3600,
        tiktoker: data.tiktoker || tiktoker,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error during vote verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'otp') {
          onClose();
        }
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 bg-white border border-slate-200 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 text-slate-900 max-h-[92vh] overflow-y-auto"
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dynamic Modal Content */}
        {step === 'phone' && (
          <PhoneVerification
            tiktoker={tiktoker}
            phoneNumber={phoneNumber}
            onPhoneChange={setPhoneNumber}
            onSubmit={handleSendOtp}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}

        {step === 'otp' && (
          <OtpVerification
            phoneNumber={normalizedPhone || phoneNumber}
            demoOtp={demoOtp}
            onVerify={handleVerifyAndVote}
            onResendOtp={handleSendOtp}
            onBack={() => setStep('phone')}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}

        {step === 'success' && successPayload && (
          <VoteSuccessModal
            tiktoker={tiktoker}
            ranking={successPayload.ranking}
            newTotalVotes={successPayload.newTotalVotes}
            nextEligibleVoteAt={successPayload.nextEligibleVoteAt}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
