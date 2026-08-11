import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getDealsByCategory } from '@/lib/db';
import { getCategoryMeta } from '@/lib/utils';
import { DealCard } from '@/components/DealCard';
import { ArrowLeft, Flame, Sparkles } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);

  return {
    title: `${meta.icon} ${meta.label} Deals – Beste Amazon Rabatte`,
    description: `Entdecke die besten Amazon Angebote, Rabatte und Preisfehler in der Kategorie ${meta.label}. Täglich aktualisiert auf BlitzDeals.de.`
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  const deals = getDealsByCategory(slug);

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
      {deals.length > 0 ? (
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
            className="inline-block px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold"
          >
            Alle Deals ansehen
          </Link>
        </div>
      )}
    </div>
  );
}
