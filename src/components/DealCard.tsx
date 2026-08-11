'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Star, ShieldCheck, Clock, ArrowRight, Tag, Zap } from 'lucide-react';
import { Deal } from '@/lib/types';
import { formatPrice, getCategoryMeta, timeAgo, cleanMarkdown } from '@/lib/utils';

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const categoryMeta = getCategoryMeta(deal.category);

  return (
    <article className="group relative flex flex-col bg-slate-900/70 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1">
      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
        {deal.discountPercentage > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-950/50">
            <Zap className="w-3 h-3 fill-white" />
            -{deal.discountPercentage}%
          </span>
        )}

        {deal.isLoot && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-md animate-pulse">
            🔥 PREISFEHLER
          </span>
        )}
      </div>

      {deal.isPrime && (
        <div className="absolute top-3 right-3 z-10">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-500/20 border border-sky-500/40 text-sky-400 backdrop-blur-md">
            Prime
          </span>
        </div>
      )}

      {/* Product Image Preview */}
      <div className="relative w-full h-52 bg-white/5 flex items-center justify-center p-6 overflow-hidden">
        {/* Soft radial backlight glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/60 pointer-events-none" />
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={deal.imageUrl}
          alt={cleanMarkdown(deal.title)}
          className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 rounded-xl"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/banner.png';
          }}
        />
      </div>

      {/* Card Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Category & Time Meta */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border ${categoryMeta.bg} ${categoryMeta.color}`}>
              <span>{categoryMeta.icon}</span>
              <span>{categoryMeta.label}</span>
            </span>

            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              {timeAgo(deal.createdAt)}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/deal/${deal.slug}`} className="block group-hover:text-amber-300 transition-colors">
            <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug">
              {cleanMarkdown(deal.title)}
            </h3>
          </Link>

          {/* Ratings */}
          {deal.rating && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(deal.rating!)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-200">{deal.rating.toFixed(1)}</span>
              {deal.ratingCount && (
                <span className="text-slate-400">({deal.ratingCount.toLocaleString('de-DE')})</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">
                {formatPrice(deal.discountPrice, deal.currency)}
              </span>
              {deal.originalPrice > deal.discountPrice && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  {formatPrice(deal.originalPrice, deal.currency)}
                </span>
              )}
            </div>

            {deal.savingsAmount > 0 && (
              <span className="text-xs font-semibold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Spare {formatPrice(deal.savingsAmount, deal.currency)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-2">
            <a
              href={deal.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="col-span-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>🛒 Zum Deal auf Amazon</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href={`/deal/${deal.slug}`}
              className="col-span-1 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="Details & Preisvergleich"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
