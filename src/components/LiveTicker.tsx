'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Flame, TrendingDown, ShieldCheck } from 'lucide-react';
import { Deal } from '@/lib/types';
import { formatPrice, cleanMarkdown } from '@/lib/utils';

interface LiveTickerProps {
  deals?: Deal[];
}

const DEFAULT_ITEMS = [
  { icon: Flame, text: 'PREISFEHLER ALARM: Bis zu 70% Rabatt auf Amazon Prime Artikel', highlight: '-70%', href: '/category/loot' },
  { icon: Zap, text: 'Live Bot Sync aktiv: Automatisch geprüfte Blitzangebote', highlight: 'LIVE', href: '/' },
  { icon: TrendingDown, text: 'Sony WH-1000XM5 auf 269,00 € gefallen (Tiefstpreis)', highlight: '-36%', href: '/category/audio' },
  { icon: ShieldCheck, text: '100% Kostenlos: Tritt unserem Telegram-Kanal für Sofort-Pings bei', highlight: 'JOIN', href: 'https://t.me/dealsingermany' }
];

export function LiveTicker({ deals }: LiveTickerProps) {
  const dynamicItems = deals && deals.length > 0
    ? deals.slice(0, 6).map((deal) => ({
        icon: deal.isLoot ? Flame : Zap,
        text: `${deal.isLoot ? 'PREISFEHLER' : 'TOP DEAL'}: ${cleanMarkdown(deal.title).slice(0, 55)}... nur ${formatPrice(deal.discountPrice, deal.currency)}`,
        highlight: `-${deal.discountPercentage}%`,
        href: `/deal/${deal.slug}`
      }))
    : DEFAULT_ITEMS;

  const items = [...dynamicItems, ...dynamicItems];

  return (
    <div className="relative w-full overflow-hidden border-b border-amber-200/80 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 py-2 text-xs">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-amber-50 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-amber-50 to-transparent z-10" />

      <div className="flex animate-marquee items-center gap-8 text-slate-700 font-medium">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isExternal = item.href.startsWith('http');
          return (
            <Link
              key={index}
              href={item.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 hover:text-slate-950 transition-colors shrink-0 cursor-pointer"
            >
              <Icon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[12px]">{item.text}</span>
              <span className="font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                {item.highlight}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
