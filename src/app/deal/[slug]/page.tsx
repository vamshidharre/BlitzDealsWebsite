'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Deal } from '@/lib/types';
import { formatPrice, getCategoryMeta, timeAgo, cleanMarkdown } from '@/lib/utils';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { DealCard } from '@/components/DealCard';
import {
  ExternalLink,
  Truck,
  ArrowLeft,
  Clock,
  Loader2,
  Copy,
  Check,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function DealDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug as string;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : '';

  const [deal, setDeal] = useState<Deal | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAsin, setCopiedAsin] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function fetchDeal() {
      if (!slug) return;
      try {
        const res = await fetch('/api/deals', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.deals) {
          const all: Deal[] = data.deals;
          const lowerSlug = slug.toLowerCase();
          const found =
            all.find(
              (d) =>
                d.slug.toLowerCase() === lowerSlug ||
                d.id === slug ||
                (d.asin && d.asin.toLowerCase() === lowerSlug) ||
                lowerSlug.includes(d.slug.toLowerCase()) ||
                d.slug.toLowerCase().includes(lowerSlug) ||
                (d.asin && lowerSlug.includes(d.asin.toLowerCase()))
            ) || null;

          if (found) {
            setDeal(found);
            const related = all
              .filter((d) => d.id !== found.id && d.category === found.category)
              .slice(0, 3);
            setRelatedDeals(related);
          }
        }
      } catch (err) {
        console.error('Error loading deal details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDeal();
  }, [slug]);

  const copyAsin = () => {
    if (deal?.asin) {
      navigator.clipboard.writeText(deal.asin);
      setCopiedAsin(true);
      setTimeout(() => setCopiedAsin(false), 2000);
    }
  };

  const copyPageLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500">Lade Angebot...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4">
        <h1 className="text-xl font-bold text-zinc-900">Angebot nicht gefunden</h1>
        <p className="text-xs text-zinc-500">
          Dieses Angebot ist möglicherweise nicht mehr verfügbar.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Übersicht</span>
        </Link>
      </div>
    );
  }

  const categoryMeta = getCategoryMeta(deal.category);

  return (
    <div className="py-4 space-y-8 max-w-5xl mx-auto">
      {/* JSON-LD Schema for Google SEO */}
      <JsonLdSchema deal={deal} />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Alle Deals</span>
        </Link>
        <span>/</span>
        <Link href={`/category/${deal.category}`} className="hover:text-zinc-900 transition-colors">
          {categoryMeta.label}
        </Link>
        <span>/</span>
        <span className="text-zinc-800 font-medium truncate max-w-sm">
          {cleanMarkdown(deal.title)}
        </span>
      </nav>

      {/* Main Deal Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
        
        {/* Left: Product Image Area */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-zinc-50/50 rounded-2xl p-8 relative border border-zinc-100 min-h-[340px]">
          {deal.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-900 text-white shadow-xs">
                -{deal.discountPercentage}%
              </span>
            </div>
          )}

          {deal.isLoot && (
            <div className="absolute top-4 right-4 z-10">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                Preisfehler
              </span>
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={deal.imageUrl}
            alt={cleanMarkdown(deal.title)}
            className="max-h-[280px] max-w-full object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/banner.png';
            }}
          />
        </div>

        {/* Right: Deal Details & Action */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-500 font-medium">
                {categoryMeta.label}
              </span>
              {deal.isPrime && (
                <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100 font-medium flex items-center gap-1 text-[11px]">
                  <Truck className="w-3 h-3" />
                  Prime Versand
                </span>
              )}
              <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" />
                Geprüft {timeAgo(deal.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug">
              {cleanMarkdown(deal.title)}
            </h1>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-zinc-900">
                  {formatPrice(deal.discountPrice, deal.currency)}
                </span>
                {deal.originalPrice > deal.discountPrice && (
                  <span className="text-sm text-zinc-400 line-through font-normal">
                    {formatPrice(deal.originalPrice, deal.currency)} UVP
                  </span>
                )}
              </div>

              {deal.savingsAmount > 0 && (
                <div className="text-xs font-semibold text-emerald-600">
                  Ersparnis: {formatPrice(deal.savingsAmount, deal.currency)} ({deal.discountPercentage}%)
                </div>
              )}
            </div>

            {/* Deal Specs Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs text-zinc-600 pt-1">
              <div className="p-2.5 rounded-xl bg-zinc-50/80 border border-zinc-100 space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block">Händler</span>
                <span className="font-semibold text-zinc-900">{deal.store || 'Amazon.de'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50/80 border border-zinc-100 space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block">ASIN</span>
                <button
                  onClick={copyAsin}
                  className="font-mono font-medium text-zinc-900 flex items-center gap-1 hover:text-zinc-600 transition-colors"
                  title="ASIN kopieren"
                >
                  <span>{deal.asin || 'N/A'}</span>
                  {copiedAsin ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50/80 border border-zinc-100 space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block">Verfügbarkeit</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Auf Lager
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs text-zinc-600 leading-relaxed pt-1">
              <h3 className="font-semibold text-zinc-900 text-xs">Beschreibung</h3>
              <p className="whitespace-pre-line">{cleanMarkdown(deal.description)}</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <a
              href={deal.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm transition-colors"
            >
              <span>Jetzt bei Amazon bestellen</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <button
                onClick={copyPageLink}
                className="flex items-center gap-1.5 hover:text-zinc-700 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link kopiert!' : 'Deal teilen'}</span>
              </button>
              <span className="text-[11px]">Amazon Partner-Link</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Deals Section */}
      {relatedDeals.length > 0 && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Ähnliche Angebote in {categoryMeta.label}
            </h2>
            <Link
              href={`/category/${deal.category}`}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Alle ansehen →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedDeals.map((item) => (
              <DealCard key={item.id} deal={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
