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
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-3 pb-1 overflow-hidden">
      {/* Search Input Box */}
      <div className="relative flex items-center w-full min-w-0">
        <div className="absolute left-3.5 text-blue-600 pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${totalNominees} creators by name or @handle...`}
          className="w-full min-w-0 pl-10 pr-20 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs transition-all"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5 shrink-0">
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-bold text-slate-600 font-mono">
            {totalResults}
          </div>
        </div>
      </div>
    </div>
  );
}
