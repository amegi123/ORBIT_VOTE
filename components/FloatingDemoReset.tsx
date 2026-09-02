'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface FloatingDemoResetProps {
  onReset: () => void;
}

export function FloatingDemoReset({ onReset }: FloatingDemoResetProps) {
  const [isResetting, setIsResetting] = useState(false);

  const handleClick = async () => {
    setIsResetting(true);
    await onReset();
    setTimeout(() => setIsResetting(false), 500);
  };

  return (
    <aside aria-label="Developer Demo Controls" className="fixed bottom-4 right-4 z-40">
      <button
        type="button"
        onClick={handleClick}
        disabled={isResetting}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-white font-mono text-[11px] font-medium border border-slate-700 shadow-sm transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
        title="Reset 24h Cooldown (Demo Purpose Only)"
        aria-label="Reset 24h voting cooldown for demo testing"
      >
        <RotateCcw className={`w-3 h-3 text-amber-400 ${isResetting ? 'animate-spin' : ''}`} />
        <span>Demo Reset</span>
      </button>
    </aside>
  );
}
