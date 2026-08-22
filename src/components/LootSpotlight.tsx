'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ExternalLink, ArrowRight, TrendingDown, Sparkles } from 'lucide-react';
import { Deal } from '@/lib/types';
import { formatPrice, cleanMarkdown } from '@/lib/utils';

interface LootSpotlightProps {
  deals: Deal[];
}

export function LootSpotlight({ deals }: LootSpotlightProps) {
  const lootDeals = deals.filter((d) => d.isLoot || d.discountPercentage >= 35).slice(0, 2);

  if (lootDeals.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-sm">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Tages-Highlights & Preisfehler
          </h2>
        </div>
        <Link
          href="/category/loot"
          className="text-xs font-bold text-amber-600 hover:text-orange-600 transition-colors flex items-center gap-1"
        >
          <span>Alle ansehen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {lootDeals.map((deal) => (
          <div
            key={deal.id}
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border-2 border-amber-300 shadow-md shadow-amber-500/5 group hover:shadow-xl hover:border-amber-400 transition-all duration-300"
          >
            {/* Product Image */}
            <div className="relative w-36 h-36 shrink-0 bg-white rounded-xl p-3 flex items-center justify-center border border-amber-200/60 shadow-sm">
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-black bg-rose-500 text-white shadow-xs">
                -{deal.discountPercentage}%
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={deal.imageUrl}
                alt={cleanMarkdown(deal.title)}
                className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = '/banner.png';
                }}
              />
            </div>

            {/* Content Details */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                  🔥 PREISFEHLER
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  {deal.store || 'Amazon.de'}
                </span>
              </div>

              <Link href={`/deal/${deal.slug}`} className="block group-hover:text-amber-700 transition-colors">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 line-clamp-2 leading-snug">
                  {cleanMarkdown(deal.title)}
                </h3>
              </Link>

              <div className="flex items-baseline justify-center sm:justify-start gap-2.5">
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(deal.discountPrice, deal.currency)}
                </span>
                {deal.originalPrice > deal.discountPrice && (
                  <span className="text-xs text-slate-400 line-through font-semibold">
                    {formatPrice(deal.originalPrice, deal.currency)}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  Du sparst {formatPrice(deal.savingsAmount, deal.currency)}
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <a
                  href={deal.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Zum Deal bei Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  href={`/deal/${deal.slug}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
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
