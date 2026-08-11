'use client';

import React, { useState, useMemo } from 'react';
import { Deal, DealCategory } from '@/lib/types';
import { DealCard } from './DealCard';
import { Flame, SlidersHorizontal, Layers, Sparkles, AlertCircle } from 'lucide-react';

interface DealsGridProps {
  initialDeals: Deal[];
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES: { id: DealCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'Alle Deals', icon: '⚡' },
  { id: 'loot', label: 'Preisfehler', icon: '🔥' },
  { id: 'tech', label: 'Tech & PC', icon: '💻' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'home', label: 'Haushalt & Küche', icon: '🏠' },
  { id: 'audio', label: 'Audio & HiFi', icon: '🎧' },
  { id: 'fashion', label: 'Mode', icon: '👗' }
];

export function DealsGrid({
  initialDeals,
  searchQuery,
  selectedCategory,
  onSelectCategory
}: DealsGridProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'discount' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [minDiscount, setMinDiscount] = useState<number>(0);

  // Filter and sort deals dynamically
  const filteredDeals = useMemo(() => {
    let result = [...initialDeals];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.asin?.toLowerCase().includes(q) ||
          (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // 2. Category Filter
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'loot') {
        result = result.filter((d) => d.isLoot || d.discountPercentage >= 35);
      } else {
        result = result.filter((d) => d.category.toLowerCase() === selectedCategory.toLowerCase());
      }
    }

    // 3. Minimum Discount Filter
    if (minDiscount > 0) {
      result = result.filter((d) => d.discountPercentage >= minDiscount);
    }

    // 4. Sorting
    switch (sortBy) {
      case 'discount':
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case 'price_asc':
        result.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case 'price_desc':
        result.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case 'popular':
        result.sort((a, b) => (b.clicksCount || 0) - (a.clicksCount || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [initialDeals, searchQuery, selectedCategory, minDiscount, sortBy]);

  return (
    <section className="space-y-6">
      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold shadow-lg shadow-orange-500/20 scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="newest">🕒 Neueste zuerst</option>
              <option value="discount">💥 Höchster Rabatt %</option>
              <option value="popular">🔥 Beliebteste</option>
              <option value="price_asc">💶 Günstigster Preis</option>
              <option value="price_desc">💎 Höchster Preis</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            <span className="text-slate-200 font-bold">{filteredDeals.length}</span> Deals
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      {filteredDeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">Keine Deals gefunden</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Zu deiner Suchanfrage &quot;{searchQuery}&quot; in dieser Kategorie gibt es aktuell keine passenden Angebote.
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20"
          >
            Alle Kategorien anzeigen
          </button>
        </div>
      )}
    </section>
  );
}
