'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Flame, Send, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400 group-hover:animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                BlitzDeals
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                .de
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Deutschlands schnellste Schnäppchen
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          <Link
            href="/category/loot"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 transition-colors"
          >
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Preisfehler</span>
          </Link>
          <Link
            href="/category/tech"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Tech & PC
          </Link>
          <Link
            href="/category/gaming"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Gaming
          </Link>
          <Link
            href="/category/home"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Haushalt & Küche
          </Link>
          <Link
            href="/category/audio"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Audio & HiFi
          </Link>
        </nav>

        {/* Live Channel Badges & CTA */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 border-r border-slate-800 pr-3 mr-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">Live Bot Sync</span>
          </div>

          <a
            href="https://t.me/dealsingermany"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-all hover:scale-105"
            title="Telegram Deals Channel"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Telegram</span>
          </a>

          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold transition-all hover:scale-105"
            title="Discord Deals Server"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Discord</span>
          </a>
        </div>
      </div>
    </header>
  );
}
