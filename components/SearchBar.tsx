'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalResults: number;
  totalNominees: number;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  totalResults,
  totalNominees,
}: SearchBarProps) {
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-3 pb-2">
      <div className="relative flex items-center w-full min-w-0" role="search">
        {/* Search Icon */}
        <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search creators by name or @handle"
          aria-label="Search creators by name or handle"
          className="w-full min-w-0 pl-10 pr-24 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
        />

        {/* Subtle Counter & Clear Button */}
        <div className="absolute right-3 flex items-center gap-2 shrink-0">
          {isSearching && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-0.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="text-xs text-slate-400 font-medium">
            {isSearching ? `${totalResults} of ${totalNominees}` : `${totalNominees} Creators`}
          </span>
        </div>
      </div>
    </div>
  );
}
