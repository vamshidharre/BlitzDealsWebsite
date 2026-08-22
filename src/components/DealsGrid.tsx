'use client';

import React, { useState, useMemo } from 'react';
import { Deal, DealCategory } from '@/lib/types';
import { DealCard } from './DealCard';
import { Check, LayoutGrid, List } from 'lucide-react';

interface DealsGridProps {
  initialDeals: Deal[];
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES: { id: DealCategory; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'loot', label: 'Preisfehler' },
  { id: 'tech', label: 'Elektronik' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'home', label: 'Haushalt' },
  { id: 'audio', label: 'Audio' },
  { id: 'fashion', label: 'Mode' }
];

export function DealsGrid({
  initialDeals,
  searchQuery,
  selectedCategory,
  onSelectCategory
}: DealsGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'discount' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [primeOnly, setPrimeOnly] = useState(false);
  const [highDiscountOnly, setHighDiscountOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

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

    // 3. Quick Filter: Prime Only
    if (primeOnly) {
      result = result.filter((d) => d.isPrime);
    }

    // 4. Quick Filter: High Discount (>= 40%)
    if (highDiscountOnly) {
      result = result.filter((d) => d.discountPercentage >= 40);
    }

    // 5. Budget Max Price Filter
    if (maxPrice !== null) {
      result = result.filter((d) => d.discountPrice <= maxPrice);
    }

    // 6. Sorting
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
  }, [initialDeals, searchQuery, selectedCategory, primeOnly, highDiscountOnly, maxPrice, sortBy]);

  return (
    <section className="space-y-5">
      {/* Category Tabs & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 pb-3">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* View Switcher & Sort */}
        <div className="flex items-center gap-2 text-xs">
          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-400 hover:text-zinc-700'
              }`}
              title="Kachelansicht"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-400 hover:text-zinc-700'
              }`}
              title="Listenansicht"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
          >
            <option value="newest">Neueste</option>
            <option value="discount">Rabatt %</option>
            <option value="popular">Beliebt</option>
            <option value="price_asc">Preis aufsteigend</option>
            <option value="price_desc">Preis absteigend</option>
          </select>
        </div>
      </div>

      {/* Secondary Fast-Filters Bar: Prime, Rabatt, Budget Ranges */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-600">
        <span className="text-[11px] text-zinc-400 font-medium mr-1">Filter:</span>
        
        {/* Prime Toggle */}
        <button
          onClick={() => setPrimeOnly(!primeOnly)}
          className={`px-2.5 py-1 rounded-lg font-medium border transition-colors flex items-center gap-1 ${
            primeOnly
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          {primeOnly && <Check className="w-3 h-3" />}
          <span>Prime</span>
        </button>

        {/* High Discount Toggle */}
        <button
          onClick={() => setHighDiscountOnly(!highDiscountOnly)}
          className={`px-2.5 py-1 rounded-lg font-medium border transition-colors flex items-center gap-1 ${
            highDiscountOnly
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          {highDiscountOnly && <Check className="w-3 h-3" />}
          <span>≥ 40%</span>
        </button>

        {/* Budget Chips */}
        {[25, 50, 100].map((budget) => {
          const isSelected = maxPrice === budget;
          return (
            <button
              key={budget}
              onClick={() => setMaxPrice(isSelected ? null : budget)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                isSelected
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              &lt; {budget} €
            </button>
          );
        })}

        {(primeOnly || highDiscountOnly || maxPrice !== null) && (
          <button
            onClick={() => {
              setPrimeOnly(false);
              setHighDiscountOnly(false);
              setMaxPrice(null);
            }}
            className="text-[11px] text-zinc-400 hover:text-zinc-700 underline ml-2"
          >
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Deals Rendering (Grid or List View) */}
      {filteredDeals.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 p-8 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900">Keine Deals gefunden</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Passe deine Suche oder Filter an, um mehr Angebote zu sehen.
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              setPrimeOnly(false);
              setHighDiscountOnly(false);
              setMaxPrice(null);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
          >
            Filter zurücksetzen
          </button>
        </div>
      )}
    </section>
  );
}
