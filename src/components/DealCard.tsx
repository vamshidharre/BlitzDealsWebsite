'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Truck } from 'lucide-react';
import { Deal } from '@/lib/types';
import { formatPrice, getCategoryMeta, timeAgo, cleanMarkdown } from '@/lib/utils';

interface DealCardProps {
  deal: Deal;
  viewMode?: 'grid' | 'list';
}

export function DealCard({ deal, viewMode = 'grid' }: DealCardProps) {
  const categoryMeta = getCategoryMeta(deal.category);

  // List View (Compact horizontal row for power shoppers)
  if (viewMode === 'list') {
    return (
      <article className="deal-card flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs hover:shadow-md transition-all gap-4 group">
        {/* Left: Thumbnail & Badges */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-zinc-50/50 rounded-lg p-2 shrink-0 border border-zinc-100 flex items-center justify-center overflow-hidden">
            {deal.discountPercentage > 0 && (
              <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-zinc-900 text-white z-10 shadow-2xs">
                -{deal.discountPercentage}%
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={deal.imageUrl}
              alt={cleanMarkdown(deal.title)}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/banner.png';
              }}
            />
          </div>

          {/* Title & Metadata */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] font-medium text-zinc-400">
                {categoryMeta.label}
              </span>
              {deal.isLoot && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-1.5 py-0.2 rounded border border-rose-100">
                  Preisfehler
                </span>
              )}
              {deal.isPrime && (
                <span className="text-[10px] font-medium text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100 flex items-center gap-0.5">
                  <Truck className="w-2.5 h-2.5" />
                  Prime
                </span>
              )}
            </div>

            <Link href={`/deal/${deal.slug}`} className="block group-hover:text-zinc-600 transition-colors">
              <h3 className="text-sm font-semibold text-zinc-900 truncate">
                {cleanMarkdown(deal.title)}
              </h3>
            </Link>

            <span className="text-[11px] text-zinc-400 block sm:hidden">
              {timeAgo(deal.createdAt)}
            </span>
          </div>
        </div>

        {/* Right: Pricing & CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
          <div className="text-left sm:text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-zinc-900">
                {formatPrice(deal.discountPrice, deal.currency)}
              </span>
              {deal.originalPrice > deal.discountPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatPrice(deal.originalPrice, deal.currency)}
                </span>
              )}
            </div>
            {deal.savingsAmount > 0 && (
              <span className="text-[11px] font-medium text-emerald-600 block">
                -{formatPrice(deal.savingsAmount, deal.currency)}
              </span>
            )}
          </div>

          <a
            href={deal.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors shadow-2xs whitespace-nowrap"
          >
            <span>Zum Deal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </article>
    );
  }

  // Grid View (Default clean visual card)
  return (
    <article className="deal-card flex flex-col justify-between rounded-2xl overflow-hidden group bg-white border border-zinc-200/80 shadow-2xs hover:shadow-lg transition-all duration-200">
      <div>
        {/* Product Image Area */}
        <div className="relative w-full h-48 bg-zinc-50/50 flex items-center justify-center p-5 border-b border-zinc-100 overflow-hidden">
          {/* Discount Badge */}
          {deal.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-zinc-900 text-white shadow-2xs">
                -{deal.discountPercentage}%
              </span>
            </div>
          )}

          {/* Loot Tag */}
          {deal.isLoot && (
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                Preisfehler
              </span>
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={deal.imageUrl}
            alt={cleanMarkdown(deal.title)}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/banner.png';
            }}
          />
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2">
          {/* Category & Prime */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-zinc-400">
              {categoryMeta.label}
            </span>
            {deal.isPrime && (
              <span className="text-[10px] font-medium text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100 flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Prime
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/deal/${deal.slug}`} className="block group-hover:text-zinc-600 transition-colors">
            <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 leading-snug">
              {cleanMarkdown(deal.title)}
            </h3>
          </Link>
        </div>
      </div>

      {/* Pricing & CTA Button */}
      <div className="p-4 pt-0 space-y-3">
        <div className="pt-2.5 border-t border-zinc-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-zinc-900">
              {formatPrice(deal.discountPrice, deal.currency)}
            </span>
            {deal.originalPrice > deal.discountPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(deal.originalPrice, deal.currency)}
              </span>
            )}
          </div>

          {deal.savingsAmount > 0 && (
            <span className="text-[11px] font-medium text-emerald-600">
              -{formatPrice(deal.savingsAmount, deal.currency)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <a
          href={deal.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors shadow-2xs"
        >
          <span>Zum Amazon Deal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
