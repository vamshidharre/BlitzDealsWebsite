'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { LootSpotlight } from '@/components/LootSpotlight';
import { DealsGrid } from '@/components/DealsGrid';
import { Deal } from '@/lib/types';

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();
        if (data.success && data.deals) {
          setDeals(data.deals);
        }
      } catch (err) {
        console.error('Failed to load deals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  return (
    <div className="space-y-4">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalDealsCount={deals.length}
      />

      {!searchQuery && selectedCategory === 'all' && (
        <LootSpotlight deals={deals} />
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-900/60 rounded-2xl border border-slate-800" />
          ))}
        </div>
      ) : (
        <DealsGrid
          initialDeals={deals}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}
    </div>
  );
}
