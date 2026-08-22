'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Deal } from '@/lib/types';
import { getCategoryMeta } from '@/lib/utils';
import { DealCard } from '@/components/DealCard';
import { ArrowLeft, Loader2 } from 'lucide-react';

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
    <div className="py-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zurück zur Übersicht</span>
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {meta.label} Deals
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {deals.length} aktuelle Angebote gefunden
          </p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
          <p className="text-xs text-zinc-500">Lade Angebote...</p>
        </div>
      ) : deals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 p-8 space-y-3">
          <p className="text-zinc-600 text-xs font-medium">Aktuell keine Angebote in dieser Kategorie online.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            Alle Deals ansehen
          </Link>
        </div>
      )}
    </div>
  );
}
