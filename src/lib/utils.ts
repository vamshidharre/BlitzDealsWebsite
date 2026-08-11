import { DealCategory } from './types';

export function formatPrice(price: number, currency = '€'): string {
  if (typeof price !== 'number' || isNaN(price)) return '0,00 €';
  return `${price.toFixed(2).replace('.', ',')} ${currency}`;
}

export function generateSlug(title: string, asin?: string): string {
  const cleanTitle = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove German umlaut diacritics
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  const cleanAsin = (asin || '').toLowerCase().trim();
  if (cleanAsin && !cleanTitle.includes(cleanAsin)) {
    return `${cleanTitle}-${cleanAsin}`;
  }
  return cleanTitle || `deal-${Date.now()}`;
}

export function timeAgo(dateString: string): string {
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 2) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours === 1) return 'vor 1 Std.';
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    return past.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  } catch {
    return 'Heute';
  }
}

export function getCategoryMeta(category: string): { label: string; icon: string; bg: string; color: string } {
  switch (category?.toLowerCase()) {
    case 'loot':
      return { label: 'Preisfehler / Loot', icon: '🔥', bg: 'bg-amber-500/10 border-amber-500/30', color: 'text-amber-400' };
    case 'tech':
      return { label: 'Tech & Elektronik', icon: '💻', bg: 'bg-cyan-500/10 border-cyan-500/30', color: 'text-cyan-400' };
    case 'gaming':
      return { label: 'Gaming & Konsolen', icon: '🎮', bg: 'bg-purple-500/10 border-purple-500/30', color: 'text-purple-400' };
    case 'home':
      return { label: 'Haushalt & Küche', icon: '🏠', bg: 'bg-emerald-500/10 border-emerald-500/30', color: 'text-emerald-400' };
    case 'fashion':
      return { label: 'Mode & Kleidung', icon: '👗', bg: 'bg-pink-500/10 border-pink-500/30', color: 'text-pink-400' };
    case 'audio':
      return { label: 'Audio & HiFi', icon: '🎧', bg: 'bg-blue-500/10 border-blue-500/30', color: 'text-blue-400' };
    default:
      return { label: 'Top Deal', icon: '⚡', bg: 'bg-slate-500/10 border-slate-500/30', color: 'text-slate-400' };
  }
}
