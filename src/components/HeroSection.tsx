'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalDealsCount: number;
}

export function HeroSection({ searchQuery, onSearchChange, totalDealsCount }: HeroSectionProps) {
  return (
    <section className="pt-4 pb-2 space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Amazon Deals & Preisfehler
          </h1>
          <p className="text-sm text-zinc-500 font-normal">
            Geprüfte Tiefstpreise und Blitzangebote in Echtzeit.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Suchen nach Artikeln..."
            className="w-full bg-white border border-zinc-200/90 hover:border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl pl-9 pr-8 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-600 rounded"
              title="Löschen"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
