'use client';

import React from 'react';
import Link from 'next/link';
import { Send, MessageSquare, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200/80 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900">BlitzDeals.de</span>
            <span>—</span>
            <span>Geprüfte Amazon-Angebote & Preisfehler</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1 font-medium"
            >
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>Datenschutz / Privacy</span>
            </Link>
            <a
              href="https://t.me/dealsingermany"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Telegram</span>
            </a>
            <a
              href="https://discord.gg/75gPdFBr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Discord</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
          <p>© {new Date().getFullYear()} BlitzDeals.de. Alle Preise inkl. MwSt., ggf. zzgl. Versand.</p>
          <p>Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.</p>
        </div>
      </div>
    </footer>
  );
}