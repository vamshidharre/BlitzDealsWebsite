'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Send, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-orange-500/20 border border-amber-500/30 bg-slate-900 flex items-center justify-center p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="BlitzDeals Logo"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                BlitzDeals<span className="text-amber-400">.de</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              BlitzDeals durchsucht das Internet und Amazon 24/7 nach den besten Rabatten, Sonderangeboten und Preisfehlern. Alle Angebote werden vollautomatisch geprüft.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/dealsingermany"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 transition-colors"
                title="Telegram Kanal"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://discord.gg/75gPdFBr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 transition-colors"
                title="Discord Server"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Kategorien</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/category/loot" className="hover:text-amber-400 transition-colors">
                  🔥 Preisfehler / Loot
                </Link>
              </li>
              <li>
                <Link href="/category/tech" className="hover:text-cyan-400 transition-colors">
                  💻 Tech & Elektronik
                </Link>
              </li>
              <li>
                <Link href="/category/gaming" className="hover:text-purple-400 transition-colors">
                  🎮 Gaming & Konsolen
                </Link>
              </li>
              <li>
                <Link href="/category/home" className="hover:text-emerald-400 transition-colors">
                  🏠 Haushalt & Küche
                </Link>
              </li>
              <li>
                <Link href="/category/audio" className="hover:text-blue-400 transition-colors">
                  🎧 Audio & HiFi
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Affiliate Disclosure Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Hinweise</h4>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Partner-Transparenz</span>
              </div>
              <p>
                Als Amazon-Partner verdienen wir an qualifizierten Verkäufen. Preise und Verfügbarkeiten können sich kurzfristig ändern.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BlitzDeals.de – Alle Rechte vorbehalten.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Smart Shoppers
          </p>
        </div>
      </div>
    </footer>
  );
}
