'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Deal } from '@/lib/types';
import { getCategoryMeta } from '@/lib/utils';
import { DealCard } from '@/components/DealCard';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const rawSlug = params?.slug as string;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : 'all';

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const meta = getCategoryMeta(slug);

  useEffect(() => {
    async function loadCategoryDeals() {
      try {
        const res = await fetch(`/api/deals?category=${slug}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.deals) {
          setDeals(data.deals);
        }
      } catch (err) {
        console.error('Failed to load category deals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryDeals();
  }, [slug]);

  return (
    <div className="py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zurück zur Übersicht</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
            {meta.icon}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {meta.label} Deals
            </h1>
            <p className="text-xs text-slate-400">
              {deals.length} aktuelle Angebote mit geprüften Amazon Rabatten
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm text-slate-400">Lade {meta.label} Deals...</p>
        </div>
      ) : deals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8 space-y-3">
          <p className="text-slate-400 text-sm">Aktuell keine Angebote in dieser Kategorie online.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20"
          >
            Alle Deals ansehen
          </Link>
        </div>
      )}
    </div>
  );
}
