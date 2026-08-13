import fs from 'fs';
import path from 'path';
import os from 'os';
import { Deal, PublishDealPayload } from './types';
import { generateSlug, cleanDealTitle, cleanMarkdown } from './utils';

declare global {
  // eslint-disable-next-line no-var
  var _blitzDealsCache: Deal[] | undefined;
}

function getUpstashCredentials(): { url: string; token: string } {
  const url = (
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    ''
  ).replace(/\/+$/, '');

  const token = (
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    ''
  ).trim();

  return { url, token };
}

/** Universal Upstash Redis Command Executor via POST array protocol */
async function upstashCommand<T = any>(command: any[]): Promise<T | null> {
  const { url, token } = getUpstashCredentials();
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command),
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return data.result as T;
    } else {
      const errText = await res.text();
      console.warn(`[UPSTASH WARNING] Command failed (${res.status}):`, errText);
    }
  } catch (err) {
    console.error('[UPSTASH ERROR] Execution failed:', err);
  }
  return null;
}

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
      return [...globalThis._blitzDealsCache].sort(
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
    console.error('Error reading deals synchronously:', err);
  }
  return globalThis._blitzDealsCache || [];
}

/** Asynchronous fetch supporting persistent Upstash Redis Cloud Database */
export async function getAllDealsAsync(): Promise<Deal[]> {
  try {
    // 1. Fetch deal IDs index from Upstash
    const idsResult = await upstashCommand<string | string[]>(['GET', 'blitzdeals_ids']);
    let ids: string[] = [];

    if (idsResult) {
      ids = typeof idsResult === 'string' ? JSON.parse(idsResult) : idsResult;
    }

    if (Array.isArray(ids) && ids.length > 0) {
      // 2. Multi-Get all individual deals simultaneously
      const mgetKeys = ids.map((id) => `deal:${id}`);
      const dealsRaw = await upstashCommand<any[]>(['MGET', ...mgetKeys]);

      if (Array.isArray(dealsRaw)) {
        const deals: Deal[] = [];
        for (const item of dealsRaw) {
          if (!item) continue;
          try {
            const parsed = typeof item === 'string' ? JSON.parse(item) : item;
            if (parsed && parsed.id && parsed.title) {
              deals.push(parsed);
            }
          } catch (parseErr) {
            console.warn('Failed to parse deal item:', parseErr);
          }
        }

        if (deals.length > 0) {
          globalThis._blitzDealsCache = deals;
          return deals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      }
    }

    // Fallback: Check legacy list key if ids index is empty
    const legacyResult = await upstashCommand<string | Deal[]>(['GET', 'blitzdeals_list']);
    if (legacyResult) {
      const parsed = typeof legacyResult === 'string' ? JSON.parse(legacyResult) : legacyResult;
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis._blitzDealsCache = parsed;
        return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }
  } catch (e) {
    console.error('Error loading deals from Upstash Redis:', e);
  }

  // Local fallback
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
  const asin = (payload.asin || 'AMZ' + Math.random().toString(36).substring(2, 9).toUpperCase()).toUpperCase();
  const cleanTitle = cleanDealTitle(payload.title);
  const cleanDesc = cleanMarkdown(payload.description || 'Aktuelles Top-Angebot auf Amazon mit starkem Preisnachlass.');
  const slug = generateSlug(cleanTitle, asin);
  const dealId = `deal-${Date.now()}`;

  const finalImageUrl = payload.imageBase64 || payload.imageUrl || '/banner.png';

  const existingIdx = deals.findIndex(
    (d) => d.asin && d.asin.toUpperCase() === asin
  );

  const newDeal: Deal = {
    id: existingIdx >= 0 ? deals[existingIdx].id : dealId,
    asin,
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

  // 1. Persist to Cloud Upstash Redis KV using POST command protocol
  try {
    // Save the individual deal key
    await upstashCommand(['SET', `deal:${newDeal.id}`, JSON.stringify(newDeal)]);

    // Save the updated list of deal IDs
    const dealIds = deals.map((d) => d.id);
    await upstashCommand(['SET', 'blitzdeals_ids', JSON.stringify(dealIds)]);
    console.log(`[DB SUCCESS] Persisted deal ${newDeal.asin} to Upstash Cloud Database (Total active: ${dealIds.length})`);
  } catch (upstashErr) {
    console.error('Failed to sync deal to Upstash:', upstashErr);
  }

  // 2. Persist to local disk fallback
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
