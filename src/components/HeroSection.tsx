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
    <section className="relative pt-8 pb-12 overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-500/15 via-orange-600/10 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto text-center space-y-6 px-4">
        {/* Top Live Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-inner backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="text-amber-400 font-bold">24/7 Autopilot:</span>
          <span>Über {totalDealsCount} geprüfte Amazon Deals online</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Nie wieder zu viel zahlen bei{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Amazon.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unser intelligenter Deal-Bot filtert in Echtzeit die größten Rabatte, Blitzangebote und Preisfehler – 100% kostenlos und handverlesen.
        </p>

        {/* Interactive Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300 pointer-events-none" />
            <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl px-4 py-3">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Suche nach AirPods, PS5, LEGO, Kaffeevollautomat..."
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-md"
                >
                  Löschen
                </button>
              )}
            </div>
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
            <span className="font-medium text-slate-400">Beliebt:</span>
            {['AirPods', 'PlayStation 5', 'Ninja Airfryer', 'SSD', 'OLED TV'].map((item) => (
              <button
                key={item}
                onClick={() => onSearchChange(item)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
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
