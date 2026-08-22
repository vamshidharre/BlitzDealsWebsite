'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
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
    <div className="space-y-8 pb-12">
      {/* Clean Hero Header & Search */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalDealsCount={deals.length}
      />

      {/* Main Deals Grid & Category Filter */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-white rounded-2xl border border-zinc-200/80 animate-pulse" />
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
