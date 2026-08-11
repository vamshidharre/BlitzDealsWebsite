'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Zap, ExternalLink, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Deal } from '@/lib/types';
import { formatPrice, cleanMarkdown } from '@/lib/utils';

interface LootSpotlightProps {
  deals: Deal[];
}

export function LootSpotlight({ deals }: LootSpotlightProps) {
  const lootDeals = deals.filter((d) => d.isLoot || d.discountPercentage >= 30).slice(0, 2);

  if (lootDeals.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Hot Loot & Preisfehler</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                TOP-RABATTE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Besonders hohe Preisnachlässe - schnell sein, solange der Vorrat reicht!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lootDeals.map((deal) => (
          <div
            key={deal.id}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/30 p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-amber-500/60 transition-all duration-300 shadow-xl"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

            {/* Product Image */}
            <div className="relative w-36 h-36 shrink-0 bg-white/5 rounded-xl p-3 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={deal.imageUrl}
                alt={cleanMarkdown(deal.title)}
                className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = '/banner.png';
                }}
              />
              <span className="absolute -top-2 -left-2 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg">
                -{deal.discountPercentage}%
              </span>
            </div>

            {/* Content Details */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                🔥 HISTORISCHER TIEFSTPREIS
              </span>

              <Link href={`/deal/${deal.slug}`} className="block group-hover:text-amber-300 transition-colors">
                <h3 className="text-base font-bold text-slate-100 line-clamp-2 leading-tight">
                  {cleanMarkdown(deal.title)}
                </h3>
              </Link>

              <div className="flex items-baseline justify-center sm:justify-start gap-2.5">
                <span className="text-2xl font-extrabold text-emerald-400">
                  {formatPrice(deal.discountPrice, deal.currency)}
                </span>
                {deal.originalPrice > deal.discountPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(deal.originalPrice, deal.currency)}
                  </span>
                )}
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Du sparst {formatPrice(deal.savingsAmount, deal.currency)}
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <a
                  href={deal.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-md shadow-orange-500/20 transition-all hover:scale-105"
                >
                  <span>Jetzt bei Amazon sichern</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  href={`/deal/${deal.slug}`}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
