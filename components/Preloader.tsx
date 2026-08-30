'use client';

import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  isLoading: boolean;
}

export function Preloader({ isLoading }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        setIsFadingOut(true);
        const removeTimeout = setTimeout(() => {
          setShouldRender(false);
        }, 400);
        return () => clearTimeout(removeTimeout);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-50 transition-opacity duration-400 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Outer subtle spinner ring */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-slate-200 border-t-blue-600 animate-spin" />

        {/* Center Logo */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <img
            src="/orbit-electronics-logo.png"
            alt="Orbit Electronics"
            className="h-7 sm:h-8 w-auto max-w-[100px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
