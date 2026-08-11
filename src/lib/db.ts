import fs from 'fs';
import path from 'path';
import os from 'os';
import { Deal, PublishDealPayload } from './types';
import { generateSlug, cleanDealTitle, cleanMarkdown } from './utils';

declare global {
  // eslint-disable-next-line no-var
  var _blitzDealsCache: Deal[] | undefined;
}

const KV_URL =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  '';

const KV_TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  '';

function getDbFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), 'blitzdeals.json');
  }
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      return path.join(os.tmpdir(), 'blitzdeals.json');
    }
  }
  return path.join(dataDir, 'deals.json');
}

/** Synchronous fetch from memory / local file storage */
export function getAllDeals(): Deal[] {
  try {
    if (globalThis._blitzDealsCache && globalThis._blitzDealsCache.length > 0) {
      return globalThis._blitzDealsCache.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const dbFile = getDbFilePath();
    if (fs.existsSync(dbFile)) {
      const data = fs.readFileSync(dbFile, 'utf-8');
      const deals: Deal[] = JSON.parse(data);
      globalThis._blitzDealsCache = deals;
      return deals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.error('Error reading deals:', err);
  }
  return globalThis._blitzDealsCache || [];
}

/** Asynchronous fetch supporting persistent Cloud KV database (Upstash / Vercel KV) */
export async function getAllDealsAsync(): Promise<Deal[]> {
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/blitzdeals_list`, {
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          if (Array.isArray(parsed)) {
            globalThis._blitzDealsCache = parsed;
            return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }
        }
      }
    } catch (e) {
      console.error('Cloud KV fetch failed, falling back to local storage:', e);
    }
  }
  return getAllDeals();
}

export function getDealBySlug(slug: string): Deal | null {
  const deals = getAllDeals();
  const lowerSlug = decodeURIComponent(slug).toLowerCase();
  return (
    deals.find(
      (d) =>
        d.slug.toLowerCase() === lowerSlug ||
        d.id === slug ||
        (d.asin && d.asin.toLowerCase() === lowerSlug) ||
        lowerSlug.includes(d.slug.toLowerCase()) ||
        d.slug.toLowerCase().includes(lowerSlug) ||
        (d.asin && lowerSlug.includes(d.asin.toLowerCase()))
    ) || null
  );
}

export function getDealsByCategory(category: string): Deal[] {
  const deals = getAllDeals();
  if (!category || category === 'all') return deals;
  if (category === 'loot') return deals.filter((d) => d.isLoot || d.discountPercentage >= 35);
  return deals.filter((d) => d.category.toLowerCase() === category.toLowerCase());
}

export function searchDeals(query: string, category = 'all'): Deal[] {
  const deals = getDealsByCategory(category);
  if (!query || !query.trim()) return deals;

  const q = query.toLowerCase().trim();
  return deals.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.asin?.toLowerCase().includes(q) ||
      (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)))
  );
}

export async function saveDeal(
  payload: PublishDealPayload & { imageBase64?: string }
): Promise<Deal> {
  const deals = await getAllDealsAsync();

  const originalPrice = payload.originalPrice || payload.discountPrice;
  const discountPrice = payload.discountPrice;
  const discountPercentage =
    payload.discountPercentage ||
    (originalPrice > discountPrice
      ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
      : 0);
  const savingsAmount = Math.max(0, Number((originalPrice - discountPrice).toFixed(2)));
  const asin = payload.asin || 'AMZ' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const cleanTitle = cleanDealTitle(payload.title);
  const cleanDesc = cleanMarkdown(payload.description || 'Aktuelles Top-Angebot auf Amazon mit starkem Preisnachlass.');
  const slug = generateSlug(cleanTitle, asin);
  const dealId = `deal-${Date.now()}`;

  const finalImageUrl = payload.imageBase64 || payload.imageUrl || '/banner.png';

  const existingIdx = deals.findIndex(
    (d) => d.asin && d.asin.toUpperCase() === asin.toUpperCase()
  );

  const newDeal: Deal = {
    id: existingIdx >= 0 ? deals[existingIdx].id : dealId,
    asin: asin.toUpperCase(),
    title: cleanTitle,
    slug,
    description: cleanDesc,
    originalPrice,
    discountPrice,
    discountPercentage,
    savingsAmount,
    currency: '€',
    imageUrl: finalImageUrl,
    affiliateUrl: payload.affiliateUrl,
    category: payload.category || 'tech',
    isLoot: payload.isLoot || discountPercentage >= 35,
    isFeatured: discountPercentage >= 30,
    rating: payload.rating || 4.7,
    ratingCount: payload.ratingCount || 120,
    isPrime: payload.isPrime !== false,
    store: 'Amazon.de',
    createdAt: existingIdx >= 0 ? deals[existingIdx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [payload.category || 'Deal', 'Amazon', discountPercentage >= 35 ? 'Loot' : 'Schnäppchen'],
    clicksCount: existingIdx >= 0 ? deals[existingIdx].clicksCount || 0 : 0
  };

  if (existingIdx >= 0) {
    deals[existingIdx] = newDeal;
  } else {
    deals.unshift(newDeal);
  }

  // Update in-memory global cache
  globalThis._blitzDealsCache = deals;

  // 1. Persist to Cloud KV if configured
  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/set/blitzdeals_list`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deals)
      });
    } catch (e) {
      console.error('Failed to sync to Cloud KV:', e);
    }
  }

  // 2. Persist to local disk
  try {
    const dbFile = getDbFilePath();
    fs.writeFileSync(dbFile, JSON.stringify(deals, null, 2), 'utf-8');
  } catch (err) {
    console.error('File write fallback maintained in memory:', err);
  }

  return newDeal;
}

export function incrementClickCount(id: string): void {
  try {
    const deals = getAllDeals();
    const deal = deals.find((d) => d.id === id || d.slug === id);
    if (deal) {
      deal.clicksCount = (deal.clicksCount || 0) + 1;
      globalThis._blitzDealsCache = deals;
      const dbFile = getDbFilePath();
      fs.writeFileSync(dbFile, JSON.stringify(deals, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error incrementing click count:', err);
  }
}
