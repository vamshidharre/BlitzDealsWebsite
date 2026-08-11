import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDealBySlug, getAllDeals, getDealsByCategory } from '@/lib/db';
import { formatPrice, getCategoryMeta, timeAgo } from '@/lib/utils';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { SocialShare } from '@/components/SocialShare';
import { DealCard } from '@/components/DealCard';
import {
  ExternalLink,
  Star,
  ShieldCheck,
  Zap,
  TrendingDown,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface DealPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: DealPageProps): Promise<Metadata> {
  const { slug } = await params;
  const deal = getDealBySlug(slug);

  if (!deal) {
    return {
      title: 'Angebot nicht gefunden'
    };
  }

  const discountText = deal.discountPercentage > 0 ? `(-${deal.discountPercentage}%) ` : '';
  const priceText = formatPrice(deal.discountPrice, deal.currency);

  return {
    title: `${discountText}${deal.title} für nur ${priceText}`,
    description: `Jetzt ${deal.title} auf Amazon mit ${deal.discountPercentage}% Rabatt für nur ${priceText} statt ${formatPrice(deal.originalPrice, deal.currency)} sichern. Jetzt Angebot prüfen!`,
    openGraph: {
      title: `${discountText}${deal.title} – ${priceText}`,
      description: deal.description,
      images: [
        {
          url: deal.imageUrl,
          width: 800,
          height: 600,
          alt: deal.title
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${discountText}${deal.title}`,
      description: `Nur ${priceText} (statt ${formatPrice(deal.originalPrice, deal.currency)}). Spare ${formatPrice(deal.savingsAmount, deal.currency)}!`,
      images: [deal.imageUrl]
    }
  };
}

export default async function DealDetailPage({ params }: DealPageProps) {
  const { slug } = await params;
  const deal = getDealBySlug(slug);

  if (!deal) {
    notFound();
  }

  const categoryMeta = getCategoryMeta(deal.category);
  const relatedDeals = getDealsByCategory(deal.category)
    .filter((d) => d.id !== deal.id)
    .slice(0, 3);

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzdeals.de'}/deal/${deal.slug}`;

  return (
    <div className="py-8 space-y-8">
      {/* JSON-LD Schema for Google Rich Snippets */}
      <JsonLdSchema deal={deal} />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Alle Deals</span>
        </Link>
        <span>/</span>
        <Link href={`/category/${deal.category}`} className="hover:text-white transition-colors">
          {categoryMeta.label}
        </Link>
        <span>/</span>
        <span className="text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
          {deal.title}
        </span>
      </nav>

      {/* Main Deal Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        {/* Left: Product Image Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white/5 rounded-2xl p-8 relative overflow-hidden border border-slate-800/80 min-h-[380px]">
          {deal.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-black bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-xl">
                <Zap className="w-4 h-4 fill-white" />
                -{deal.discountPercentage}% RABATT
              </span>
            </div>
          )}

          {deal.isLoot && (
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-lg animate-pulse">
                🔥 PREISFEHLER
              </span>
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={deal.imageUrl}
            alt={deal.title}
            className="max-h-[320px] max-w-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right: Deal Details & Direct Affiliate Action */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${categoryMeta.bg} ${categoryMeta.color}`}>
                {categoryMeta.icon} {categoryMeta.label}
              </span>
              {deal.isPrime && (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Kostenlose Prime-Lieferung
                </span>
              )}
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Geprüft {timeAgo(deal.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {deal.title}
            </h1>

            {/* Ratings */}
            {deal.rating && (
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(deal.rating!)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-white">{deal.rating.toFixed(1)} von 5</span>
                {deal.ratingCount && (
                  <span className="text-slate-400">({deal.ratingCount.toLocaleString('de-DE')} Kundenbewertungen)</span>
                )}
              </div>
            )}

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-emerald-400">
                  {formatPrice(deal.discountPrice, deal.currency)}
                </span>
                {deal.originalPrice > deal.discountPrice && (
                  <span className="text-lg text-slate-400 line-through font-semibold">
                    {formatPrice(deal.originalPrice, deal.currency)}
                  </span>
                )}
              </div>

              {deal.savingsAmount > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span>Deine Ersparnis: {formatPrice(deal.savingsAmount, deal.currency)} ({deal.discountPercentage}%)</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Produktbeschreibung & Highlights</h3>
              <p>{deal.description}</p>
            </div>
          </div>

          {/* Call to Action Bar */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <a
              href={deal.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-base bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-xl shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Jetzt für {formatPrice(deal.discountPrice, deal.currency)} bei Amazon bestellen</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

            {/* Social Share & Compliance */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <SocialShare title={deal.title} url={currentUrl} />
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Offizieller Amazon Partner-Link
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Deals Section */}
      {relatedDeals.length > 0 && (
        <section className="space-y-4 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Ähnliche Schnäppchen in {categoryMeta.label}
            </h2>
            <Link
              href={`/category/${deal.category}`}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Alle ansehen →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedDeals.map((item) => (
              <DealCard key={item.id} deal={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
