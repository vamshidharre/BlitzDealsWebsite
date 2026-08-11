'use client';

import React from 'react';
import { Search, Flame, Zap, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalDealsCount: number;
}

export function HeroSection({ searchQuery, onSearchChange, totalDealsCount }: HeroSectionProps) {
  return (
    <section className="relative pt-6 pb-10 overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-orange-600/10 to-cyan-500/15 blur-[140px] pointer-events-none rounded-full" />

      {/* Featured Banner Showcase Card */}
      <div className="relative max-w-5xl mx-auto mb-8 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
        <div className="relative w-full aspect-[21/9] sm:aspect-[2.4/1] bg-slate-950 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner.png"
            alt="BlitzDeals Deutschland - Top Rabatte & Preisfehler"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

          {/* Floating Live Pill over banner */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-amber-500/40 text-xs font-bold text-slate-200 backdrop-blur-md shadow-xl">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-amber-400 font-extrabold">24/7 Live Sync:</span>
            <span>{totalDealsCount} geprüfte Amazon Deals online</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-6 px-4">
        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Nie wieder zu viel zahlen bei{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Amazon.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unser intelligenter Deal-Bot scannt Amazon 24/7 nach den größten Rabatten, Blitzangeboten und Preisfehlern – 100% kostenlos und automatisch geprüft.
        </p>

        {/* Interactive Search Bar */}
        <div className="max-w-2xl mx-auto pt-1">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300 pointer-events-none" />
            <div className="relative flex items-center bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl px-4 py-3.5">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Suche nach AirPods, PS5, Philips Hue, Anker, Bratpfanne..."
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Löschen
                </button>
              )}
            </div>
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
            <span className="font-medium text-slate-400">Beliebt:</span>
            {['Sony Kopfhörer', 'PlayStation 5', 'Philips Hue', 'SanDisk', 'Tefal Pfanne', 'Smart Steckdose'].map((item) => (
              <button
                key={item}
                onClick={() => onSearchChange(item)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
